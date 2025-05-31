# 🏗️ React Component Architecture & Implementation Guide

## 📦 1. Core Component Library

### 🎛️ Common UI Components

```typescript
// src/components/common/SafetyControls/SafetyControls.tsx
interface SafetyControlsProps {
  onPause: () => void;
  onStop: () => void;
  onExit: () => void;
  intensity: number;
  showIntensityWarning: boolean;
}

export const SafetyControls: React.FC<SafetyControlsProps> = ({
  onPause, onStop, onExit, intensity, showIntensityWarning
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={onExit}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
        aria-label="Exit simulation immediately"
      >
        🚨 EXIT NOW
      </button>
      <button
        onClick={onPause}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
        aria-label="Pause simulation"
      >
        ⏸️ PAUSE
      </button>
      {showIntensityWarning && (
        <div className="bg-orange-100 border-l-4 border-orange-500 p-3 rounded">
          <p className="text-orange-700 text-sm">High intensity detected</p>
        </div>
      )}
    </div>
  );
};

// src/components/common/EmpathyScore/EmpathyScore.tsx
interface EmpathyScoreProps {
  score: number;
  maxScore: number;
  showDetails: boolean;
  onShowDetails: () => void;
}

export const EmpathyScore: React.FC<EmpathyScoreProps> = ({
  score, maxScore, showDetails, onShowDetails
}) => {
  const percentage = (score / maxScore) * 100;
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Your Empathy Journey</h3>
      <div className="relative w-full h-4 bg-gray-200 rounded-full mb-4">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-gray-700">{score}/{maxScore}</span>
        <button
          onClick={onShowDetails}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          View Insights
        </button>
      </div>
    </div>
  );
};

// src/components/common/ReflectionPrompt/ReflectionPrompt.tsx
interface ReflectionPromptProps {
  question: string;
  onSubmit: (response: string, emotion: string) => void;
  isVisible: boolean;
}

export const ReflectionPrompt: React.FC<ReflectionPromptProps> = ({
  question, onSubmit, isVisible
}) => {
  const [response, setResponse] = useState('');
  const [emotion, setEmotion] = useState('');
  
  const emotions = ['😊', '😔', '😰', '🤔', '😮', '😌'];
  
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">{question}</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">How did this feel?</label>
          <div className="flex gap-2">
            {emotions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setEmotion(emoji)}
                className={`p-2 text-2xl rounded ${
                  emotion === emoji ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Share your thoughts and feelings..."
          className="w-full p-3 border rounded-lg mb-4 h-24 resize-none"
        />
        
        <div className="flex gap-3">
          <button
            onClick={() => onSubmit(response, emotion)}
            disabled={!emotion}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-2 rounded-lg"
          >
            Continue
          </button>
          <button
            onClick={() => onSubmit('', emotion)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Skip
          </button>
        </div>
      </div>
    </motion.div>
  );
};
```

### 🔊 Sensory Overload Module Components

```typescript
// src/components/modules/SensoryOverload/IntensitySlider.tsx
interface IntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
  warningThreshold: number;
  disabled?: boolean;
}

export const IntensitySlider: React.FC<IntensitySliderProps> = ({
  value, onChange, max, warningThreshold, disabled = false
}) => {
  const getColorForValue = (val: number) => {
    if (val < warningThreshold * 0.5) return 'from-green-400 to-green-600';
    if (val < warningThreshold) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <label className="block text-lg font-medium mb-4">
        Intensity Level: {value}/{max}
      </label>
      
      <div className="relative">
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-3 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              #10b981 0%, #10b981 ${(value/max)*33}%, 
              #f59e0b ${(value/max)*33}%, #f59e0b ${(value/max)*66}%, 
              #ef4444 ${(value/max)*66}%, #ef4444 100%)`
          }}
        />
        
        {value >= warningThreshold && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm"
          >
            ⚠️ High intensity - Use caution
          </motion.div>
        )}
      </div>
      
      <div className="flex justify-between text-sm text-gray-500 mt-2">
        <span>Gentle</span>
        <span>Moderate</span>
        <span>Intense</span>
      </div>
    </div>
  );
};

// src/components/modules/SensoryOverload/AudioLayerControls.tsx
interface AudioLayer {
  id: string;
  name: string;
  description: string;
  volume: number;
  isActive: boolean;
  audioUrl: string;
  icon: string;
}

interface AudioLayerControlsProps {
  layers: AudioLayer[];
  onLayerToggle: (id: string) => void;
  onVolumeChange: (id: string, volume: number) => void;
  globalVolume: number;
  onGlobalVolumeChange: (volume: number) => void;
}

