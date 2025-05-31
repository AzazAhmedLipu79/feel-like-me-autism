import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafety } from '../../contexts/SafetyContext';
import { useModuleProgress } from '../../contexts/ModuleProgressContext';
import { SafetyControls } from '../common/SafetyControls';
import { SimpleReflection } from '../common/SimpleReflection';

interface SocialScenario {
  id: string;
  setting: string;
  situation: string;
  character: {
    name: string;
    expression: string;
    bodyLanguage: string;
  };
  options: {
    text: string;
    confidence: number;
    outcome: 'positive' | 'negative' | 'neutral';
  }[];
  hiddenMeaning?: string;
  socialCues: string[];
}

interface SocialUncertaintyProps {
  onComplete: () => void;
  onExit: () => void;
}

const scenarios: SocialScenario[] = [
  {
    id: 'workplace_greeting',
    setting: 'Office hallway',
    situation: 'A colleague you barely know approaches you in the hallway.',
    character: {
      name: 'Sarah',
      expression: 'slight smile, brief eye contact',
      bodyLanguage: 'walking quickly, checking phone'
    },
    options: [
      { text: 'Say "Good morning!" enthusiastically', confidence: 0.3, outcome: 'negative' },
      { text: 'Nod and say "Hi"', confidence: 0.7, outcome: 'positive' },
      { text: 'Smile but say nothing', confidence: 0.5, outcome: 'neutral' },
      { text: 'Look away and keep walking', confidence: 0.2, outcome: 'negative' }
    ],
    hiddenMeaning: 'Sarah is busy but being polite. A brief acknowledgment is appropriate.',
    socialCues: ['Brief eye contact suggests polite acknowledgment', 'Quick pace indicates she\'s busy', 'Phone checking shows divided attention']
  },
  {
    id: 'group_conversation',
    setting: 'Break room at work',
    situation: 'You join a group conversation about weekend plans. Everyone gets quiet when you arrive.',
    character: {
      name: 'Group of colleagues',
      expression: 'mixed - some welcoming, others uncertain',
      bodyLanguage: 'circle formation, slight body turn toward you'
    },
    options: [
      { text: 'Ask "What are you all talking about?"', confidence: 0.6, outcome: 'positive' },
      { text: 'Share your own weekend plans immediately', confidence: 0.3, outcome: 'negative' },
      { text: 'Wait quietly to see if they include you', confidence: 0.4, outcome: 'neutral' },
      { text: 'Make a joke about being left out', confidence: 0.2, outcome: 'negative' }
    ],
    hiddenMeaning: 'The group is unsure how to include you, but willing to try.',
    socialCues: ['Body language shows openness', 'Quiet moment is uncertainty, not rejection', 'Mixed expressions show varying comfort levels']
  },
  {
    id: 'compliment_response',
    setting: 'Team meeting',
    situation: 'Your manager says "Great job on the presentation" in front of the team.',
    character: {
      name: 'Manager',
      expression: 'professional smile, direct eye contact',
      bodyLanguage: 'leaning forward, engaged posture'
    },
    options: [
      { text: 'Just say "Thank you"', confidence: 0.8, outcome: 'positive' },
      { text: 'List everything you think was wrong with it', confidence: 0.1, outcome: 'negative' },
      { text: 'Thank them and mention team contributions', confidence: 0.9, outcome: 'positive' },
      { text: 'Change the subject quickly', confidence: 0.2, outcome: 'negative' }
    ],
    hiddenMeaning: 'Genuine praise meant to encourage and recognize your work publicly.',
    socialCues: ['Direct eye contact shows sincerity', 'Public setting amplifies the recognition', 'Professional but warm tone']
  }
];

