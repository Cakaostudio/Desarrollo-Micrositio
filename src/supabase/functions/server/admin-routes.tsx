import { Hono } from 'npm:hono';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const adminRoutes = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize first super admin if no admins exist
async function initializeFirstAdmin() {
  try {
    // Check if any admins exist in our KV store
    const admins = await kv.getByPrefix('admin_list:');
    
    if (admins.length === 0) {
      console.log('No admins found in KV store - initializing first super admin');
      
      const email = 'hello@cakaostudio.com';
      const password = 'Cakaostudio08';
      
      // First, check if user already exists in Supabase Auth
      let userId: string | null = null;
      
      try {
        // Try to get existing user by email
        const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
        
        if (!listError && existingUsers?.users) {
          const existingUser = existingUsers.users.find(u => u.email === email);
          
          if (existingUser) {
            console.log('User already exists in Supabase Auth, using existing user:', existingUser.id);
            userId = existingUser.id;
          }
        }
      } catch (checkError) {
        console.log('Could not check for existing user:', checkError);
      }
      
      // If user doesn't exist, create it
      if (!userId) {
        try {
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name: 'Super Admin' }
          });

          if (authError) {
            console.error('Error creating auth user:', authError);
            
            // If error is because user already exists, try to sign in to get the user ID
            if (authError.message?.includes('already') || authError.status === 422) {
              console.log('User might already exist, will create KV entry anyway');
              // Generate a temporary ID for KV store
              userId = `temp-${Date.now()}`;
            } else {
              console.error('Cannot create super admin:', authError.message);
              return;
            }
          } else {
            userId = authData.user.id;
            console.log('Created new auth user:', userId);
          }
        } catch (createError) {
          console.error('Exception creating auth user:', createError);
          return;
        }
      }

      // Store admin data in KV store
      if (userId) {
        const adminKey = `admin_user:${email}`;
        const adminData = {
          id: userId,
          email,
          name: 'Super Admin',
          role: 'super_admin',
          status: 'active',
          created_at: new Date().toISOString(),
          password: password // Store the password for super admin too
        };

        await kv.set(adminKey, adminData);
        await kv.set(`admin_list:${userId}`, adminData);

        console.log('✅ First super admin initialized successfully:', email);
      }
    } else {
      console.log(`Found ${admins.length} existing admin(s), skipping initialization`);
    }
  } catch (error) {
    console.error('Error initializing first admin:', error);
  }
}

// Don't initialize on module load - it causes boot errors
// Users should call /admin/initialize-super-admin manually instead
// initializeFirstAdmin();

