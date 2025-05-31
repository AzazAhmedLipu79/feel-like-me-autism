import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSafety } from '../../contexts/SafetyContext';
import { useModuleProgress } from '../../contexts/ModuleProgressContext';
import { SafetyControls } from '../common/SafetyControls';
import { SimpleReflection } from '../common/SimpleReflection';

interface FocusTask {
  id: string;
  title: string;
  type: 'reading' | 'puzzle' | 'creative' | 'learning';
  description: string;
  estimatedDuration: number;
  complexity: 'low' | 'medium' | 'high';
}

interface Distraction {
  id: string;
  type: 'notification' | 'noise' | 'visual' | 'social';
  description: string;
  severity: number;
  duration: number;
}

interface HyperfocusSession {
  taskId: string;
  timeSpent: number;
  distractionsEncountered: number;
  transitionsAttempted: number;
  focusDepth: number;
  transitionDifficulty: number;
}

const FOCUS_TASKS: FocusTask[] = [
  {
    id: 'coding-puzzle',
    title: 'Coding Challenge',
    type: 'puzzle',
    description: 'Solve complex algorithmic problems',
    estimatedDuration: 120,
    complexity: 'high'
  },
  {
    id: 'research-deep-dive',
    title: 'Research Project',
    type: 'learning',
    description: 'Deep dive into a fascinating topic',
    estimatedDuration: 180,
    complexity: 'medium'
  },
  {
    id: 'creative-writing',
    title: 'Creative Writing',
    type: 'creative',
    description: 'Write an engaging story or article',
    estimatedDuration: 90,
    complexity: 'medium'
  },
  {
    id: 'technical-reading',
    title: 'Technical Documentation',
    type: 'reading',
    description: 'Study complex technical material',
    estimatedDuration: 150,
    complexity: 'high'
  },
  {
    id: 'art-project',
    title: 'Digital Art Creation',
    type: 'creative',
    description: 'Create detailed digital artwork',
    estimatedDuration: 240,
    complexity: 'low'
  }
];

const DISTRACTIONS: Distraction[] = [
  {
    id: 'phone-notification',
    type: 'notification',
    description: 'Phone buzzes with notification',
    severity: 30,
    duration: 5
  },
  {
    id: 'email-ping',
    type: 'notification',
    description: 'Email notification sound',
    severity: 20,
    duration: 3
  },
  {
    id: 'loud-conversation',
    type: 'noise',
    description: 'Loud conversation nearby',
    severity: 40,
    duration: 15
  },
  {
    id: 'meeting-reminder',
    type: 'social',
    description: 'Someone reminds you of a meeting',
    severity: 60,
    duration: 30
  },
  {
    id: 'emergency-call',
    type: 'social',
    description: 'Important phone call',
    severity: 80,
    duration: 45
  }
];

