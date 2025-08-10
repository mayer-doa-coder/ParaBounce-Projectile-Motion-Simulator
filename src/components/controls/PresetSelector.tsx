import React, { useState } from 'react';
import { Preset } from '../../types/simulation';

interface PresetSelectorProps {
  presets: Preset[];
  onApplyPreset: (preset: Preset) => void;
  isDayTheme: boolean;
}

export function PresetSelector({ presets, onApplyPreset, isDayTheme }: PresetSelectorProps) {
  const [hoveredPreset, setHoveredPreset] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {presets.map((preset) => (
        <div
          key={preset.name}
          className={`relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
            isDayTheme 
              ? 'bg-gradient-to-br from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 hover:border-pink-300 border-pink-200 shadow-lg hover:shadow-pink-200/50' 
              : 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border-emerald-500/30 hover:border-emerald-500/50 shadow-lg hover:shadow-emerald-500/20'
          }`}
          onClick={() => onApplyPreset(preset)}
          onMouseEnter={() => setHoveredPreset(preset.name)}
          onMouseLeave={() => setHoveredPreset(null)}
        >
          <div className="flex items-start space-x-3">
            <div className="text-2xl flex-shrink-0">
              <span className={isDayTheme ? 'text-pink-600' : 'text-emerald-400'}>{preset.icon}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-sm ${
                isDayTheme ? 'text-pink-900' : 'text-emerald-100'
              }`}>
                {preset.name}
              </div>
              
              <div className={`text-xs mt-1 ${
                isDayTheme ? 'text-pink-700' : 'text-emerald-300'
              }`}>
                {preset.description}
              </div>
              
              {/* Parameter Preview */}
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(preset.params).map(([key, value]) => {
                  if (typeof value === 'boolean') {
                    return (
                      <span
                        key={key}
                        className={`px-2 py-1 text-xs rounded-full ${
                          value
                            ? (isDayTheme ? 'bg-pink-200 text-pink-800' : 'bg-emerald-900/50 text-emerald-200')
                            : (isDayTheme ? 'bg-rose-200 text-rose-800' : 'bg-red-900/50 text-red-300')
                        }`}
                      >
                        {key === 'airResistance' ? (value ? 'Air Resistance' : 'Vacuum') : `${key}: ${value}`}
                      </span>
                    );
                  }
                  
                  return (
                    <span
                      key={key}
                      className={`px-2 py-1 text-xs rounded-full font-mono ${
                        isDayTheme ? 'bg-pink-100 text-pink-800' : 'bg-emerald-900/30 text-emerald-200'
                      }`}
                    >
                      {key}: {value}{key === 'velocity' ? 'm/s' : key === 'angle' ? '°' : key === 'mass' ? 'kg' : ''}
                    </span>
                  );
                })}
              </div>
            </div>
            
            {/* Apply Button */}
            <div className={`flex-shrink-0 transition-opacity duration-200 ${
              hoveredPreset === preset.name ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                isDayTheme 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' 
                  : 'bg-gradient-to-r from-squid-green to-emerald-800 text-white shadow-lg'
              }`}>
                Apply
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Tooltip */}
      {hoveredPreset && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-3 py-2 bg-black text-white text-sm rounded-lg shadow-lg pointer-events-none">
          Click to apply {hoveredPreset} preset
        </div>
      )}
    </div>
  );
}