import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProjectProvider, useProjects } from './contexts/ProjectContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/sonner';
import { SyncIndicator } from './components/SyncIndicator';
import { MapView } from './pages/MapView';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminManagementPage } from './pages/AdminManagementPage';
import { InitializeSuperAdminPage } from './pages/InitializeSuperAdminPage';
import { DebugKVPage } from './pages/DebugKVPage';

// Lazy load non-critical routes for better initial load performance
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ErrorTestPage = lazy(() => import('./pages/ErrorTestPage'));

/**
 * Loading fallback component for lazy-loaded routes
 */
function RouteLoadingFallback() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0c4159]">
      <div className="text-white font-['Arvo',_serif]">Cargando...</div>
    </div>
  );
}

/**
 * Main application layout with optimized route loading
 */
function AppLayout() {
  const { isSyncing } = useProjects();
  
  return (
    <div className="h-screen w-full overflow-hidden relative bg-[#0c4159]">
      {/* Sync indicator */}
      <SyncIndicator isSyncing={isSyncing} />
      
      {/* Main content area - routes */}
      <div className="relative h-full w-full">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<MapView />} />
            <Route path="/proyecto/:projectId" element={<ProjectDetailPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/initialize" element={<InitializeSuperAdminPage />} />
            <Route path="/admin/manage" element={<ProtectedRoute requireSuperAdmin={true}><AdminManagementPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="/error-test" element={<ErrorTestPage />} />
            <Route path="/debug-kv" element={<DebugKVPage />} />
            {/* Catch all - redirect to home */}
            <Route path="*" element={<MapView />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

/**
 * Root App component with providers
 */
export default function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to console for development
        console.error('Application Error:', error);
        console.error('Error Info:', errorInfo);
        
        // Optional: Send to error tracking service
        // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
      }}
    >
      <BrowserRouter>
        <ProjectProvider>
          <AuthProvider>
            <AppLayout />
            <Toaster 
              position="top-right" 
              richColors 
              closeButton
              toastOptions={{
                style: {
                  fontFamily: 'Arvo, serif',
                },
              }}
            />
          </AuthProvider>
        </ProjectProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}