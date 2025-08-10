import React from 'react';
import { DataPanelProps } from '../../types/simulation';
import { GraphDisplay } from './GraphDisplay';

export function DataPanel({ simulation, params, isDayTheme }: DataPanelProps) {
  const cardClass = `${isDayTheme 
    ? 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200' 
    : 'bg-gradient-to-br from-gray-800 to-gray-900 border-emerald-500/30'
    } rounded-xl shadow-lg border-2`;

  // Calculate real-time max height and range based on current progress
  const getRealTimeValues = () => {
    if (!simulation.currentProjectile || !simulation.trajectory.length) {
      return { realTimeMaxHeight: 0, realTimeRange: 0 };
    }

    const currentIndex = Math.floor(simulation.animationProgress * (simulation.trajectory.length - 1));
    const trajectoryUpToCurrent = simulation.trajectory.slice(0, currentIndex + 1);

    const realTimeMaxHeight = Math.max(...trajectoryUpToCurrent.map(p => p.y));
    const realTimeRange = simulation.currentProjectile.x;

    return { realTimeMaxHeight, realTimeRange };
  };

  const { realTimeMaxHeight, realTimeRange } = getRealTimeValues();

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Real-time Graphs */}
      <GraphDisplay simulation={simulation} isDayTheme={isDayTheme} />
      
      {/* Real-time Data */}
      <div className={cardClass}>
        <div className={`p-4 border-b ${isDayTheme ? 'border-pink-200' : 'border-emerald-500/30'}`}>
          <h3 className={`text-lg font-semibold ${isDayTheme 
            ? 'bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent' 
            : 'bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent'
            }`}>
            Live Data
          </h3>
        </div>

        <div className="p-4">
          {simulation.currentProjectile ? (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg border ${isDayTheme 
                ? 'bg-gradient-to-r from-pink-100 to-rose-100 border-pink-200' 
                : 'bg-gradient-to-r from-squid-green/20 to-emerald-900/20 border-emerald-500/30'
                }`}>
                <div className={`text-xs font-medium ${isDayTheme ? 'text-pink-700' : 'text-emerald-300'
                  } mb-1`}>
                  Position
                </div>
                <div className={`text-sm font-mono ${isDayTheme ? 'text-pink-900' : 'text-emerald-100'
                  }`}>
                  X: {simulation.currentProjectile.x.toFixed(1)}m<br />
                  Y: {simulation.currentProjectile.y.toFixed(1)}m
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${isDayTheme 
                ? 'bg-gradient-to-r from-rose-100 to-pink-100 border-rose-200' 
                : 'bg-gradient-to-r from-emerald-900/20 to-squid-green/20 border-emerald-500/30'
                }`}>
                <div className={`text-xs font-medium ${isDayTheme ? 'text-rose-700' : 'text-emerald-300'
                  } mb-1`}>
                  Velocity
                </div>
                <div className={`text-sm font-mono ${isDayTheme ? 'text-rose-900' : 'text-emerald-100'
                  }`}>
                  Vₓ: {simulation.currentProjectile.vx.toFixed(1)}m/s<br />
                  Vᵧ: {simulation.currentProjectile.vy.toFixed(1)}m/s
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${isDayTheme 
                ? 'bg-gradient-to-r from-pink-100 to-rose-100 border-pink-200' 
                : 'bg-gradient-to-r from-squid-green/20 to-emerald-900/20 border-emerald-500/30'
                }`}>
                <div className={`text-xs font-medium ${isDayTheme ? 'text-pink-700' : 'text-emerald-300'
                  } mb-1`}>
                  Speed & Time
                </div>
                <div className={`text-sm font-mono ${isDayTheme ? 'text-pink-900' : 'text-emerald-100'
                  }`}>
                  Speed: {Math.sqrt(simulation.currentProjectile.vx ** 2 + simulation.currentProjectile.vy ** 2).toFixed(1)} m/s<br />
                  Time: {simulation.currentProjectile.time.toFixed(2)}s
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${isDayTheme 
                ? 'bg-gradient-to-r from-rose-100 to-pink-100 border-rose-200' 
                : 'bg-gradient-to-r from-emerald-900/20 to-squid-green/20 border-emerald-500/30'
                }`}>
                <div className={`text-xs font-medium ${isDayTheme ? 'text-rose-700' : 'text-emerald-300'
                  } mb-1`}>
                  Real-time Max Height & Range
                </div>
                <div className={`text-sm font-mono ${isDayTheme ? 'text-rose-900' : 'text-emerald-100'
                  }`}>
                  Max Height: {realTimeMaxHeight.toFixed(1)}m<br />
                  Range: {realTimeRange.toFixed(1)}m
                </div>
              </div>
            </div>
          ) : (
            <div className={`text-center py-8 ${isDayTheme ? 'text-gray-500' : 'text-gray-400'}`}>
              <svg className="w-10 h-10 mb-2 mx-auto text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1"/>
              </svg>
              <div className="text-sm">Press start to begin simulation</div>
            </div>
          )}
        </div>
      </div>

      {/* Physics Info */}
      <div className={`${cardClass} flex-1`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`text-lg font-semibold ${isDayTheme ? 'text-gray-900' : 'text-white'
            }`}>
            Physics Info
          </h3>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Current Parameters */}
          <div>
            <h4 className={`text-sm font-medium mb-2 ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
              }`}>
              Current Parameters
            </h4>
            <div className="space-y-2 text-sm">
              <div className={`flex justify-between ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
                }`}>
                <span>Initial Velocity:</span>
                <span className="font-mono">{params.velocity} m/s</span>
              </div>
              <div className={`flex justify-between ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
                }`}>
                <span>Launch Angle:</span>
                <span className="font-mono">{params.angle}°</span>
              </div>
              <div className={`flex justify-between ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
                }`}>
                <span>Projectile Mass:</span>
                <span className="font-mono">{params.mass} kg</span>
              </div>
              <div className={`flex justify-between ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
                }`}>
                <span>Gravity:</span>
                <span className="font-mono">{params.gravity} m/s²</span>
              </div>
            </div>
          </div>

          {/* Calculated Results */}
          <div>
            <h4 className={`text-sm font-medium mb-2 ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
              }`}>
              Calculated Results
            </h4>
            <div className="space-y-2 text-sm">
              <div className={`flex justify-between ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
                }`}>
                <span>Maximum Height:</span>
                <span className="font-mono">{simulation.maxHeight.toFixed(2)} m</span>
              </div>
              <div className={`flex justify-between ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
                }`}>
                <span>Range:</span>
                <span className="font-mono">{simulation.range.toFixed(2)} m</span>
              </div>
              <div className={`flex justify-between ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
                }`}>
                <span>Time of Flight:</span>
                <span className="font-mono">{simulation.timeOfFlight.toFixed(2)} s</span>
              </div>
            </div>
          </div>

          {/* Physics Model */}
          <div className={`border-t pt-3 ${isDayTheme ? 'border-gray-200' : 'border-gray-700'
            }`}>
            <h4 className={`text-sm font-medium mb-2 ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
              }`}>
              Physics Model
            </h4>
            <div className={`text-xs ${isDayTheme ? 'text-gray-500' : 'text-gray-400'
              } space-y-1`}>
              <div className="font-medium">
                {params.airResistance ? ' With Air Resistance' : 'Ideal Conditions (Vacuum)'}
              </div>
              <div>
                {params.airResistance
                  ? 'Trajectory affected by drag force proportional to velocity² and inversely proportional to mass'
                  : 'Perfect parabolic trajectory following kinematic equations: x = v₀cos(θ)t, y = v₀sin(θ)t - ½gt²'
                }
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}