// Generate random password
function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Check user role
adminRoutes.post('/check-role', async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    // Get admin data from KV store
    const adminKey = `admin_user:${email}`;
    const adminData = await kv.get(adminKey);

    if (!adminData) {
      return c.json({ role: null });
    }

    // adminData is already an object, no need to parse
    
    // Check if admin is active
    if (adminData.status !== 'active') {
      return c.json({ role: null });
    }

    return c.json({ role: adminData.role });
  } catch (error) {
    console.error('Error checking role:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Invite new admin
adminRoutes.post('/invite', async (c) => {
  try {
    const { name, email, role } = await c.req.json();

    if (!name || !email || !role) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    if (!['super_admin', 'editor'].includes(role)) {
      return c.json({ error: 'Invalid role' }, 400);
    }

    // FIRST: Check if user exists in our KV store
    const adminKey = `admin_user:${email}`;
    const existingAdmin = await kv.get(adminKey);
    
    console.log('=== INVITE USER DEBUG ===');
    console.log('Email:', email);
    console.log('Checking if admin exists in KV store...');
    console.log('existingAdmin value:', existingAdmin);
    console.log('existingAdmin type:', typeof existingAdmin);
    
    if (existingAdmin && typeof existingAdmin === 'object' && existingAdmin.email) {
      // User already exists in KV store
      console.log('❌ User already exists in KV store');
      return c.json({ 
        error: 'Este administrador ya existe en el sistema. Por favor verifica la lista de administradores.' 
      }, 400);
    }
    
    console.log('✅ User does NOT exist in KV store, proceeding...');

    // Generate temporary password
    const temporaryPassword = generatePassword();

    let userId: string | null = null;
    let userAlreadyExisted = false;

    // Try to create user in Supabase Auth
    console.log('Attempting to create user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true, // Auto-confirm since we don't have email server configured
      user_metadata: { name }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      
      // If user already exists in Auth, try to get their ID
      if (authError.message?.includes('already') || authError.status === 422 || authError.code === 'email_exists') {
        console.log('⚠️ User already exists in Supabase Auth');
        console.log('Since they don\'t exist in KV store, we will add them...');
        
        // User exists in Auth but not in KV store - let's find their ID and add them
        try {
          const { data: existingUsers } = await supabase.auth.admin.listUsers();
          const existingUser = existingUsers?.users?.find(u => u.email === email);
          
          if (existingUser) {
            userId = existingUser.id;
            userAlreadyExisted = true;
            console.log('✅ Found existing user in Auth:', userId);
          } else {
            console.error('❌ User should exist in Auth but was not found in listUsers()');
            return c.json({ 
              error: 'Error al recuperar el usuario existente. Por favor contacta al administrador del sistema.' 
            }, 500);
          }
        } catch (err) {
          console.error('Error finding existing user:', err);
          return c.json({ 
            error: 'Error al verificar usuario existente: ' + String(err) 
          }, 500);
        }
      } else {
        // Some other error that we can't handle
        console.error('❌ Unexpected auth error:', authError);
        return c.json({ error: 'Error creating user: ' + authError.message }, 500);
      }
    } else {
      // User was created successfully
      userId = authData.user.id;
      console.log('✅ Created new user in Supabase Auth:', userId);
    }

    // At this point we should have a valid userId
    if (!userId) {
      return c.json({ error: 'Failed to obtain user ID' }, 500);
    }

    // Store admin data in KV store (reuse adminKey from line 158)
    const adminData = {
      id: userId,
      email,
      name,
      role,
      status: 'active',
      created_at: new Date().toISOString(),
      password: userAlreadyExisted ? null : temporaryPassword // Store password only for new users
    };

    await kv.set(adminKey, adminData);

    // Also store in admin list for easy retrieval
    const adminListKey = `admin_list:${userId}`;
    await kv.set(adminListKey, adminData);

    console.log(`✅ Admin added to system: ${email} (existed in Auth: ${userAlreadyExisted})`);

    return c.json({
      success: true,
      temporaryPassword: userAlreadyExisted 
        ? '(Usuario ya existía - usar contraseña anterior o restablecer)' 
        : temporaryPassword,
      admin: {
        email,
        name,
        role
      },
      note: userAlreadyExisted 
        ? 'Este usuario ya existía en el sistema de autenticación. Fue agregado a la lista de administradores.' 
        : undefined
    });
  } catch (error) {
    console.error('Error inviting admin:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// List all admins
adminRoutes.get('/list', async (c) => {
  try {
    // Get all admin entries from KV store
    // Note: getByPrefix returns an array of values (not {key, value} objects)
    const adminValues = await kv.getByPrefix('admin_list:');
    
    console.log('=== DEBUG: Admin List ===');
    console.log('Raw admin values found:', adminValues.length);
    console.log('Raw data:', JSON.stringify(adminValues, null, 2));
    
    // The values are already parsed objects, no need to JSON.parse
    const admins = adminValues
      .filter(admin => admin && typeof admin === 'object' && admin.email)
      .sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

    console.log('Filtered admins:', admins.length);
    console.log('Admin emails:', admins.map(a => a.email));

    return c.json({ admins });
  } catch (error) {
    console.error('Error listing admins:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Toggle admin status
adminRoutes.post('/toggle-status', async (c) => {
  try {
    const { adminId, status } = await c.req.json();

    if (!adminId || !status) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    if (!['active', 'inactive'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    // Get admin data (already an object, no need to parse)
    const adminListKey = `admin_list:${adminId}`;
    const adminData = await kv.get(adminListKey);

    if (!adminData) {
      return c.json({ error: 'Admin not found' }, 404);
    }
    
    // Update status
    adminData.status = status;
    adminData.updated_at = new Date().toISOString();

    // Save updated data (pass object directly, no need to stringify)
    await kv.set(adminListKey, adminData);
    
    // Also update in email-keyed entry
    const adminKey = `admin_user:${adminData.email}`;
    await kv.set(adminKey, adminData);

    return c.json({ success: true, admin: adminData });
  } catch (error) {
    console.error('Error toggling admin status:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delete admin permanently
adminRoutes.post('/delete', async (c) => {
  try {
    const { adminId } = await c.req.json();

    if (!adminId) {
      return c.json({ error: 'Admin ID is required' }, 400);
    }

    // Get admin data
    const adminListKey = `admin_list:${adminId}`;
    const adminData = await kv.get(adminListKey);

    if (!adminData) {
      return c.json({ error: 'Admin not found' }, 404);
    }

    // Delete from KV store
    const adminUserKey = `admin_user:${adminData.email}`;
    
    // Delete both keys
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Delete from kv_store table
    await supabaseClient
      .from('kv_store_2ce8a38a')
      .delete()
      .eq('key', adminListKey);

    await supabaseClient
      .from('kv_store_2ce8a38a')
      .delete()
      .eq('key', adminUserKey);

    console.log(`✅ Admin deleted from system: ${adminData.email}`);

    return c.json({ 
      success: true, 
      message: 'Administrador eliminado correctamente',
      deletedAdmin: {
        email: adminData.email,
        name: adminData.name
      }
    });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get admin credentials (for super admin only)
adminRoutes.post('/get-credentials', async (c) => {
  try {
    const { adminId } = await c.req.json();

    if (!adminId) {
      return c.json({ error: 'Admin ID is required' }, 400);
    }

    // Get admin data
    const adminListKey = `admin_list:${adminId}`;
    const adminData = await kv.get(adminListKey);

    if (!adminData) {
      return c.json({ error: 'Admin not found' }, 404);
    }

    return c.json({ 
      success: true,
      credentials: {
        email: adminData.email,
        password: adminData.password || '(No disponible - usuario ya existía)',
        name: adminData.name,
        role: adminData.role,
        created_at: adminData.created_at
      }
    });
  } catch (error) {
    console.error('Error getting credentials:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Reset admin password (generate new password)
adminRoutes.post('/reset-password', async (c) => {
  try {
    const { adminId } = await c.req.json();

    if (!adminId) {
      return c.json({ error: 'Admin ID is required' }, 400);
    }

    // Get admin data
    const adminListKey = `admin_list:${adminId}`;
    const adminData = await kv.get(adminListKey);

    if (!adminData) {
      return c.json({ error: 'Admin not found' }, 404);
    }

    // Generate new password
    const newPassword = generatePassword();

    // Update password in Supabase Auth
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      adminId,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Error updating password in Supabase Auth:', updateError);
      return c.json({ 
        error: 'Error al actualizar la contraseña: ' + updateError.message 
      }, 500);
    }

    // Update password in KV store
    adminData.password = newPassword;
    adminData.updated_at = new Date().toISOString();

    await kv.set(adminListKey, adminData);
    
    // Also update in email-keyed entry
    const adminKey = `admin_user:${adminData.email}`;
    await kv.set(adminKey, adminData);

    console.log(`✅ Password reset for admin: ${adminData.email}`);

    return c.json({ 
      success: true,
      newPassword: newPassword,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return c.json({ error: 'Internal server error: ' + String(error) }, 500);
  }
});

// Manual initialization endpoint - call this to create the first super admin
adminRoutes.post('/initialize-super-admin', async (c) => {
  try {
    const email = 'hello@cakaostudio.com';
    const password = 'Cakaostudio08';
    
    // Check if admin already exists in KV store
    const adminKey = `admin_user:${email}`;
    const existingAdmin = await kv.get(adminKey);
    
    if (existingAdmin) {
      return c.json({ 
        success: true, 
        message: 'Super admin already exists in KV store',
        admin: existingAdmin, // Already an object, no need to parse
        credentials: { email, password }
      });
    }
    
    // Try to find or create user in Supabase Auth
    let userId: string | null = null;
    let userAlreadyExisted = false;
    
    // First check if user exists in Auth
    try {
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === email);
      
      if (existingUser) {
        userId = existingUser.id;
        userAlreadyExisted = true;
        console.log('✅ Found existing user in Supabase Auth:', userId);
      }
    } catch (err) {
      console.log('Error checking existing users:', err);
    }
    
    // If not found, try to create
    if (!userId) {
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name: 'Super Admin' }
        });

        if (authError) {
          // If error is because user exists, try to get user ID
          if (authError.code === 'email_exists' || authError.status === 422) {
            console.log('User already exists in Auth, fetching user...');
            
            // Try to get the user again
            const { data: users } = await supabase.auth.admin.listUsers();
            const user = users?.users?.find(u => u.email === email);
            
            if (user) {
              userId = user.id;
              userAlreadyExisted = true;
              console.log('✅ Found existing user after creation error:', userId);
            } else {
              // Last resort: use a generated ID
              userId = `fallback-${Date.now()}`;
              console.log('⚠️ Using fallback ID:', userId);
            }
          } else {
            console.error('Auth error:', authError);
            return c.json({ 
              error: 'Failed to create/find user in Supabase Auth', 
              details: authError.message 
            }, 500);
          }
        } else {
          userId = authData.user.id;
          console.log('✅ Created new user in Supabase Auth:', userId);
        }
      } catch (err) {
        console.error('Exception creating user:', err);
        return c.json({ 
          error: 'Failed to create user', 
          details: String(err) 
        }, 500);
      }
    }
    
    // Create admin in KV store
    const adminData = {
      id: userId,
      email,
      name: 'Super Admin',
      role: 'super_admin',
      status: 'active',
      created_at: new Date().toISOString(),
      password: password // Store the password for super admin too
    };

    await kv.set(adminKey, adminData);
    await kv.set(`admin_list:${userId}`, adminData);

    const message = userAlreadyExisted 
      ? 'Super admin created in system (user already existed in Auth)'
      : 'Super admin created successfully';

    console.log(`✅ ${message}`);

    return c.json({
      success: true,
      message,
      admin: adminData,
      credentials: {
        email,
        password
      }
    });
  } catch (error) {
    console.error('Error in manual initialization:', error);
    return c.json({ error: 'Failed to initialize super admin', details: String(error) }, 500);
  }
});

// DEBUG ENDPOINT - Temporary for troubleshooting
adminRoutes.get('/debug-kv', async (c) => {
  try {
    console.log('=== DEBUG: Checking all KV entries ===');
    
    // We need to query the database directly to get both keys and values
    // because getByPrefix only returns values
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // Get admin_list entries with keys
    const { data: adminListData } = await supabaseClient
      .from('kv_store_2ce8a38a')
      .select('key, value')
      .like('key', 'admin_list:%');
    
    console.log('admin_list: entries found:', adminListData?.length || 0);
    console.log('admin_list: data:', JSON.stringify(adminListData, null, 2));
    
    // Get admin_user entries with keys
    const { data: adminUserData } = await supabaseClient
      .from('kv_store_2ce8a38a')
      .select('key, value')
      .like('key', 'admin_user:%');
    
    console.log('admin_user: entries found:', adminUserData?.length || 0);
    console.log('admin_user: data:', JSON.stringify(adminUserData, null, 2));
    
    return c.json({
      admin_list: {
        count: adminListData?.length || 0,
        entries: adminListData || []
      },
      admin_user: {
        count: adminUserData?.length || 0,
        entries: adminUserData || []
      }
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// CLEANUP ENDPOINT - Removes all admin entries from KV store
adminRoutes.post('/cleanup-kv', async (c) => {
  try {
    console.log('=== CLEANUP: Removing all admin entries ===');
    
    // Get all admin entries
    const adminListValues = await kv.getByPrefix('admin_list:');
    const adminUserValues = await kv.getByPrefix('admin_user:');
    
    console.log(`Found ${adminListValues.length} admin_list entries`);
    console.log(`Found ${adminUserValues.length} admin_user entries`);
    
    // We need to reconstruct the keys from the data
    // Since getByPrefix only returns values, we need to use a different approach
    // Let's delete by querying the database directly
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // Delete all admin_list: entries
    const { error: error1 } = await supabaseClient
      .from('kv_store_2ce8a38a')
      .delete()
      .like('key', 'admin_list:%');
    
    if (error1) {
      console.error('Error deleting admin_list entries:', error1);
    } else {
      console.log('✅ Deleted all admin_list: entries');
    }
    
    // Delete all admin_user: entries
    const { error: error2 } = await supabaseClient
      .from('kv_store_2ce8a38a')
      .delete()
      .like('key', 'admin_user:%');
    
    if (error2) {
      console.error('Error deleting admin_user entries:', error2);
    } else {
      console.log('✅ Deleted all admin_user: entries');
    }
    
    return c.json({
      success: true,
      message: 'All admin entries have been removed from KV store',
      deleted: {
        admin_list: adminListValues.length,
        admin_user: adminUserValues.length
      }
    });
  } catch (error) {
    console.error('Error in cleanup endpoint:', error);
    return c.json({ error: String(error) }, 500);
  }
});

export default adminRoutes;