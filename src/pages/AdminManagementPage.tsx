import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { InviteAdminModal } from '../components/InviteAdminModal';
import { ViewCredentialsModal } from '../components/ViewCredentialsModal';
import { UserPlus, Shield, Edit, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Admin {
  id: string;
  email: string;
  name?: string;
  role: 'super_admin' | 'editor';
  status: 'active' | 'inactive';
  created_at: string;
  created_by?: string;
}

interface Credentials {
  email: string;
  password: string;
  name: string;
  role: string;
  created_at: string;
}

export function AdminManagementPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedCredentials, setSelectedCredentials] = useState<Credentials | null>(null);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2ce8a38a/admin/list`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins || []);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdminStatus = async (adminId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2ce8a38a/admin/toggle-status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ adminId, status: newStatus })
        }
      );

      if (response.ok) {
        fetchAdmins();
      }
    } catch (error) {
      console.error('Error toggling admin status:', error);
    }
  };

  const viewCredentials = async (adminId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2ce8a38a/admin/get-credentials`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ adminId })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedCredentials(data.credentials);
        setSelectedAdminId(adminId);
        setShowCredentialsModal(true);
      } else {
        alert('Error al obtener las credenciales');
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
      alert('Error al obtener las credenciales');
    }
  };

  const deleteAdmin = async (adminId: string, adminEmail: string) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar permanentemente a ${adminEmail}?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmDelete) return;

    setDeletingAdminId(adminId);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2ce8a38a/admin/delete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ adminId })
        }
      );

      if (response.ok) {
        alert('Administrador eliminado correctamente');
        fetchAdmins();
      } else {
        const error = await response.json();
        alert('Error al eliminar: ' + (error.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Error al eliminar el administrador');
    } finally {
      setDeletingAdminId(null);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'super_admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
          <Shield className="w-3 h-3" />
          Super Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
        <Edit className="w-3 h-3" />
        Editor
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          <CheckCircle className="w-3 h-3" />
          Activo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
        <XCircle className="w-3 h-3" />
        Inactivo
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8012]"></div>
          <p className="mt-4 text-gray-600">Cargando administradores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-['Arvo',_serif] text-[#0c4159] mb-2">
              Gestión de Administradores
            </h1>
            <p className="text-gray-600">
              Invita y gestiona los administradores del sistema
            </p>
          </div>
          <Button
            onClick={() => setShowInviteModal(true)}
            className="bg-[#ff8012] hover:bg-[#e67310]"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invitar Administrador
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#0c4159]">{admins.length}</p>
                <p className="text-sm text-gray-600 mt-1">Total Administradores</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {admins.filter(a => a.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Activos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {admins.filter(a => a.role === 'super_admin').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Super Admins</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admins List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Administradores</CardTitle>
          </CardHeader>
          <CardContent>
            {admins.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay administradores registrados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-gray-900">
                          {admin.name || admin.email}
                        </p>
                        {admin.email === user?.email && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                            Tú
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getRoleBadge(admin.role)}
                        {getStatusBadge(admin.status)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {admin.email !== user?.email && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAdminStatus(admin.id, admin.status)}
                          >
                            {admin.status === 'active' ? (
                              <>
                                <XCircle className="w-4 h-4 mr-1" />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Activar
                              </>
                            )}
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewCredentials(admin.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Credenciales
                      </Button>
                      
                      {admin.email !== user?.email && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAdmin(admin.id, admin.email)}
                          disabled={deletingAdminId === admin.id}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            Volver al Panel
          </Button>
        </div>
      </div>

      {/* Invite Modal */}
      <InviteAdminModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={() => {
          setShowInviteModal(false);
          fetchAdmins();
        }}
      />

      {/* Credentials Modal */}
      <ViewCredentialsModal
        isOpen={showCredentialsModal}
        onClose={() => {
          setShowCredentialsModal(false);
          setSelectedCredentials(null);
          setSelectedAdminId(null);
        }}
        credentials={selectedCredentials}
        adminId={selectedAdminId}
        onPasswordReset={() => {
          fetchAdmins();
        }}
      />
    </div>
  );
}