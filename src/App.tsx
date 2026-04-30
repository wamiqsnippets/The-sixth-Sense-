/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, ChevronRight, RefreshCcw } from 'lucide-react';
import { SensorForm } from './components/SensorForm';
import { SensorGrid } from './components/SensorGrid';
import { Visuals } from './components/Visuals';
import { Interpretation } from './components/Interpretation';
import { SensorData } from './types';

export default function App() {
  const [analysis, setAnalysis] = useState<SensorData | null>(null);

  const handleAnalyze = (data: SensorData) => {
    // Scroll to results after a short delay to feel like "processing"
    setAnalysis(data);
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setAnalysis(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-emerald-950 font-sans selection:bg-emerald-100">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-center">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/80 backdrop-blur-md px-8 py-3 rounded-full border border-emerald-100 shadow-sm flex items-center gap-3"
          >
            <div className="bg-emerald-600 p-1.5 rounded-full">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-900">
              The Sixth Sense
            </h1>
          </motion.div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-4 max-w-6xl mx-auto space-y-12">
        {/* Intro Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-5xl font-black text-emerald-900 tracking-tight leading-tight"
          >
            Precision Agriculture <br/> 
            <span className="text-emerald-500">at your fingertips.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-emerald-800/60 font-medium md:text-lg"
          >
            Monitor soil health and environmental conditions with advanced sensory insights.
          </motion.p>
        </section>

        {/* Input Form */}
        <section className="max-w-4xl mx-auto">
          <SensorForm onAnalyze={handleAnalyze} />
        </section>

        {/* Results Section */}
        <AnimatePresence>
          {analysis && (
            <motion.div 
              id="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="space-y-12 pt-12"
            >
              <div className="flex items-center justify-between border-b border-emerald-100 pb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-xl">
                    <ChevronRight className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-emerald-900 tracking-tight">Analysis Results</h2>
                </div>
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 text-emerald-600 font-bold text-sm hover:text-emerald-700 transition-colors uppercase tracking-widest"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              <SensorGrid data={analysis} />
              
              <Visuals data={analysis} />

              <Interpretation data={analysis} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-emerald-100 bg-emerald-50/30">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-emerald-900/40">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">The Sixth Sense</span>
          </div>
          <p className="text-xs text-emerald-800/40 font-medium">
            Smart Agriculture IoT Platform &copy; 2026. Built for precision.
          </p>
        </div>
      </footer>
    </div>
  );
}

