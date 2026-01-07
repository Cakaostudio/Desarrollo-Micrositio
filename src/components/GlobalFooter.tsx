import React from 'react';
import { Mail, Phone, Instagram, Facebook, Globe, MapPin, Linkedin, Youtube } from 'lucide-react';
import { Project } from '../types';

// Custom X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Custom TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface GlobalFooterProps {
  project: Project;
}

export function GlobalFooter({ project }: GlobalFooterProps) {
  // Extract footer data from project with fallbacks
  const organizationName = project.footerOrganizationName || project.organization || 'Organization Name';
  const contactEmail = project.footerContactEmail;
  const contactPhone = project.footerContactPhone;
  const contactEmail2 = project.footerContactEmail2;
  const contactPhone2 = project.footerContactPhone2;
  const websiteUrl = project.footerWebsiteUrl;
  const physicalAddress = project.footerPhysicalAddress;
  const instagramUrl = project.footerInstagramUrl;
  const facebookUrl = project.footerFacebookUrl;
  const xUrl = project.footerXUrl;
  const linkedinUrl = project.footerLinkedinUrl;
  const youtubeUrl = project.footerYoutubeUrl;
  const tiktokUrl = project.footerTiktokUrl;
  return (
    <div className="w-full bg-white">
      {/* Desktop title - Hidden on mobile (mobile gets title from StackedCardSection) */}
      <div className="hidden lg:block px-4 sm:px-6 md:px-8 lg:px-[20px] pt-8 sm:pt-10 md:pt-12">
        <div className="font-['Arvo',_serif] text-[#ff8012] text-[32px] md:text-[40px] leading-none mb-8 font-bold">
          Información
        </div>
      </div>
      
      {/* Full-width horizontal divider */}
      <div className="w-full h-[1px] bg-[#0c4159] opacity-20" />

      {/* Footer content container - Mobile optimized */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-[20px] py-8 sm:py-10 md:py-12">
        {/* Three-column layout - Mobile stacks vertically */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-8 mb-6 sm:mb-8">
          
          {/* Left Side - Brand - Mobile optimized */}
          <div className="flex-1 w-full sm:w-auto">
            <p className="font-['Arvo',_serif] text-[#0c4159] text-base sm:text-lg md:text-[20px] leading-tight mb-3 sm:mb-4">
              {organizationName}
            </p>
            
            {/* Website */}
            {websiteUrl && (
              <div className="flex items-center gap-2 mt-3">
                <Globe className="w-4 h-4 text-[#0c4159]" />
                <a 
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-['Arvo',_serif] text-[#0c4159] text-[14px] hover:text-[#ff8012] transition-colors"
                >
                  Sitio Web
                </a>
              </div>
            )}
            
            {/* Physical Address */}
            <div className="flex items-start gap-2 mt-3">
              <MapPin className="w-4 h-4 text-[#0c4159] mt-0.5 flex-shrink-0" />
              {physicalAddress ? (
                <p className="font-['Arvo',_serif] text-[#0c4159] text-[14px]">
                  {physicalAddress}
                </p>
              ) : (
                <p className="font-['Arvo',_serif] text-[#0c4159] text-[14px] italic opacity-60">
                  No tiene ubicación física
                </p>
              )}
            </div>
          </div>

          {/* Center - Contact Info - Mobile optimized */}
          <div className="flex-1 w-full sm:w-auto flex flex-col gap-2 sm:gap-3">
            {/* Email - Only show if exists */}
            {contactEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0c4159]" />
                <a 
                  href={`mailto:${contactEmail}`}
                  className="font-['Arvo',_serif] text-[#0c4159] text-[14px] hover:text-[#ff8012] transition-colors"
                >
                  {contactEmail}
                </a>
              </div>
            )}
            
            {/* Phone - Only show if exists */}
            {contactPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0c4159]" />
                <a 
                  href={`tel:${contactPhone}`}
                  className="font-['Arvo',_serif] text-[#0c4159] text-[14px] hover:text-[#ff8012] transition-colors"
                >
                  {contactPhone}
                </a>
              </div>
            )}
            
            {/* Email 2 - Only show if exists */}
            {contactEmail2 && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0c4159]" />
                <a 
                  href={`mailto:${contactEmail2}`}
                  className="font-['Arvo',_serif] text-[#0c4159] text-[14px] hover:text-[#ff8012] transition-colors"
                >
                  {contactEmail2}
                </a>
              </div>
            )}
            
            {/* Phone 2 - Only show if exists */}
            {contactPhone2 && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0c4159]" />
                <a 
                  href={`tel:${contactPhone2}`}
                  className="font-['Arvo',_serif] text-[#0c4159] text-[14px] hover:text-[#ff8012] transition-colors"
                >
                  {contactPhone2}
                </a>
              </div>
            )}
            
            {/* Message when no contact info */}
            {!contactEmail && !contactPhone && !contactEmail2 && !contactPhone2 && (
              <p className="font-['Arvo',_serif] text-[#0c4159] text-[14px] italic opacity-60">
                No se proporcionó información de contacto
              </p>
            )}
          </div>

          {/* Right Side - Social Media - Mobile optimized */}
          <div className="flex-1 w-full sm:w-auto flex justify-start sm:justify-end">
            <div className="flex gap-3 sm:gap-4">
              {instagramUrl && (
                <a 
                  href={instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px] rounded-full bg-[#0c4159] flex items-center justify-center hover:bg-[#ff8012] active:scale-95 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
              )}
              {facebookUrl && (
                <a 
                  href={facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px] rounded-full bg-[#0c4159] flex items-center justify-center hover:bg-[#ff8012] active:scale-95 transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
              )}
              {xUrl && (
                <a 
                  href={xUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px] rounded-full bg-[#0c4159] flex items-center justify-center hover:bg-[#ff8012] active:scale-95 transition-all"
                  aria-label="X (Twitter)"
                >
                  <XIcon className="w-5 h-5 text-white" />
                </a>
              )}
              {linkedinUrl && (
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px] rounded-full bg-[#0c4159] flex items-center justify-center hover:bg-[#ff8012] active:scale-95 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              )}
              {youtubeUrl && (
                <a 
                  href={youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px] rounded-full bg-[#0c4159] flex items-center justify-center hover:bg-[#ff8012] active:scale-95 transition-all"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              )}
              {tiktokUrl && (
                <a 
                  href={tiktokUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px] rounded-full bg-[#0c4159] flex items-center justify-center hover:bg-[#ff8012] active:scale-95 transition-all"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-5 h-5 text-white" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright notice - centered - GLOBAL - Mobile optimized */}
        <div className="text-center pt-4 sm:pt-6 border-t border-[#0c4159] border-opacity-10">
          <p className="font-['Arvo',_serif] text-[#0c4159] text-[10px] sm:text-[11px] md:text-[12px] opacity-60 px-2">
            © 2025 Programa de Seguridad Ciudadana de la Universidad Iberoamericana. Derechos Reservados.
          </p>
        </div>
      </div>
    </div>
  );
}