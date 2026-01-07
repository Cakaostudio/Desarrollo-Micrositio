import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  title: string;
  shortTitle: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  bgColor: string;
  hoverColor: string;
  isActive: boolean;
  menuTitle?: string;
  menuBgGradient: string;
  menuHeaderBg: string;
}

export function FilterDropdown({
  title,
  shortTitle,
  options,
  selectedValues,
  onSelectionChange,
  bgColor,
  hoverColor,
  isActive,
  menuTitle,
  menuBgGradient,
  menuHeaderBg
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonWidth, setButtonWidth] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOptionToggle = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newSelection);
  };

  useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <div ref={buttonRef} className="w-full">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            ${bgColor} ${hoverColor} text-white border-none shadow-none
            flex items-center justify-between px-2 sm:px-4 h-14 sm:h-12 rounded-none transition-all duration-300 w-full text-left overflow-hidden
            ${isActive ? 'ring-2 ring-white ring-opacity-50' : ''}
          `}
        >
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          <span className="hidden sm:inline text-sm font-medium truncate">{title}</span>
          <span className="sm:hidden text-xs font-medium truncate leading-tight">{shortTitle}</span>
          {selectedValues.length > 0 && (
            <span className="bg-white bg-opacity-30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs flex-shrink-0">
              {selectedValues.length}
            </span>
          )}
        </div>
        <Plus className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-45' : ''}`} />
      </Button>
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Flyout Menu - Mobile optimized with better touch targets */}
          <div 
            className={`absolute bottom-full left-0 mb-2 ${menuBgGradient} rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in`}
            style={{ width: buttonWidth || 'auto', minWidth: '200px', maxWidth: '95vw' }}
          >
            {/* Header */}
            <div className={`px-3 sm:px-4 py-2.5 sm:py-3 ${menuHeaderBg}`}>
              <h3 className="text-gray-800 font-medium text-sm sm:text-base">{menuTitle || "Filtros"}</h3>
            </div>
            
            {/* Options List - Scrollable with mobile optimization */}
            <div className="p-2 space-y-1 max-h-64 sm:max-h-72 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionToggle(option.value)}
                  className={`
                    w-full text-left px-3 sm:px-4 py-3 sm:py-3 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium active:scale-95 sm:hover:scale-105
                    ${selectedValues.includes(option.value) 
                      ? 'bg-white bg-opacity-80 text-gray-800 shadow-sm' 
                      : 'hover:bg-white hover:bg-opacity-40 text-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="pr-2 leading-snug">{option.label}</span>
                    {selectedValues.includes(option.value) && (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Footer Actions - Mobile optimized */}
            {selectedValues.length > 0 && (
              <div className="px-2 pb-2">
                <button
                  onClick={() => onSelectionChange([])}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-40 rounded-lg transition-colors active:scale-95"
                >
                  Limpiar selección
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}