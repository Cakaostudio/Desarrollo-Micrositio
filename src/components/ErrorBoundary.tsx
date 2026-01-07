import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { copyToClipboard } from '../utils/clipboard';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * Features:
 * - Beautiful error UI matching app design
 * - Multiple recovery options (reload, home, report)
 * - Optional error details (for debugging)
 * - Error logging support
 * - User-friendly messaging
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Optional: Send to error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.handleReset();
    window.location.href = '/';
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    const errorReport = `
Error: ${error?.message || 'Unknown error'}

Stack Trace:
${error?.stack || 'No stack trace available'}

Component Stack:
${errorInfo?.componentStack || 'No component stack available'}

User Agent: ${navigator.userAgent}
URL: ${window.location.href}
Time: ${new Date().toISOString()}
    `.trim();

    // Copy to clipboard
    copyToClipboard(errorReport).then(() => {
      alert('Error details copied to clipboard! You can now paste and send this to support.');
    }).catch(() => {
      // Fallback: show in alert
      alert('Error details:\n\n' + errorReport);
    });
  };

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#0c4159] to-[#0a3547] flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
              {/* Header with Icon */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="bg-white bg-opacity-20 p-4 rounded-full">
                    <AlertTriangle className="w-12 h-12" />
                  </div>
                  <div>
                    <h1 className="font-['Arvo',_serif] mb-2">
                      ¡Ups! Algo salió mal
                    </h1>
                    <p className="text-red-100 font-['Arvo',_serif] text-sm opacity-90">
                      La aplicación encontró un error inesperado
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Error Message */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-['Arvo',_serif]">
                    <span className="font-bold">Error:</span>{' '}
                    {this.state.error?.message || 'Error desconocido'}
                  </p>
                </div>

                {/* What Happened */}
                <div className="space-y-3">
                  <h3 className="text-gray-900 font-['Arvo',_serif]">
                    ¿Qué pasó?
                  </h3>
                  <p className="text-gray-600 font-['Arvo',_serif] text-sm leading-relaxed">
                    La aplicación encontró un problema inesperado y no pudo continuar. 
                    Esto puede ocurrir por varios motivos, pero generalmente se soluciona 
                    recargando la página.
                  </p>
                </div>

                {/* What to Do */}
                <div className="space-y-3">
                  <h3 className="text-gray-900 font-['Arvo',_serif]">
                    ¿Qué puedo hacer?
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 font-['Arvo',_serif]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#0c4159] mt-0.5">•</span>
                      <span>
                        <strong>Recargar la página</strong> - Esto soluciona la mayoría de los problemas
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0c4159] mt-0.5">•</span>
                      <span>
                        <strong>Volver al inicio</strong> - Regresa al mapa principal
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#0c4159] mt-0.5">•</span>
                      <span>
                        <strong>Reportar el error</strong> - Ayúdanos a mejorar reportando el problema
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    onClick={this.handleReload}
                    className="bg-[#0c4159] hover:bg-[#0a3547] text-white font-['Arvo',_serif] flex-1 min-w-[200px]"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recargar página
                  </Button>
                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="font-['Arvo',_serif] flex-1 min-w-[200px]"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Volver al inicio
                  </Button>
                </div>

                {/* Secondary Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={this.handleReportError}
                    variant="ghost"
                    size="sm"
                    className="font-['Arvo',_serif] text-gray-600 hover:text-gray-900"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar detalles del error
                  </Button>
                  <Button
                    onClick={this.toggleDetails}
                    variant="ghost"
                    size="sm"
                    className="font-['Arvo',_serif] text-gray-600 hover:text-gray-900"
                  >
                    {this.state.showDetails ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Ocultar detalles técnicos
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Ver detalles técnicos
                      </>
                    )}
                  </Button>
                </div>

                {/* Technical Details (Collapsible) */}
                {this.state.showDetails && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3 animate-fade-in">
                    <div>
                      <p className="text-xs font-bold text-gray-700 font-['Arvo',_serif] mb-1">
                        Error Message:
                      </p>
                      <pre className="text-xs text-gray-600 font-mono bg-white p-2 rounded overflow-x-auto">
                        {this.state.error?.message}
                      </pre>
                    </div>
                    
                    {this.state.error?.stack && (
                      <div>
                        <p className="text-xs font-bold text-gray-700 font-['Arvo',_serif] mb-1">
                          Stack Trace:
                        </p>
                        <pre className="text-xs text-gray-600 font-mono bg-white p-2 rounded overflow-x-auto max-h-32 overflow-y-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}

                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <p className="text-xs font-bold text-gray-700 font-['Arvo',_serif] mb-1">
                          Component Stack:
                        </p>
                        <pre className="text-xs text-gray-600 font-mono bg-white p-2 rounded overflow-x-auto max-h-32 overflow-y-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-bold text-gray-700 font-['Arvo',_serif] mb-1">
                        Browser Info:
                      </p>
                      <pre className="text-xs text-gray-600 font-mono bg-white p-2 rounded overflow-x-auto">
                        {navigator.userAgent}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 font-['Arvo',_serif] text-center">
                  Si el problema persiste, por favor contacta al soporte técnico
                </p>
              </div>
            </div>

            {/* Additional Help */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white opacity-75 font-['Arvo',_serif]">
                Lamentamos las molestias. Estamos trabajando para que esto no vuelva a suceder.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple error boundary for specific sections
 * Shows a compact error message with retry option
 */
export class SectionErrorBoundary extends Component<
  { children: ReactNode; sectionName?: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`SectionErrorBoundary (${this.props.sectionName}) caught:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-red-900 font-['Arvo',_serif] mb-1">
              Error en {this.props.sectionName || 'esta sección'}
            </h3>
            <p className="text-sm text-red-700 font-['Arvo',_serif]">
              {this.state.error?.message || 'Error desconocido'}
            </p>
          </div>
          <Button
            onClick={() => this.setState({ hasError: false, error: null })}
            size="sm"
            variant="outline"
            className="font-['Arvo',_serif]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Intentar de nuevo
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}