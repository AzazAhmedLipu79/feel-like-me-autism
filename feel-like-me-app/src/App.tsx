import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SafetyProvider } from './contexts/SafetyContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { ModuleProgressProvider } from './contexts/ModuleProgressContext';
import Dashboard from './pages/Dashboard';
import ModuleExperience from './pages/ModuleExperience';
import Settings from './pages/Settings';
import About from './pages/About';
import './index.css';

const App: React.FC = () => {
  return (
    <SafetyProvider>
      <UserPreferencesProvider>
        <ModuleProgressProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/module/:moduleId" element={<ModuleExperience />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </ModuleProgressProvider>
      </UserPreferencesProvider>
    </SafetyProvider>
  );
};

export default App;
