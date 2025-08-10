import React from 'react';

export interface ProjectileData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  time: number;
}

export interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  trajectory: ProjectileData[];
  currentProjectile: ProjectileData | null;
  maxHeight: number;
  range: number;
  timeOfFlight: number;
  animationProgress: number;
  isReset: boolean;
}

export interface SimulationParams {
  velocity: number;
  angle: number;
  mass: number;
  airResistance: boolean;
  airResistanceCoeff: number;
  gravity: number;
  canvasWidthMeters: number;
  canvasHeightMeters: number;
  cannonHeight: number;
}

export interface Preset {
  name: string;
  icon: string | React.ReactElement;
  params: Partial<SimulationParams>;
  description: string;
}

export interface CanvasProps {
  simulation: SimulationState;
  params: SimulationParams;
  isDayTheme: boolean;
  updateParams?: (params: Partial<SimulationParams>) => void;
}

export interface ControlPanelProps {
  params: SimulationParams;
  updateParams: (params: Partial<SimulationParams>) => void;
  simulation: SimulationState;
  startSimulation: () => void;
  resetSimulation: () => void;
  togglePause: () => void;
  isDayTheme: boolean;
}

export interface DataPanelProps {
  simulation: SimulationState;
  params: SimulationParams;
  isDayTheme: boolean;
}

export interface HeaderProps {
  simulation: SimulationState;
  isDayTheme: boolean;
  setIsDayTheme: (isDayTheme: boolean) => void;
  params: SimulationParams;
  updateParams: (params: Partial<SimulationParams>) => void;
  startSimulation: () => void;
  resetSimulation: () => void;
  togglePause: () => void;
}