export default function HyperfocusChallenge() {
  const { safetyState } = useSafety();
  const { updateProgress } = useModuleProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [phase, setPhase] = useState<'intro' | 'task-selection' | 'hyperfocus' | 'transition' | 'reflection'>('intro');
  const [selectedTask, setSelectedTask] = useState<FocusTask | null>(null);
  const [sessionData, setSessionData] = useState<HyperfocusSession>({
    taskId: '',
    timeSpent: 0,
    distractionsEncountered: 0,
    transitionsAttempted: 0,
    focusDepth: 0,
    transitionDifficulty: 0
  });
  const [focusLevel, setFocusLevel] = useState(20);
  const [timeInTask, setTimeInTask] = useState(0);
  const [currentDistraction, setCurrentDistraction] = useState<Distraction | null>(null);  const [transitionPrompts, setTransitionPrompts] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (safetyState.exitRequested) {
      setPhase('reflection');
      return;
    }

    if (phase === 'hyperfocus' && selectedTask) {
      const timer = setInterval(() => {
        setTimeInTask(prev => prev + 1);
        
        // Increase focus depth over time
        setFocusLevel(prev => Math.min(100, prev + 0.5));
        
        setSessionData(prev => ({
          ...prev,
          timeSpent: prev.timeSpent + 1,
          focusDepth: Math.max(prev.focusDepth, focusLevel)
        }));
        
        // Random distractions
        if (Math.random() < 0.003) { // ~3% chance per second
          introduceDistraction();
        }
        
        // Transition prompts every 20-30 minutes
        if (timeInTask > 0 && timeInTask % (20 * 60 + Math.random() * 10 * 60) < 1) {
          promptTransition();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [phase, selectedTask, focusLevel, timeInTask, safetyState.exitRequested]);

  const startExperience = () => {
    setPhase('task-selection');
    updateProgress('hyperfocus-challenge', { 
      currentStep: 1,
      totalSteps: 4,
      completedSteps: [1],
      empathyScore: 0,
      timeSpent: 0,
      isCompleted: false
    });
  };

  const selectTask = (task: FocusTask) => {
    setSelectedTask(task);
    setSessionData(prev => ({
      ...prev,
      taskId: task.id
    }));
    setPhase('hyperfocus');
    setTimeInTask(0);
    setFocusLevel(20);
  };

  const introduceDistraction = () => {
    const distraction = DISTRACTIONS[Math.floor(Math.random() * DISTRACTIONS.length)];
    setCurrentDistraction(distraction);
    
    setSessionData(prev => ({
      ...prev,
      distractionsEncountered: prev.distractionsEncountered + 1
    }));
    
    // Reduce focus based on distraction severity
    setFocusLevel(prev => Math.max(10, prev - distraction.severity / 2));
    
    setTimeout(() => {
      setCurrentDistraction(null);
    }, distraction.duration * 1000);
  };

  const promptTransition = () => {
    setTransitionPrompts(prev => prev + 1);
    
    // Show transition difficulty
    setTimeout(() => {
      if (transitionPrompts > 2) {
        setIsTransitioning(true);
      }
    }, 5000);
  };

  const attemptTransition = () => {
    setSessionData(prev => ({
      ...prev,
      transitionsAttempted: prev.transitionsAttempted + 1,
      transitionDifficulty: Math.max(prev.transitionDifficulty, focusLevel)
    }));
    
    if (focusLevel > 80) {
      // High focus makes transition very difficult
      alert('It\'s really hard to stop when you\'re this focused! This is hyperfocus.');
      setFocusLevel(prev => prev - 10); // Slight reduction but still high
    } else if (focusLevel > 60) {
      // Medium difficulty
      setPhase('transition');
    } else {
      // Easier transition
      setPhase('reflection');      updateProgress('hyperfocus-challenge', {
        currentStep: 4,
        totalSteps: 4,
        completedSteps: [1, 2, 3, 4],
        empathyScore: Math.min(100, sessionData.focusDepth * 10 + sessionData.timeSpent / 10),
        timeSpent: sessionData.timeSpent,
        isCompleted: true
      });
    }
  };

  const forceTransition = () => {
    setPhase('transition');
    setIsTransitioning(true);
    
    // Simulate the difficulty and aftermath of forced transition
    setTimeout(() => {
      setPhase('reflection');      updateProgress('hyperfocus-challenge', {
        currentStep: 4,
        totalSteps: 4,
        completedSteps: [1, 2, 3, 4],
        empathyScore: Math.max(0, Math.min(100, sessionData.focusDepth * 8 + sessionData.timeSpent / 10 - 20)), // Penalty for forced transition
        timeSpent: sessionData.timeSpent,
        isCompleted: true
      });
    }, 8000);
  };

  if (phase === 'reflection') {
    return (      <SimpleReflection
        questions={[
          'How did it feel when you were deeply focused?',
          'What was it like when distractions occurred?',
          'How difficult was it to transition away from the task?',
          'What strategies might help with managing hyperfocus?'
        ]}
        insights={[
          `You focused for ${Math.round(sessionData.timeSpent / 60)} minutes`,
          `Maximum focus depth: ${Math.round(sessionData.focusDepth)}%`,
          `Distractions encountered: ${sessionData.distractionsEncountered}`,
          'Hyperfocus can be both a strength and a challenge to manage'
        ]}
        onComplete={() => setPhase('intro')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 relative overflow-hidden">
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
            <h1 className="text-4xl font-bold text-indigo-900">
              Hyperfocus Challenge
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Experience the intense concentration of hyperfocus - both its benefits and 
              the challenges of transitioning away from deeply engaging tasks. 
              Understand this unique aspect of autistic cognition.
            </p>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-purple-800">
              <p className="font-semibold">About Hyperfocus:</p>
              <p>Hyperfocus is intense concentration on preferred tasks. While it can lead 
              to extraordinary productivity and deep learning, it can also make transitions 
              and time awareness challenging.</p>
            </div>
            
            <button
              onClick={startExperience}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Enter Hyperfocus
            </button>
          </motion.div>
        )}

        {phase === 'task-selection' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-indigo-900 mb-2">
                Choose Your Focus Task
              </h2>
              <p className="text-gray-600">
                Select a task that interests you. Notice how your focus deepens over time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FOCUS_TASKS.map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectTask(task)}
                  className="bg-white rounded-lg p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800 text-lg">{task.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.complexity === 'high' ? 'bg-red-100 text-red-800' :
                      task.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.complexity}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{task.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="capitalize">{task.type}</span>
                    <span>~{task.estimatedDuration}min</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {phase === 'hyperfocus' && selectedTask && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-indigo-900 mb-2">
                Deep Focus: {selectedTask.title}
              </h2>
              <p className="text-gray-600">{selectedTask.description}</p>
            </div>

            {/* Focus Visualization */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Focus Intensity</h3>
                <div className="w-full bg-gray-200 rounded-full h-8 mt-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-8 rounded-full flex items-center justify-center text-white font-bold"
                    animate={{ width: `${focusLevel}%` }}
                    transition={{ duration: 0.5 }}
                  >
                    {Math.round(focusLevel)}%
                  </motion.div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {Math.floor(timeInTask / 60)}:{(timeInTask % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">Time Focused</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {sessionData.distractionsEncountered}
                  </div>
                  <div className="text-sm text-gray-600">Distractions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-600">
                    {transitionPrompts}
                  </div>
                  <div className="text-sm text-gray-600">Transition Prompts</div>
                </div>
              </div>
            </div>

            {/* Current Distraction */}
            {currentDistraction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-red-50 border-2 border-red-300 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-red-800">Distraction!</h4>
                    <p className="text-red-700">{currentDistraction.description}</p>
                  </div>
                  <div className="text-red-600 font-bold">
                    -{currentDistraction.severity}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Transition Prompts */}
            {transitionPrompts > 0 && !isTransitioning && (
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-amber-800">
                      Time to transition? ({transitionPrompts} reminder{transitionPrompts > 1 ? 's' : ''})
                    </h4>
                    <p className="text-amber-700">
                      You've been focused for a while. Maybe it's time for a break?
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={attemptTransition}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded"
                    >
                      Try to Stop
                    </button>
                    <button
                      onClick={() => setTransitionPrompts(0)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    >
                      Keep Going
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency transition */}
            <div className="text-center">
              <button
                onClick={forceTransition}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Force Transition (Emergency)
              </button>
            </div>
          </div>
        )}

        {phase === 'transition' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <h2 className="text-2xl font-bold text-red-700">
              Transition Difficulty
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-red-800 mb-4">
                Breaking away from hyperfocus can be jarring and disorienting. 
                You might feel frustrated, anxious, or struggle to switch mental gears.
              </p>
              <div className="space-y-2 text-left">
                <p>• Mental fatigue from the transition</p>
                <p>• Difficulty shifting attention</p>
                <p>• Emotional resistance to stopping</p>
                <p>• Need time to process the change</p>
              </div>
            </div>
            
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-600"
            >
              Processing transition...
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
