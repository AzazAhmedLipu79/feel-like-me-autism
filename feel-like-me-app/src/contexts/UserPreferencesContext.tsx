import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences } from '../types/index';

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetToDefaults: () => void;
}

const defaultPreferences: UserPreferences = {
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  highContrast: false,
  fontSize: 'medium',
  audioDescriptions: true,
  intensityLimit: 7,
  audioVolume: 75,
  maxIntensity: 80,
  safetySettings: {
    emergencyExitReminders: true,
    stressMonitoring: true,
    autoPause: true,
    reflectionPrompts: true,
  },
  accessibilitySettings: {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    highContrast: false,
  },
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

interface UserPreferencesProviderProps {
  children: ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('feellikeme_preferences');
    if (saved) {
      try {
        return { ...defaultPreferences, ...JSON.parse(saved) };
      } catch {
        return defaultPreferences;
      }
    }
    return defaultPreferences;
  });

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPreferences };
      localStorage.setItem('feellikeme_preferences', JSON.stringify(updated));
      return updated;
    });
  };

  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('feellikeme_preferences');
  };

  // Apply preferences to document
  useEffect(() => {
    const classes = [
      preferences.reduceMotion ? 'reduce-motion' : '',
      preferences.highContrast ? 'high-contrast' : '',
      `font-size-${preferences.fontSize}`
    ].filter(Boolean);

    document.documentElement.className = classes.join(' ');
  }, [preferences]);

  const value: UserPreferencesContextType = {
    preferences,
    updatePreferences,
    resetToDefaults
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};
