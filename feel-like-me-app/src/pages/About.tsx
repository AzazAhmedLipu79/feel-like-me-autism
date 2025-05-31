import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, HeartIcon, ShieldCheckIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const About: React.FC = () => {
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
          className="space-y-8"
        >
          {/* Hero Section */}
          <section className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Feel Like Me</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              An empathy-building platform designed to help neurotypical individuals understand 
              and experience what life feels like for autistic people through safe, educational simulations.
            </p>
          </section>

          {/* Mission */}
          <section className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center mb-4">
              <HeartIcon className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Feel Like Me exists to bridge the empathy gap between neurotypical and autistic individuals. 
              By creating immersive, first-person experiences of common autistic challenges—such as sensory 
              overload, social uncertainty, and cognitive load—we help build understanding, reduce stigma, 
              and foster more inclusive communities.
            </p>
          </section>

          {/* How It Works */}
          <section className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Choose an Experience</h3>
                <p className="text-sm text-gray-600">
                  Select from modules designed around different aspects of autistic experience
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Immerse Yourself</h3>
                <p className="text-sm text-gray-600">
                  Experience realistic simulations using audio, visual, and interactive elements
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Reflect & Learn</h3>
                <p className="text-sm text-gray-600">
                  Process your experience through guided reflection and educational content
                </p>
              </div>
            </div>
          </section>

          {/* Safety First */}
          <section className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="w-8 h-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Safety First</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                We prioritize user safety and well-being above all else. Our platform includes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Immediate emergency exit controls (ESC key) available at all times</li>
                <li>Pause functionality (Ctrl+Space) to take breaks when needed</li>
                <li>Adjustable intensity settings to match individual comfort levels</li>
                <li>Real-time stress monitoring with automatic safety interventions</li>
                <li>Clear warnings before intense experiences</li>
                <li>Post-experience support and reflection guidance</li>
              </ul>
            </div>
          </section>

          {/* Educational Foundation */}
          <section className="bg-white rounded-lg shadow p-8">
            <div className="flex items-center mb-4">
              <AcademicCapIcon className="w-8 h-8 text-blue-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Educational Foundation</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our simulations are grounded in research and developed in consultation with autistic 
              individuals and autism advocacy organizations. We strive for authenticity while maintaining 
              educational value and user safety.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Important:</strong> These simulations provide a glimpse into autistic experiences 
                but cannot fully capture the complexity and diversity of autism. Every autistic person's 
                experience is unique.
              </p>
            </div>
          </section>

          {/* Modules Overview */}
          <section className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Experience Modules</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900">Sensory Overload</h3>
                <p className="text-gray-600 text-sm">
                  Experience overwhelming sensory input through layered audio-visual stimulation 
                  that builds from manageable to intense levels.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900">Social Uncertainty</h3>
                <p className="text-gray-600 text-sm">
                  Navigate ambiguous social situations where the "correct" response is unclear, 
                  highlighting the stress of social interpretation.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900">Cognitive Load</h3>
                <p className="text-gray-600 text-sm">
                  Manage multiple mental tasks while processing environmental distractions, 
                  simulating cognitive overwhelm.
                </p>
              </div>
              <div className="border-l-4 border-gray-400 pl-4">
                <h3 className="font-semibold text-gray-900">Additional Modules</h3>
                <p className="text-gray-600 text-sm">
                  Coming soon: Meltdown Simulator, Stimming Studio, and Hyperfocus Challenge.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="font-semibold text-amber-800 mb-2">Important Disclaimer</h3>
            <p className="text-amber-700 text-sm leading-relaxed">
              Feel Like Me is an educational tool designed to build empathy and understanding. 
              It is not a diagnostic tool, therapy, or medical device. If you experience distress 
              during or after using this platform, please consider speaking with a mental health 
              professional. The experiences simulated here represent common autistic challenges but 
              do not encompass the full spectrum of autism.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Questions or Feedback?</h2>
            <p className="text-gray-600 mb-4">
              We welcome your thoughts, suggestions, and questions about Feel Like Me.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>This is a demonstration project showcasing empathy-building technology.</p>
              <p>Built with safety, accessibility, and educational value as core principles.</p>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default About;
