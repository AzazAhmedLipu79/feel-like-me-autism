import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { EmotionType } from '@types/index';
import { EmotionType } from '../../types/index';

interface ReflectionPromptProps {
  question: string;
  onSubmit: (response: string, emotion: EmotionType) => void;
  isVisible: boolean;
  onSkip?: () => void;
}

const emotions: EmotionType[] = ['😊', '😔', '😰', '🤔', '😮', '😌', '😡', '😴'];

const emotionLabels: Record<EmotionType, string> = {
  '😊': 'Happy',
  '😔': 'Sad',
  '😰': 'Anxious',
  '🤔': 'Thoughtful',
  '😮': 'Surprised',
  '😌': 'Calm',
  '😡': 'Frustrated',
  '😴': 'Tired'
};

export const ReflectionPrompt: React.FC<ReflectionPromptProps> = ({
  question,
  onSubmit,
  isVisible,
  onSkip
}) => {
  const [response, setResponse] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedEmotion) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Brief loading state
    onSubmit(response, selectedEmotion as EmotionType);
    
    // Reset form
    setResponse('');
    setSelectedEmotion('');
    setIsSubmitting(false);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onSubmit('', '😌');
    }
    setResponse('');
    setSelectedEmotion('');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
          onClick={(e) => e.target === e.currentTarget && handleSkip()}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800">{question}</h3>
            
            {/* Emotion Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How did this experience make you feel?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {emotions.map((emotion) => (
                  <motion.button
                    key={emotion}
                    onClick={() => setSelectedEmotion(emotion)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 text-2xl rounded-lg border-2 transition-all duration-200 ${
                      selectedEmotion === emotion
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-label={emotionLabels[emotion]}
                  >
                    {emotion}
                  </motion.button>
                ))}
              </div>
              {selectedEmotion && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-600 mt-2 text-center"
                >
                  You selected: {emotionLabels[selectedEmotion as EmotionType]}
                </motion.p>
              )}
            </div>
            
            {/* Text Response */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share your thoughts and feelings (optional)
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="What did you learn? How did it feel? What surprised you?"
                className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {response.length}/500 characters
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={handleSubmit}
                disabled={!selectedEmotion || isSubmitting}
                whileHover={{ scale: selectedEmotion ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedEmotion && !isSubmitting
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Saving...
                  </span>
                ) : (
                  'Continue'
                )}
              </motion.button>
              
              <motion.button
                onClick={handleSkip}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Skip
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
