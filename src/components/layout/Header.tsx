import React from 'react';
import { FaPlay, FaPause, FaRedo, FaSun, FaMoon } from 'react-icons/fa';
import { HeaderProps } from '../../types/simulation';

export function Header({
  simulation,
  isDayTheme,
  setIsDayTheme,
  params,
  updateParams,
  startSimulation,
  resetSimulation,
  togglePause
}: HeaderProps) {
  return (
    <div className={`${isDayTheme ? 'bg-white/95 backdrop-blur-sm' : 'bg-gray-900/95 backdrop-blur-sm'
      } border-b ${isDayTheme ? 'border-gray-200' : 'border-gray-700'
      } sticky top-0 z-50`}>
      <div className="max-w-full mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-6">
            <h1 className={`squid_font text-xl md:text-2xl font-bold ${isDayTheme ? 'text-gray-900' : 'text-white'
              }`}>
              ParaBounce
            </h1>
          </div>

          {/* Centered Simulation Controls */}
          <div className="hidden md:flex items-center space-x-3 absolute left-1/2 transform -translate-x-1/2">
            <button
              onClick={startSimulation}
              disabled={simulation.isRunning}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${simulation.isRunning
                ? isDayTheme
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : isDayTheme
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md hover:shadow-lg'
                  : 'bg-gradient-to-r from-squid-green to-emerald-800 hover:from-emerald-900 hover:to-squid-green text-white shadow-md hover:shadow-lg'
                }`}
            >
              <FaPlay className="w-4 h-4" />
            </button>

            <button
              onClick={togglePause}
              disabled={!simulation.isRunning}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${!simulation.isRunning
                ? isDayTheme
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : isDayTheme
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg'
                  : 'bg-gradient-to-r from-emerald-700 to-green-800 hover:from-emerald-800 hover:to-green-900 text-white shadow-md hover:shadow-lg'
                }`}
            >
              {simulation.isPaused ? <FaPlay className="w-4 h-4" /> : <FaPause className="w-4 h-4" />}
            </button>

            <button
              onClick={resetSimulation}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${isDayTheme
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-md hover:shadow-lg'
                : 'bg-gradient-to-r from-emerald-800 to-green-900 hover:from-emerald-900 hover:to-green-950 text-white shadow-md hover:shadow-lg'
                }`}
            >
              <FaRedo className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Canvas Size Indicator */}
            <div className={`hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${isDayTheme ? 'bg-gray-100 text-gray-700' : 'bg-gray-800/70 text-gray-300'
              }`}>
              <span className="font-mono">{params.canvasWidthMeters}×{params.canvasHeightMeters}m</span>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${isDayTheme ? 'text-gray-700' : 'text-gray-300'
                }`}>
                {isDayTheme ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
              </span>
              <button
                onClick={() => setIsDayTheme(!isDayTheme)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isDayTheme 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500' 
                  : 'bg-gradient-to-r from-squid-green to-emerald-800'
                  }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${isDayTheme ? 'translate-x-1' : 'translate-x-7'
                  }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Controls & Metrics */}
        <div className="md:hidden mt-3 space-y-3">
          {/* Mobile Control Buttons */}
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={startSimulation}
              disabled={simulation.isRunning}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${simulation.isRunning
                ? isDayTheme
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : isDayTheme
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white'
                  : 'bg-gradient-to-r from-squid-green to-emerald-800 hover:from-emerald-900 hover:to-squid-green text-white'
                }`}
            >
              <FaPlay className="w-4 h-4" />
            </button>

            <button
              onClick={togglePause}
              disabled={!simulation.isRunning}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${!simulation.isRunning
                ? isDayTheme
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : isDayTheme
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white'
                  : 'bg-gradient-to-r from-emerald-700 to-green-800 hover:from-emerald-800 hover:to-green-900 text-white'
                }`}
            >
              {simulation.isPaused ? <FaPlay className="w-4 h-4" /> : <FaPause className="w-4 h-4" />}
            </button>

            <button
              onClick={resetSimulation}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${isDayTheme
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white'
                : 'bg-gradient-to-r from-emerald-800 to-green-900 hover:from-emerald-900 hover:to-green-950 text-white'
                }`}
            >
              <FaRedo className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Metrics */}
          <div className="flex items-center justify-center space-x-2 text-xs overflow-x-auto">
            <div className={`px-2 py-1 rounded-full whitespace-nowrap ${isDayTheme ? 'bg-blue-100 text-blue-800' : 'bg-blue-900/70 text-blue-200'
              }`}>
              H: {simulation.maxHeight.toFixed(1)}m
            </div>
            <div className={`px-2 py-1 rounded-full whitespace-nowrap ${isDayTheme ? 'bg-green-100 text-green-800' : 'bg-green-900/70 text-green-200'
              }`}>
              R: {simulation.range.toFixed(1)}m
            </div>
            <div className={`px-2 py-1 rounded-full whitespace-nowrap ${isDayTheme ? 'bg-purple-100 text-purple-800' : 'bg-purple-900/70 text-purple-200'
              }`}>
              T: {simulation.timeOfFlight.toFixed(1)}s
            </div>
            <div className={`px-2 py-1 rounded-full whitespace-nowrap font-mono ${isDayTheme ? 'bg-gray-100 text-gray-700' : 'bg-gray-800/70 text-gray-300'
              }`}>
              {params.canvasWidthMeters}×{params.canvasHeightMeters}m
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}