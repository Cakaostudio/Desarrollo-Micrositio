import React from 'react';
import { X, MapPin, Users, Calendar, DollarSign } from 'lucide-react';
import { Project } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { categoryOptions, thematicAreaOptions } from '../data/projects';

interface ProjectDetailsModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectDetailsModal({ project, onClose }: ProjectDetailsModalProps) {
  const categoryLabel = categoryOptions.find(c => c.value === project.category)?.label || project.category;
  const thematicAreaLabel = thematicAreaOptions.find(t => t.value === project.thematicArea)?.label || project.thematicArea;
  
  const statusColors = {
    activo: 'bg-green-100 text-green-800',
    'en-desarrollo': 'bg-yellow-100 text-yellow-800',
    finalizado: 'bg-gray-100 text-gray-800'
  };

  const categoryColors = {
    educacion: 'bg-blue-100 text-blue-800',
    salud: 'bg-red-100 text-red-800',
    'medio-ambiente': 'bg-green-100 text-green-800',
    'desarrollo-social': 'bg-purple-100 text-purple-800',
    tecnologia: 'bg-orange-100 text-orange-800'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl text-gray-900">{project.name}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status and Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={statusColors[project.status] || 'bg-gray-100 text-gray-800'}>
              {project.status === 'activo' ? 'Activo' : 
               project.status === 'en-desarrollo' ? 'En Desarrollo' : 'Finalizado'}
            </Badge>
            <Badge className={categoryColors[project.category] || 'bg-gray-100 text-gray-800'}>
              {categoryLabel}
            </Badge>
            <Badge variant="outline">
              {thematicAreaLabel}
            </Badge>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-700">{project.description}</p>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-600">Ubicación</div>
                <div className="text-gray-900">{project.location.city}, {project.location.state}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-600">Beneficiarios</div>
                <div className="text-gray-900">{project.beneficiaries.toLocaleString()} personas</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-600">Presupuesto</div>
                <div className="text-gray-900">{project.budget}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-600">Fecha de inicio</div>
                <div className="text-gray-900">
                  {new Date(project.startDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Ver más detalles
            </Button>
            <Button variant="outline">
              Contactar responsable
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}