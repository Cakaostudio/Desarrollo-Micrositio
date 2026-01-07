/**
 * Smooth scroll utility with fallback for older browsers
 * Ensures consistent smooth scrolling behavior across all browsers
 */

/**
 * Smoothly scroll to an element
 * @param element - Target element to scroll to
 * @param options - Scroll behavior options
 */
export function smoothScrollToElement(
  element: HTMLElement,
  options: {
    block?: ScrollLogicalPosition;
    behavior?: ScrollBehavior;
    offset?: number;
  } = {}
) {
  const {
    block = 'start',
    behavior = 'smooth',
    offset = 0,
  } = options;

  // Check if browser supports smooth scrolling
  if ('scrollBehavior' in document.documentElement.style) {
    element.scrollIntoView({
      behavior,
      block,
    });
  } else {
    // Fallback for browsers without smooth scroll support
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'auto', // Instant scroll as fallback
    });
  }
}

/**
 * Smoothly scroll to a specific position
 * @param position - Target scroll position in pixels
 * @param duration - Animation duration in milliseconds
 */
export function smoothScrollToPosition(
  position: number,
  duration: number = 300
) {
  const startPosition = window.pageYOffset;
  const distance = position - startPosition;
  const startTime = performance.now();

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (easeInOutCubic)
    const easeProgress = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startPosition + distance * easeProgress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

/**
 * Check if smooth scroll is supported by the browser
 */
export function isSmoothScrollSupported(): boolean {
  return 'scrollBehavior' in document.documentElement.style;
}

/**
 * Get the current scroll position
 */
export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  };
}

/**
 * Disable scroll (useful for modals/overlays)
 */
export function disableScroll() {
  const scrollY = window.pageYOffset;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
}

/**
 * Re-enable scroll after disabling
 */
export function enableScroll() {
  const scrollY = document.body.style.top;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, parseInt(scrollY || '0') * -1);
}
