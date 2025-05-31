import React, { useState, useEffect, useRef, useCallback } from 'react';
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

interface Task {
  id: string;
  type: 'memory' | 'attention' | 'processing' | 'switching';
  instruction: string;
  stimuli: any[];
  correctAnswer?: any;
  timeLimit: number;
}

interface CognitiveLoadProps {
  onComplete: () => void;
  onExit: () => void;
}

const CognitiveLoad: React.FC<CognitiveLoadProps> = ({ onComplete, onExit }) => {
  const [phase, setPhase] = useState<'intro' | 'tasks' | 'reflection'>('intro');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [cognitiveLoad, setCognitiveLoad] = useState(0.3);
  const [isTaskActive, setIsTaskActive] = useState(false);
  const [tasks] = useState<Task[]>(generateTasks());
  const [responses, setResponses] = useState<any[]>([]);
  const [distractions, setDistractions] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  
  const { updateStressLevel, safetyState } = useSafety();
  const { preferences } = useUserPreferences();
  const { updateProgress } = useModuleProgress();
  
  const {
    initializeAudio,
    createSoundscape,
    updateStressLevel: updateAudioStress,
    setMasterVolume,
    startAllLayers,
    stopAllLayers
  } = useAudioEngine();
  
  const {
    canvasRef,
    initializeVisual,
    createVisualEffects,
    updateStressLevel: updateVisualStress,
    start: startVisual,
    stop: stopVisual
  } = useVisualEngine();
  const taskStartTime = useRef(Date.now());
  const distractionInterval = useRef<NodeJS.Timeout | null>(null);
  const taskTimer = useRef<NodeJS.Timeout | null>(null);

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
    updateStressLevel(cognitiveLoad);
    updateAudioStress(cognitiveLoad);
    updateVisualStress(cognitiveLoad);
  }, [cognitiveLoad, updateStressLevel, updateAudioStress, updateVisualStress]);
  // Distraction generator
  useEffect(() => {
    if (!isTaskActive || safetyState.pauseRequested) return;

    distractionInterval.current = setInterval(() => {
      addDistraction();
    }, 2000 - (cognitiveLoad * 1500)); // More frequent distractions as load increases

    return () => {
      if (distractionInterval.current) {
        clearInterval(distractionInterval.current);
      }
    };
  }, [isTaskActive, safetyState.pauseRequested, cognitiveLoad]);

  const addDistraction = useCallback(() => {
    const distractionTypes = [
      "Email notification",
      "Phone buzzing",
      "Someone calling your name",
      "Sudden noise",
      "Movement in peripheral vision",
      "Urgent reminder",
      "Background conversation",
      "Temperature change"
    ];
    
    const newDistraction = distractionTypes[Math.floor(Math.random() * distractionTypes.length)];
    setDistractions(prev => [...prev.slice(-2), newDistraction]); // Keep last 3
    
    // Increase cognitive load with distractions
    setCognitiveLoad(prev => Math.min(0.9, prev + 0.05));
  }, []);

  const startExperience = async () => {
    setMasterVolume(preferences.audioVolume * 0.01);
    createSoundscape(AudioEngine.getCognitiveLoadConfig());
    createVisualEffects(VisualEngine.getCognitiveLoadConfig());
    
    setPhase('tasks');
    setIsTaskActive(true);
    startAllLayers();
    startVisual();
    startTask(0);
  };

  const startTask = (taskIndex: number) => {
    if (taskIndex >= tasks.length) {
      completeExperience();
      return;
    }

    const task = tasks[taskIndex];
    setCurrentTaskIndex(taskIndex);
    setTimeRemaining(task.timeLimit);
    setCurrentAnswer(null);
    taskStartTime.current = Date.now();
    
    // Increase cognitive load based on task complexity
    const baseLoad = 0.3 + (taskIndex * 0.1);
    setCognitiveLoad(baseLoad);

    // Start task timer
    taskTimer.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTaskTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTaskResponse = (answer: any) => {
    if (!isTaskActive) return;
    
    const task = tasks[currentTaskIndex];
    const responseTime = Date.now() - taskStartTime.current;
    const isCorrect = JSON.stringify(answer) === JSON.stringify(task.correctAnswer);
    
    const response = {
      taskId: task.id,
      taskType: task.type,
      answer,
      correctAnswer: task.correctAnswer,
      isCorrect,
      responseTime,
      cognitiveLoadAtResponse: cognitiveLoad,
      distractionsCount: distractions.length
    };
    
    setResponses(prev => [...prev, response]);
    setCurrentAnswer(answer);
    
    // Clear task timer
    if (taskTimer.current) {
      clearInterval(taskTimer.current);
    }
    
    // Brief pause before next task
    setTimeout(() => {
      startTask(currentTaskIndex + 1);
    }, 2000);
  };

  const handleTaskTimeout = () => {
    handleTaskResponse(null); // No answer given
  };

  const handleEmergencyExit = () => {
    setIsTaskActive(false);
    stopAllLayers();
    stopVisual();
    if (taskTimer.current) clearInterval(taskTimer.current);
    if (distractionInterval.current) clearInterval(distractionInterval.current);
    onExit();
  };

  const completeExperience = () => {
    setIsTaskActive(false);
    stopAllLayers();
    stopVisual();
    if (taskTimer.current) clearInterval(taskTimer.current);
    if (distractionInterval.current) clearInterval(distractionInterval.current);
      setPhase('reflection');
    
    // Calculate performance metrics
    const correctResponses = responses.filter(r => r.isCorrect).length;updateProgress('cognitive-load', {
      isCompleted: true,
      empathyScore: correctResponses / tasks.length * 100,
      timeSpent: Date.now() - taskStartTime.current,
      currentStep: tasks.length,
      totalSteps: tasks.length,
      completedSteps: Array.from({ length: tasks.length }, (_, i) => i)
    });
  };  const handleReflectionComplete = () => {
    updateProgress('cognitive-load', {
      isCompleted: true,
      empathyScore: responses.filter(r => r.isCorrect).length / tasks.length * 100,
      timeSpent: Date.now() - taskStartTime.current,
      currentStep: tasks.length,
      totalSteps: tasks.length,
      completedSteps: Array.from({ length: tasks.length }, (_, i) => i)
    });
    onComplete();
  };
  if (phase === 'reflection') {
    return (
      <SimpleReflection
        questions={[
          "How did it feel to manage multiple tasks while being distracted?",
          "At what point did you feel most overwhelmed?",
          "How did the distractions affect your ability to focus?",
          "What strategies might help manage cognitive overload in daily life?"
        ]}
        insights={[
          "Cognitive overload happens when our mental processing capacity is exceeded",
          "Distractions compound the difficulty of complex tasks",
          "Breaking tasks into smaller parts can help manage cognitive load"
        ]}
        onComplete={handleReflectionComplete}
      />
    );
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <SafetyControls className="z-50" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-2xl"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Cognitive Load Experience
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Experience what it's like when your mental processing capacity becomes overwhelmed. 
            You'll face multiple cognitive tasks while managing increasing distractions and 
            environmental stressors.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-purple-800">
              🧠 You'll need to complete memory, attention, and processing tasks while 
              dealing with interruptions and environmental overload. Notice how your 
              performance changes as cognitive load increases.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startExperience}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Begin Cognitive Challenge
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const currentTask = tasks[currentTaskIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Visual Effects Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />
      
      <SafetyControls className="z-50" />
      
      {/* Cognitive load overlay */}
      <div 
        className="absolute inset-0 bg-red-900 pointer-events-none transition-opacity duration-300"
        style={{ 
          opacity: cognitiveLoad * 0.3,
          zIndex: 2
        }}
      />
      
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header with stats */}
        <div className="p-4 bg-black/50 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div>
                <span className="text-sm text-gray-300">Task</span>
                <div className="text-lg font-bold">{currentTaskIndex + 1}/{tasks.length}</div>
              </div>
              <div>
                <span className="text-sm text-gray-300">Time</span>
                <div className={`text-lg font-bold ${timeRemaining <= 5 ? 'text-red-400' : 'text-white'}`}>
                  {timeRemaining}s
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-300">Cognitive Load</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-600 rounded-full">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        cognitiveLoad < 0.4 ? 'bg-green-500' :
                        cognitiveLoad < 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${cognitiveLoad * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{Math.round(cognitiveLoad * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Distractions sidebar */}
        <div className="absolute right-4 top-20 w-64 z-20">
          <div className="bg-red-900/80 backdrop-blur-sm rounded-lg p-3">
            <h4 className="text-sm font-semibold mb-2 text-red-200">Active Distractions</h4>
            <AnimatePresence>
              {distractions.map((distraction, index) => (
                <motion.div
                  key={`${distraction}-${index}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-xs text-red-100 bg-red-800/50 rounded px-2 py-1 mb-1"
                >
                  ⚠️ {distraction}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Main task area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTaskIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl w-full"
            >
              <TaskRenderer
                task={currentTask}
                onResponse={handleTaskResponse}
                cognitiveLoad={cognitiveLoad}
                currentAnswer={currentAnswer}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Task renderer component
const TaskRenderer: React.FC<{
  task: Task;
  onResponse: (answer: any) => void;
  cognitiveLoad: number;
  currentAnswer: any;
}> = ({ task, onResponse, cognitiveLoad, currentAnswer }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<any[]>([]);

  const handleSelect = (answer: any) => {
    if (currentAnswer !== null) return;
    
    if (task.type === 'memory' && Array.isArray(task.correctAnswer)) {
      // Multiple selection for memory tasks
      const newSelected = selectedAnswers.includes(answer)
        ? selectedAnswers.filter(a => a !== answer)
        : [...selectedAnswers, answer];
      setSelectedAnswers(newSelected);
    } else {
      onResponse(answer);
    }
  };

  const submitMemoryAnswer = () => {
    onResponse(selectedAnswers.sort());
  };

  // Add visual distortion based on cognitive load
  const distortionStyle = {
    filter: `blur(${cognitiveLoad * 2}px) contrast(${1 + cognitiveLoad * 0.5})`,
    transform: `scale(${1 + cognitiveLoad * 0.1})`
  };

  return (
    <div style={distortionStyle}>
      <h2 className="text-xl font-bold mb-4">{task.instruction}</h2>
      
      {task.type === 'memory' && (
        <MemoryTask 
          task={task} 
          onSelect={handleSelect} 
          selectedAnswers={selectedAnswers}
          onSubmit={submitMemoryAnswer}
          disabled={currentAnswer !== null}
        />
      )}
      
      {task.type === 'attention' && (
        <AttentionTask 
          task={task} 
          onResponse={onResponse} 
          disabled={currentAnswer !== null}
        />
      )}
      
      {task.type === 'processing' && (
        <ProcessingTask 
          task={task} 
          onResponse={onResponse} 
          disabled={currentAnswer !== null}
        />
      )}
      
      {task.type === 'switching' && (
        <SwitchingTask 
          task={task} 
          onResponse={onResponse} 
          disabled={currentAnswer !== null}
        />
      )}
    </div>
  );
};

// Individual task components would be implemented here...
// For brevity, I'll create simplified versions

const MemoryTask: React.FC<any> = ({ task, onSelect, selectedAnswers, onSubmit, disabled }) => (
  <div>
    <p className="mb-4">Remember this sequence, then select the items that were shown:</p>
    <div className="grid grid-cols-4 gap-2 mb-4">
      {task.stimuli.map((item: any, index: number) => (
        <button
          key={index}
          onClick={() => onSelect(item)}
          disabled={disabled}
          className={`p-3 rounded border-2 transition-colors ${
            selectedAnswers.includes(item)
              ? 'border-blue-400 bg-blue-500/50'
              : 'border-gray-400 bg-gray-600/50 hover:bg-gray-500/50'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
    {selectedAnswers.length > 0 && !disabled && (
      <button
        onClick={onSubmit}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
      >
        Submit Answer
      </button>
    )}
  </div>
);

const AttentionTask: React.FC<any> = ({ task, onResponse, disabled }) => (
  <div>
    <p className="mb-4">{task.instruction}</p>
    <div className="grid grid-cols-3 gap-4">
      {task.stimuli.map((option: any, index: number) => (
        <button
          key={index}
          onClick={() => onResponse(option)}
          disabled={disabled}
          className="p-4 bg-gray-600/50 hover:bg-gray-500/50 rounded border-2 border-gray-400 transition-colors"
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const ProcessingTask: React.FC<any> = ({ task, onResponse, disabled }) => (
  <div>
    <p className="mb-4">{task.instruction}</p>
    <div className="flex justify-center space-x-4">
      {task.stimuli.map((option: any, index: number) => (
        <button
          key={index}
          onClick={() => onResponse(option)}
          disabled={disabled}
          className="px-6 py-3 bg-purple-600/50 hover:bg-purple-500/50 rounded border-2 border-purple-400 transition-colors"
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const SwitchingTask: React.FC<any> = ({ task, onResponse, disabled }) => (
  <div>
    <p className="mb-4">{task.instruction}</p>
    <div className="grid grid-cols-2 gap-4">
      {task.stimuli.map((option: any, index: number) => (
        <button
          key={index}
          onClick={() => onResponse(option)}
          disabled={disabled}
          className="p-4 bg-orange-600/50 hover:bg-orange-500/50 rounded border-2 border-orange-400 transition-colors"
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

// Task generation function
function generateTasks(): Task[] {
  return [
    {
      id: 'memory-1',
      type: 'memory',
      instruction: 'Memorize this sequence of numbers, then select them in order:',
      stimuli: [3, 7, 1, 9, 2, 8, 4, 6, 5],
      correctAnswer: [3, 7, 1, 9],
      timeLimit: 15
    },
    {
      id: 'attention-1',
      type: 'attention',
      instruction: 'Find the red triangle among these shapes:',
      stimuli: ['🔴🔺', '🔵⭕', '🟢⬜'],
      correctAnswer: '🔴🔺',
      timeLimit: 10
    },
    {
      id: 'processing-1',
      type: 'processing',
      instruction: 'What is 17 + 25 - 8?',
      stimuli: [32, 34, 36, 38],
      correctAnswer: 34,
      timeLimit: 12
    },
    {
      id: 'switching-1',
      type: 'switching',
      instruction: 'If the previous task was about numbers, click "Math". If it was about shapes, click "Visual":',
      stimuli: ['Math', 'Visual'],
      correctAnswer: 'Math',
      timeLimit: 8
    }
  ];
}

export default CognitiveLoad;
