import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SafetyState } from '../types/index';

interface SafetyContextType {
  safetyState: SafetyState;
  stressLevel: number;
  requestExit: () => void;
  requestPause: () => void;
  resumeFromPause: () => void;
  updateStressLevel: (level: number) => void;
  setSafetyState: (state: Partial<SafetyState>) => void;
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};

interface SafetyProviderProps {
  children: ReactNode;
}

export const SafetyProvider: React.FC<SafetyProviderProps> = ({ children }) => {
  const [safetyState, setSafetyStateInternal] = useState<SafetyState>({
    isActive: true,
    intensityLimit: 7,
    exitRequested: false,
    pauseRequested: false,
    warningShown: false
  });

  const [stressLevel, setStressLevel] = useState(0);

  const requestExit = () => {
    setSafetyStateInternal(prev => ({ ...prev, exitRequested: true }));
  };

  const requestPause = () => {
    setSafetyStateInternal(prev => ({ ...prev, pauseRequested: true }));
  };

  const resumeFromPause = () => {
    setSafetyStateInternal(prev => ({ ...prev, pauseRequested: false }));
  };

  const updateStressLevel = (level: number) => {
    setStressLevel(level);
    
    if (level >= safetyState.intensityLimit && !safetyState.warningShown) {
      setSafetyStateInternal(prev => ({ ...prev, warningShown: true }));
    }
  };

  const setSafetyState = (newState: Partial<SafetyState>) => {
    setSafetyStateInternal(prev => ({ ...prev, ...newState }));
  };

  // Auto-pause if stress level gets too high
  useEffect(() => {
    if (stressLevel >= 9 && safetyState.isActive && !safetyState.pauseRequested) {
      requestPause();
    }
  }, [stressLevel, safetyState.isActive, safetyState.pauseRequested]);

  // Keyboard shortcuts for safety
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // ESC key for immediate exit
      if (e.key === 'Escape') {
        requestExit();
      }
      // Ctrl+Space for pause
      if (e.key === ' ' && e.ctrlKey) {
        e.preventDefault();
        if (safetyState.pauseRequested) {
          resumeFromPause();
        } else {
          requestPause();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [safetyState.pauseRequested]);

  const value: SafetyContextType = {
    safetyState,
    stressLevel,
    requestExit,
    requestPause,
    resumeFromPause,
    updateStressLevel,
    setSafetyState
  };

  return (
    <SafetyContext.Provider value={value}>
      {children}
    </SafetyContext.Provider>
  );
};
