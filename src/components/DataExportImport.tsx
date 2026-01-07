import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Download, Upload, FileJson, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Project } from '../types';
import { toast } from 'sonner';
import { Alert, AlertDescription } from './ui/alert';

interface DataExportImportProps {
  projects: Project[];
  onImport: (projects: Project[]) => void;
  onClearAll: () => void;
}

export function DataExportImport({ projects, onImport, onClearAll }: DataExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');

  // Generate filename with timestamp
  const getTimestamp = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace(/[T:]/g, '-');
  };

  // Export all projects to JSON
  const exportToJSON = () => {
    if (projects.length === 0) {
      toast.error('No hay proyectos para exportar');
      return;
    }

    try {
      const dataStr = JSON.stringify(projects, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `proyectos-mexico-${getTimestamp()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`${projects.length} proyectos exportados exitosamente`, {
        description: 'El archivo JSON se ha descargado'
      });
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      toast.error('Error al exportar los proyectos', {
        description: 'Por favor intenta de nuevo'
      });
    }
  };

  // Export projects to CSV
  const exportToCSV = () => {
    if (projects.length === 0) {
      toast.error('No hay proyectos para exportar');
      return;
    }

    try {
      // CSV Headers
      const headers = [
        'No. Registro',
        'Nombre de la Propuesta',
        'Organización',
        'Categoría',
        'Ámbito Temático',
        'Estado',
        'Municipio',
        'Estados Implementación',
        'Objetivo Principal',
        'Beneficiarios',
        'Factores de Riesgo',
        'Metodología',
        'Resultados Principales',
        'Criterios Evaluación',
        'Puntaje Total',
        'Posición Final',
        'URL Imagen',
        'Coordenada X',
        'Coordenada Y'
      ];

      // Convert projects to CSV rows
      const rows = projects.map(project => {
        const implementationStates = project.implementationStates?.join('; ') || '';
        
        return [
          project.id,
          project.name,
          project.organization,
          project.category,
          project.thematicArea,
          project.state,
          project.municipality,
          implementationStates,
          project.objective,
          project.beneficiaries,
          project.riskFactors || '',
          project.methodology || '',
          project.results,
          project.evaluationCriteriaHighlights || '',
          project.totalScore.toString(),
          project.finalRankingPosition?.toString() || '',
          project.imageUrl,
          project.location?.x?.toString() || '',
          project.location?.y?.toString() || ''
        ].map(field => {
          // Escape quotes and wrap in quotes if contains comma, newline, or quote
          const escaped = String(field).replace(/"/g, '""');
          return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
        });
      });

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Add UTF-8 BOM for Excel compatibility
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `proyectos-mexico-${getTimestamp()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`${projects.length} proyectos exportados a CSV`, {
        description: 'El archivo se puede abrir en Excel'
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast.error('Error al exportar a CSV', {
        description: 'Por favor intenta de nuevo'
      });
    }
  };

  // Validate imported project data
  const validateProject = (project: any): project is Project => {
    const requiredFields = ['id', 'name', 'organization', 'category', 'thematicArea', 'state', 'objective', 'results'];
    
    for (const field of requiredFields) {
      if (!project[field]) {
        return false;
      }
    }
    
    // Validate totalScore is a number
    if (typeof project.totalScore !== 'number') {
      return false;
    }
    
    return true;
  };

  // Import projects from JSON file
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be selected again
    event.target.value = '';

    if (!file.name.endsWith('.json')) {
      toast.error('Formato de archivo incorrecto', {
        description: 'Por favor selecciona un archivo JSON'
      });
      return;
    }

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Validate data is an array
      if (!Array.isArray(data)) {
        toast.error('Formato de datos incorrecto', {
          description: 'El archivo debe contener un array de proyectos'
        });
        return;
      }

      // Validate each project
      const validProjects: Project[] = [];
      const invalidProjects: number[] = [];

      data.forEach((project, index) => {
        if (validateProject(project)) {
          validProjects.push(project);
        } else {
          invalidProjects.push(index + 1);
        }
      });

      if (validProjects.length === 0) {
        toast.error('No se encontraron proyectos válidos', {
          description: 'Verifica el formato del archivo'
        });
        return;
      }

      // Handle import based on mode
      if (importMode === 'replace') {
        onClearAll();
        validProjects.forEach(project => onImport([project]));
        toast.success(`${validProjects.length} proyectos importados`, {
          description: 'Los proyectos anteriores han sido reemplazados'
        });
      } else {
        // Merge mode - check for duplicates
        const existingIds = new Set(projects.map(p => p.id));
        const newProjects = validProjects.filter(p => !existingIds.has(p.id));
        const duplicates = validProjects.length - newProjects.length;

        newProjects.forEach(project => onImport([project]));
        
        if (newProjects.length > 0) {
          toast.success(`${newProjects.length} nuevos proyectos importados`, {
            description: duplicates > 0 
              ? `${duplicates} proyectos duplicados fueron omitidos` 
              : 'Importación completada'
          });
        } else {
          toast.warning('No se importaron proyectos nuevos', {
            description: 'Todos los proyectos ya existen'
          });
        }
      }

      if (invalidProjects.length > 0) {
        toast.warning(`${invalidProjects.length} proyectos inválidos fueron omitidos`, {
          description: `Índices: ${invalidProjects.slice(0, 5).join(', ')}${invalidProjects.length > 5 ? '...' : ''}`
        });
      }

    } catch (error) {
      console.error('Error importing projects:', error);
      toast.error('Error al importar el archivo', {
        description: error instanceof Error ? error.message : 'Archivo JSON mal formado'
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Proyectos
          </CardTitle>
          <CardDescription>
            Descarga todos los proyectos para hacer respaldo o compartir
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={exportToJSON}
              disabled={projects.length === 0}
              className="flex-1"
              variant="outline"
            >
              <FileJson className="w-4 h-4 mr-2" />
              Exportar JSON ({projects.length} proyectos)
            </Button>
            <Button
              onClick={exportToCSV}
              disabled={projects.length === 0}
              className="flex-1"
              variant="outline"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Exportar CSV (Excel)
            </Button>
          </div>
          
          {projects.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No hay proyectos para exportar. Agrega proyectos primero.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importar Proyectos
          </CardTitle>
          <CardDescription>
            Carga proyectos desde un archivo JSON exportado anteriormente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Import Mode Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Modo de Importación</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={importMode === 'merge' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setImportMode('merge')}
                className="flex-1"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Combinar
              </Button>
              <Button
                type="button"
                variant={importMode === 'replace' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setImportMode('replace')}
                className="flex-1"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Reemplazar Todo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {importMode === 'merge' 
                ? 'Los proyectos nuevos se agregarán sin eliminar los existentes'
                : '⚠️ TODOS los proyectos actuales serán eliminados y reemplazados'}
            </p>
          </div>

          {/* Import Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              variant={importMode === 'replace' ? 'destructive' : 'default'}
            >
              <Upload className="w-4 h-4 mr-2" />
              Seleccionar Archivo JSON
            </Button>
          </div>

          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Solo se aceptan archivos JSON exportados desde esta aplicación.
              Los proyectos duplicados (mismo ID) serán omitidos en modo "Combinar".
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Backup Reminder */}
      {projects.length > 0 && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Recomendación:</strong> Exporta tus proyectos regularmente como respaldo.
            Los datos se guardan en el navegador y pueden perderse si se borran los datos del sitio.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
