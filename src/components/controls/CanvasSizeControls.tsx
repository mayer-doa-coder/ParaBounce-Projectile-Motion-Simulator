import React from 'react';
import { SimulationParams } from '../../types/simulation';

interface CanvasSizeControlsProps {
  params: SimulationParams;
  updateParams: (params: Partial<SimulationParams>) => void;
  isDayTheme: boolean;
}

const CANVAS_PRESETS = [
  { 
    name: 'Small Field', 
    width: 50, 
    height: 30, 
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M2 12h20"/>
      </svg>
    ), 
    ratio: '5:3' 
  },
  { 
    name: 'Standard', 
    width: 100, 
    height: 60, 
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
        <path d="M13 13l6 6"/>
      </svg>
    ), 
    ratio: '5:3' 
  },
  { 
    name: 'Large Field', 
    width: 150, 
    height: 90, 
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 12h18l-2-2v4l2-2zM3 12l2-2v4l-2-2z"/>
        <path d="M12 3v18l-2-2h4l-2 2zM12 3l-2 2h4l-2-2z"/>
      </svg>
    ), 
    ratio: '5:3' 
  },
  { 
    name: 'Wide Range', 
    width: 200, 
    height: 100, 
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="8" width="20" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ), 
    ratio: '2:1' 
  },
  { 
    name: 'Square', 
    width: 80, 
    height: 80, 
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ), 
    ratio: '1:1' 
  },
  { 
    name: 'Tall View', 
    width: 60, 
    height: 100, 
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <rect x="8" y="2" width="8" height="20" rx="1" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ), 
    ratio: '3:5' 
  }
];

export function CanvasSizeControls({ params, updateParams, isDayTheme }: CanvasSizeControlsProps) {
  const handlePresetSelect = (preset: typeof CANVAS_PRESETS[0]) => {
    updateParams({
      canvasWidthMeters: preset.width,
      canvasHeightMeters: preset.height
    });
  };

  const handleCustomSize = (dimension: 'width' | 'height', value: number) => {
    updateParams({
      [dimension === 'width' ? 'canvasWidthMeters' : 'canvasHeightMeters']: value
    });
  };

  const rotateCanvas = () => {
    updateParams({
      canvasWidthMeters: params.canvasHeightMeters,
      canvasHeightMeters: params.canvasWidthMeters
    });
  };

  const currentAspectRatio = (params.canvasWidthMeters / params.canvasHeightMeters).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Current Size Display */}
      <div className={`p-4 rounded-lg ${isDayTheme ? 'bg-gray-50' : 'bg-gray-700'
        }`}>
        <div className="text-center">
          <div className={`text-2xl font-mono ${isDayTheme ? 'text-gray-900' : 'text-white'
            }`}>
            {params.canvasWidthMeters} × {params.canvasHeightMeters}m
          </div>
          <div className={`text-sm ${isDayTheme ? 'text-gray-600' : 'text-gray-400'
            }`}>
            Aspect Ratio: {currentAspectRatio}:1
          </div>
          <div className={`text-xs mt-1 ${isDayTheme ? 'text-gray-500' : 'text-gray-500'
            }`}>
            
          </div>
        </div>
      </div>

      {/* Preset Sizes */}
      <div>
        <h4 className={`text-sm font-medium mb-3 ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
          }`}>
          Field Size Presets
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {CANVAS_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetSelect(preset)}
              className={`p-3 rounded-lg text-left transition-all duration-200 ${params.canvasWidthMeters === preset.width && params.canvasHeightMeters === preset.height
                  ? (isDayTheme
                    ? 'bg-blue-100 border-blue-200 text-blue-900'
                    : 'bg-blue-900 border-blue-700 text-blue-100')
                  : (isDayTheme
                    ? 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                    : 'bg-gray-700 hover:bg-gray-600 border-gray-600')
                } border`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{preset.icon}</span>
                <div>
                  <div className="font-medium text-sm">{preset.name}</div>
                  <div className={`text-xs ${isDayTheme ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                    {preset.width} × {preset.height}m ({preset.ratio})
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Size Controls */}
      <div>
        <h4 className={`text-sm font-medium mb-3 ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
          }`}>
          Custom Field Size
        </h4>

        <div className="space-y-4">
          {/* Width Control */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`text-sm font-medium ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
                }`}>
                Width (Range)
              </label>
              <span className={`text-sm font-mono px-2 py-1 rounded ${isDayTheme ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'
                }`}>
                {params.canvasWidthMeters}m
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={300}
              step={5}
              value={params.canvasWidthMeters}
              onChange={(e) => handleCustomSize('width', Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-blue-400 to-blue-600 accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>30m</span>
              <span>300m</span>
            </div>
          </div>

          {/* Height Control */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`text-sm font-medium ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
                }`}>
                Height (Max altitude)
              </label>
              <span className={`text-sm font-mono px-2 py-1 rounded ${isDayTheme ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200'
                }`}>
                {params.canvasHeightMeters}m
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={150}
              step={5}
              value={params.canvasHeightMeters}
              onChange={(e) => handleCustomSize('height', Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-green-400 to-green-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>20m</span>
              <span>150m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h4 className={`text-sm font-medium mb-3 ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
          }`}>
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 gap-2">
                    <button
            onClick={rotateCanvas}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              isDayTheme 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            Rotate
          </button>
          <button
            onClick={() => {
              const aspectRatio = params.canvasWidthMeters / params.canvasHeightMeters;
              if (aspectRatio > 1) {
                // Wide format - set standard 5:3 ratio
                const newHeight = Math.round(params.canvasWidthMeters / 1.67);
                updateParams({ canvasHeightMeters: newHeight });
              } else {
                // Tall format - set 3:5 ratio
                const newWidth = Math.round(params.canvasHeightMeters / 1.67);
                updateParams({ canvasWidthMeters: newWidth });
              }
            }}
            className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${isDayTheme
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
          >
            📐 Fix Ratio
          </button>
        </div>
      </div>
    </div>
  );
}