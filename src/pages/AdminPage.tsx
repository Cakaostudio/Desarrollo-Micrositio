import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDataEntry } from '../components/AdminDataEntry';
import { useProjects } from '../contexts/ProjectContext';

/**
 * Admin panel page - manage projects, import/export data
 * Accessible via /admin URL
 */
export default function AdminPage() {
  const navigate = useNavigate();
  const { projects, addProject, clearAllProjects, removeProject } = useProjects();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <AdminDataEntry 
      onSave={addProject}
      onClose={handleClose}
      existingProjects={projects}
      onClearAll={clearAllProjects}
      onRemoveProject={removeProject}
    />
  );
}
