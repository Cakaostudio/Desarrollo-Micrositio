import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ErrorBoundaryDemo } from '../components/ErrorBoundaryDemo';

/**
 * Error Testing Page
 * 
 * Dedicated page for testing error boundaries
 * Access at /error-test
 */
export default function ErrorTestPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0c4159] text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="font-['Arvo',_serif]">
            Error Boundary Testing
          </h1>
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-white hover:bg-white hover:bg-opacity-10 font-['Arvo',_serif]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al mapa
          </Button>
        </div>
      </div>

      {/* Demo Content */}
      <ErrorBoundaryDemo />
    </div>
  );
}
