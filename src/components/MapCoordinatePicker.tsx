import React, { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { MapPin, Check, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Card } from './ui/card';
import svgPaths from "../imports/svg-v5k32ff4er";

interface MapCoordinatePickerProps {
  percentX?: number | string; // Percentage (0-100)
  percentY?: number | string; // Percentage (0-100)
  onPositionChange: (percentX: number, percentY: number) => void;
  onLoad?: () => void; // Optional callback when map is loaded
}

interface Transform {
  x: number;
  y: number;
  scale: number;
}

export function MapCoordinatePicker({ percentX, percentY, onPositionChange, onLoad }: MapCoordinatePickerProps) {
  const [isPickerActive, setIsPickerActive] = useState(false);
  // Convert to number, handling both number and string types, defaulting to 50
  const initialX = percentX !== undefined && percentX !== '' ? (typeof percentX === 'number' ? percentX : parseFloat(percentX)) : 50;
  const initialY = percentY !== undefined && percentY !== '' ? (typeof percentY === 'number' ? percentY : parseFloat(percentY)) : 50;
  const [tempX, setTempX] = useState(initialX);
  const [tempY, setTempY] = useState(initialY);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);

  // Constrain transform to keep map within bounds
  const constrainToBounds = useCallback((x: number, y: number, scale: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x, y };
    
    const mapWidth = 2638;
    const mapHeight = 1822;
    const mapOffsetX = 455;
    const mapOffsetY = 521;
    
    const scaledMapWidth = mapWidth * scale;
    const scaledMapHeight = mapHeight * scale;
    const scaledOffsetX = mapOffsetX * scale;
    const scaledOffsetY = mapOffsetY * scale;
    
    const minX = rect.width - scaledMapWidth;
    const maxX = scaledOffsetX;
    const minY = rect.height - scaledMapHeight;
    const maxY = scaledOffsetY;
    
    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY)
    };
  }, []);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !mapContentRef.current) return;
    if (isDragging) return; // Don't place marker while dragging
    
    // Get click position relative to the viewport container
    const containerRect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - containerRect.left;
    const clickY = e.clientY - containerRect.top;
    
    // Account for the transform (pan and scale)
    // Convert viewport coordinates to map coordinates
    const mapX = (clickX - transform.x) / transform.scale;
    const mapY = (clickY - transform.y) / transform.scale;
    
    // The map content has dimensions 2638x1822 with offset -455, -521
    // Convert to coordinates relative to the map's coordinate system
    const relativeX = mapX + 455;
    const relativeY = mapY + 521;
    
    // Convert to percentage (0-100)
    const xPercent = (relativeX / 2638) * 100;
    const yPercent = (relativeY / 1822) * 100;
    
    // Clamp to 0-100%
    setTempX(Math.max(0, Math.min(100, xPercent)));
    setTempY(Math.max(0, Math.min(100, yPercent)));
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const rawNewX = e.clientX - dragStart.x;
    const rawNewY = e.clientY - dragStart.y;
    
    const constrainedPosition = constrainToBounds(rawNewX, rawNewY, transform.scale);
    
    setTransform(prev => ({
      ...prev,
      x: constrainedPosition.x,
      y: constrainedPosition.y
    }));
  }, [isDragging, dragStart, transform.scale, constrainToBounds]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(transform.scale * scaleFactor, 0.6), 3);
    
    const rawNewX = mouseX - (mouseX - transform.x) * (newScale / transform.scale);
    const rawNewY = mouseY - (mouseY - transform.y) * (newScale / transform.scale);
    
    const constrainedPosition = constrainToBounds(rawNewX, rawNewY, newScale);
    
    setTransform({
      x: constrainedPosition.x,
      y: constrainedPosition.y,
      scale: newScale
    });
  }, [transform, constrainToBounds]);

  const handleZoomIn = () => {
    const newScale = Math.min(transform.scale * 1.3, 3);
    const constrainedPosition = constrainToBounds(transform.x, transform.y, newScale);
    setTransform({ 
      x: constrainedPosition.x, 
      y: constrainedPosition.y, 
      scale: newScale 
    });
  };

  const handleZoomOut = () => {
    const newScale = Math.max(transform.scale * 0.7, 0.6);
    const constrainedPosition = constrainToBounds(transform.x, transform.y, newScale);
    setTransform({ 
      x: constrainedPosition.x, 
      y: constrainedPosition.y, 
      scale: newScale 
    });
  };

  const handleReset = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  const handleSave = () => {
    onPositionChange(tempX, tempY);
    setIsPickerActive(false);
  };

  const handleCancel = () => {
    const resetX = percentX !== undefined && percentX !== '' ? (typeof percentX === 'number' ? percentX : parseFloat(percentX)) : 50;
    const resetY = percentY !== undefined && percentY !== '' ? (typeof percentY === 'number' ? percentY : parseFloat(percentY)) : 50;
    setTempX(resetX);
    setTempY(resetY);
    setTransform({ x: 0, y: 0, scale: 1 });
    setIsPickerActive(false);
  };

  // Features component matching InteractiveMap structure
  function Features() {
    return (
      <div className="absolute inset-[4.54%_4.55%_4.57%_4.55%]" data-name="features">
        <div className="absolute inset-[-0.02%_-0.01%]">
          <svg className="block size-full pointer-events-none" fill="none" preserveAspectRatio="none" viewBox="0 0 2400 1658">
            <g id="features">
              <path d={svgPaths.p282afa00} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p8de2500} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p3253b780} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p2da1a600} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p2f46e800} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p38eb17b0} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p1b2b9b00} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.pe0b2e80} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p31270280} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p2f5800c0} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p3709c380} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p2b241f80} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p24a5a00} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p20579e00} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p3df966c0} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p7b69280} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.pf594e80} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p37a8880} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p210f4000} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p36ce1e00} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p1a4ea820} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p15f9d880} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p38919bf0} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p3e4afa80} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p2cfb2d00} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p92bf200} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p262c7600} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p3ca23580} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p32b46e00} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p28fa54f0} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p2826ee80} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
              <path d={svgPaths.p10649200} fill="#0E5271" stroke="#8FA1A9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
            </g>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block font-medium">Ubicación en el Mapa</label>
        {!isPickerActive && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPickerActive(true)}
            className="text-xs"
          >
            <MapPin className="w-3 h-3 mr-1" />
            {percentX !== undefined && percentX !== '' && percentY !== undefined && percentY !== '' ? 'Cambiar Ubicación' : 'Seleccionar Ubicación'}
          </Button>
        )}
      </div>

      {/* Status indicator */}
      {!isPickerActive && (
        <div className={`p-3 rounded-lg text-sm ${percentX !== undefined && percentX !== '' && percentY !== undefined && percentY !== '' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-gray-50 border border-gray-200 text-gray-600'}`}>
          {percentX !== undefined && percentX !== '' && percentY !== undefined && percentY !== '' ? (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Ubicación seleccionada en el mapa</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Haz clic en "Seleccionar Ubicación" para colocar el marcador en el mapa</span>
            </div>
          )}
        </div>
      )}

      {/* Interactive Map Picker */}
      {isPickerActive && (
        <Card className="p-4 border-2 border-blue-500 bg-blue-50">
          <div className="mb-3">
            <p className="text-sm text-blue-900 font-medium">
              Usa la rueda del ratón o los botones para hacer zoom. Arrastra para mover el mapa. Haz clic para colocar el marcador.
            </p>
          </div>

          {/* Map container with zoom controls - matches InteractiveMap exactly */}
          <div className="relative">
            <div 
              ref={containerRef}
              className={`relative w-full h-[600px] bg-[#0c4159] rounded-lg overflow-hidden border-2 border-blue-300 shadow-lg ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onClick={handleMapClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              {/* Map content with transform - exact same structure as InteractiveMap */}
              <div
                ref={mapContentRef}
                style={{
                  transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                  transformOrigin: '0 0',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
                className="w-full h-full"
              >
                {/* Figma imported map structure - exact match */}
                <div className="relative size-full bg-[#0c4159]">
                  <div className="absolute bg-[#0c4159] h-[1822px] left-[-455px] overflow-clip top-[-521px] w-[2638px]">
                    <Features />
                  </div>
                  
                  {/* Marker overlay - matches InteractiveMap positioning exactly */}
                  <div className="absolute" style={{ width: '2638px', height: '1822px', left: '-455px', top: '-521px' }}>
                    <div
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                      style={{
                        left: `${(tempX / 100) * 2638}px`,
                        top: `${(tempY / 100) * 1822}px`
                      }}
                    >
                      <div className="relative" style={{ transform: `scale(${1 / transform.scale})` }}>
                        {/* Pulsing background */}
                        <div className="absolute inset-0 w-8 h-8 bg-yellow-400 rounded-full opacity-30 animate-pulse transform -translate-x-1/2 -translate-y-1/2" />
                        {/* Pin icon */}
                        <MapPin className="relative w-10 h-10 text-yellow-400 drop-shadow-lg" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Zoom controls */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 z-30">
              <Button
                type="button"
                onClick={handleZoomIn}
                size="sm"
                className="w-8 h-8 p-0 bg-white text-gray-800 hover:bg-gray-100"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                onClick={handleZoomOut}
                size="sm"
                className="w-8 h-8 p-0 bg-white text-gray-800 hover:bg-gray-100"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                onClick={handleReset}
                size="sm"
                className="w-8 h-8 p-0 bg-white text-gray-800 hover:bg-gray-100"
                title="Restablecer vista"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Coordinate display */}
          <div className="mt-2 text-xs text-gray-600 text-center">
            Posición: {tempX.toFixed(2)}% x {tempY.toFixed(2)}%
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <Button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Check className="w-4 h-4 mr-1" />
              Guardar Ubicación
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              size="sm"
            >
              <X className="w-4 h-4 mr-1" />
              Cancelar
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}