export const AudioLayerControls: React.FC<AudioLayerControlsProps> = ({
  layers, onLayerToggle, onVolumeChange, globalVolume, onGlobalVolumeChange
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Audio Layers</h3>
      
      {/* Global Volume */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium mb-2">
          Master Volume: {Math.round(globalVolume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={globalVolume}
          onChange={(e) => onGlobalVolumeChange(Number(e.target.value))}
          className="w-full"
        />
      </div>
      
      {/* Individual Layers */}
      <div className="space-y-4">
        {layers.map((layer) => (
          <motion.div
            key={layer.id}
            layout
            className={`p-4 rounded-lg border-2 transition-colors ${
              layer.isActive 
                ? 'border-blue-300 bg-blue-50' 
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{layer.icon}</span>
                <div>
                  <h4 className="font-medium">{layer.name}</h4>
                  <p className="text-sm text-gray-600">{layer.description}</p>
                </div>
              </div>
              
              <button
                onClick={() => onLayerToggle(layer.id)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  layer.isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {layer.isActive ? 'ON' : 'OFF'}
              </button>
            </div>
            
            {layer.isActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={layer.volume}
                  onChange={(e) => onVolumeChange(layer.id, Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Quiet</span>
                  <span>{Math.round(layer.volume * 100)}%</span>
                  <span>Loud</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// src/components/modules/SensoryOverload/VisualStimuli.tsx
interface VisualStimuliProps {
  intensity: number;
  isActive: boolean;
  config: {
    flickerRate: number;
    movementSpeed: number;
    colorIntensity: number;
    particleCount: number;
  };
}

export const VisualStimuli: React.FC<VisualStimuliProps> = ({
  intensity, isActive, config
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
    }> = [];
    
    // Generate particles based on intensity
    for (let i = 0; i < config.particleCount * intensity; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * config.movementSpeed * intensity,
        vy: (Math.random() - 0.5) * config.movementSpeed * intensity,
        color: `hsl(${Math.random() * 360}, ${config.colorIntensity * intensity}%, 50%)`,
        size: Math.random() * 3 + 1
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Flicker effect
      if (Math.random() < config.flickerRate * intensity) {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * intensity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, intensity, config]);
  
  if (!isActive) return null;
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'overlay' }}
    />
  );
};

// src/components/modules/SensoryOverload/OverloadMeter.tsx
interface OverloadMeterProps {
  currentLevel: number;
  maxLevel: number;
  warningThreshold: number;
  dangerThreshold: number;
}

export const OverloadMeter: React.FC<OverloadMeterProps> = ({
  currentLevel, maxLevel, warningThreshold, dangerThreshold
}) => {
  const percentage = (currentLevel / maxLevel) * 100;
  
  const getMeterColor = () => {
    if (currentLevel < warningThreshold) return 'from-green-400 to-green-600';
    if (currentLevel < dangerThreshold) return 'from-yellow-400 to-orange-500';
    return 'from-red-500 to-red-700';
  };
  
  const getMeterAnimation = () => {
    if (currentLevel >= dangerThreshold) {
      return 'animate-pulse';
    }
    return '';
  };
  
  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-lg p-4 shadow-lg z-30">
      <h4 className="text-sm font-medium mb-2">Sensory Load</h4>
      
      <div className="w-48 h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${getMeterColor()} ${getMeterAnimation()}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Calm</span>
        <span>{Math.round(percentage)}%</span>
        <span>Overload</span>
      </div>
      
      {currentLevel >= dangerThreshold && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-red-600 text-xs font-medium"
        >
          ⚠️ Approaching overload
        </motion.div>
      )}
    </div>
  );
};
```

### 💬 Social Uncertainty Module Components

```typescript
// src/components/modules/SocialUncertainty/ScenarioCard.tsx
interface Scenario {
  id: string;
  title: string;
  context: string;
  description: string;
  imageUrl?: string;
  choices: Choice[];
  autisticPerspective: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface ScenarioCardProps {
  scenario: Scenario;
  onChoiceSelect: (choiceId: string) => void;
  selectedChoice?: string;
  showResult: boolean;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario, onChoiceSelect, selectedChoice, showResult
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{scenario.title}</h2>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            scenario.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            scenario.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {scenario.difficulty.toUpperCase()}
          </span>
        </div>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">{scenario.context}</p>
        </div>
        
        {scenario.imageUrl && (
          <div className="mb-4">
            <img
              src={scenario.imageUrl}
              alt="Social scenario"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
        
        <p className="text-gray-700 mb-6">{scenario.description}</p>
        
        <div className="space-y-3">
          {scenario.choices.map((choice) => (
            <motion.button
              key={choice.id}
              onClick={() => onChoiceSelect(choice.id)}
              disabled={showResult}
              whileHover={{ scale: showResult ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                selectedChoice === choice.id
                  ? showResult
                    ? choice.isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedChoice === choice.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedChoice === choice.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{choice.text}</p>
                  {showResult && selectedChoice === choice.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 p-2 bg-gray-100 rounded text-sm"
                    >
                      {choice.explanation}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// src/components/modules/SocialUncertainty/ConfidenceSlider.tsx
interface ConfidenceSliderProps {
  value: number;
  onChange: (value: number) => void;
  onSubmit: () => void;
  isVisible: boolean;
}

export const ConfidenceSlider: React.FC<ConfidenceSliderProps> = ({
  value, onChange, onSubmit, isVisible
}) => {
  if (!isVisible) return null;
  
  const getConfidenceLabel = (val: number) => {
    if (val < 25) return 'Very Uncertain';
    if (val < 50) return 'Somewhat Uncertain';
    if (val < 75) return 'Somewhat Confident';
    return 'Very Confident';
  };
  
  const getConfidenceColor = (val: number) => {
    if (val < 25) return 'text-red-600';
    if (val < 50) return 'text-orange-600';
    if (val < 75) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-6 bg-gray-50 rounded-lg"
    >
      <h3 className="text-lg font-medium mb-4">How confident were you in your choice?</h3>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Confidence Level</span>
          <span className={`font-medium ${getConfidenceColor(value)}`}>
            {getConfidenceLabel(value)}
          </span>
        </div>
        
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Not at all</span>
          <span>Moderately</span>
          <span>Completely</span>
        </div>
      </div>
      
      <button
        onClick={onSubmit}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium"
      >
        Continue
      </button>
    </motion.div>
  );
};

// src/components/modules/SocialUncertainty/InsightPanel.tsx
interface InsightPanelProps {
  perspective: string;
  isVisible: boolean;
  onContinue: () => void;
}

export const InsightPanel: React.FC<InsightPanelProps> = ({
  perspective, isVisible, onContinue
}) => {
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
    >
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Autistic Perspective</h3>
            <p className="text-sm text-gray-600">Understanding a different viewpoint</p>
          </div>
        </div>
        
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
          <p className="text-purple-800 leading-relaxed">{perspective}</p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={onContinue}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            I understand
          </button>
        </div>
      </div>
    </motion.div>
  );
};
```

## 🔄 2. Custom Hooks for State Management

```typescript
// src/hooks/useAudioEngine.ts
export const useAudioEngine = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioLayers, setAudioLayers] = useState<AudioLayer[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const initializeAudio = useCallback(async () => {
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(context);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }, []);
  
  const playLayeredAudio = useCallback((layers: AudioLayer[]) => {
    if (!audioContext || !isInitialized) return;
    
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    
    layers.forEach(layer => {
      if (layer.isActive && layer.audioBuffer) {
        const source = audioContext.createBufferSource();
        const layerGain = audioContext.createGain();
        
        source.buffer = layer.audioBuffer;
        layerGain.gain.value = layer.volume;
        
        source.connect(layerGain);
        layerGain.connect(gainNode);
        source.loop = true;
        source.start();
        
        // Store reference for cleanup
        layer.sourceNode = source;
      }
    });
    
    setAudioLayers(layers);
  }, [audioContext, isInitialized]);
  
  const stopAllAudio = useCallback(() => {
    audioLayers.forEach(layer => {
      if (layer.sourceNode) {
        layer.sourceNode.stop();
      }
    });
    setAudioLayers([]);
  }, [audioLayers]);
  
  return {
    isInitialized,
    initializeAudio,
    playLayeredAudio,
    stopAllAudio,
    audioLayers
  };
};

// src/hooks/useModuleProgress.ts
export const useModuleProgress = (moduleId: string) => {
  const [progress, setProgress] = useState({
    currentStep: 0,
    totalSteps: 0,
    completedSteps: [],
    empathyScore: 0,
    reflections: []
  });
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimeSpent(Date.now() - startTime);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const nextStep = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.totalSteps),
      completedSteps: [...prev.completedSteps, prev.currentStep]
    }));
  }, []);
  
  const addReflection = useCallback((reflection: string, emotion: string) => {
    setProgress(prev => ({
      ...prev,
      reflections: [...prev.reflections, { reflection, emotion, timestamp: Date.now() }]
    }));
  }, []);
  
  const completeModule = useCallback(() => {
    setIsCompleted(true);
    // Save to localStorage or send to analytics
    const moduleData = {
      moduleId,
      completedAt: Date.now(),
      timeSpent,
      progress,
      empathyScore: progress.empathyScore
    };
    
    localStorage.setItem(`module_${moduleId}`, JSON.stringify(moduleData));
  }, [moduleId, timeSpent, progress]);
  
  return {
    progress,
    isCompleted,
    timeSpent,
    nextStep,
    addReflection,
    completeModule,
    setProgress
  };
};

// src/hooks/useSafetyMonitor.ts
export const useSafetyMonitor = () => {
  const [safetyState, setSafetyState] = useState({
    isActive: true,
    intensityLimit: 7,
    exitRequested: false,
    pauseRequested: false,
    warningShown: false
  });
  
  const [stressLevel, setStressLevel] = useState(0);
  
  const requestExit = useCallback(() => {
    setSafetyState(prev => ({ ...prev, exitRequested: true }));
  }, []);
  
  const requestPause = useCallback(() => {
    setSafetyState(prev => ({ ...prev, pauseRequested: true }));
  }, []);
  
  const resumeFromPause = useCallback(() => {
    setSafetyState(prev => ({ ...prev, pauseRequested: false }));
  }, []);
  
  const updateStressLevel = useCallback((level: number) => {
    setStressLevel(level);
    
    if (level >= safetyState.intensityLimit && !safetyState.warningShown) {
      setSafetyState(prev => ({ ...prev, warningShown: true }));
    }
  }, [safetyState.intensityLimit, safetyState.warningShown]);
  
  // Auto-pause if stress level gets too high
  useEffect(() => {
    if (stressLevel >= 9 && safetyState.isActive) {
      requestPause();
    }
  }, [stressLevel, safetyState.isActive, requestPause]);
  
  return {
    safetyState,
    stressLevel,
    requestExit,
    requestPause,
    resumeFromPause,
    updateStressLevel,
    setSafetyState
  };
};
```

## 🚦 3. Routing & Navigation Structure

```typescript
// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SafetyProvider } from './contexts/SafetyContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';

function App() {
  return (
    <Router>
      <AccessibilityProvider>
        <SafetyProvider>
          <UserPreferencesProvider>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/getting-started" element={<GettingStarted />} />
                <Route path="/persona-selection" element={<PersonaSelection />} />
                <Route path="/modules" element={<ModuleDashboard />} />
                <Route path="/module/:moduleId" element={<ModuleWrapper />} />
                <Route path="/results" element={<ResultsDashboard />} />
                <Route path="/reflection" element={<ReflectionCenter />} />
              </Routes>
            </div>
          </UserPreferencesProvider>
        </SafetyProvider>
      </AccessibilityProvider>
    </Router>
  );
}

// src/components/layout/ModuleWrapper.tsx
export const ModuleWrapper: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { safetyState, requestExit } = useSafetyMonitor();
  const { progress } = useModuleProgress(moduleId!);
  
  const navigate = useNavigate();
  
  const moduleComponents = {
    'sensory-overload': SensoryOverloadModule,
    'social-uncertainty': SocialUncertaintyModule,
    'cognitive-load': CognitiveLoadModule,
    'meltdown-simulator': MeltdownSimulatorModule,
    'stimming-studio': StimmingStudioModule,
    'hyperfocus-challenge': HyperfocusModule
  };
  
  const ModuleComponent = moduleComponents[moduleId as keyof typeof moduleComponents];
  
  useEffect(() => {
    if (safetyState.exitRequested) {
      navigate('/modules');
    }
  }, [safetyState.exitRequested, navigate]);
  
  if (!ModuleComponent) {
    return <div>Module not found</div>;
  }
  
  return (
    <div className="module-wrapper">
      <SafetyOverlay />
      <ProgressHeader progress={progress} />
      <ModuleComponent />
      <SafetyControls onExit={requestExit} />
    </div>
  );
};

// src/pages/ModuleDashboard.tsx
export const ModuleDashboard: React.FC = () => {
  const modules = [
    {
      id: 'sensory-overload',
      title: 'Sensory Overload Simulator',
      description: 'Experience overwhelming sensory input',
      icon: '🔊',
      difficulty: 'Medium',
      duration: '5-10 min',
      completed: false
    },
    {
      id: 'social-uncertainty',
      title: 'Social Uncertainty Navigator',
      description: 'Navigate confusing social situations',
      icon: '💬',
      difficulty: 'Medium',
      duration: '10-15 min',
      completed: false
    },
    // ... other modules
  ];
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Experience Modules
        </h1>
        <p className="text-gray-600">
          Choose your journey into understanding autism
        </p>
      </header>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
    </div>
  );
};
```

This comprehensive React architecture provides:

1. **Modular component structure** - Each simulation has dedicated components
2. **Custom hooks** - For audio, progress tracking, and safety monitoring
3. **Accessibility-first design** - Built-in a11y features
4. **Safety-centered approach** - Always-available exit controls
5. **Responsive design** - Works across devices
6. **Type-safe implementation** - Full TypeScript support
7. **Performance optimized** - Efficient animations and audio handling

The structure allows for easy expansion with new modules while maintaining consistent UX patterns and safety standards throughout the application.
