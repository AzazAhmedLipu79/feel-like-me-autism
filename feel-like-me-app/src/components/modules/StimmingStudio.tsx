import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSafety } from '../../contexts/SafetyContext';
import { useModuleProgress } from '../../contexts/ModuleProgressContext';
import { SafetyControls } from '../common/SafetyControls';
import { SimpleReflection } from '../common/SimpleReflection';

interface StimTool {
  id: string;
  name: string;
  type: 'visual' | 'tactile' | 'auditory' | 'movement';
  description: string;
  regulationValue: number;
  icon: string;
}

interface StimSession {
  toolsUsed: string[];
  duration: number;
  regulationAchieved: number;
  stressReduced: number;
}

const STIM_TOOLS: StimTool[] = [
  {
    id: 'fidget-spinner',
    name: 'Fidget Spinner',
    type: 'tactile',
    description: 'Smooth spinning motion with tactile feedback',
    regulationValue: 15,
    icon: '🌀'
  },
  {
    id: 'stress-ball',
    name: 'Stress Ball',
    type: 'tactile',
    description: 'Squeeze and release for pressure stimulation',
    regulationValue: 20,
    icon: '⚾'
  },
  {
    id: 'kaleidoscope',
    name: 'Digital Kaleidoscope',
    type: 'visual',
    description: 'Mesmerizing patterns and colors',
    regulationValue: 25,
    icon: '🔮'
  },
  {
    id: 'breathing-pace',
    name: 'Breathing Pacer',
    type: 'visual',
    description: 'Visual guide for rhythmic breathing',
    regulationValue: 30,
    icon: '🫁'
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    type: 'auditory',
    description: 'Consistent background sound',
    regulationValue: 18,
    icon: '🌊'
  },
  {
    id: 'binaural-beats',
    name: 'Binaural Beats',
    type: 'auditory',
    description: 'Frequency patterns for relaxation',
    regulationValue: 35,
    icon: '🎵'
  },
  {
    id: 'rocking-motion',
    name: 'Rocking Motion',
    type: 'movement',
    description: 'Gentle back and forth movement',
    regulationValue: 28,
    icon: '🪑'
  },
  {
    id: 'hand-flapping',
    name: 'Hand Movements',
    type: 'movement',
    description: 'Rhythmic hand and arm movements',
    regulationValue: 22,
    icon: '👋'
  }
];

