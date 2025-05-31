import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useModuleProgress } from '../contexts/ModuleProgressContext';
import { 
  EyeIcon, 
  UserGroupIcon, 
  CpuChipIcon, 
  ExclamationTriangleIcon,
  SparklesIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  color: string;
  available: boolean;
}

const modules: ModuleCard[] = [
  {
    id: 'sensory-overload',
    title: 'Sensory Overload',
    description: 'Experience overwhelming sensory input through layered audio-visual stimulation',
    icon: EyeIcon,
    difficulty: 'Intermediate',
    duration: '5-7 minutes',
    color: 'from-red-500 to-orange-600',
    available: true
  },
  {
    id: 'social-uncertainty',
    title: 'Social Uncertainty',
    description: 'Navigate ambiguous social situations where the "right" response is unclear',
    icon: UserGroupIcon,
    difficulty: 'Beginner',
    duration: '8-10 minutes',
    color: 'from-blue-500 to-indigo-600',
    available: true
  },
  {
    id: 'cognitive-load',
    title: 'Cognitive Load',
    description: 'Manage multiple mental tasks while processing environmental distractions',
    icon: CpuChipIcon,
    difficulty: 'Advanced',
    duration: '6-8 minutes',
    color: 'from-purple-500 to-pink-600',
    available: true
  },  {
    id: 'meltdown-simulator',
    title: 'Meltdown Experience',
    description: 'Feel the escalation from stress to complete sensory shutdown',
    icon: ExclamationTriangleIcon,
    difficulty: 'Advanced',
    duration: '4-6 minutes',
    color: 'from-red-600 to-red-800',
    available: true
  },
  {
    id: 'stimming-studio',
    title: 'Stimming Studio',
    description: 'Explore self-regulation through interactive stimming tools and techniques',
    icon: SparklesIcon,
    difficulty: 'Beginner',
    duration: 'Open-ended',
    color: 'from-green-500 to-teal-600',
    available: true
  },  {
    id: 'hyperfocus-challenge',
    title: 'Hyperfocus Challenge',
    description: 'Experience intense focus that becomes difficult to break away from',
    icon: FlagIcon,
    difficulty: 'Intermediate',
    duration: '10-15 minutes',
    color: 'from-yellow-500 to-orange-500',
    available: true
  }
];

const Dashboard: React.FC = () => {
  const { progress } = useModuleProgress();

  const completedModules = Object.keys(progress).filter(id => progress[id]?.isCompleted);
  const totalModules = modules.filter(m => m.available).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Feel Like Me</h1>
              <p className="text-gray-600 mt-1">Autism Empathy Simulator</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/settings"
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                Settings
              </Link>
              <Link 
                to="/about"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to Feel Like Me
            </h2>
            <p className="text-lg text-blue-100 mb-4 max-w-3xl">
              Experience what it feels like to be autistic through interactive simulations 
              designed to build empathy and understanding. Each module offers a safe, 
              educational journey into different aspects of the autistic experience.
            </p>
            <div className="flex items-center space-x-6 text-blue-100">
              <div>
                <span className="text-2xl font-bold text-white">{completedModules.length}</span>
                <span className="text-sm ml-1">/ {totalModules} completed</span>
              </div>
              <div className="w-32 h-2 bg-blue-500 rounded-full">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${(completedModules.length / totalModules) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Safety Notice */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-amber-800 font-semibold mb-2">Important Safety Information</h3>
                <p className="text-amber-700 text-sm mb-3">
                  These experiences may be intense and could trigger stress responses. 
                  Emergency exit controls are always available.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-amber-600">
                  <span>• Press <kbd className="bg-amber-200 px-1 rounded">ESC</kbd> for emergency exit</span>
                  <span>• Press <kbd className="bg-amber-200 px-1 rounded">Ctrl+Space</kbd> to pause</span>
                  <span>• Adjust intensity in Settings</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Modules Grid */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Experience Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <ModuleCard module={module} isCompleted={progress[module.id]?.isCompleted} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Progress Summary */}
        {completedModules.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Progress</h3>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{completedModules.length}</div>
                  <div className="text-gray-600">Modules Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round((completedModules.length / totalModules) * 100)}%
                  </div>
                  <div className="text-gray-600">Progress</div>
                </div>
                <div className="text-center">                  <div className="text-3xl font-bold text-purple-600">
                    {Object.values(progress).reduce((sum, p) => sum + (p?.empathyScore > 0 ? 1 : 0), 0)}
                  </div>
                  <div className="text-gray-600">Reflections Shared</div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
};

const ModuleCard: React.FC<{ module: ModuleCard; isCompleted?: boolean }> = ({ 
  module, 
  isCompleted = false 
}) => {
  const Icon = module.icon;
  
  return (
    <motion.div
      whileHover={{ scale: module.available ? 1.02 : 1 }}
      whileTap={{ scale: module.available ? 0.98 : 1 }}
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${
        module.available ? 'cursor-pointer' : 'opacity-60'
      }`}
    >
      {module.available ? (
        <Link to={`/module/${module.id}`} className="block">
          <CardContent module={module} isCompleted={isCompleted} Icon={Icon} />
        </Link>
      ) : (
        <div>
          <CardContent module={module} isCompleted={isCompleted} Icon={Icon} />
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
              Coming Soon
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const CardContent: React.FC<{ 
  module: ModuleCard; 
  isCompleted: boolean; 
  Icon: React.ComponentType<any> 
}> = ({ module, isCompleted, Icon }) => (
  <>
    <div className={`h-32 bg-gradient-to-br ${module.color} relative`}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute top-4 left-4">
        <Icon className="w-8 h-8 text-white" />
      </div>
      {isCompleted && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
    <div className="p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h4>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{module.description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span className={`px-2 py-1 rounded-full ${
          module.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
          module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {module.difficulty}
        </span>
        <span>{module.duration}</span>
      </div>
    </div>
  </>
);

export default Dashboard;
