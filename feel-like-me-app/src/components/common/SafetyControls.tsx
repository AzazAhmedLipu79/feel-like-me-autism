import React from 'react';
import { motion } from 'framer-motion';
import { useSafety } from '@contexts/SafetyContext';

interface SafetyControlsProps {
  className?: string;
  showIntensityWarning?: boolean;
}

export const SafetyControls: React.FC<SafetyControlsProps> = ({
  className = '',
  showIntensityWarning = false
}) => {
  const { requestExit, requestPause, resumeFromPause, safetyState, stressLevel } = useSafety();

  return (
    <div className={`fixed top-4 right-4 z-50 flex flex-col gap-2 ${className}`}>
      {/* Emergency Exit Button */}
      <motion.button
        onClick={requestExit}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-colors duration-200"
        aria-label="Exit simulation immediately"
      >
        🚨 EXIT NOW
      </motion.button>

      {/* Pause/Resume Button */}
      <motion.button
        onClick={safetyState.pauseRequested ? resumeFromPause : requestPause}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-2 rounded-lg font-medium shadow-lg transition-colors duration-200 ${
          safetyState.pauseRequested
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
        }`}
        aria-label={safetyState.pauseRequested ? 'Resume simulation' : 'Pause simulation'}
      >
        {safetyState.pauseRequested ? '▶️ RESUME' : '⏸️ PAUSE'}
      </motion.button>

      {/* Stress Level Indicator */}
      {stressLevel > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-2 shadow-lg"
        >
          <div className="text-xs font-medium text-gray-700 mb-1">Stress Level</div>
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full transition-colors duration-300 ${
                stressLevel < 3 ? 'bg-green-400' :
                stressLevel < 6 ? 'bg-yellow-400' :
                stressLevel < 8 ? 'bg-orange-400' :
                'bg-red-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${(stressLevel / 10) * 100}%` }}
            />
          </div>
        </motion.div>
      )}

      {/* High Intensity Warning */}
      {(showIntensityWarning || safetyState.warningShown) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-orange-100 border-l-4 border-orange-500 p-3 rounded shadow-lg max-w-xs"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-orange-400">⚠️</span>
            </div>
            <div className="ml-2">
              <p className="text-orange-700 text-sm font-medium">High intensity detected</p>
              <p className="text-orange-600 text-xs mt-1">
                Consider reducing intensity or taking a break
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Keyboard Shortcuts Info */}
      <div className="bg-gray-800 text-white text-xs p-2 rounded opacity-75 max-w-xs">
        <div className="font-medium mb-1">Quick Keys:</div>
        <div>ESC - Exit</div>
        <div>Ctrl+Space - Pause/Resume</div>
      </div>
    </div>
  );
};
