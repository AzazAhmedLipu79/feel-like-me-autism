import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSafety } from '../../contexts/SafetyContext';
import { useModuleProgress } from '../../contexts/ModuleProgressContext';
import { SafetyControls } from '../common/SafetyControls';
import { SimpleReflection } from '../common/SimpleReflection';

interface MeltdownTrigger {
  id: string;
  type: 'sensory' | 'social' | 'routine' | 'communication';
  description: string;
  impact: number;
}

interface EmotionalState {
  overwhelm: number;
  anxiety: number;
  frustration: number;
  exhaustion: number;
}

const MELTDOWN_TRIGGERS: MeltdownTrigger[] = [
  {
    id: 'noise',
    type: 'sensory',
    description: 'Unexpected loud noise in quiet environment',
    impact: 25
  },
  {
    id: 'change',
    type: 'routine',
    description: 'Last-minute plan change',
    impact: 30
  },
  {
    id: 'misunderstanding',
    type: 'communication',
    description: 'Being misunderstood or misinterpreted',
    impact: 20
  },
  {
    id: 'crowds',
    type: 'social',
    description: 'Unexpected crowded space',
    impact: 35
  },
  {
    id: 'texture',
    type: 'sensory',
    description: 'Uncomfortable fabric touching skin',
    impact: 15
  },
  {
    id: 'pressure',
    type: 'social',
    description: 'Being put on the spot socially',
    impact: 40
  }
];

