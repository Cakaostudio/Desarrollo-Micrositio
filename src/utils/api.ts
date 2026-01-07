/**
 * API utilities for communicating with Supabase backend
 */

import { projectId, publicAnonKey } from './supabase/info';
import { Project } from '../types';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2ce8a38a`;

/**
 * Make an authenticated request to the API
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('API Request:', url, options.method || 'GET');
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    console.log('API Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: response.statusText || 'Unknown error' };
      }
      
      const errorMessage = errorData.error || errorData.details || `API request failed: ${response.statusText || response.status}`;
      console.error('API Error:', errorMessage, errorData);
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('API Request Exception:', error);
    throw error;
  }
}

/**
 * Fetch all projects from the server
 */
export async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await apiRequest<{ success: boolean; projects: Project[] }>(
      '/projects',
      { method: 'GET' }
    );
    
    return response.projects || [];
  } catch (error) {
    console.error('Error fetching projects from server:', error);
    throw error;
  }
}

/**
 * Fetch a single project by ID
 */
export async function fetchProject(id: string): Promise<Project | null> {
  try {
    const response = await apiRequest<{ success: boolean; project: Project }>(
      `/projects/${id}`,
      { method: 'GET' }
    );
    
    return response.project;
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    return null;
  }
}

/**
 * Create or update a project
 */
export async function saveProject(project: Project): Promise<Project> {
  try {
    const response = await apiRequest<{ success: boolean; project: Project }>(
      '/projects',
      {
        method: 'POST',
        body: JSON.stringify(project),
      }
    );
    
    return response.project;
  } catch (error) {
    console.error('Error saving project:', error);
    throw error;
  }
}

/**
 * Update an existing project
 */
export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  try {
    const response = await apiRequest<{ success: boolean; project: Project }>(
      `/projects/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );
    
    return response.project;
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<void> {
  try {
    await apiRequest<{ success: boolean; message: string }>(
      `/projects/${id}`,
      { method: 'DELETE' }
    );
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    throw error;
  }
}

/**
 * Bulk import projects (for migration)
 */
export async function bulkImportProjects(projects: Project[]): Promise<number> {
  try {
    const response = await apiRequest<{ success: boolean; count: number }>(
      '/projects/bulk-import',
      {
        method: 'POST',
        body: JSON.stringify({ projects }),
      }
    );
    
    return response.count;
  } catch (error) {
    console.error('Error bulk importing projects:', error);
    throw error;
  }
}

/**
 * Clear all projects (admin only)
 */
export async function clearAllProjects(): Promise<number> {
  try {
    const response = await apiRequest<{ success: boolean; count: number }>(
      '/projects',
      { method: 'DELETE' }
    );
    
    return response.count;
  } catch (error) {
    console.error('Error clearing all projects:', error);
    throw error;
  }
}