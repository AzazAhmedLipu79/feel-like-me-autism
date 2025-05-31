import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleVolumeChange = (volume: number) => {
    updatePreferences({ audioVolume: volume });
  };

  const handleIntensityChange = (intensity: number) => {
    updatePreferences({ maxIntensity: intensity });
  };

  const handleSafetyChange = (setting: string, enabled: boolean) => {
    updatePreferences({
      safetySettings: {
        ...preferences.safetySettings,
        [setting]: enabled
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

          <div className="space-y-8">
            {/* Audio Settings */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Audio Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Master Volume: {preferences.audioVolume}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={preferences.audioVolume}
                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Silent</span>
                    <span>Maximum</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Experience Settings */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Intensity: {preferences.maxIntensity}%
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={preferences.maxIntensity}
                    onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Gentle (30%)</span>
                    <span>Full Intensity (100%)</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Controls the maximum stress and sensory intensity across all modules
                  </p>
                </div>
              </div>
            </section>

            {/* Safety Settings */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Safety Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Emergency Exit Reminders</h3>
                    <p className="text-xs text-gray-600">Show periodic reminders about exit controls</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={preferences.safetySettings.emergencyExitReminders}
                      onChange={(e) => handleSafetyChange('emergencyExitReminders', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Stress Level Monitoring</h3>
                    <p className="text-xs text-gray-600">Monitor and display real-time stress indicators</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={preferences.safetySettings.stressMonitoring}
                      onChange={(e) => handleSafetyChange('stressMonitoring', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Automatic Pause on High Stress</h3>
                    <p className="text-xs text-gray-600">Automatically pause when stress levels become too high</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={preferences.safetySettings.autoPause}
                      onChange={(e) => handleSafetyChange('autoPause', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Reflection Prompts</h3>
                    <p className="text-xs text-gray-600">Show guided reflection questions after each experience</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={preferences.safetySettings.reflectionPrompts}
                      onChange={(e) => handleSafetyChange('reflectionPrompts', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Accessibility Settings */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Accessibility</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Reduced Motion</h3>
                    <p className="text-xs text-gray-600">Minimize animations and transitions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={preferences.accessibilitySettings.reducedMotion}
                      onChange={(e) => updatePreferences({
                        accessibilitySettings: {
                          ...preferences.accessibilitySettings,
                          reducedMotion: e.target.checked
                        }
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">High Contrast</h3>
                    <p className="text-xs text-gray-600">Increase contrast for better visibility</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={preferences.accessibilitySettings.highContrast}
                      onChange={(e) => updatePreferences({
                        accessibilitySettings: {
                          ...preferences.accessibilitySettings,
                          highContrast: e.target.checked
                        }
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Keyboard Shortcuts */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Keyboard Shortcuts</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Emergency Exit</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">ESC</kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Pause/Resume</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">Ctrl + Space</kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Volume Down</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">Ctrl + ↓</kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Volume Up</span>
                  <kbd className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">Ctrl + ↑</kbd>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
