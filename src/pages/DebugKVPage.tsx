import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Safe JSON display component
function SafeJSONDisplay({ value }: { value: any }) {
  try {
    let displayValue = value;
    
    // If it's a string that looks like an object, it might be double-stringified
    if (typeof value === 'string' && value.startsWith('{')) {
      try {
        displayValue = JSON.parse(value);
      } catch {
        // If parsing fails, just use the string
        displayValue = value;
      }
    }
    
    return (
      <pre className="text-xs overflow-x-auto">
        {JSON.stringify(displayValue, null, 2)}
      </pre>
    );
  } catch (err) {
    return (
      <div className="text-red-600">
        <p>Error displaying value:</p>
        <pre className="text-xs">{String(err)}</pre>
        <pre className="text-xs">Raw: {String(value)}</pre>
      </div>
    );
  }
}

export function DebugKVPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [cleanupSuccess, setCleanupSuccess] = useState('');

  useEffect(() => {
    fetchKVData();
  }, []);

  const fetchKVData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2ce8a38a/admin/debug-kv`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Debug KV data received:', result);
        setData(result);
      } else {
        setError('Error al obtener datos del KV store');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión: ' + String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanup = async () => {
    if (!confirm('⚠️ ADVERTENCIA: Esto eliminará TODOS los administradores del KV store. ¿Estás seguro?')) {
      return;
    }

    setIsCleaningUp(true);
    setError('');
    setCleanupSuccess('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2ce8a38a/admin/cleanup-kv`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        setCleanupSuccess(`✅ Limpieza exitosa: ${result.deleted.admin_list + result.deleted.admin_user} entradas eliminadas`);
        // Refresh data
        await fetchKVData();
      } else {
        setError('Error al limpiar el KV store');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión durante la limpieza: ' + String(err));
    } finally {
      setIsCleaningUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-['Arvo',_serif] text-[#0c4159] mb-4">
            🔍 Debug KV Store
          </h1>
          <p className="text-gray-600 mb-4">
            Esta página muestra el contenido del KV store para debugging
          </p>
          <div className="flex gap-2">
            <Button onClick={fetchKVData} disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Refrescar'}
            </Button>
            <Button 
              onClick={handleCleanup} 
              disabled={isCleaningUp}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCleaningUp ? 'Limpiando...' : '🗑️ Limpiar Entradas Corruptas'}
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Volver
            </Button>
          </div>
        </div>

        {error && (
          <Card className="mb-4 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {cleanupSuccess && (
          <Card className="mb-4 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-green-800">{cleanupSuccess}</p>
              <p className="text-sm text-green-700 mt-2">
                💡 Ahora ve a /admin/initialize para inicializar el super admin
              </p>
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            {/* Admin List Entries */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  admin_list: ({data.admin_list?.count || 0} entradas)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!data.admin_list?.entries || data.admin_list.entries.length === 0 ? (
                  <p className="text-gray-500">No hay entradas en admin_list:</p>
                ) : (
                  <div className="space-y-4">
                    {data.admin_list.entries.map((entry: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                        <p className="font-mono text-sm mb-2">
                          <strong>Key:</strong> {entry.key || 'N/A'}
                        </p>
                        <div className="bg-white p-3 rounded border">
                          <SafeJSONDisplay value={entry.value} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Admin User Entries */}
            <Card>
              <CardHeader>
                <CardTitle>
                  admin_user: ({data.admin_user?.count || 0} entradas)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!data.admin_user?.entries || data.admin_user.entries.length === 0 ? (
                  <p className="text-gray-500">No hay entradas en admin_user:</p>
                ) : (
                  <div className="space-y-4">
                    {data.admin_user.entries.map((entry: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                        <p className="font-mono text-sm mb-2">
                          <strong>Key:</strong> {entry.key || 'N/A'}
                        </p>
                        <div className="bg-white p-3 rounded border">
                          <SafeJSONDisplay value={entry.value} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Raw JSON */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>JSON Completo (Raw)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                  <SafeJSONDisplay value={data} />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8012]"></div>
            <p className="mt-4 text-gray-600">Cargando datos...</p>
          </div>
        )}
      </div>
    </div>
  );
}
