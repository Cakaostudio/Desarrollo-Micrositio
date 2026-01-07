import React, { useState } from 'react';
import { X, Palette, Layers, Zap, Info } from 'lucide-react';
import { Button } from './ui/button';
import { getAllCategoryColors } from '../utils/categoryColors';

/**
 * Demo overlay showing map enhancement features
 * Can be toggled on/off to show users what's new
 */
export function MapEnhancementsDemo() {
  const [isVisible, setIsVisible] = useState(false);
  const categories = getAllCategoryColors();

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="absolute bottom-20 right-4 z-30 bg-blue-600 hover:bg-blue-700 shadow-lg"
        size="sm"
      >
        <Info className="w-4 h-4 mr-2" />
        Novedades del Mapa
      </Button>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="font-['Arvo',_serif] text-2xl">
              🎨 Mejoras del Mapa Interactivo
            </h2>
            <button
              onClick={() => setIsVisible(false)}
              className="hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="font-['Arvo',_serif] text-sm mt-2 opacity-90">
            Explora las nuevas funcionalidades visuales
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Feature 1: Category Colors */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-['Arvo',_serif] text-lg text-gray-900">
                  Colores por Categoría
                </h3>
                <p className="font-['Arvo',_serif] text-sm text-gray-600">
                  Cada categoría tiene un color único
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {categories.slice(0, 6).map(({ category, color }) => (
                <div key={category} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full ring-2 ring-white shadow-md"
                    style={{ backgroundColor: color.primary }}
                  />
                  <span className="font-['Arvo',_serif] text-sm text-gray-700">
                    {color.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 2: Clustering */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-['Arvo',_serif] text-lg text-gray-900">
                  Agrupación Inteligente
                </h3>
                <p className="font-['Arvo',_serif] text-sm text-gray-600">
                  Los proyectos cercanos se agrupan automáticamente
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-['Arvo',_serif] shadow-lg">
                  5
                </div>
                <div className="flex-1">
                  <p className="font-['Arvo',_serif] text-sm text-gray-700">
                    Haz clic en un grupo para acercar
                  </p>
                  <p className="font-['Arvo',_serif] text-xs text-gray-500 mt-1">
                    El mapa se acerca automáticamente
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="text-center">
                  <div className="text-2xl mb-1">🔍</div>
                  <p className="font-['Arvo',_serif] text-xs text-gray-600">
                    Zoom Out
                  </p>
                  <p className="font-['Arvo',_serif] text-xs text-gray-500">
                    Grupos grandes
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🎯</div>
                  <p className="font-['Arvo',_serif] text-xs text-gray-600">
                    Zoom Normal
                  </p>
                  <p className="font-['Arvo',_serif] text-xs text-gray-500">
                    Grupos pequeños
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">📍</div>
                  <p className="font-['Arvo',_serif] text-xs text-gray-600">
                    Zoom In
                  </p>
                  <p className="font-['Arvo',_serif] text-xs text-gray-500">
                    Sin grupos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: Animations */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-['Arvo',_serif] text-lg text-gray-900">
                  Animaciones Suaves
                </h3>
                <p className="font-['Arvo',_serif] text-sm text-gray-600">
                  Transiciones fluidas al filtrar
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                <span className="font-['Arvo',_serif] text-sm text-gray-700">
                  Los marcadores aparecen con efecto de rebote
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                <span className="font-['Arvo',_serif] text-sm text-gray-700">
                  Resplandor al pasar el cursor
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="font-['Arvo',_serif] text-sm text-gray-700">
                  Zoom suave al hacer clic en grupos
                </span>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-['Arvo',_serif] text-sm text-gray-900 mb-2">
              💡 Consejos de uso:
            </h4>
            <ul className="space-y-1 font-['Arvo',_serif] text-xs text-gray-700">
              <li>• Usa la leyenda en la esquina inferior izquierda para identificar categorías</li>
              <li>• Haz clic en grupos numerados para acercar y ver proyectos individuales</li>
              <li>• Pasa el cursor sobre marcadores para ver información rápida</li>
              <li>• Los colores te ayudan a encontrar proyectos por categoría</li>
            </ul>
          </div>

          {/* Close Button */}
          <Button
            onClick={() => setIsVisible(false)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            ¡Entendido! Explorar el Mapa
          </Button>
        </div>
      </div>
    </div>
  );
}
