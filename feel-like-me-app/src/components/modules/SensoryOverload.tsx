import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafety } from '../../contexts/SafetyContext';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';
import { useModuleProgress } from '../../contexts/ModuleProgressContext';
import { useAudioEngine } from '../../hooks/useAudioEngine';
import { useVisualEngine } from '../../hooks/useVisualEngine';
import AudioEngine from '../../utils/audioEngine';
import VisualEngine from '../../utils/visualEngine';
import { SafetyControls } from '../common/SafetyControls';
import { SimpleReflection } from '../common/SimpleReflection';

interface SensoryOverloadProps {
  onComplete: () => void;
  onExit: () => void;
}

const SensoryOverload: React.FC<SensoryOverloadProps> = ({ onComplete, onExit }) => {
  const [phase, setPhase] = useState<'intro' | 'building' | 'peak' | 'reflection'>('intro');
  const [intensity, setIntensity] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  const { stressLevel, updateStressLevel, safetyState } = useSafety();
  const { preferences } = useUserPreferences();
  const { updateProgress } = useModuleProgress();
  
  const {
    initializeAudio,
    createSoundscape,
    updateStressLevel: updateAudioStress,
    setMasterVolume,
    startAllLayers,
    stopAllLayers,
    isInitialized: audioInitialized
  } = useAudioEngine();
  
  const {
    canvasRef,
    initializeVisual,
    createVisualEffects,
    updateStressLevel: updateVisualStress,
    start: startVisual,
    stop: stopVisual
  } = useVisualEngine();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseStartTime = useRef(Date.now());

  // Initialize engines
  useEffect(() => {
    const init = async () => {
      try {
        await initializeAudio();
        initializeVisual();
      } catch (error) {
        console.error('Failed to initialize engines:', error);
      }
    };
    init();
  }, [initializeAudio, initializeVisual]);
  // Handle emergency exit
  useEffect(() => {
    if (safetyState.exitRequested) {
      handleEmergencyExit();
    }
  }, [safetyState.exitRequested]);

  // Update stress levels in engines
  useEffect(() => {
    updateAudioStress(stressLevel);
    updateVisualStress(stressLevel);
  }, [stressLevel, updateAudioStress, updateVisualStress]);

  // Main simulation loop
  useEffect(() => {
    if (!isActive || safetyState.pauseRequested) return;

    intervalRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 100);
      
      const elapsed = Date.now() - phaseStartTime.current;
      
      switch (phase) {
        case 'building':
          handleBuildingPhase(elapsed);
          break;
        case 'peak':
          handlePeakPhase(elapsed);
          break;
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, safetyState.pauseRequested, phase]);

  const handleBuildingPhase = (elapsed: number) => {
    // Gradually increase intensity over 30 seconds
    const buildDuration = 30000;
    const progress = Math.min(elapsed / buildDuration, 1);
    const newIntensity = progress * 0.7; // Build to 70% intensity
    
    setIntensity(newIntensity);
    updateStressLevel(newIntensity);
    
    if (progress >= 1) {
      setPhase('peak');
      phaseStartTime.current = Date.now();
    }
  };

  const handlePeakPhase = (elapsed: number) => {
    // Maintain peak intensity for 15 seconds with fluctuations
    const peakDuration = 15000;
    const progress = elapsed / peakDuration;
    
    // Add realistic fluctuations
    const fluctuation = Math.sin(elapsed * 0.01) * 0.1;
    const newIntensity = 0.7 + fluctuation + (progress * 0.2); // Peak at 90%
    
    setIntensity(Math.min(newIntensity, 0.9));
    updateStressLevel(Math.min(newIntensity, 0.9));
    
    if (progress >= 1) {
      handleExperienceComplete();
    }
  };

  const startExperience = async () => {
    if (!audioInitialized) {
      await initializeAudio();
    }
    
    // Set volume based on user preferences
    setMasterVolume(preferences.audioVolume * 0.01);
    
    // Create sensory overload soundscape and visuals
    createSoundscape(AudioEngine.getSensoryOverloadConfig());
    createVisualEffects(VisualEngine.getSensoryOverloadConfig());
    
    setPhase('building');
    setIsActive(true);
    phaseStartTime.current = Date.now();
    
    startAllLayers();
    startVisual();
  };

  const handleEmergencyExit = () => {
    setIsActive(false);
    stopAllLayers();
    stopVisual();
    onExit();
  };

  const handleExperienceComplete = () => {
    setIsActive(false);
    stopAllLayers();
    stopVisual();
    setPhase('reflection');
    
        // Update progress
    updateProgress('sensory-overload', {
      isCompleted: true,
      empathyScore: Math.max(...[stressLevel]),
      timeSpent: timeElapsed,
      currentStep: 5,
      totalSteps: 5,
      completedSteps: [1, 2, 3, 4, 5]
    });
  };
  const handleReflectionComplete = () => {
    updateProgress('sensory-overload', {
      isCompleted: true,
      empathyScore: Math.max(...[stressLevel]),
      timeSpent: timeElapsed,
      currentStep: 5,
      totalSteps: 5,
      completedSteps: [1, 2, 3, 4, 5]
    });
    onComplete();
  };

  if (phase === 'reflection') {
    return (
      <SimpleReflection
        questions={[
          "How did the overwhelming sensations make you feel?",
          "What was the most difficult part of the experience?",
          "How might this help you understand autistic experiences?",
          "What would have helped you cope better during the experience?"
        ]}
        insights={[
          "Many autistic individuals experience sensory overload daily",
          "What feels manageable to neurotypical people can be overwhelming",
          "Understanding leads to better support and accommodation"
        ]}
        onComplete={handleReflectionComplete}
      />
    );
  }

  return (
    <div className="relative h-screen w-full bg-gray-100 overflow-hidden">
      {/* Visual Effects Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />
      
      {/* Safety Controls */}
      <SafetyControls className="z-50" />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        <AnimatePresence>
          {phase === 'intro' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center p-8"
            >
              <div className="max-w-2xl text-center bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Sensory Overload Experience
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                  You're about to experience what sensory overload feels like for many autistic individuals. 
                  This simulation will gradually build overwhelming sensory input through sound and visual effects.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-amber-800 font-medium">
                    ⚠️ This experience may be intense. You can exit at any time using the ESC key 
                    or pause using Ctrl+Space.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startExperience}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Begin Experience
                </motion.button>
              </div>
            </motion.div>
          )}
          
          {(phase === 'building' || phase === 'peak') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 relative"
            >
              {/* Intensity Overlay */}
              <div 
                className="absolute inset-0 bg-red-500 pointer-events-none"
                style={{ 
                  opacity: intensity * 0.3,
                  zIndex: 2
                }}
              />
              
              {/* Simulated Environment */}
              <div className="h-full flex items-center justify-center relative z-3">
                <motion.div
                  animate={{
                    scale: 1 + (intensity * 0.1),
                    rotate: intensity * 2
                  }}
                  className="text-center"
                >
                  <motion.h2
                    animate={{
                      fontSize: `${2 + intensity}rem`,
                      opacity: 0.7 + (intensity * 0.3)
                    }}
                    className="font-bold text-gray-900 mb-4"
                  >
                    {phase === 'building' ? 'Sensations Building...' : 'OVERWHELMING SENSORY INPUT'}
                  </motion.h2>
                  
                  {/* Stress Level Indicator */}
                  <div className="bg-white/80 rounded-lg p-4 inline-block">
                    <p className="text-sm font-medium mb-2">Stress Level</p>
                    <div className="w-48 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stressLevel * 100}%` }}
                        className={`h-full transition-colors duration-300 ${
                          stressLevel < 0.3 ? 'bg-green-500' :
                          stressLevel < 0.6 ? 'bg-yellow-500' :
                          stressLevel < 0.8 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {Math.round(stressLevel * 100)}%
                    </p>
                  </div>
                </motion.div>
              </div>
              
              {/* Environmental Elements */}
              <div className="absolute inset-0 pointer-events-none z-1">
                {/* Flickering lights effect */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    transition: { duration: 0.1 + (intensity * 0.05), repeat: Infinity }
                  }}
                  className="absolute top-0 left-0 w-full h-8 bg-white"
                />
                
                {/* Moving crowd shadows */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      x: [-100, window.innerWidth + 100],
                      transition: { 
                        duration: 3 - (intensity * 1.5), 
                        repeat: Infinity,
                        delay: i * 0.5
                      }
                    }}
                    className="absolute bottom-1/3 w-16 h-32 bg-black/20 rounded-full blur-sm"
                    style={{ left: `${i * 20}%` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SensoryOverload;
