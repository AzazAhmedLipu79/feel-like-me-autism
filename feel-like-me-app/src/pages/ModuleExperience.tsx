import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SensoryOverload from '@/components/modules/SensoryOverload';
import SocialUncertainty from '@/components/modules/SocialUncertainty';
import CognitiveLoad from '@/components/modules/CognitiveLoad';
import MeltdownSimulator from '@/components/modules/MeltdownSimulator';
import StimmingStudio from '@/components/modules/StimmingStudio';
import HyperfocusChallenge from '@/components/modules/HyperfocusChallenge';

const ModuleExperience: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/', { replace: true });
  };

  const handleExit = () => {
    navigate('/', { replace: true });
  };

  const renderModule = () => {
    switch (moduleId) {
      case 'sensory-overload':
        return (
          <SensoryOverload 
            onComplete={handleComplete}
            onExit={handleExit}
          />
        );
      case 'social-uncertainty':
        return (
          <SocialUncertainty 
            onComplete={handleComplete}
            onExit={handleExit}
          />
        );      case 'cognitive-load':
        return (
          <CognitiveLoad 
            onComplete={handleComplete}
            onExit={handleExit}
          />
        );
      case 'meltdown-simulator':
        return (
          <MeltdownSimulator />
        );
      case 'stimming-studio':
        return (
          <StimmingStudio />
        );
      case 'hyperfocus-challenge':
        return (
          <HyperfocusChallenge />
        );
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Module Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                The requested module "{moduleId}" is not available.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Return to Dashboard
              </button>
            </motion.div>
          </div>
        );
    }
  };

  return renderModule();
};

export default ModuleExperience;
