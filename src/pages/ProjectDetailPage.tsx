import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../contexts/ProjectContext';
import { ProjectStackedCardsView } from '../components/ProjectStackedCardsView';
import { ProjectDetailSkeleton } from '../components/ProjectDetailSkeleton';

/**
 * Project detail page - shows full project information
 * Accessible via /proyecto/:projectId URL
 * 
 * Uses the premium stacked cards view with smooth scroll animations
 * and folder-like card stacking experience.
 */
export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, setSelectedProject, selectedProject } = useProjects();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      navigate('/');
      return;
    }

    // Find project by ID
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      setSelectedProject(project);
      setIsLoading(false);
    } else {
      // Project not found - redirect to map after brief delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  }, [projectId, projects, setSelectedProject, navigate]);

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  if (isLoading || !selectedProject) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-hidden">
        <div className="h-full w-full overflow-y-auto bg-white">
          <ProjectDetailSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
      <div className="h-full w-full overflow-y-auto bg-white">
        <ProjectStackedCardsView 
          project={selectedProject} 
          onClose={handleClose} 
        />
      </div>
    </div>
  );
}
