import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, CheckCircle, ArrowRight } from 'lucide-react';

/**
 * Demo component showcasing the stacked cards feature
 * Can be used in admin panel or as a feature highlight
 */
export function StackedCardsDemo() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Layers className="w-6 h-6" />,
      title: 'Folder-like Stacking',
      description: 'Sections layer on top like organized folders',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Smooth Scroll Snap',
      description: 'Precise section alignment with smooth transitions',
    },
    {
      icon: <ArrowRight className="w-6 h-6" />,
      title: 'Multiple Navigation',
      description: 'Progress rail, keyboard, and scroll navigation',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#0c4159] to-[#0a3448] rounded-xl p-6 sm:p-8 text-white shadow-2xl">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-[#ff8012] p-3 rounded-lg">
          <Layers className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-['Arvo',_serif] mb-2">
            Vista de Tarjetas Apiladas
          </h3>
          <p className="text-white/80 text-sm sm:text-base">
            Una experiencia moderna tipo folder para explorar proyectos
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4"
          >
            <div className="text-[#ff8012] flex-shrink-0">
              {feature.icon}
            </div>
            <div>
              <h4 className="font-['Arvo',_serif] mb-1">{feature.title}</h4>
              <p className="text-sm text-white/70">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate('/proyecto/PRJ-001?view=stacked')}
          className="
            flex-1 bg-[#ff8012] hover:bg-[#ff9933] text-white 
            px-6 py-3 rounded-lg font-['Arvo',_serif]
            transition-all duration-200 hover:shadow-lg
            flex items-center justify-center gap-2
          "
        >
          <span>Ver Demo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => window.open('/guidelines/Stacked-Cards-Guide.md', '_blank')}
          className="
            flex-1 bg-white/10 hover:bg-white/20 text-white 
            px-6 py-3 rounded-lg font-['Arvo',_serif]
            transition-all duration-200 border border-white/20
          "
        >
          Documentación
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-white/20">
        <p className="text-xs text-white/60 text-center">
          Activar agregando <code className="bg-white/10 px-2 py-1 rounded">?view=stacked</code> a cualquier URL de proyecto
        </p>
      </div>
    </div>
  );
}
