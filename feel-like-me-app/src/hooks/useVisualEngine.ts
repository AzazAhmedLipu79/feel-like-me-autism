import { useRef, useEffect, useCallback } from 'react';
import VisualEngine, { VisualConfig, VisualStimulus } from '@/utils/visualEngine';

export interface UseVisualEngineReturn {
  visualEngine: VisualEngine | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  initializeVisual: () => void;
  createVisualEffects: (config: VisualConfig) => void;
  addStimulus: (stimulus: VisualStimulus) => void;
  removeStimulus: (id: string) => void;
  updateStressLevel: (level: number) => void;
  start: () => void;
  stop: () => void;
  clearAll: () => void;
}

export const useVisualEngine = (): UseVisualEngineReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualEngineRef = useRef<VisualEngine | null>(null);

  const initializeVisual = useCallback(() => {
    if (!canvasRef.current || visualEngineRef.current) return;
    
    try {
      visualEngineRef.current = new VisualEngine(canvasRef.current);
    } catch (error) {
      console.error('Failed to initialize visual engine:', error);
    }
  }, []);

  const createVisualEffects = useCallback((config: VisualConfig) => {
    if (!visualEngineRef.current) return;
    
    visualEngineRef.current.clearAllStimuli();
    config.stimuli.forEach(stimulus => {
      visualEngineRef.current?.addStimulus(stimulus);
    });
  }, []);

  const addStimulus = useCallback((stimulus: VisualStimulus) => {
    visualEngineRef.current?.addStimulus(stimulus);
  }, []);

  const removeStimulus = useCallback((id: string) => {
    visualEngineRef.current?.removeStimulus(id);
  }, []);

  const updateStressLevel = useCallback((level: number) => {
    visualEngineRef.current?.updateStressLevel(level);
  }, []);

  const start = useCallback(() => {
    visualEngineRef.current?.start();
  }, []);

  const stop = useCallback(() => {
    visualEngineRef.current?.stop();
  }, []);

  const clearAll = useCallback(() => {
    visualEngineRef.current?.clearAllStimuli();
  }, []);

  useEffect(() => {
    return () => {
      if (visualEngineRef.current) {
        visualEngineRef.current.stop();
      }
    };
  }, []);

  return {
    visualEngine: visualEngineRef.current,
    canvasRef,
    initializeVisual,
    createVisualEffects,
    addStimulus,
    removeStimulus,
    updateStressLevel,
    start,
    stop,
    clearAll
  };
};
