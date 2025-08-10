import React, { useEffect, useRef } from 'react';
import { SimulationState } from '../../types/simulation';

interface GraphDisplayProps {
  simulation: SimulationState;
  isDayTheme: boolean;
}

export function GraphDisplay({ simulation, isDayTheme }: GraphDisplayProps) {
  const velocityCanvasRef = useRef<HTMLCanvasElement>(null);
  const accelerationCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Store historical data for smooth graphing
  const velocityHistoryRef = useRef<Array<{ time: number; velocity: number }>>([]);
  const accelerationHistoryRef = useRef<Array<{ time: number; acceleration: number }>>([]);

  useEffect(() => {
    // Clear graphs when explicitly reset or when simulation stops running
    if (simulation.isReset || (!simulation.isRunning && !simulation.currentProjectile)) {
      // Reset history when simulation is explicitly reset
      velocityHistoryRef.current = [];
      accelerationHistoryRef.current = [];
      // Clear the canvas displays
      clearGraphs();
      return;
    }

    // Continue drawing graphs even when simulation stops (projectile hits ground)
    if (simulation.currentProjectile) {
      const currentTime = simulation.currentProjectile.time;
      const currentVelocity = Math.sqrt(
        simulation.currentProjectile.vx ** 2 + simulation.currentProjectile.vy ** 2
      );

      // Calculate acceleration (change in velocity over time)
      let currentAcceleration = 0;
      if (velocityHistoryRef.current.length > 0) {
        const lastEntry = velocityHistoryRef.current[velocityHistoryRef.current.length - 1];
        const deltaV = currentVelocity - lastEntry.velocity;
        const deltaT = currentTime - lastEntry.time;
        if (deltaT > 0) {
          currentAcceleration = deltaV / deltaT;
        }
      }

      // Add current data to history
      velocityHistoryRef.current.push({ time: currentTime, velocity: currentVelocity });
      accelerationHistoryRef.current.push({ time: currentTime, acceleration: currentAcceleration });

      // Keep only last 100 data points for performance
      if (velocityHistoryRef.current.length > 100) {
        velocityHistoryRef.current.shift();
      }
      if (accelerationHistoryRef.current.length > 100) {
        accelerationHistoryRef.current.shift();
      }

      // Draw graphs
      drawVelocityGraph();
      drawAccelerationGraph();
    }
  }, [simulation.currentProjectile, simulation.isReset, simulation.isRunning, isDayTheme]);

  // Effect to ensure graphs are cleared on initial mount and when no data
  useEffect(() => {
    if (velocityHistoryRef.current.length === 0 && accelerationHistoryRef.current.length === 0) {
      clearGraphs();
    }
  }, [isDayTheme]);

  const clearGraphs = () => {
    // Clear velocity graph
    const velocityCanvas = velocityCanvasRef.current;
    if (velocityCanvas) {
      const ctx = velocityCanvas.getContext('2d');
      if (ctx) {
        const { width, height } = velocityCanvas;
        // Clear entire canvas first
        ctx.clearRect(0, 0, width, height);
        const bgColor = isDayTheme ? '#f9fafb' : '#1f2937';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        // Draw empty grid for velocity
        drawEmptyGrid(ctx, width, height, isDayTheme);
      }
    }

    // Clear acceleration graph
    const accelerationCanvas = accelerationCanvasRef.current;
    if (accelerationCanvas) {
      const ctx = accelerationCanvas.getContext('2d');
      if (ctx) {
        const { width, height } = accelerationCanvas;
        // Clear entire canvas first
        ctx.clearRect(0, 0, width, height);
        const bgColor = isDayTheme ? '#f0fdf4' : '#1f2937';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        // Draw empty grid for acceleration
        drawEmptyGrid(ctx, width, height, isDayTheme);
      }
    }
  };

  const drawEmptyGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, isDayTheme: boolean) => {
    const gridColor = isDayTheme ? '#e5e7eb' : '#374151';
    const textColor = isDayTheme ? '#374151' : '#d1d5db';
    
    const padding = 30;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Draw grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * graphHeight) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 4; i++) {
      const x = padding + (i * graphWidth) / 4;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    // Draw axis labels for empty graph
    ctx.fillStyle = textColor;
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('0.0', padding - 5, height - padding + 15);
    ctx.fillText('0.0', padding + graphWidth + 5, height - padding + 15);
  };

  const drawVelocityGraph = () => {
    const canvas = velocityCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Set colors based on theme
    const lineColor = isDayTheme ? '#3b82f6' : '#60a5fa';
    const gridColor = isDayTheme ? '#e5e7eb' : '#374151';
    const textColor = isDayTheme ? '#374151' : '#d1d5db';
    const bgColor = isDayTheme ? '#f9fafb' : '#1f2937';

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const data = velocityHistoryRef.current;
    if (data.length < 2) return;

    // Find min/max values for scaling
    const maxTime = Math.max(...data.map(d => d.time));
    const minTime = Math.min(...data.map(d => d.time));
    const maxVel = Math.max(...data.map(d => d.velocity));
    const minVel = Math.min(...data.map(d => d.velocity));

    const padding = 30;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Draw grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * graphHeight) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 4; i++) {
      const x = padding + (i * graphWidth) / 4;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    // Draw velocity line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding + ((point.time - minTime) / (maxTime - minTime || 1)) * graphWidth;
      const y = height - padding - ((point.velocity - minVel) / (maxVel - minVel || 1)) * graphHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw labels
    ctx.fillStyle = textColor;
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * graphHeight) / 4;
      const value = maxVel - (i * (maxVel - minVel)) / 4;
      ctx.fillText(value.toFixed(1), padding - 5, y + 3);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
      const x = padding + (i * graphWidth) / 4;
      const value = minTime + (i * (maxTime - minTime)) / 4;
      ctx.fillText(value.toFixed(1), x, height - 5);
    }
  };

  const drawAccelerationGraph = () => {
    const canvas = accelerationCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Set colors based on theme
    const lineColor = isDayTheme ? '#ef4444' : '#f87171';
    const gridColor = isDayTheme ? '#e5e7eb' : '#374151';
    const textColor = isDayTheme ? '#374151' : '#d1d5db';
    const bgColor = isDayTheme ? '#f9fafb' : '#1f2937';

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const data = accelerationHistoryRef.current;
    if (data.length < 2) return;

    // Find min/max values for scaling
    const maxTime = Math.max(...data.map(d => d.time));
    const minTime = Math.min(...data.map(d => d.time));
    const maxAcc = Math.max(...data.map(d => d.acceleration));
    const minAcc = Math.min(...data.map(d => d.acceleration));

    const padding = 30;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Draw grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * graphHeight) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 4; i++) {
      const x = padding + (i * graphWidth) / 4;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    // Draw acceleration line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding + ((point.time - minTime) / (maxTime - minTime || 1)) * graphWidth;
      const y = height - padding - ((point.acceleration - minAcc) / (maxAcc - minAcc || 1)) * graphHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw labels
    ctx.fillStyle = textColor;
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * graphHeight) / 4;
      const value = maxAcc - (i * (maxAcc - minAcc)) / 4;
      ctx.fillText(value.toFixed(1), padding - 5, y + 3);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
      const x = padding + (i * graphWidth) / 4;
      const value = minTime + (i * (maxTime - minTime)) / 4;
      ctx.fillText(value.toFixed(1), x, height - 5);
    }
  };

  const cardClass = `${isDayTheme ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} rounded-xl shadow-lg border`;

  return (
    <div className="space-y-4">
      {/* Velocity vs Time Graph */}
      <div className={cardClass}>
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <h4 className={`text-sm font-semibold ${isDayTheme ? 'text-gray-900' : 'text-white'}`}>
            Velocity vs Time
          </h4>
        </div>
        <div className="p-3">
          <canvas
            ref={velocityCanvasRef}
            width={200}
            height={120}
            className="w-full h-auto border rounded"
            style={{ maxHeight: '120px' }}
          />
          <div className={`text-xs mt-1 text-center ${isDayTheme ? 'text-gray-600' : 'text-gray-400'}`}>
            Time (s) vs Velocity (m/s)
          </div>
        </div>
      </div>

      {/* Acceleration vs Time Graph */}
      <div className={cardClass}>
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <h4 className={`text-sm font-semibold ${isDayTheme ? 'text-gray-900' : 'text-white'}`}>
            Acceleration vs Time
          </h4>
        </div>
        <div className="p-3">
          <canvas
            ref={accelerationCanvasRef}
            width={200}
            height={120}
            className="w-full h-auto border rounded"
            style={{ maxHeight: '120px' }}
          />
          <div className={`text-xs mt-1 text-center ${isDayTheme ? 'text-gray-600' : 'text-gray-400'}`}>
            Time (s) vs Acceleration (m/s²)
          </div>
        </div>
      </div>
    </div>
  );
}