const SocialUncertainty: React.FC<SocialUncertaintyProps> = ({ onComplete, onExit }) => {
  const [phase, setPhase] = useState<'intro' | 'scenario' | 'reflection' | 'results'>('intro');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHiddenMeaning, setShowHiddenMeaning] = useState(false);  const [answers, setAnswers] = useState<any[]>([]);
  const [uncertaintyLevel, setUncertaintyLevel] = useState(0.5);
  
  const { updateStressLevel, safetyState } = useSafety();
  const { updateProgress } = useModuleProgress();
  
  const scenarioStartTime = useRef(Date.now());
  const totalStartTime = useRef(Date.now());
  // Handle emergency exit
  useEffect(() => {
    if (safetyState.exitRequested) {
      onExit();
    }
  }, [safetyState.exitRequested, onExit]);

  // Update stress based on uncertainty
  useEffect(() => {
    updateStressLevel(uncertaintyLevel);
  }, [uncertaintyLevel, updateStressLevel]);
  // Timer for current scenario
  useEffect(() => {
    if (phase !== 'scenario' || safetyState.pauseRequested) return;
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - scenarioStartTime.current;
      
      // Increase uncertainty over time if no answer selected
      if (!selectedOption && elapsed > 5000) {
        const additionalUncertainty = Math.min(0.3, (elapsed - 5000) / 20000);
        setUncertaintyLevel(0.5 + additionalUncertainty);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phase, safetyState.pauseRequested, selectedOption]);

  const currentScenario = scenarios[currentScenarioIndex];

  const startExperience = () => {
    setPhase('scenario');
    totalStartTime.current = Date.now();
    scenarioStartTime.current = Date.now();
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(optionIndex);
    const option = currentScenario.options[optionIndex];
    const responseTime = Date.now() - scenarioStartTime.current;
    
    // Record answer
    const answer = {
      scenarioId: currentScenario.id,
      selectedOption: optionIndex,
      responseTime,
      confidence: option.confidence,
      outcome: option.outcome
    };
    
    setAnswers(prev => [...prev, answer]);
    
    // Update uncertainty based on confidence
    setUncertaintyLevel(1 - option.confidence);
    
    // Show hidden meaning after a delay
    setTimeout(() => {
      setShowHiddenMeaning(true);
    }, 1500);
  };

  const proceedToNext = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      // Next scenario
      setCurrentScenarioIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowHiddenMeaning(false);
      setUncertaintyLevel(0.5);
      scenarioStartTime.current = Date.now();
    } else {
      // Complete experience
      setPhase('reflection');
        // Calculate results
      const totalTime = Date.now() - totalStartTime.current;
      const avgConfidence = answers.reduce((sum, a) => sum + a.confidence, 0) / answers.length;
      
      updateProgress('social-uncertainty', {
        isCompleted: true,
        empathyScore: avgConfidence * 100,
        timeSpent: totalTime,
        currentStep: scenarios.length,
        totalSteps: scenarios.length,
        completedSteps: Array.from({ length: scenarios.length }, (_, i) => i)
      });
    }
  };
  const handleReflectionComplete = () => {
    const totalTime = Date.now() - totalStartTime.current;
    const avgConfidence = answers.reduce((sum, a) => sum + a.confidence, 0) / answers.length;
    
    updateProgress('social-uncertainty', {
      isCompleted: true,
      empathyScore: avgConfidence * 100,
      timeSpent: totalTime,
      currentStep: scenarios.length,
      totalSteps: scenarios.length,
      completedSteps: Array.from({ length: scenarios.length }, (_, i) => i)
    });
    onComplete();
  };
  if (phase === 'reflection') {
    return (
      <SimpleReflection
        questions={[
          "How did it feel when you weren't sure what the 'right' response was?",
          "Which social cues were hardest to interpret?",
          "How might this uncertainty affect daily social interactions?",
          "What strategies could help manage social uncertainty?"
        ]}
        insights={[
          "Social uncertainty is common and affects how we interact with others",
          "Hidden meanings in social interactions can be challenging to decode",
          "Practice and awareness of social cues can help build confidence"
        ]}
        onComplete={handleReflectionComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <SafetyControls className="z-50" />
      
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Social Uncertainty Experience
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                  Navigate ambiguous social situations where the "right" response isn't clear. 
                  Experience the anxiety of uncertain social interactions that many autistic 
                  individuals face daily.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800">
                    💡 You'll face scenarios where social cues are unclear and multiple responses 
                    seem possible. Pay attention to your stress levels as uncertainty builds.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startExperience}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Begin Social Scenarios
                </motion.button>
              </div>
            </motion.div>
          )}
          
          {phase === 'scenario' && (
            <motion.div
              key={currentScenarioIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="py-8"
            >
              {/* Progress indicator */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Scenario {currentScenarioIndex + 1} of {scenarios.length}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Uncertainty Level:</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-orange-500 rounded-full transition-all duration-300"
                        style={{ width: `${uncertaintyLevel * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-orange-600">
                      {Math.round(uncertaintyLevel * 100)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentScenarioIndex + (selectedOption !== null ? 1 : 0)) / scenarios.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Scenario content */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-indigo-600 text-white p-6">
                  <h2 className="text-xl font-semibold mb-2">{currentScenario.setting}</h2>
                  <p className="text-indigo-100">{currentScenario.situation}</p>
                </div>

                <div className="p-6">
                  {/* Character info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{currentScenario.character.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Expression:</span>
                        <p className="text-gray-600">{currentScenario.character.expression}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Body Language:</span>
                        <p className="text-gray-600">{currentScenario.character.bodyLanguage}</p>
                      </div>
                    </div>
                  </div>

                  {/* Response options */}
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-gray-900">How do you respond?</h4>
                    {currentScenario.options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: selectedOption === null ? 1.02 : 1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOptionSelect(index)}
                        disabled={selectedOption !== null}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedOption === index
                            ? option.outcome === 'positive'
                              ? 'border-green-500 bg-green-50'
                              : option.outcome === 'negative'
                              ? 'border-red-500 bg-red-50'
                              : 'border-yellow-500 bg-yellow-50'
                            : selectedOption === null
                            ? 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                            : 'border-gray-200 bg-gray-50 opacity-50'
                        }`}
                      >
                        <p className="font-medium">{option.text}</p>
                        {selectedOption === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-2 pt-2 border-t border-gray-200"
                          >
                            <p className="text-sm text-gray-600">
                              Confidence level: {Math.round(option.confidence * 100)}%
                            </p>
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Hidden meaning reveal */}
                  <AnimatePresence>
                    {showHiddenMeaning && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
                      >
                        <h5 className="font-semibold text-blue-900 mb-2">Social Context Revealed:</h5>
                        <p className="text-blue-800 mb-3">{currentScenario.hiddenMeaning}</p>
                        <div>
                          <h6 className="font-medium text-blue-900 mb-1">Key Social Cues:</h6>
                          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                            {currentScenario.socialCues.map((cue, index) => (
                              <li key={index}>{cue}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Continue button */}
                  {showHiddenMeaning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center"
                    >
                      <button
                        onClick={proceedToNext}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                      >
                        {currentScenarioIndex < scenarios.length - 1 ? 'Next Scenario' : 'Complete Experience'}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SocialUncertainty;
