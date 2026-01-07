import React, { useState } from 'react';
import { Bug, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { SectionErrorBoundary } from './ErrorBoundary';

/**
 * Demo component for testing Error Boundary
 * This component intentionally throws errors for testing purposes
 * 
 * Usage: Add to a page to test error handling
 */

// Component that throws on render
function BrokenComponent({ shouldBreak }: { shouldBreak: boolean }) {
  if (shouldBreak) {
    throw new Error('This is a simulated error for testing the Error Boundary!');
  }
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <p className="text-green-800 font-['Arvo',_serif] text-sm">
        ✓ Component is working correctly
      </p>
    </div>
  );
}

// Component that throws in event handler
function EventErrorComponent() {
  const handleClick = () => {
    throw new Error('Error thrown from event handler!');
  };

  return (
    <Button onClick={handleClick} variant="destructive" className="font-['Arvo',_serif]">
      <Bug className="w-4 h-4 mr-2" />
      Throw Error (Event Handler)
    </Button>
  );
}

// Component that throws in async operation
function AsyncErrorComponent() {
  const [error, setError] = useState<Error | null>(null);

  const handleAsyncError = async () => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    setError(new Error('Async operation failed!'));
  };

  if (error) {
    throw error;
  }

  return (
    <Button onClick={handleAsyncError} variant="destructive" className="font-['Arvo',_serif]">
      <Bug className="w-4 h-4 mr-2" />
      Throw Error (Async)
    </Button>
  );
}

export function ErrorBoundaryDemo() {
  const [breakFullPage, setBreakFullPage] = useState(false);
  const [breakSection, setBreakSection] = useState(false);

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-amber-900 font-['Arvo',_serif] mb-2">
              Error Boundary Testing Component
            </h2>
            <p className="text-sm text-amber-800 font-['Arvo',_serif]">
              This component is for testing error boundaries. Use the buttons below to trigger different types of errors.
            </p>
          </div>
        </div>
      </div>

      {/* Full Page Error Test */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-gray-900 font-['Arvo',_serif]">
          1. Full Page Error Boundary
        </h3>
        <p className="text-sm text-gray-600 font-['Arvo',_serif]">
          This will trigger the main error boundary and show the full-page error UI.
        </p>
        <BrokenComponent shouldBreak={breakFullPage} />
        <Button
          onClick={() => setBreakFullPage(true)}
          variant="destructive"
          className="font-['Arvo',_serif]"
        >
          <Bug className="w-4 h-4 mr-2" />
          Trigger Full Page Error
        </Button>
      </div>

      {/* Section Error Test */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-gray-900 font-['Arvo',_serif]">
          2. Section Error Boundary
        </h3>
        <p className="text-sm text-gray-600 font-['Arvo',_serif]">
          This error is caught by a section-level boundary and only affects this part of the page.
        </p>
        <SectionErrorBoundary sectionName="Demo Section">
          <BrokenComponent shouldBreak={breakSection} />
        </SectionErrorBoundary>
        <Button
          onClick={() => setBreakSection(true)}
          variant="destructive"
          className="font-['Arvo',_serif]"
        >
          <Bug className="w-4 h-4 mr-2" />
          Trigger Section Error
        </Button>
        {breakSection && (
          <Button
            onClick={() => setBreakSection(false)}
            variant="outline"
            className="font-['Arvo',_serif] ml-2"
          >
            Reset Section
          </Button>
        )}
      </div>

      {/* Event Handler Error */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-gray-900 font-['Arvo',_serif]">
          3. Event Handler Error
        </h3>
        <p className="text-sm text-gray-600 font-['Arvo',_serif]">
          Note: Event handler errors are NOT caught by error boundaries in React. 
          They must be handled with try-catch.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-xs text-yellow-800 font-['Arvo',_serif]">
            ⚠️ This will show an error in the console but won't trigger the error boundary.
          </p>
        </div>
        <EventErrorComponent />
      </div>

      {/* Async Error */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-gray-900 font-['Arvo',_serif]">
          4. Async Operation Error
        </h3>
        <p className="text-sm text-gray-600 font-['Arvo',_serif]">
          Simulates an error from an async operation (like API call).
        </p>
        <AsyncErrorComponent />
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-blue-900 font-['Arvo',_serif] mb-3">
          Testing Instructions
        </h3>
        <ol className="space-y-2 text-sm text-blue-800 font-['Arvo',_serif]">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span>Click "Trigger Full Page Error" to see the main error boundary</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span>Try the reload and home buttons in the error UI</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span>Click "Trigger Section Error" to see a localized error boundary</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">4.</span>
            <span>Try the "Intentar de nuevo" button to recover the section</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">5.</span>
            <span>Check the browser console for error logs</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
