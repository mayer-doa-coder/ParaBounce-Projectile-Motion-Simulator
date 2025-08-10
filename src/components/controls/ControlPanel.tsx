import React, { useState } from 'react';
import { ControlPanelProps, Preset } from '../../types/simulation';
import { ParameterSlider } from './ParameterSlider';
import { PresetSelector } from './PresetSelector';
import { CanvasSizeControls } from './CanvasSizeControls';

const PRESETS: Preset[] = [
  {
    name: "Cannon Ball",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8"/>
      </svg>
    ),
    params: {
      velocity: 28,
      angle: 45,
      mass: 50,
      airResistance: true,
      airResistanceCoeff: 0.02,
      cannonHeight: 2.0
    },
    description: "Heavy projectile with moderate air resistance from elevated position"
  },
  // {
  //   name: "Basketball",
  //   icon: (
  //     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
  //       <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/>
  //       <path d="M12 3v18M3 12h18M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1"/>
  //     </svg>
  //   ),
  //   params: {
  //     velocity: 25,
  //     angle: 55,
  //     mass: 1,
  //     airResistance: true,
  //     airResistanceCoeff: 0.04,
  //     cannonHeight: 2.5
  //   },
  //   description: "Sports projectile with high air resistance from above head"
  // },
  {
    name: "Handball",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 8c0-4.42-2.5-8-6-8s-6 3.58-6 8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2zM8 18c0 2 2 4 4 4s4-2 4-4"/>
      </svg>
    ),
    params: {
      velocity: 42,
      angle: 90,
      mass: 0.1,
      airResistance: false,
      airResistanceCoeff: 0.08,
      cannonHeight: 0.0
    },
    description: "Very light object heavily affected by air resistance"
  },
  {
    name: "Perfect Vacuum",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <polygon points="12,2 22,20 2,20"/>
        <circle cx="12" cy="14" r="2"/>
      </svg>
    ),
    params: {
      velocity: 35,
      angle: 45,
      mass: 25,
      airResistance: false,
      airResistanceCoeff: 0.01,
      cannonHeight: 1.5
    },
    description: "Ideal physics without air resistance - perfect parabolic motion"
  },
  {
    name: "Bullet",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <ellipse cx="12" cy="12" rx="8" ry="3"/>
      </svg>
    ),
    params: {
      velocity: 47,
      angle: 26,
      mass: 0.01,
      airResistance: false,
      airResistanceCoeff: 0.005,
      cannonHeight: 0.0
    },
    description: "High-speed, lightweight projectile with minimal air resistance"
  },
  {
    name: "Long Range",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="2"/>
        <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    params: {
      velocity: 60,
      angle: 30,
      mass: 20,
      airResistance: true,
      airResistanceCoeff: 0.015,
      cannonHeight: 3.0
    },
    description: "Optimized for maximum range with realistic air resistance"
  }
];

