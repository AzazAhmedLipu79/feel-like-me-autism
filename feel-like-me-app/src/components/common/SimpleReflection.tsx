import { useState } from 'react';
import { motion } from 'framer-motion';

interface SimpleReflectionProps {
  questions: string[];
  insights: string[];
  onComplete: () => void;
}

export function SimpleReflection({ questions, insights, onComplete }: SimpleReflectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setResponses([...responses, currentResponse]);
      setCurrentResponse('');
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setResponses([...responses, currentResponse]);
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Reflection</h2>
        
        {currentQuestion < questions.length ? (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-4">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <p className="text-gray-600">{questions[currentQuestion]}</p>
            </div>
            
            <textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Reflection'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Key Insights</h3>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">{insight}</p>
                </div>
              ))}
            </div>
            
            <button
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
