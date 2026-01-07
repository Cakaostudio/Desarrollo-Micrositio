import { Project } from '../types';

// Projects array - Add your projects here using the admin panel
export const projects: Project[] = [];

export const categoryOptions = [
  { value: 'iniciativa-con-evidencia-impacto', label: 'Iniciativa con evidencia de impacto o resultado' },
  { value: 'iniciativa-prometedora', label: 'Iniciativa prometedora' },
  { value: 'proyecto', label: 'Proyecto' }
];

export const thematicAreaOptions = [
  { value: 'prevencion-violencias-ninos-adolescentes', label: 'Prevención de violencias o conductas problemáticas de niños, niñas y adolescentes' },
  { value: 'prevencion-violencia-intrafamiliar-maltrato-infantil', label: 'Prevención de la violencia intrafamiliar y el maltrato infantil' },
  { value: 'proteccion-lideres-sociales-defensores-periodistas', label: 'Protección a líderes(as) sociales, defensores(as) de DDHH y/o periodistas' },
  { value: 'rehabilitacion-reinsercion-social-jovenes-adultos', label: 'Reinserción social de jóvenes y adultos en conflicto con la justicia' },
  { value: 'prevencion-situacional', label: 'Prevención situacional' },
  { value: 'mediacion-resolucion-conflictos', label: 'Mediación, resolución pacífica de conflictos y construcción de paz' },
  { value: 'policia-comunitaria', label: 'Policía comunitaria' }
];

// All Mexican states in alphabetical order
export const locationOptions = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nacional',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas'
].map(state => ({ value: state, label: state }));