export default function StimmingStudio() {
  const { safetyState } = useSafety();
  const { updateProgress } = useModuleProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [phase, setPhase] = useState<'intro' | 'exploration' | 'session' | 'reflection'>('intro');
  const [activeTool, setActiveTool] = useState<StimTool | null>(null);
  const [stressLevel, setStressLevel] = useState(75);
  const [regulationLevel, setRegulationLevel] = useState(25);
  const [sessionData, setSessionData] = useState<StimSession>({
    toolsUsed: [],
    duration: 0,
    regulationAchieved: 0,
    stressReduced: 0
  });
  const [timeInSession, setTimeInSession] = useState(0);  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (safetyState.exitRequested) {
      setActiveTool(null);
      setIsActive(false);
      return;
    }

    let timer: number;
    if (isActive && activeTool) {
      timer = setInterval(() => {
        setTimeInSession(prev => prev + 1);
        
        // Gradual regulation increase
        setRegulationLevel(prev => 
          Math.min(100, prev + activeTool.regulationValue / 10)
        );
        
        // Gradual stress decrease
        setStressLevel(prev => 
          Math.max(0, prev - activeTool.regulationValue / 15)
        );
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive, activeTool, safetyState.exitRequested]);

  const startExploration = () => {
    setPhase('exploration');
    updateProgress('stimming-studio', { 
      currentStep: 1,
      totalSteps: 3,
      completedSteps: [1],
      empathyScore: 0,
      timeSpent: 0,
      isCompleted: false
    });
  };

  const selectTool = (tool: StimTool) => {
    setActiveTool(tool);
    setPhase('session');
    setIsActive(true);
    
    // Add to session data
    setSessionData(prev => ({
      ...prev,
      toolsUsed: prev.toolsUsed.includes(tool.id) 
        ? prev.toolsUsed 
        : [...prev.toolsUsed, tool.id]
    }));
  };
  const stopSession = () => {
    setIsActive(false);
    const stressReduction = 75 - stressLevel;
    
    setSessionData(prev => ({
      ...prev,
      duration: prev.duration + timeInSession,
      regulationAchieved: Math.max(prev.regulationAchieved, regulationLevel),
      stressReduced: prev.stressReduced + stressReduction
    }));
    
    setTimeInSession(0);
    setPhase('exploration');
  };

  const finishExperience = () => {
    setPhase('reflection');    updateProgress('stimming-studio', {
      currentStep: 3,
      totalSteps: 3,
      completedSteps: [1, 2, 3],
      empathyScore: Math.min(100, sessionData.toolsUsed.length * 12 + sessionData.regulationAchieved),
      timeSpent: sessionData.duration,
      isCompleted: true
    });
  };

  const renderStimTool = (tool: StimTool) => {
    if (!activeTool || activeTool.id !== tool.id) return null;

    switch (tool.id) {
      case 'fidget-spinner':
        return (
          <motion.div
            animate={{ rotate: isActive ? 360 : 0 }}
            transition={{ 
              duration: 1, 
              repeat: isActive ? Infinity : 0, 
              ease: "linear" 
            }}
            className="w-24 h-24 bg-blue-500 rounded-full border-4 border-blue-700 mx-auto mb-4 flex items-center justify-center"
          >
            <div className="w-4 h-4 bg-white rounded-full" />
          </motion.div>
        );
        
      case 'stress-ball':
        return (
          <motion.div
            animate={{ 
              scale: isActive ? [1, 0.8, 1] : 1,
              backgroundColor: isActive ? ['#ef4444', '#dc2626', '#ef4444'] : '#ef4444'
            }}
            transition={{ 
              duration: 0.8, 
              repeat: isActive ? Infinity : 0 
            }}
            className="w-24 h-24 bg-red-500 rounded-full mx-auto mb-4 cursor-pointer"
            onClick={() => setIsActive(!isActive)}
          />
        );
        
      case 'kaleidoscope':
        return (
          <motion.div
            className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-purple-300"
            animate={{ rotate: isActive ? 360 : 0 }}
            transition={{ 
              duration: 4, 
              repeat: isActive ? Infinity : 0, 
              ease: "linear" 
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-400 to-green-400"
                animate={{ 
                  rotate: isActive ? -360 : 0,
                  scale: isActive ? [1, 1.2, 1] : 1
                }}
                transition={{ 
                  duration: 3, 
                  repeat: isActive ? Infinity : 0, 
                  ease: "linear" 
                }}
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </motion.div>
        );
        
      case 'breathing-pace':
        return (
          <motion.div
            animate={{ 
              scale: isActive ? [1, 1.3, 1] : 1,
              opacity: isActive ? [0.6, 1, 0.6] : 0.8
            }}
            transition={{ 
              duration: 4, 
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut"
            }}
            className="w-32 h-32 bg-green-400 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <div className="text-white font-semibold text-lg">
              {isActive ? 'Breathe' : 'Start'}
            </div>
          </motion.div>
        );
        
      default:
        return (
          <motion.div
            animate={{ 
              y: isActive ? [0, -10, 0] : 0,
              opacity: isActive ? [0.7, 1, 0.7] : 1
            }}
            transition={{ 
              duration: 2, 
              repeat: isActive ? Infinity : 0 
            }}
            className="w-24 h-24 bg-gray-400 rounded-lg mx-auto mb-4 flex items-center justify-center text-4xl"
          >
            {tool.icon}
          </motion.div>
        );
    }
  };

  if (phase === 'reflection') {
    return (      <SimpleReflection
        questions={[
          'Which stimming tools felt most regulating for you?',
          'How did your stress and regulation levels change?',
          'What did you learn about the purpose of stimming?',
          'How might this help you understand stimming in others?'
        ]}
        insights={[
          `You explored ${sessionData.toolsUsed.length} different stimming tools`,
          `Total session time: ${Math.round(sessionData.duration / 60)} minutes`,
          `Maximum regulation achieved: ${Math.round(sessionData.regulationAchieved)}%`,
          'Stimming is self-regulation, not distraction or "bad behavior"'
        ]}
        onComplete={() => setPhase('intro')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: safetyState.intensityLimit < 5 ? 0.3 : 1 }}
      />
      
      <SafetyControls />
      
      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {phase === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl font-bold text-green-900">
              Stimming Studio
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Explore the world of stimming - self-regulating behaviors that help manage 
              sensory input, emotions, and stress. Discover how different sensory tools 
              can provide comfort and regulation.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
              <p className="font-semibold">About Stimming:</p>
              <p>Stimming (self-stimulatory behavior) is a natural way to regulate sensory 
              input and emotional states. It's not something to suppress, but to understand and support.</p>
            </div>
            
            <button
              onClick={startExploration}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Explore Stimming Tools
            </button>
          </motion.div>
        )}

        {phase === 'exploration' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-900 mb-2">
                Choose Your Stimming Tool
              </h2>
              <p className="text-gray-600">
                Select a tool to explore how it helps with regulation and stress management
              </p>
            </div>

            {/* Current State Display */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Stress Level</h3>
                  <div className="w-full bg-red-200 rounded-full h-4">
                    <div
                      className="bg-red-500 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${stressLevel}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{Math.round(stressLevel)}%</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Regulation Level</h3>
                  <div className="w-full bg-green-200 rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${regulationLevel}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{Math.round(regulationLevel)}%</p>
                </div>
              </div>
            </div>

            {/* Stim Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {STIM_TOOLS.map((tool) => (
                <motion.div
                  key={tool.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectTool(tool)}
                  className="bg-white rounded-lg p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl text-center mb-3">{tool.icon}</div>
                  <h3 className="font-semibold text-gray-800 text-center mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center mb-3">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 capitalize">
                      {tool.type}
                    </span>
                    <span className="text-xs font-semibold text-green-600">
                      +{tool.regulationValue}
                    </span>
                  </div>
                  {sessionData.toolsUsed.includes(tool.id) && (
                    <div className="mt-2 text-center">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Explored ✓
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {sessionData.toolsUsed.length > 0 && (
              <div className="text-center">
                <button
                  onClick={finishExperience}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Complete Experience
                </button>
              </div>
            )}
          </div>
        )}

        {phase === 'session' && activeTool && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-900 mb-2">
                {activeTool.name} Session
              </h2>
              <p className="text-gray-600">{activeTool.description}</p>
            </div>

            {/* Interactive Tool Display */}
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              {renderStimTool(activeTool)}
              
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      isActive
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isActive ? 'Pause' : 'Start'} Stimming
                  </button>
                </div>
                
                <div className="text-sm text-gray-600">
                  Session time: {Math.floor(timeInSession / 60)}:{(timeInSession % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Real-time Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-gray-700 mb-3">Stress Level</h3>
                <div className="w-full bg-red-200 rounded-full h-6">
                  <div
                    className="bg-red-500 h-6 rounded-full transition-all duration-1000"
                    style={{ width: `${stressLevel}%` }}
                  />
                </div>
                <p className="text-center mt-2 font-bold text-gray-800">
                  {Math.round(stressLevel)}%
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-gray-700 mb-3">Regulation</h3>
                <div className="w-full bg-green-200 rounded-full h-6">
                  <div
                    className="bg-green-500 h-6 rounded-full transition-all duration-1000"
                    style={{ width: `${regulationLevel}%` }}
                  />
                </div>
                <p className="text-center mt-2 font-bold text-gray-800">
                  {Math.round(regulationLevel)}%
                </p>
              </div>
            </div>

            <div className="text-center space-x-4">
              <button
                onClick={stopSession}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Try Another Tool
              </button>
              <button
                onClick={finishExperience}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Finish Experience
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
