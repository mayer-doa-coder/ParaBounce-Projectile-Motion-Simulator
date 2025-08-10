import React from 'react';

interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  color: 'blue' | 'green' | 'purple' | 'red' | 'orange';
  isDayTheme: boolean;
  onChange: (value: number) => void;
  description?: string;
}

const colorClasses = {
  blue: {
    gradient: 'from-pink-400 to-rose-500',
    badge: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200',
    thumb: 'border-pink-500'
  },
  green: {
    gradient: 'from-squid-green to-emerald-800',
    badge: 'bg-squid-green/20 text-emerald-200 dark:bg-squid-green/30 dark:text-emerald-100',
    thumb: 'border-emerald-400'
  },
  purple: {
    gradient: 'from-pink-500 to-rose-600',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200',
    thumb: 'border-rose-500'
  },
  red: {
    gradient: 'from-pink-400 to-rose-500',
    badge: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200',
    thumb: 'border-pink-500'
  },
  orange: {
    gradient: 'from-pink-400 to-rose-500',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200',
    thumb: 'border-rose-500'
  }
};

export function ParameterSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  color,
  isDayTheme,
  onChange,
  description
}: ParameterSliderProps) {
  const colors = colorClasses[color];
  const percentage = ((value - min) / (max - min)) * 100;

  // Use Squid Game colors based on theme
  const actualGradient = isDayTheme ? colors.gradient : 'from-squid-green via-emerald-900 to-green-900';
  const actualBadge = isDayTheme ? 'bg-transparent text-pink-800 border border-pink-300' : 'bg-squid-green/30 text-emerald-100 border border-emerald-500/30';
  const actualThumb = isDayTheme ? colors.thumb : 'border-emerald-300';

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className={`text-sm font-medium ${
          isDayTheme ? 'text-pink-700' : 'text-emerald-300'
        }`}>
          {label}
        </label>
        <span className={`text-sm font-mono px-3 py-1 rounded-full ${actualBadge}`}>
          {value.toFixed(step < 1 ? 1 : 0)} {unit}
        </span>
      </div>
      
      <div className="relative">
        {/* Track */}
        <div className={`w-full h-3 rounded-full ${
          isDayTheme ? 'bg-gray-200' : 'bg-gray-800'
        } overflow-hidden border ${isDayTheme ? 'border-gray-300' : 'border-gray-700'}`}>
          {/* Progress */}
          <div 
            className={`h-full bg-gradient-to-r ${actualGradient} transition-all duration-200 ${!isDayTheme ? 'shadow-lg shadow-emerald-500/20' : ''}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {/* Thumb indicator */}
        <div 
          className={`absolute top-1/2 w-5 h-5 ${isDayTheme ? 'bg-white' : 'bg-gray-100'} border-2 ${actualThumb} rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-lg pointer-events-none transition-all duration-200 ${!isDayTheme ? 'shadow-emerald-400/30' : ''}`}
          style={{ left: `${percentage}%` }}
        />
      </div>
      
      {/* Min/Max labels */}
      <div className={`flex justify-between text-xs ${isDayTheme ? 'text-pink-600' : 'text-emerald-400'}`}>
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
      
      {description && (
        <p className={`text-xs ${isDayTheme ? 'text-pink-600' : 'text-emerald-400'}`}>
          {description}
        </p>
      )}
    </div>
  );
}