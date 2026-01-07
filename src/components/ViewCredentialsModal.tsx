import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Copy, Eye, EyeOff, Mail, Lock, User, Calendar, RefreshCw } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { copyToClipboard as copyTextToClipboard } from '../utils/clipboard';

interface Credentials {
  email: string;
  password: string;
  name: string;
  role: string;
  created_at: string;
}

interface ViewCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: Credentials | null;
  adminId: string | null;
  onPasswordReset?: () => void;
}

export function ViewCredentialsModal({ isOpen, onClose, credentials, adminId, onPasswordReset }: ViewCredentialsModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const copyToClipboard = async (text: string, field: string) => {
    const success = await copyTextToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleResetPassword = async () => {
    if (!adminId) return;
    
    setIsResetting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2ce8a38a/admin/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ adminId })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al resetear contraseña');
      }

      // Update credentials with new password
      if (credentials) {
        credentials.password = data.newPassword;
        setShowPassword(true);
      }

      // Call the parent's callback to refresh admin list
      if (onPasswordReset) {
        onPasswordReset();
      }

      setCopiedField('reset-success');
      setTimeout(() => setCopiedField(null), 3000);
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error al resetear la contraseña: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsResetting(false);
    }
  };

  if (!credentials) return null;

  const isPasswordAvailable = credentials.password && !credentials.password.includes('No disponible');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-['Arvo',_serif] text-[#0c4159]">
            Credenciales del Administrador
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Aquí puedes ver y copiar las credenciales del administrador.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 mb-1">Nombre</p>
              <p className="text-sm font-medium text-gray-900 break-words">
                {credentials.name}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 mb-1">Email</p>
              <p className="text-sm font-medium text-gray-900 break-words">
                {credentials.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(credentials.email, 'email')}
              className="shrink-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {/* Password */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Lock className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 mb-1">Contraseña</p>
              <p className="text-sm font-medium text-gray-900 break-words font-mono">
                {showPassword ? credentials.password : '••••••••••••'}
              </p>
              {!isPasswordAvailable && (
                <div className="mt-2">
                  <p className="text-xs text-amber-600 mb-2">
                    Este usuario ya existía en el sistema
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetPassword}
                    disabled={isResetting}
                    className="text-xs h-8 bg-[#f8c200] hover:bg-[#e6b300] text-[#0c4159] border-0"
                  >
                    {isResetting ? (
                      <>
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Generar Nueva Contraseña
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
              {isPasswordAvailable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(credentials.password, 'password')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Role */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-1">Rol</p>
              <p className="text-sm font-medium text-gray-900">
                {credentials.role === 'super_admin' ? 'Super Admin' : 'Editor'}
              </p>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-1">Creado el</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(credentials.created_at).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Copy feedback */}
          {copiedField && copiedField !== 'reset-success' && (
            <div className="flex items-center justify-center gap-2 p-2 bg-green-50 text-green-800 rounded text-sm">
              ✓ {copiedField === 'email' ? 'Email' : 'Contraseña'} copiado al portapapeles
            </div>
          )}
          {copiedField === 'reset-success' && (
            <div className="flex items-center justify-center gap-2 p-2 bg-green-50 text-green-800 rounded text-sm">
              ✓ Contraseña reseteada con éxito
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}