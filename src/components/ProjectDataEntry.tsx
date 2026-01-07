import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Project } from '../types';

const MEXICAN_STATES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 
  'Chihuahua', 'Coahuila', 'Colima', 'Ciudad de México', 'Durango', 'Guanajuato', 
  'Guerrero', 'Hidalgo', 'Jalisco', 'México', 'Michoacán', 'Morelos', 'Nayarit', 
  'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 
  'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
];

interface ProjectDataEntryProps {
  onSave: (project: Omit<Project, 'id'>) => void;
  onClose: () => void;
}

export function ProjectDataEntry({ onSave, onClose }: ProjectDataEntryProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    organization: '',
    state: '',
    city: '',
    category: '',
    thematicArea: '',
    budget: '',
    status: 'activo',
    beneficiaries: '',
    startDate: '',
    evaluationCriteria: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate approximate coordinates based on state (you can refine these)
    const getCoordinates = (state: string) => {
      const stateCoords: Record<string, { x: number, y: number }> = {
        'Chihuahua': { x: 33, y: 7 },
        'Sonora': { x: 10, y: 12 },
        'Coahuila': { x: 45, y: 13 },
        'Durango': { x: 35, y: 25 },
        'Nuevo León': { x: 55, y: 18 },
        // Add more states as needed
      };
      return stateCoords[state] || { x: 50, y: 50 };
    };

    const coords = getCoordinates(formData.state);
    
    const project: Omit<Project, 'id'> = {
      name: formData.name,
      description: formData.description,
      shortDescription: formData.shortDescription,
      organization: formData.organization,
      location: {
        state: formData.state,
        city: formData.city,
        x: coords.x,
        y: coords.y
      },
      category: formData.category as Project['category'],
      thematicArea: formData.thematicArea as Project['thematicArea'],
      budget: formData.budget,
      status: formData.status as Project['status'],
      beneficiaries: parseInt(formData.beneficiaries),
      startDate: formData.startDate,
      evaluationCriteria: formData.evaluationCriteria.split(',').map(c => c.trim())
    };

    onSave(project);
    // Reset form
    setFormData({
      name: '', description: '', shortDescription: '', organization: '',
      state: '', city: '', category: '', thematicArea: '', budget: '',
      status: 'activo', beneficiaries: '', startDate: '', evaluationCriteria: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Project</h2>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Project Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input
              placeholder="Organization"
              value={formData.organization}
              onChange={(e) => setFormData({...formData, organization: e.target.value})}
              required
            />
          </div>
          
          <Textarea
            placeholder="Full Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
          
          <Textarea
            placeholder="Short Description"
            value={formData.shortDescription}
            onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {MEXICAN_STATES.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="educacion">Educación</SelectItem>
                <SelectItem value="salud">Salud</SelectItem>
                <SelectItem value="medio-ambiente">Medio Ambiente</SelectItem>
                <SelectItem value="desarrollo-social">Desarrollo Social</SelectItem>
                <SelectItem value="tecnologia">Tecnología</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={formData.thematicArea} onValueChange={(value) => setFormData({...formData, thematicArea: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Thematic Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="innovacion">Innovación</SelectItem>
                <SelectItem value="sostenibilidad">Sostenibilidad</SelectItem>
                <SelectItem value="inclusion">Inclusión</SelectItem>
                <SelectItem value="emprendimiento">Emprendimiento</SelectItem>
                <SelectItem value="investigacion">Investigación</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Budget (e.g., $2,500,000 MXN)"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              required
            />
            <Input
              type="number"
              placeholder="Beneficiaries"
              value={formData.beneficiaries}
              onChange={(e) => setFormData({...formData, beneficiaries: e.target.value})}
              required
            />
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              required
            />
          </div>
          
          <Input
            placeholder="Evaluation Criteria (comma separated)"
            value={formData.evaluationCriteria}
            onChange={(e) => setFormData({...formData, evaluationCriteria: e.target.value})}
            required
          />
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">Save Project</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}