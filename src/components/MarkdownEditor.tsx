import React, { useState } from 'react';
import { Eye, EyeOff, HelpCircle } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  rows?: number;
}

export function MarkdownEditor({ value, onChange, placeholder, label, rows = 6 }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="space-y-2">
      {/* Label and Controls */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowGuide(!showGuide)}
            className="h-8 px-2 text-xs"
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            {showGuide ? 'Ocultar' : 'Guía'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="h-8 px-2 text-xs"
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Editor
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Vista Previa
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Guide */}
      {showGuide && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-2">
          <h4 className="font-semibold text-blue-900 mb-2">📝 Guía Rápida de Formato</h4>
          <div className="grid grid-cols-2 gap-3 text-blue-800">
            <div>
              <code className="bg-white px-2 py-0.5 rounded">**texto**</code>
              <span className="ml-2">→ <strong>Negrita</strong></span>
            </div>
            <div>
              <code className="bg-white px-2 py-0.5 rounded">*texto*</code>
              <span className="ml-2">→ <em>Cursiva</em></span>
            </div>
            <div>
              <code className="bg-white px-2 py-0.5 rounded">- Item</code>
              <span className="ml-2">→ Lista con viñetas</span>
            </div>
            <div>
              <code className="bg-white px-2 py-0.5 rounded">1. Item</code>
              <span className="ml-2">→ Lista numerada</span>
            </div>
            <div>
              <code className="bg-white px-2 py-0.5 rounded">### Título</code>
              <span className="ml-2">→ Subtítulo</span>
            </div>
            <div>
              <code className="bg-white px-2 py-0.5 rounded">`código`</code>
              <span className="ml-2">→ Código inline</span>
            </div>
          </div>
          <div className="pt-2 border-t border-blue-200 mt-3">
            <p className="text-blue-700 text-xs">
              💡 <strong>Tip:</strong> Usa doble salto de línea para crear párrafos separados
            </p>
          </div>
        </div>
      )}

      {/* Editor or Preview */}
      {showPreview ? (
        <div className="border border-gray-300 rounded-md p-4 bg-gray-50 min-h-[150px]">
          <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Vista Previa:</h4>
          {value ? (
            <MarkdownRenderer content={value} className="text-gray-900" />
          ) : (
            <p className="text-gray-400 italic">Escribe algo para ver la vista previa...</p>
          )}
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="font-mono text-sm resize-none"
        />
      )}

      {/* Character Count */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{value.length} caracteres</span>
        {!showPreview && (
          <span className="text-gray-400">Usa Markdown para formato avanzado</span>
        )}
      </div>
    </div>
  );
}
