import React, { useState } from 'react';
import { Share2, Check, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { copyToClipboard } from '../utils/clipboard';

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'hero';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  iconOnly?: boolean;
  project?: any; // Optional project data for better sharing
}

/**
 * Share button component with Web Share API fallback to clipboard
 * Enables easy sharing of project links on social platforms or copying URLs
 */
export function ShareButton({ 
  url, 
  title = 'Proyecto Social México', 
  text = 'Mira este proyecto social',
  variant = 'outline',
  size = 'sm',
  className = '',
  iconOnly = false,
  project
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;
  
  // Use project data if available
  const shareTitle = project ? project.name : title;
  const shareText = project ? `Conoce este proyecto social: ${project.name}` : text;

  const handleShare = async () => {
    // Try Web Share API first (mobile-friendly)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        toast.success('¡Compartido exitosamente!');
      } catch (error) {
        // User cancelled or share failed
        if ((error as Error).name !== 'AbortError') {
          handleCopyToClipboard();
        }
      }
    } else {
      // Fallback to clipboard
      handleCopyToClipboard();
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await copyToClipboard(shareUrl);
      setCopied(true);
      toast.success('Enlace copiado al portapapeles', {
        description: 'Puedes compartir el enlace donde quieras'
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('No se pudo copiar el enlace');
    }
  };

  // Hero variant gets custom styling - matches close button EXACTLY
  if (variant === 'hero') {
    return (
      <button
        onClick={handleShare}
        className={`
          w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12
          rounded-full
          bg-white/90 backdrop-blur-sm
          text-[#0c4159]
          hover:bg-white
          active:scale-95
          transition-all duration-300
          shadow-lg hover:shadow-xl
          flex items-center justify-center
          group
          pointer-events-auto
          ${className}
        `}
        aria-label={copied ? 'Enlace copiado' : 'Compartir proyecto'}
      >
        {copied ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:scale-110"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:scale-110"
          >
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        )}
      </button>
    );
  }
  
  return (
    <Button
      onClick={handleShare}
      variant={variant}
      size={size}
      className={`${className} transition-all duration-200`}
      title={iconOnly ? (copied ? 'Copiado' : 'Compartir') : undefined}
    >
      {iconOnly ? (
        // Icon only mode - no text
        copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Share2 className="w-4 h-4" />
        )
      ) : (
        // Normal mode - with text
        copied ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Copiado
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </>
        )
      )}
    </Button>
  );
}