// Core types for the Feel Like Me application

export interface UserPreferences {
  reduceMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  audioDescriptions: boolean;
  intensityLimit: number;
  audioVolume: number;
  maxIntensity: number;
  safetySettings: {
    emergencyExitReminders: boolean;
    stressMonitoring: boolean;
    autoPause: boolean;
    reflectionPrompts: boolean;
  };
  accessibilitySettings: {
    reducedMotion: boolean;
    highContrast: boolean;
  };
}

export interface EmpathyScore {
  total: number;
  moduleScores: Record<string, number>;
  reflections: Reflection[];
}

export interface Reflection {
  moduleId: string;
  text: string;
  emotion: string;
  timestamp: number;
}

export interface ModuleProgress {
  moduleId: string;
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  empathyScore: number;
  timeSpent: number;
  isCompleted: boolean;
}

export interface SafetyState {
  isActive: boolean;
  intensityLimit: number;
  exitRequested: boolean;
  pauseRequested: boolean;
  warningShown: boolean;
}

// Audio types
export interface AudioLayer {
  id: string;
  name: string;
  description: string;
  volume: number;
  isActive: boolean;
  audioUrl: string;
  icon: string;
  audioBuffer?: AudioBuffer;
  sourceNode?: AudioBufferSourceNode;
}

// Social module types
export interface Scenario {
  id: string;
  title: string;
  context: string;
  description: string;
  imageUrl?: string;
  choices: Choice[];
  autisticPerspective: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ConfidenceData {
  scenarioId: string;
  confidence: number;
  responseTime: number;
  selectedChoice: string;
}

// Visual stimuli types
export interface StimuliConfig {
  flickerRate: number;
  movementSpeed: number;
  colorIntensity: number;
  particleCount: number;
}

// Module types
export type ModuleId = 
  | 'sensory-overload'
  | 'social-uncertainty'
  | 'cognitive-load'
  | 'meltdown-simulator'
  | 'stimming-studio'
  | 'hyperfocus-challenge';

export interface Module {
  id: ModuleId;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  completed: boolean;
  locked: boolean;
}

// Analytics types
export interface UserEvent {
  type: 'module_start' | 'module_complete' | 'safety_exit' | 'reflection_submit' | 'pause_requested';
  moduleId?: string;
  data?: Record<string, any>;
  timestamp: number;
}

// Stimming types
export interface StimmingTool {
  id: string;
  name: string;
  type: 'visual' | 'audio' | 'tactile';
  icon: string;
  description: string;
}

// Emotion types
export type EmotionType = '😊' | '😔' | '😰' | '🤔' | '😮' | '😌' | '😡' | '😴';
