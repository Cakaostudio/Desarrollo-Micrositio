import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import adminRoutes from "./admin-routes.tsx";
import imageRoutes from "./image-routes.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-2ce8a38a/health", (c) => {
  return c.json({ status: "ok" });
});

// ========================================
// PROJECT MANAGEMENT ENDPOINTS
// ========================================

/**
 * Get all projects
 */
app.get("/make-server-2ce8a38a/projects", async (c) => {
  try {
    console.log('=== GET /projects ===');
    
    // Get all projects using prefix
    const rawProjects = await kv.getByPrefix("project:");
    
    console.log('Raw projects from KV:', rawProjects?.length || 0);
    console.log('First project sample:', rawProjects?.[0]);
    
    // Filter out any corrupted data
    const validProjects = rawProjects.filter((p: any) => {
      if (!p || typeof p !== 'object') {
        console.warn('Invalid project (not an object):', p);
        return false;
      }
      if (!p.id) {
        console.warn('Invalid project (no id):', p);
        return false;
      }
      return true;
    });
    
    console.log('Valid projects:', validProjects.length);
    
    return c.json({
      success: true,
      projects: validProjects
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return c.json({
      success: false,
      error: "Failed to fetch projects",
      details: String(error)
    }, 500);
  }
});

/**
 * Get a single project by ID
 */
app.get("/make-server-2ce8a38a/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const project = await kv.get(`project:${id}`);
    
    if (!project) {
      return c.json({
        success: false,
        error: "Project not found"
      }, 404);
    }
    
    return c.json({
      success: true,
      project
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return c.json({
      success: false,
      error: "Failed to fetch project",
      details: error.message
    }, 500);
  }
});

/**
 * Create or update a project
 */
app.post("/make-server-2ce8a38a/projects", async (c) => {
  try {
    const project = await c.req.json();
    
    if (!project.id) {
      return c.json({
        success: false,
        error: "Project ID is required"
      }, 400);
    }
    
    // Save project
    await kv.set(`project:${project.id}`, project);
    
    return c.json({
      success: true,
      project
    });
  } catch (error) {
    console.error("Error saving project:", error);
    return c.json({
      success: false,
      error: "Failed to save project",
      details: error.message
    }, 500);
  }
});

/**
 * Update a project
 */
app.put("/make-server-2ce8a38a/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    // Get existing project
    const existingProject = await kv.get(`project:${id}`);
    
    if (!existingProject) {
      return c.json({
        success: false,
        error: "Project not found"
      }, 404);
    }
    
    // Merge updates
    const updatedProject = { ...existingProject, ...updates, id };
    
    // Save updated project
    await kv.set(`project:${id}`, updatedProject);
    
    return c.json({
      success: true,
      project: updatedProject
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return c.json({
      success: false,
      error: "Failed to update project",
      details: error.message
    }, 500);
  }
});

/**
 * Delete a project
 */
app.delete("/make-server-2ce8a38a/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    // Check if project exists
    const project = await kv.get(`project:${id}`);
    
    if (!project) {
      return c.json({
        success: false,
        error: "Project not found"
      }, 404);
    }
    
    // Delete project
    await kv.del(`project:${id}`);
    
    return c.json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return c.json({
      success: false,
      error: "Failed to delete project",
      details: error.message
    }, 500);
  }
});

/**
 * Bulk import projects (for migration from localStorage)
 */
app.post("/make-server-2ce8a38a/projects/bulk-import", async (c) => {
  try {
    const { projects } = await c.req.json();
    
    if (!Array.isArray(projects)) {
      return c.json({
        success: false,
        error: "Projects must be an array"
      }, 400);
    }
    
    // Save all projects
    const keys = projects.map(p => `project:${p.id}`);
    await kv.mset(keys, projects);
    
    return c.json({
      success: true,
      count: projects.length,
      message: `Successfully imported ${projects.length} projects`
    });
  } catch (error) {
    console.error("Error bulk importing projects:", error);
    return c.json({
      success: false,
      error: "Failed to import projects",
      details: error.message
    }, 500);
  }
});

/**
 * Clear all projects (for admin use)
 */
app.delete("/make-server-2ce8a38a/projects", async (c) => {
  try {
    // Get all project keys
    const projects = await kv.getByPrefix("project:");
    const keys = projects.map(p => `project:${p.id}`);
    
    if (keys.length > 0) {
      await kv.mdel(keys);
    }
    
    return c.json({
      success: true,
      count: keys.length,
      message: `Deleted ${keys.length} projects`
    });
  } catch (error) {
    console.error("Error clearing projects:", error);
    return c.json({
      success: false,
      error: "Failed to clear projects",
      details: error.message
    }, 500);
  }
});

// ========================================
// ADMIN AUTHENTICATION ENDPOINTS
// ========================================

// Mount admin routes
app.route("/make-server-2ce8a38a/admin", adminRoutes);

// ========================================
// IMAGE MANAGEMENT ENDPOINTS
// ========================================

// Mount image routes
app.route("/make-server-2ce8a38a/images", imageRoutes);

Deno.serve(app.fetch);