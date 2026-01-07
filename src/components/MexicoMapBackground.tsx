import React from 'react';

export function MexicoMapBackground() {
  return (
    <svg
      viewBox="0 0 1000 600"
      className="w-full h-full absolute inset-0"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Mexico outline with state borders */}
      <g fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5">
        {/* Main Mexico outline */}
        <path
          d="M150,200 L200,150 L300,140 L400,130 L500,135 L600,140 L700,150 L800,160 L850,180 L900,220 L920,280 L900,350 L880,400 L850,450 L800,480 L750,500 L700,510 L650,520 L600,525 L550,530 L500,535 L450,540 L400,545 L350,550 L300,545 L250,540 L200,530 L180,520 L160,500 L140,480 L130,450 L125,400 L130,350 L140,300 L150,250 Z"
          fill="rgba(255,255,255,0.02)"
        />
        
        {/* State borders - simplified representation */}
        {/* Baja California */}
        <path d="M50,180 L80,160 L90,200 L85,240 L70,260 L50,250 Z" fill="transparent" />
        
        {/* Sonora */}
        <path d="M90,200 L150,180 L170,220 L160,260 L140,280 L120,270 L90,250 Z" fill="transparent" />
        
        {/* Chihuahua */}
        <path d="M170,160 L250,150 L270,200 L250,250 L200,260 L170,220 Z" fill="transparent" />
        
        {/* Coahuila */}
        <path d="M270,160 L350,155 L370,200 L350,240 L270,250 L270,200 Z" fill="transparent" />
        
        {/* Nuevo León */}
        <path d="M370,180 L420,175 L430,210 L410,230 L370,225 Z" fill="transparent" />
        
        {/* Tamaulipas */}
        <path d="M430,175 L480,170 L500,210 L480,250 L430,240 Z" fill="transparent" />
        
        {/* San Luis Potosí */}
        <path d="M320,250 L380,245 L400,290 L370,320 L320,315 Z" fill="transparent" />
        
        {/* Jalisco */}
        <path d="M220,320 L280,315 L300,360 L270,390 L220,385 Z" fill="transparent" />
        
        {/* México */}
        <path d="M380,320 L440,315 L460,350 L440,380 L380,375 Z" fill="transparent" />
        
        {/* Guerrero */}
        <path d="M340,380 L400,375 L420,410 L390,440 L340,435 Z" fill="transparent" />
        
        {/* Oaxaca */}
        <path d="M420,410 L500,405 L520,450 L480,480 L420,475 Z" fill="transparent" />
        
        {/* Chiapas */}
        <path d="M520,450 L580,445 L600,480 L570,510 L520,505 Z" fill="transparent" />
        
        {/* Veracruz */}
        <path d="M480,250 L540,245 L560,320 L520,380 L480,350 Z" fill="transparent" />
        
        {/* Yucatán */}
        <path d="M700,220 L780,215 L800,260 L770,290 L700,285 Z" fill="transparent" />
        
        {/* Quintana Roo */}
        <path d="M780,260 L820,255 L840,300 L810,330 L780,325 Z" fill="transparent" />
      </g>
    </svg>
  );
}