export default function MeltdownSimulator() {
  const { safetyState } = useSafety();
  const { updateProgress } = useModuleProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [phase, setPhase] = useState<'intro' | 'building' | 'peak' | 'recovery' | 'reflection'>('intro');
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    overwhelm: 0,
    anxiety: 0,
    frustration: 0,
    exhaustion: 0
  });
  const [activeTriggers, setActiveTriggers] = useState<MeltdownTrigger[]>([]);
  const [copingStrategies, setCopingStrategies] = useState<string[]>([]);
  const [timeInPhase, setTimeInPhase] = useState(0);  const [hasExperiencedMeltdown, setHasExperiencedMeltdown] = useState(false);

  useEffect(() => {
    if (safetyState.exitRequested) {
      setPhase('reflection');
      setEmotionalState({
        overwhelm: 0,
        anxiety: 0,
        frustration: 0,
        exhaustion: 0
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeInPhase(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [safetyState.exitRequested, phase]);

  useEffect(() => {
    if (phase === 'building' && timeInPhase > 0 && timeInPhase % 10 === 0) {
      addRandomTrigger();
    }
  }, [timeInPhase, phase]);

  const addRandomTrigger = () => {
    const availableTriggers = MELTDOWN_TRIGGERS.filter(
      trigger => !activeTriggers.find(active => active.id === trigger.id)
    );
    
    if (availableTriggers.length > 0) {
      const randomTrigger = availableTriggers[Math.floor(Math.random() * availableTriggers.length)];
      setActiveTriggers(prev => [...prev, randomTrigger]);
      
      setEmotionalState(prev => ({
        overwhelm: Math.min(100, prev.overwhelm + randomTrigger.impact),
        anxiety: Math.min(100, prev.anxiety + randomTrigger.impact * 0.8),
        frustration: Math.min(100, prev.frustration + randomTrigger.impact * 0.6),
        exhaustion: Math.min(100, prev.exhaustion + randomTrigger.impact * 0.4)
      }));
    }
  };

  const startExperience = () => {
    setPhase('building');
    setTimeInPhase(0);
    updateProgress('meltdown-simulator', { 
      currentStep: 1,
      totalSteps: 4,
      completedSteps: [1],
      empathyScore: 0,
      timeSpent: 0,
      isCompleted: false
    });
  };

  const trycopingStrategy = (strategy: string) => {
    if (copingStrategies.includes(strategy)) return;
    
    setCopingStrategies(prev => [...prev, strategy]);
    
    const effectiveness = Math.random() * 0.3 + 0.1; // 10-40% reduction
    setEmotionalState(prev => ({
      overwhelm: Math.max(0, prev.overwhelm - prev.overwhelm * effectiveness),
      anxiety: Math.max(0, prev.anxiety - prev.anxiety * effectiveness),
      frustration: Math.max(0, prev.frustration - prev.frustration * effectiveness),
      exhaustion: prev.exhaustion // Exhaustion doesn't reduce easily
    }));

    if (emotionalState.overwhelm > 80 && !hasExperiencedMeltdown) {
      setPhase('peak');
      setHasExperiencedMeltdown(true);
    }
  };

  const enterRecovery = () => {
    setPhase('recovery');
    setTimeInPhase(0);
    
    // Gradual recovery
    const recoveryInterval = setInterval(() => {
      setEmotionalState(prev => ({
        overwhelm: Math.max(0, prev.overwhelm - 5),
        anxiety: Math.max(0, prev.anxiety - 3),
        frustration: Math.max(0, prev.frustration - 4),
        exhaustion: Math.min(100, prev.exhaustion + 2) // Exhaustion increases during recovery
      }));
    }, 2000);

    setTimeout(() => {
      clearInterval(recoveryInterval);
      setPhase('reflection');      updateProgress('meltdown-simulator', { 
        currentStep: 4,
        totalSteps: 4,
        completedSteps: [1, 2, 3, 4],
        empathyScore: Math.min(100, copingStrategies.length * 10 + activeTriggers.length * 5),
        timeSpent: timeInPhase,
        isCompleted: true
      });
    }, 20000);
  };

  const COPING_STRATEGIES = [
    'Deep breathing exercises',
    'Remove from stimulating environment',
    'Use noise-canceling headphones',
    'Apply pressure (weighted blanket/hug)',
    'Engage in repetitive movement',
    'Use familiar comfort object',
    'Communicate needs clearly',
    'Take a break from demands'
  ];

  if (phase === 'reflection') {
    return (      <SimpleReflection
        questions={[
          'How did it feel when triggers started accumulating?',
          'Which coping strategies felt most helpful?',
          'What surprised you about the recovery process?',
          'How might you support someone experiencing this?'
        ]}
        insights={[
          `You experienced ${activeTriggers.length} different triggers`,
          `You tried ${copingStrategies.length} coping strategies`,
          'Meltdowns are neurological responses, not behavioral choices',
          'Recovery takes time and energy, often leading to exhaustion'
        ]}
        onComplete={() => setPhase('intro')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: safetyState.intensityLimit < 5 ? 0.3 : 1 }}
      />
      
      <SafetyControls />
      
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {phase === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl font-bold text-purple-900">
              Meltdown Simulator
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Experience the overwhelming cascade of stimuli that can lead to an autistic meltdown. 
              Learn about triggers, responses, and recovery in a safe, controlled environment.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
              <p className="font-semibold">Important:</p>
              <p>This simulation demonstrates the involuntary nature of meltdowns. 
              Remember you can stop anytime using the safety controls.</p>
            </div>
            
            <button
              onClick={startExperience}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Begin Experience
            </button>
          </motion.div>
        )}

        {(phase === 'building' || phase === 'peak') && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-2">
                {phase === 'building' ? 'Triggers Accumulating' : 'Meltdown Peak'}
              </h2>
              <p className="text-gray-600">
                {phase === 'building' 
                  ? 'Feel the stress building as triggers accumulate...' 
                  : 'Experiencing overwhelming sensory and emotional overload'}
              </p>
            </div>

            {/* Emotional State Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(emotionalState).map(([emotion, level]) => (
                <div key={emotion} className="bg-white rounded-lg p-4 shadow-lg">
                  <div className="text-sm font-semibold text-gray-600 capitalize mb-2">
                    {emotion}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        emotion === 'overwhelm' ? 'bg-red-500' :
                        emotion === 'anxiety' ? 'bg-yellow-500' :
                        emotion === 'frustration' ? 'bg-orange-500' :
                        'bg-purple-500'
                      }`}
                      style={{ width: `${level}%` }}
                    />
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {Math.round(level)}%
                  </div>
                </div>
              ))}
            </div>

            {/* Active Triggers */}
            {activeTriggers.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-3">Active Triggers:</h3>
                <div className="space-y-2">
                  {activeTriggers.map((trigger) => (
                    <motion.div
                      key={trigger.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between bg-red-100 rounded p-2"
                    >
                      <span className="text-red-800">{trigger.description}</span>
                      <span className="text-sm font-semibold text-red-600">
                        +{trigger.impact}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Coping Strategies */}
            {phase === 'building' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">Try Coping Strategies:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {COPING_STRATEGIES.map((strategy) => (
                    <button
                      key={strategy}
                      onClick={() => trycopingStrategy(strategy)}
                      disabled={copingStrategies.includes(strategy)}
                      className={`p-2 rounded text-left transition-colors ${
                        copingStrategies.includes(strategy)
                          ? 'bg-green-200 text-green-800 cursor-not-allowed'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                      }`}
                    >
                      {strategy}
                      {copingStrategies.includes(strategy) && ' ✓'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {phase === 'peak' && (
              <div className="text-center space-y-4">
                <div className="bg-red-100 border border-red-300 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-red-800 mb-2">
                    Meltdown in Progress
                  </h3>
                  <p className="text-red-700">
                    This is an involuntary neurological response to overwhelming stimuli. 
                    The goal now is safety and gradual recovery.
                  </p>
                </div>
                
                <button
                  onClick={enterRecovery}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Move to Safe Recovery Space
                </button>
              </div>
            )}
          </div>
        )}

        {phase === 'recovery' && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-green-800">
              Recovery Phase
            </h2>
            <p className="text-gray-600">
              Taking time to regulate and recover. This process cannot be rushed.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 mb-3">Recovery in Progress</h3>
              <p className="text-green-700">
                Energy is being restored slowly. Exhaustion is normal after a meltdown.
                Creating a calm, predictable environment supports recovery.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(emotionalState).map(([emotion, level]) => (
                <div key={emotion} className="bg-white rounded-lg p-4 shadow-lg">
                  <div className="text-sm font-semibold text-gray-600 capitalize mb-2">
                    {emotion}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all duration-2000 ${
                        emotion === 'overwhelm' ? 'bg-red-500' :
                        emotion === 'anxiety' ? 'bg-yellow-500' :
                        emotion === 'frustration' ? 'bg-orange-500' :
                        'bg-purple-500'
                      }`}
                      style={{ width: `${level}%` }}
                    />
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {Math.round(level)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
