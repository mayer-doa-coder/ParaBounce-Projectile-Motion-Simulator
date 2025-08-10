'use client';

import React, { useState } from 'react';
import { SimulationCanvas } from './simulation/SimulationCanvas';
import { ControlPanel } from './controls/ControlPanel';
import { DataPanel } from './data/DataPanel';
import { Header } from './layout/Header';
import { useSimulation } from '../hooks/useSimulation';
import { SimulationParams } from '../types/simulation';

const DEFAULT_PARAMS: SimulationParams = {
  velocity: 25,
  angle: 45,
  mass: 5,
  airResistance: false,
  airResistanceCoeff: 0.01,
  gravity: 9.81,
  canvasWidthMeters: 100,
  canvasHeightMeters: 60,
  cannonHeight: 2
};

export default function ProjectileSimulator() {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [isDayTheme, setIsDayTheme] = useState(true);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  const {
    simulation,
    startSimulation,
    resetSimulation,
    togglePause
  } = useSimulation(params);

  const updateParams = (newParams: Partial<SimulationParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDayTheme ? 'bg-gradient-to-br from-blue-50 to-green-50' : 'bg-gradient-to-br from-gray-900 to-blue-900'
      }`}>
      <Header
        simulation={simulation}
        isDayTheme={isDayTheme}
        setIsDayTheme={setIsDayTheme}
        params={params}
        updateParams={updateParams}
        startSimulation={startSimulation}
        resetSimulation={resetSimulation}
        togglePause={togglePause}
      />

      <div className="flex h-[calc(100vh-80px)] relative">
        {/* Left Control Panel */}
        <div className={`transition-all duration-300 ease-in-out ${leftPanelCollapsed ? 'w-12' : 'w-96'
          } flex-shrink-0 relative`}>
          {!leftPanelCollapsed ? (
            <div className={`h-full overflow-y-auto ${isDayTheme ? 'bg-white/80 backdrop-blur-sm border-r border-gray-200' : 'bg-gray-900/80 backdrop-blur-sm border-r border-gray-700'
              }`}>
              <div className="p-4">
                <ControlPanel
                  params={params}
                  updateParams={updateParams}
                  simulation={simulation}
                  startSimulation={startSimulation}
                  resetSimulation={resetSimulation}
                  togglePause={togglePause}
                  isDayTheme={isDayTheme}
                />
              </div>
            </div>
          ) : (
            <div className={`h-full ${isDayTheme ? 'bg-white/80 backdrop-blur-sm border-r border-gray-200' : 'bg-gray-900/80 backdrop-blur-sm border-r border-gray-700'
              }`} />
          )}

          {/* Left Panel Toggle Button */}
          <button
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            className={`absolute top-1/2 -translate-y-1/2 ${leftPanelCollapsed ? '-right-3' : '-right-3'
              } w-6 h-12 ${isDayTheme ? 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50' : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700'
              } rounded-r-lg flex items-center justify-center shadow-lg transition-all duration-200 z-10`}
          >
            {leftPanelCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <SimulationCanvas
              simulation={simulation}
              params={params}
              isDayTheme={isDayTheme}
              updateParams={updateParams}
            />

          </div>
        </div>

        {/* Right Data Panel */}
        <div className={`transition-all duration-300 ease-in-out ${rightPanelCollapsed ? 'w-12' : 'w-80'
          } flex-shrink-0 relative`}>
          {!rightPanelCollapsed ? (
            <div className={`h-full overflow-y-auto ${isDayTheme ? 'bg-white/80 backdrop-blur-sm border-l border-gray-200' : 'bg-gray-900/80 backdrop-blur-sm border-l border-gray-700'
              }`}>
              <div className="p-4">
                <DataPanel
                  simulation={simulation}
                  params={params}
                  isDayTheme={isDayTheme}
                />
              </div>
            </div>
          ) : (
            <div className={`h-full ${isDayTheme ? 'bg-white/80 backdrop-blur-sm border-l border-gray-200' : 'bg-gray-900/80 backdrop-blur-sm border-l border-gray-700'
              }`} />
          )}

          {/* Right Panel Toggle Button */}
          <button
            onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            className={`absolute top-1/2 -translate-y-1/2 ${rightPanelCollapsed ? '-left-3' : '-left-3'
              } w-6 h-12 ${isDayTheme ? 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50' : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700'
              } rounded-l-lg flex items-center justify-center shadow-lg transition-all duration-200 z-10`}
          >
            {rightPanelCollapsed ? '←' : '→'}
          </button>
        </div>

      </div>
    </div>
  );
}