export function ControlPanel({
  params,
  updateParams,
  simulation,
  startSimulation,
  resetSimulation,
  togglePause,
  isDayTheme
}: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<'params' | 'presets' | 'canvas'>('params');

  const applyPreset = (preset: Preset) => {
    updateParams(preset.params);
    resetSimulation();
  };

  const cardClass = `${isDayTheme 
    ? 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200' 
    : 'bg-gradient-to-br from-gray-800 to-gray-900 border-emerald-500/30'
    } rounded-xl shadow-lg border-2`;

  const tabButtonClass = (isActive: boolean) => `
    px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
    ${isActive
      ? (isDayTheme 
        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' 
        : 'bg-gradient-to-r from-squid-green to-emerald-800 text-white shadow-lg')
      : (isDayTheme 
        ? 'text-pink-700 hover:bg-pink-100' 
        : 'text-emerald-300 hover:bg-emerald-900/30')
    }
  `;

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Tab Navigation */}
      <div className={`${cardClass}`}>
        <div className="p-4 w-full">
          <div className={`flex justify-center space-x-4 p-1 rounded-lg ${isDayTheme 
            ? 'bg-gradient-to-r from-pink-100 to-rose-100' 
            : 'bg-gradient-to-r from-gray-800 to-gray-900 border border-emerald-500/20'}`}>
            <button
              onClick={() => setActiveTab('params')}
              className={tabButtonClass(activeTab === 'params')}
            >
              Parameters
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={tabButtonClass(activeTab === 'presets')}
            >
              Presets
            </button>
            <button
              onClick={() => setActiveTab('canvas')}
              className={tabButtonClass(activeTab === 'canvas')}
            >
              Canvas
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'params' && (
          <div className={`${cardClass} h-full`}>
            <div className={`p-4 border-b ${isDayTheme ? 'border-pink-200' : 'border-emerald-500/30'}`}>
              <h3 className={`text-lg font-semibold ${isDayTheme 
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent'
                }`}>
                Physics Parameters
              </h3>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto">
              <ParameterSlider
                label="Initial Velocity"
                value={params.velocity}
                min={2}
                max={50}
                step={1}
                unit="m/s"
                color="blue"
                isDayTheme={isDayTheme}
                onChange={(value) => updateParams({ velocity: value })}
                description="The initial speed of the projectile"
              />

              <ParameterSlider
                label="Launch Angle"
                value={params.angle}
                min={-90}
                max={90}
                step={1}
                unit="°"
                color="red"
                isDayTheme={isDayTheme}
                onChange={(value) => updateParams({ angle: value })}
                description="The angle at which the projectile is launched (-90° to 90°)"
              />

              <ParameterSlider
                label="Projectile Mass"
                value={params.mass}
                min={0.1}
                max={10}
                step={0.1}
                unit="kg"
                color="purple"
                isDayTheme={isDayTheme}
                onChange={(value) => updateParams({ mass: value })}
                description="The mass of the projectile (affects air resistance)"
              />

              <ParameterSlider
                label="Gravity"
                value={params.gravity}
                min={1}
                max={20}
                step={0.1}
                unit="m/s²"
                color="red"
                isDayTheme={isDayTheme}
                onChange={(value) => updateParams({ gravity: value })}
                description="Gravitational acceleration"
              />

              <ParameterSlider
                label="Cannon Height"
                value={params.cannonHeight}
                min={0}
                max={params.canvasHeightMeters * 0.8}
                step={0.1}
                unit="m"
                color="orange"
                isDayTheme={isDayTheme}
                onChange={(value) => updateParams({ cannonHeight: value })}
                description={`Height of the cannon above ground level (Max: ${(params.canvasHeightMeters * 0.8).toFixed(1)}m)`}
              />

              {/* Air Resistance Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                    Air Resistance
                  </label>
                  <button
                    onClick={() => updateParams({ airResistance: !params.airResistance })}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${params.airResistance ? 'bg-red-500' : 'bg-gray-400'
                      }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${params.airResistance ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                  </button>
                </div>

                {params.airResistance && (
                  <ParameterSlider
                    label="Air Resistance Coefficient"
                    value={params.airResistanceCoeff}
                    min={0.001}
                    max={0.1}
                    step={0.001}
                    unit=""
                    color="red"
                    isDayTheme={isDayTheme}
                    onChange={(value) => updateParams({ airResistanceCoeff: value })}
                    description="How much air resistance affects the projectile (higher = more drag)"
                  />
                )}

                <p className={`text-xs ${isDayTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                  {params.airResistance
                    ? `Air resistance coefficient: ${params.airResistanceCoeff.toFixed(3)} - ${params.airResistanceCoeff < 0.01 ? 'Low drag (like a bullet)' :
                      params.airResistanceCoeff < 0.03 ? 'Medium drag (like a ball)' :
                        'High drag (like a feather)'
                    }`
                    : 'Perfect vacuum conditions (no air resistance)'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'presets' && (
          <div className={`${cardClass} h-full`}>
            <div className={`p-4 border-b ${isDayTheme ? 'border-pink-200' : 'border-emerald-500/30'}`}>
              <h3 className={`text-lg font-semibold ${isDayTheme 
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent'
                }`}>
                Quick Presets
              </h3>
            </div>

            <div className="p-4 overflow-y-auto">
              <PresetSelector
                presets={PRESETS}
                onApplyPreset={applyPreset}
                isDayTheme={isDayTheme}
              />
            </div>
          </div>
        )}

        {activeTab === 'canvas' && (
          <div className={`${cardClass} h-full`}>
            <div className={`p-4 border-b ${isDayTheme ? 'border-pink-200' : 'border-emerald-500/30'}`}>
              <h3 className={`text-lg font-semibold ${isDayTheme 
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent'
                }`}>
                Canvas Settings
              </h3>
            </div>

            <div className="p-4 overflow-y-auto">
              <CanvasSizeControls
                params={params}
                updateParams={updateParams}
                isDayTheme={isDayTheme}
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}