/**
 * Performance optimization utilities for smooth scrolling and animations
 */

/**
 * Throttle function using requestAnimationFrame
 * Ensures callback runs at most once per frame (60fps)
 */
export function rafThrottle<T extends (...args: any[]) => void>(callback: T): T {
  let rafId: number | null = null;
  let lastArgs: any[] | null = null;

  const throttled = (...args: any[]) => {
    lastArgs = args;
    
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) {
          callback(...lastArgs);
        }
        rafId = null;
        lastArgs = null;
      });
    }
  };

  return throttled as T;
}

/**
 * Debounce function for events that don't need RAF
 */
export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout | null = null;

  const debounced = (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      callback(...args);
      timeoutId = null;
    }, delay);
  };

  return debounced as T;
}

/**
 * Check if browser supports will-change CSS property
 */
export function supportsWillChange(): boolean {
  if (typeof window === 'undefined') return false;
  return 'CSS' in window && 'supports' in window.CSS 
    ? window.CSS.supports('will-change', 'transform')
    : true; // Assume support for modern browsers
}

/**
 * Enable GPU acceleration for an element
 */
export function enableGPUAcceleration(element: HTMLElement): void {
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
}

/**
 * Disable GPU acceleration for an element (when not needed)
 */
export function disableGPUAcceleration(element: HTMLElement): void {
  element.style.transform = '';
  element.style.backfaceVisibility = '';
  element.style.perspective = '';
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get optimal scroll behavior based on user preferences
 */
export function getScrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? 'auto' : 'smooth';
}
