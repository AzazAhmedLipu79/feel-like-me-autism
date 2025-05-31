import { createContext, useContext, useState, ReactNode } from 'react';
import { ModuleProgress } from '../types/index';

interface ModuleProgressContextType {
  progress: Record<string, ModuleProgress>;
  updateProgress: (moduleId: string, updates: Partial<ModuleProgress>) => void;
  completeModule: (moduleId: string, empathyScore: number) => void;
  getModuleProgress: (moduleId: string) => ModuleProgress | undefined;
  getTotalEmpathyScore: () => number;
}

const ModuleProgressContext = createContext<ModuleProgressContextType | undefined>(undefined);

export const useModuleProgress = () => {
  const context = useContext(ModuleProgressContext);
  if (!context) {
    throw new Error('useModuleProgress must be used within a ModuleProgressProvider');
  }
  return context;
};

interface ModuleProgressProviderProps {
  children: ReactNode;
}

export const ModuleProgressProvider: React.FC<ModuleProgressProviderProps> = ({ children }) => {
  const [progress, setProgress] = useState<Record<string, ModuleProgress>>(() => {
    const saved = localStorage.getItem('feellikeme_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  const updateProgress = (moduleId: string, updates: Partial<ModuleProgress>) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          ...updates,
          moduleId
        }
      };
      localStorage.setItem('feellikeme_progress', JSON.stringify(updated));
      return updated;
    });
  };

  const completeModule = (moduleId: string, empathyScore: number) => {
    updateProgress(moduleId, {
      isCompleted: true,
      empathyScore,
      currentStep: progress[moduleId]?.totalSteps || 0
    });
  };

  const getModuleProgress = (moduleId: string): ModuleProgress | undefined => {
    return progress[moduleId];
  };

  const getTotalEmpathyScore = (): number => {
    return Object.values(progress).reduce((total, moduleProgress) => {
      return total + (moduleProgress.empathyScore || 0);
    }, 0);
  };

  const value: ModuleProgressContextType = {
    progress,
    updateProgress,
    completeModule,
    getModuleProgress,
    getTotalEmpathyScore
  };

  return (
    <ModuleProgressContext.Provider value={value}>
      {children}
    </ModuleProgressContext.Provider>
  );
};
