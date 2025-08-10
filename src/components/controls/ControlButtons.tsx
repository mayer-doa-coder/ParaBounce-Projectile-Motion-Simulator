import React from 'react';
import { SimulationState } from '../../types/simulation';

interface ControlButtonsProps {
  simulation: SimulationState;
  startSimulation: () => void;
  resetSimulation: () => void;
  togglePause: () => void;
  isDayTheme: boolean;
}

export function ControlButtons({
  simulation,
  startSimulation,
  resetSimulation,
  togglePause,
  isDayTheme
}: ControlButtonsProps) {
  const buttonBaseClass = "flex flex-col items-center justify-center p-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-4">
      <h4 className={`text-sm font-medium ${
        isDayTheme ? 'text-gray-700' : 'text-gray-300'
      }`}>
        Simulation Controls
      </h4>
      
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={startSimulation}
          disabled={simulation.isRunning && !simulation.isPaused}
          className={`${buttonBaseClass} bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700`}
        >
          <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span className="text-xs">Start</span>
        </button>
        
        <button
          onClick={togglePause}
          disabled={!simulation.isRunning}
          className={`${buttonBaseClass} bg-gradient-to-br from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700`}
        >
          {simulation.isPaused ? (
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          ) : (
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          )}
          <span className="text-xs">{simulation.isPaused ? 'Resume' : 'Pause'}</span>
        </button>
        
        <button
          onClick={resetSimulation}
          className={`${buttonBaseClass} bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700`}
        >
          <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          <span className="text-xs">Reset</span>
        </button>
      </div>
      
      {/* Status Indicator */}
      <div className={`p-3 rounded-lg text-center ${
        isDayTheme ? 'bg-gray-50' : 'bg-gray-700'
      }`}>
        <div className={`text-sm font-medium ${
          isDayTheme ? 'text-gray-900' : 'text-white'
        }`}>
          Status: {
            simulation.isRunning 
              ? (simulation.isPaused ? 'Paused' : 'Running')
              : 'Stopped'
          }
        </div>
        
        {simulation.isRunning && (
          <div className={`text-xs mt-1 ${
            isDayTheme ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Progress: {(simulation.animationProgress * 100).toFixed(1)}%
          </div>
        )}
      </div>
      
      {/* Quick Tips */}
      <div className={`p-3 rounded-lg ${
        isDayTheme ? 'bg-blue-50' : 'bg-blue-900/20'
      }`}>
        <div className={`text-xs font-medium mb-2 ${
          isDayTheme ? 'text-blue-800' : 'text-blue-300'
        }`}>
          Quick Tips
        </div>
        <ul className={`text-xs space-y-1 ${
          isDayTheme ? 'text-blue-700' : 'text-blue-200'
        }`}>
          <li>• Adjust parameters while simulation is paused</li>
          <li>• Try different presets for quick setups</li>
          <li>• Change canvas size for better visibility</li>
        </ul>
      </div>
    </div>
  );
}