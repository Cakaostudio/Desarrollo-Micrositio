import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function InitializeSuperAdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const initializeSuperAdmin = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2ce8a38a/admin/initialize-super-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Error al inicializar super admin');
      }
    } catch (err) {
      console.error('Error calling initialization endpoint:', err);
      setError('Error de conexión al servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c4159] to-[#0a3345] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#ff8012] rounded-full flex items-center justify-center">
              <span className="text-3xl">🔧</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-['Arvo',_serif] text-[#0c4159]">
            Inicializar Super Administrador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>¿Cuándo usar esta herramienta?</strong>
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
              <li>Si no puedes hacer login en /admin/login</li>
              <li>Si necesitas recrear el super admin inicial</li>
              <li>Si hubo un error en la inicialización automática</li>
            </ul>
          </div>

          {/* Credentials Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Se creará el siguiente super admin:
            </p>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> hello@cakaostudio.com
              </p>
              <p className="text-sm text-gray-600">
                <strong>Password:</strong> Cakaostudio08
              </p>
              <p className="text-sm text-gray-600">
                <strong>Rol:</strong> super_admin
              </p>
            </div>
          </div>

          {/* Initialize Button */}
          {!result && (
            <Button
              onClick={initializeSuperAdmin}
              disabled={isLoading}
              className="w-full bg-[#ff8012] hover:bg-[#e67310]"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Inicializando...
                </>
              ) : (
                <>
                  Inicializar Super Admin
                </>
              )}
            </Button>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {result && result.success && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    ¡Super Admin Inicializado Correctamente!
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    {result.message}
                  </p>
                </div>
              </div>

              {result.admin && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Detalles del Admin:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{result.admin.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rol:</span>
                      <span className="font-medium">{result.admin.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className="font-medium text-green-600">{result.admin.status}</span>
                    </div>
                  </div>
                </div>
              )}

              {result.credentials && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-900 mb-2">
                    Credenciales:
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="text-yellow-800">
                      <strong>Email:</strong> {result.credentials.email}
                    </p>
                    <p className="text-yellow-800">
                      <strong>Password:</strong> {result.credentials.password}
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={() => window.location.href = '/admin/login'}
                className="w-full bg-[#0c4159] hover:bg-[#0a3345]"
              >
                Ir a Login
              </Button>
            </div>
          )}

          {/* Back Link */}
          {!result && (
            <div className="text-center pt-4">
              <a
                href="/admin/login"
                className="text-sm text-[#0c4159] hover:underline"
              >
                ← Volver al Login
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
