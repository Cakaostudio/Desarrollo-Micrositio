/**
 * Cross-browser clipboard utility with fallback support
 * Works even when Clipboard API is blocked by permissions policy
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern clipboard API first (only if available and in secure context)
  if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Silently fall through to fallback method
      // No need to log - this is expected in restricted contexts
    }
  }

  // Fallback method using execCommand
  return fallbackCopyToClipboard(text);
}

function fallbackCopyToClipboard(text: string): boolean {
  // Create a temporary textarea element
  const textArea = document.createElement('textarea');
  textArea.value = text;
  
  // Make it invisible and positioned off-screen
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  textArea.style.opacity = '0';
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback clipboard copy failed:', err);
    document.body.removeChild(textArea);
    return false;
  }
}