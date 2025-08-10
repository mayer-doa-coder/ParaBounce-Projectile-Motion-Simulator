import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { CanvasProps } from '../../types/simulation';

const GROUND_HEIGHT = 100;

// Image cache to store loaded images
const imageCache = new Map<string, HTMLImageElement>();

// Preload images immediately when module loads
const imageUrls = ['/barrel.png', '/base.png', '/bg_hill.png'];

// Function to load and cache images with better error handling
const loadImage = (src: string): Promise<HTMLImageElement> => {
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src)!);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = (error) => {
      console.warn(`Failed to load image: ${src}`, error);
      // Create a placeholder image or resolve with null
      reject(new Error(`Failed to load ${src}`));
    };
    // Set src after event handlers to avoid race conditions
    img.src = src;
  });
};

// Preload images when the module is first imported
const preloadImages = () => {
  imageUrls.forEach(url => {
    loadImage(url).catch(error => {
      console.warn(`Preload failed for ${url}:`, error);
    });
  });
};

// Start preloading immediately
if (typeof window !== 'undefined') {
  preloadImages();
}

export function SimulationCanvas({ simulation, params, isDayTheme, updateParams }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDraggingHeight, setIsDraggingHeight] = useState(false);
  const [isDraggingAngle, setIsDraggingAngle] = useState(false);
  const [isHoveringHeight, setIsHoveringHeight] = useState(false);
  const [isHoveringAngle, setIsHoveringAngle] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dragStartY, setDragStartY] = useState(0);
  const [initialHeight, setInitialHeight] = useState(0);
  const [initialAngle, setInitialAngle] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageLoadingAttempted, setImageLoadingAttempted] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(0);

  // Force re-render when images load
  useEffect(() => {
    const checkImagesLoaded = () => {
      const allLoaded = imageUrls.every(url => {
        const img = imageCache.get(url);
        return img && img.complete && img.naturalWidth > 0;
      });
      
      if (allLoaded && !imagesLoaded) {
        setImagesLoaded(true);
        setRenderTrigger(prev => prev + 1); // Force re-render
      }
    };

    // Check periodically until all images are loaded
    const interval = setInterval(checkImagesLoaded, 100);
    
    // Cleanup interval after 5 seconds or when images are loaded
    setTimeout(() => {
      clearInterval(interval);
      setImagesLoaded(true); // Ensure we don't wait indefinitely
    }, 5000);

    return () => clearInterval(interval);
  }, [imagesLoaded]);

  // Load images on component mount with improved error handling
  useEffect(() => {
    if (imageLoadingAttempted) return;
    
    const loadAllImages = async () => {
      setImageLoadingAttempted(true);
      try {
        // Try to load all images
        await Promise.allSettled([
          loadImage('/barrel.png'),
          loadImage('/base.png'),
          loadImage('/bg_hill.png')
        ]);
        
        // Check which images actually loaded successfully
        const loadedCount = imageUrls.filter(url => imageCache.has(url)).length;
        console.log(`Successfully loaded ${loadedCount}/${imageUrls.length} images`);
        
        setImagesLoaded(true);
        setRenderTrigger(prev => prev + 1); // Force re-render
      } catch (error) {
        console.error('Failed to load some images:', error);
        setImagesLoaded(true); // Still allow rendering with fallback shapes
      }
    };

    loadAllImages();
  }, [imageLoadingAttempted]);

  // Calculate responsive canvas dimensions
  const { canvasWidth, canvasHeight, scale, maxCannonHeight } = useMemo(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      // Return default values for SSR
      return {
        canvasWidth: 800,
        canvasHeight: 600,
        scale: 1,
        maxCannonHeight: params.canvasHeightMeters * 0.8
      };
    }

    const containerWidth = window.innerWidth - 320; // Account for side panels
    const containerHeight = window.innerHeight - 120; // Account for header

    // Calculate scale to fit the desired meter dimensions
    const scaleX = Math.min(containerWidth * 0.8, 1200) / params.canvasWidthMeters;
    const scaleY = Math.min(containerHeight * 0.8, 800 - GROUND_HEIGHT) / params.canvasHeightMeters;

    // Use the smaller scale to maintain aspect ratio
    const finalScale = Math.min(scaleX, scaleY);

    const width = params.canvasWidthMeters * finalScale;
    const height = params.canvasHeightMeters * finalScale + GROUND_HEIGHT;

    // Calculate max cannon height as 80% of the simulation area height
    const maxHeight = (params.canvasHeightMeters * 0.8);

    return {
      canvasWidth: width,
      canvasHeight: height,
      scale: finalScale,
      maxCannonHeight: maxHeight
    };
  }, [params.canvasWidthMeters, params.canvasHeightMeters]);

  // Generate static stars for night mode to prevent regeneration
  const nightStars = useMemo(() => {
    if (isDayTheme) return [];

    const stars = [];
    const starCount = Math.floor((canvasWidth * canvasHeight) / 8000);

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * (canvasHeight - GROUND_HEIGHT),
        size: Math.random() * 1.5 + 0.5
      });
    }
    return stars;
  }, [canvasWidth, canvasHeight, isDayTheme]);

  // Calculate cannon base height based on cannon height parameter
  const CANNON_BASE_HEIGHT = Math.max(20, params.cannonHeight * scale);

  // Convert physics coordinates (meters) to canvas coordinates (pixels)
  const physicsToCanvas = useCallback((x: number, y: number) => {
    return {
      x: x * scale + 100,
      y: canvasHeight - GROUND_HEIGHT - y * scale
    };
  }, [scale, canvasHeight]);

  // Check if mouse is over left side (height control zone)
  const isMouseInHeightZone = useCallback((mouseX: number) => {
    return mouseX < canvasWidth / 2;
  }, [canvasWidth]);

  // Check if mouse is over right side (angle control zone)
  const isMouseInAngleZone = useCallback((mouseX: number) => {
    return mouseX >= canvasWidth / 2;
  }, [canvasWidth]);

  // Handle mouse move for height and angle control
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    setMousePos({ x: mouseX, y: mouseY });

    if (isDraggingHeight) {
      // Handle height dragging - calculate change from initial position with increased sensitivity
      const deltaY = dragStartY - mouseY;
      const heightChange = deltaY / (scale * 4); // Increased sensitivity (was 8)
      const newHeight = Math.max(0.1, Math.min(maxCannonHeight, initialHeight + heightChange));
      if (updateParams) {
        updateParams({ cannonHeight: parseFloat(newHeight.toFixed(2)) });
      }
    } else if (isDraggingAngle) {
      // Handle angle dragging - calculate change from initial position
      const deltaY = dragStartY - mouseY;
      const angleChange = deltaY * 0.3; // Scale factor for angle sensitivity
      const newAngle = Math.max(-90, Math.min(90, initialAngle + angleChange)); // Updated range to -90 to 90
      if (updateParams) {
        updateParams({ angle: parseFloat(newAngle.toFixed(1)) });
      }
    } else {
      // Update hover states based on mouse position
      if (isMouseInHeightZone(mouseX)) {
        setIsHoveringHeight(true);
        setIsHoveringAngle(false);
      } else if (isMouseInAngleZone(mouseX)) {
        setIsHoveringHeight(false);
        setIsHoveringAngle(true);
      } else {
        setIsHoveringHeight(false);
        setIsHoveringAngle(false);
      }
    }
  }, [isDraggingHeight, isDraggingAngle, isMouseInHeightZone, isMouseInAngleZone, updateParams, dragStartY, initialHeight, initialAngle, scale, maxCannonHeight]);

  // Handle mouse down for starting drag
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    setDragStartY(mouseY);

    if (isMouseInHeightZone(mouseX)) {
      setIsDraggingHeight(true);
      setInitialHeight(params.cannonHeight);
    } else if (isMouseInAngleZone(mouseX)) {
      setIsDraggingAngle(true);
      setInitialAngle(params.angle);
    }
  }, [isMouseInHeightZone, isMouseInAngleZone, params.cannonHeight, params.angle]);

  // Handle mouse up for ending drag
  const handleMouseUp = useCallback(() => {
    setIsDraggingHeight(false);
    setIsDraggingAngle(false);
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsDraggingHeight(false);
    setIsDraggingAngle(false);
    setIsHoveringHeight(false);
    setIsHoveringAngle(false);
  }, []);

  // Calculate trajectory points to show based on current projectile position
  const getVisibleTrajectoryLength = useCallback(() => {
    if (!simulation.currentProjectile || simulation.trajectory.length === 0) {
      return simulation.trajectory.length;
    }

    // Find the current projectile's position in the trajectory
    const currentTime = simulation.currentProjectile.time;
    let visibleLength = 0;

    for (let i = 0; i < simulation.trajectory.length; i++) {
      if (simulation.trajectory[i].time <= currentTime) {
        visibleLength = i + 1;
      } else {
        break;
      }
    }

    return visibleLength;
  }, [simulation.currentProjectile, simulation.trajectory]);

  // Draw the simulation
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw control zone indicators
    if (isHoveringHeight || isDraggingHeight || isHoveringAngle || isDraggingAngle) {
      // Left zone (height control)
      ctx.fillStyle = (isHoveringHeight || isDraggingHeight) ? 'rgba(161, 98, 7, 0.1)' : 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvasWidth / 2, canvasHeight);

      // Right zone (angle control)
      ctx.fillStyle = (isHoveringAngle || isDraggingAngle) ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight);

      // Draw dividing line
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(canvasWidth / 2, 0);
      ctx.lineTo(canvasWidth / 2, canvasHeight);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight - GROUND_HEIGHT);
    if (isDayTheme) {
      skyGradient.addColorStop(0, '#87CEEB');
      skyGradient.addColorStop(1, '#E0F6FF');
    } else {
      skyGradient.addColorStop(0, '#1a1a2e');
      skyGradient.addColorStop(1, '#16213e');
    }
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight - GROUND_HEIGHT);

    // Draw clouds (if day theme) or static stars (if night theme)
    if (isDayTheme) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      const cloudScale = canvasWidth / 800;

      ctx.beginPath();
      ctx.arc(200 * cloudScale, 100, 25 * cloudScale, 0, Math.PI * 2);
      ctx.arc(230 * cloudScale, 100, 35 * cloudScale, 0, Math.PI * 2);
      ctx.arc(260 * cloudScale, 100, 25 * cloudScale, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(500 * cloudScale, 80, 30 * cloudScale, 0, Math.PI * 2);
      ctx.arc(535 * cloudScale, 80, 40 * cloudScale, 0, Math.PI * 2);
      ctx.arc(570 * cloudScale, 80, 30 * cloudScale, 0, Math.PI * 2);
      ctx.fill();   
        
    } else {
      // Draw static stars
      ctx.fillStyle = '#ffffff';
      nightStars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw background hill image if loaded - covering full ground with transparency
    const bgHillImg = imageCache.get('/bg_hill.png');
    if (bgHillImg && bgHillImg.complete && bgHillImg.naturalWidth > 0) {
      // Position the hill image to cover the full ground area, indicating distance
      ctx.globalAlpha = 0.8; // Semi-transparent for distant appearance
      const hillWidth = canvasWidth;
      const hillHeight = (canvasHeight - GROUND_HEIGHT) * 0.5;
      const hillX = 0;
      const hillY = canvasHeight - GROUND_HEIGHT - hillHeight + 20;

      ctx.drawImage(bgHillImg, hillX, hillY, hillWidth, hillHeight);
      ctx.globalAlpha = 1.0; // Reset alpha
    } else {
      // Fallback: Draw mountains/hills with shapes across full width
      ctx.fillStyle = isDayTheme ? 'rgba(139, 90, 43, 0.8)' : 'rgba(74, 74, 74, 0.8)';
      ctx.beginPath();
      const mountainScale = canvasWidth / 800;
      ctx.moveTo(0, canvasHeight - GROUND_HEIGHT);
      ctx.lineTo(200 * mountainScale, canvasHeight - GROUND_HEIGHT - 40);
      ctx.lineTo(300 * mountainScale, canvasHeight - GROUND_HEIGHT - 80);
      ctx.lineTo(450 * mountainScale, canvasHeight - GROUND_HEIGHT - 60);
      ctx.lineTo(600 * mountainScale, canvasHeight - GROUND_HEIGHT - 90);
      ctx.lineTo(750 * mountainScale, canvasHeight - GROUND_HEIGHT - 50);
      ctx.lineTo(canvasWidth, canvasHeight - GROUND_HEIGHT - 70);
      ctx.lineTo(canvasWidth, canvasHeight - GROUND_HEIGHT);
      ctx.closePath();
      ctx.fill();
    }

    // Draw ground
    const groundGradient = ctx.createLinearGradient(0, canvasHeight - GROUND_HEIGHT, 0, canvasHeight);
    groundGradient.addColorStop(0, '#4ade80');
    groundGradient.addColorStop(1, '#16a34a');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, canvasHeight - GROUND_HEIGHT, canvasWidth, GROUND_HEIGHT);

    // Draw adjustable cannon platform base (reacts to height changes)
    // ctx.fillStyle = '#8b5a2b';
    // const platformWidth = 80;
    // const platformHeight = CANNON_BASE_HEIGHT;
    // const platformX = 60;
    // const platformY = canvasHeight - GROUND_HEIGHT - platformHeight;
    // ctx.fillRect(platformX, platformY, platformWidth, platformHeight);

    // Calculate cannon position based on height
    const cannonY = canvasHeight - GROUND_HEIGHT - CANNON_BASE_HEIGHT + 10;

    // Draw cannon barrel image (barrel.png) - fixed size, no highlighting during interactions
    const barrelImg = imageCache.get('/barrel.png');
    if (barrelImg && barrelImg.complete && barrelImg.naturalWidth > 0) {
      ctx.save();
      ctx.translate(100, cannonY);
      ctx.rotate(-params.angle * Math.PI / 180);

      // Draw the barrel image without any interaction highlighting
      const barrelWidth = 60;
      const barrelHeight = 24;
      ctx.drawImage(barrelImg, 0, -barrelHeight / 2, barrelWidth, barrelHeight);

      ctx.restore();
    } else {
      // Fallback: Draw cannon with interaction highlight only for fallback
      ctx.save();
      ctx.translate(100, cannonY);
      ctx.rotate(-params.angle * Math.PI / 180);

      // Cannon barrel with interaction highlight only for fallback
      if (isHoveringAngle || isDraggingAngle) {
        ctx.fillStyle = isDraggingAngle ? '#2563eb' : '#3b82f6';
      } else {
        ctx.fillStyle = '#4a5568';
      }
      ctx.fillRect(0, -6, 50, 12);

      ctx.restore();
    }



    // Draw cannon base image (base.png) - fixed size, attached to the cannon position
    const baseImg = imageCache.get('/base.png');
    if (baseImg && baseImg.complete && baseImg.naturalWidth > 0) {
      // Position the base image at a fixed size, attached to the cannon position
      const baseWidth = 40;
      const baseHeight = 30;
      const baseX = 85;
      const baseY = cannonY - 5;

      ctx.drawImage(baseImg, baseX, baseY, baseWidth, baseHeight);
    } else {
      // Fallback: Draw a fixed cannon mount
      ctx.fillStyle = '#6b5b73';
      ctx.fillRect(85, cannonY - 5, 40, 30);
    }


    // Draw animated trajectory (only show up to current projectile position)
    const visibleTrajectoryLength = getVisibleTrajectoryLength();
    if (visibleTrajectoryLength > 1) {
      ctx.strokeStyle = params.airResistance ? '#ef4444' : '#3b82f6';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.beginPath();

      const firstPoint = physicsToCanvas(simulation.trajectory[0].x, simulation.trajectory[0].y);
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < visibleTrajectoryLength; i++) {
        const point = physicsToCanvas(simulation.trajectory[i].x, simulation.trajectory[i].y);
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();

      // Draw trajectory points (only visible ones)
      ctx.fillStyle = params.airResistance ? '#ef4444' : '#3b82f6';
      for (let i = 0; i < visibleTrajectoryLength; i += Math.max(1, Math.floor(visibleTrajectoryLength / 50))) {
        const point = physicsToCanvas(simulation.trajectory[i].x, simulation.trajectory[i].y);
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw current projectile
    if (simulation.currentProjectile) {
      const pos = physicsToCanvas(simulation.currentProjectile.x, simulation.currentProjectile.y);

      // Projectile shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(pos.x, canvasHeight - GROUND_HEIGHT + 5, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Projectile
      const gradient = ctx.createRadialGradient(pos.x - 3, pos.y - 3, 0, pos.x, pos.y, 8);
      gradient.addColorStop(0, '#fbbf24');
      gradient.addColorStop(1, '#f59e0b');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Projectile glow
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Velocity vector
      if (simulation.currentProjectile.vx !== 0 || simulation.currentProjectile.vy !== 0) {
        const vectorScale = scale / 10; // Scale velocity vector appropriately
        const endX = pos.x + simulation.currentProjectile.vx * vectorScale;
        const endY = pos.y - simulation.currentProjectile.vy * vectorScale;

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrowhead
        const headlen = 8;
        const angle = Math.atan2(endY - pos.y, endX - pos.x);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = '#10b981';
        ctx.fill();
      }
    }

    // Draw on-canvas indicators for height and angle when dragging only
    if (isDraggingHeight || isDraggingAngle) {
      const cannonX = 100;
      const cannonY = canvasHeight - GROUND_HEIGHT - CANNON_BASE_HEIGHT + 10;
      
      // Height indicator
      if (isDraggingHeight) {
        // Draw height line
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(cannonX - 30, canvasHeight - GROUND_HEIGHT);
        ctx.lineTo(cannonX - 30, cannonY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Height value label
        ctx.fillStyle = isDayTheme ? '#000000' : '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        const heightText = `${params.cannonHeight.toFixed(1)}m`;
        const heightY = cannonY + (canvasHeight - GROUND_HEIGHT - cannonY) / 2;
        
        // Background for text
        const textMetrics = ctx.measureText(heightText);
        ctx.fillStyle = isDayTheme ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(cannonX - 50 - textMetrics.width/2, heightY - 10, textMetrics.width + 10, 20);
        
        // Text
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(heightText, cannonX - 45, heightY + 4);
      }

      // Angle indicator
      if (isDraggingAngle) {
        // Draw angle arc
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(cannonX, cannonY, 40, 0, -params.angle * Math.PI / 180, params.angle < 0);
        ctx.stroke();
        ctx.setLineDash([]);

        // Angle value label
        ctx.fillStyle = isDayTheme ? '#000000' : '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        const angleText = `${params.angle.toFixed(1)}°`;
        const labelX = cannonX + 60;
        const labelY = cannonY - 20;
        
        // Background for text
        const textMetrics = ctx.measureText(angleText);
        ctx.fillStyle = isDayTheme ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(labelX - textMetrics.width/2 - 5, labelY - 10, textMetrics.width + 10, 20);
        
        // Text
        ctx.fillStyle = '#3b82f6';
        ctx.fillText(angleText, labelX, labelY + 4);
      }
    }

    // Draw target
    const targetX = canvasWidth * 0.9;
    const targetY = canvasHeight - GROUND_HEIGHT - 20;

    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(targetX, targetY, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw interaction indicators with improved visual feedback
    // Height and angle indicators removed per user request

  }, [simulation, params, isDayTheme, physicsToCanvas, CANNON_BASE_HEIGHT, isDraggingHeight, isDraggingAngle, isHoveringHeight, isHoveringAngle, getVisibleTrajectoryLength, canvasWidth, canvasHeight, scale, nightStars, maxCannonHeight, renderTrigger]);

  // Effect for drawing
  useEffect(() => {
    draw();
  }, [draw, renderTrigger]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="rounded-lg border-2 border-gray-300 shadow-xl bg-gradient-to-b from-blue-400 to-blue-500 max-w-full h-auto"
        style={{
          maxWidth: '100%',
          height: 'auto',
          aspectRatio: `${canvasWidth} / ${canvasHeight}`,
          cursor: isDraggingHeight ? 'ns-resize' : isDraggingAngle ? 'ns-resize' :
            (isHoveringHeight || isHoveringAngle) ? 'ns-resize' : 'default'
        }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />

      {/* Canvas size indicator */}
      <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-mono ${isDayTheme ? 'bg-black/20 text-white' : 'bg-white/20 text-white'
        }`}>
        {params.canvasWidthMeters} × {params.canvasHeightMeters}m
      </div>

      {/* Current interaction feedback with improved design */}
      {(isDraggingHeight || isDraggingAngle) && (
        <div className={`absolute top-2 left-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg ${isDayTheme ? 'bg-white/95 text-gray-800 border border-gray-200' : 'bg-gray-800/95 text-white border border-gray-600'
          }`}>
          {isDraggingHeight && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-500">📏</span>
                <span>Adjusting Cannon Height</span>
              </div>
              <div className="text-xs opacity-80">
                Current: {params.cannonHeight.toFixed(1)}m / Max: {maxCannonHeight.toFixed(1)}m
              </div>
              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-100"
                  style={{ width: `${(params.cannonHeight / maxCannonHeight) * 100}%` }}
                />
              </div>
            </div>
          )}
          {isDraggingAngle && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-500">📐</span>
                <span>Adjusting Launch Angle</span>
              </div>
              <div className="text-xs opacity-80">
                Current: {params.angle.toFixed(1)}° (Range: -90° to 90°)
              </div>
              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-100"
                  style={{ width: `${((params.angle + 90) / 180) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}