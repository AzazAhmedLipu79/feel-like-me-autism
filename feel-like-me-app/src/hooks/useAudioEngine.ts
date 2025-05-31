import { useRef, useEffect, useCallback } from 'react';
import AudioEngine from '@/utils/audioEngine';

export interface UseAudioEngineReturn {
  audioEngine: AudioEngine | null;
  initializeAudio: () => Promise<void>;
  createSoundscape: (config: any) => void;
  updateStressLevel: (level: number) => void;
  setMasterVolume: (volume: number) => void;
  startAllLayers: () => void;
  stopAllLayers: () => void;
  isInitialized: boolean;
}

export const useAudioEngine = (): UseAudioEngineReturn => {
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Initialize audio engine
    audioEngineRef.current = new AudioEngine();
    
    return () => {
      // Cleanup
      if (audioEngineRef.current) {
        audioEngineRef.current.clearAllLayers();
      }
    };
  }, []);

  const initializeAudio = useCallback(async () => {
    if (!audioEngineRef.current || isInitializedRef.current) return;
    
    try {
      await audioEngineRef.current.initialize();
      isInitializedRef.current = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw error;
    }
  }, []);

  const createSoundscape = useCallback((config: any) => {
    if (audioEngineRef.current && isInitializedRef.current) {
      audioEngineRef.current.createSoundscape(config);
    }
  }, []);

  const updateStressLevel = useCallback((level: number) => {
    if (audioEngineRef.current && isInitializedRef.current) {
      audioEngineRef.current.updateStressLevel(level);
    }
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    if (audioEngineRef.current && isInitializedRef.current) {
      audioEngineRef.current.setMasterVolume(volume);
    }
  }, []);

  const startAllLayers = useCallback(() => {
    if (audioEngineRef.current && isInitializedRef.current) {
      audioEngineRef.current.startAllLayers();
    }
  }, []);

  const stopAllLayers = useCallback(() => {
    if (audioEngineRef.current && isInitializedRef.current) {
      audioEngineRef.current.stopAllLayers();
    }
  }, []);

  return {
    audioEngine: audioEngineRef.current,
    initializeAudio,
    createSoundscape,
    updateStressLevel,
    setMasterVolume,
    startAllLayers,
    stopAllLayers,
    isInitialized: isInitializedRef.current
  };
};
