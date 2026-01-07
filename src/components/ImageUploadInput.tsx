import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Upload, Link, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
}

export function ImageUploadInput({
  value,
  onChange,
  label,
  placeholder = "https://...",
  required = false,
  description
}: ImageUploadInputProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync previewUrl with external value changes (e.g., form reset)
  useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de archivo inválido. Solo se permiten JPEG, PNG, GIF y WebP.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Archivo muy grande. El tamaño máximo es 5MB.');
      return;
    }

    // Show preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    // Upload to server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading image to server...', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2ce8a38a/images/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            // DO NOT set Content-Type - browser sets it automatically with boundary
          },
          body: formData,
        }
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Upload result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Error al subir imagen');
      }

      // Update with the server URL
      onChange(result.url);
      setPreviewUrl(result.url);
      toast.success('Imagen subida exitosamente');

      // Clean up local preview
      URL.revokeObjectURL(localPreview);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error instanceof Error ? error.message : 'Error al subir la imagen');
      setPreviewUrl(value); // Restore previous preview
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    setPreviewUrl(url);
  };

  const handleClearImage = () => {
    onChange('');
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {/* Mode Selector */}
      <div className="flex gap-2 mb-3">
        <Button
          type="button"
          variant={mode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('url')}
          className="flex-1"
        >
          <Link className="w-4 h-4 mr-2" />
          Usar URL
        </Button>
        <Button
          type="button"
          variant={mode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('upload')}
          className="flex-1"
        >
          <Upload className="w-4 h-4 mr-2" />
          Subir Archivo
        </Button>
      </div>

      {/* URL Input Mode */}
      {mode === 'url' && (
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="url"
              value={value}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder}
              required={required && !value}
            />
            {value && (
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Limpiar"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              disabled={uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Seleccionar Archivo
                </>
              )}
            </Button>
            
            {value && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleClearImage}
                disabled={uploading}
                title="Eliminar imagen"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Formatos: JPG, PNG, GIF, WebP • Máximo: 5MB
          </p>

          {value && (
            <div className="text-xs text-green-600 flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              Imagen lista: {value.substring(0, 50)}...
            </div>
          )}
        </div>
      )}

      {/* Image Preview */}
      {previewUrl && (
        <div className="mt-3 p-2 border rounded-lg bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Vista previa:</p>
          <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => {
                setPreviewUrl('');
                toast.error('Error al cargar la imagen de vista previa');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}