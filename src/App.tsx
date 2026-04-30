/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ChevronRight, Eye, Leaf, Loader2, RefreshCcw, Wand2 } from 'lucide-react';
import { SensorForm } from './components/SensorForm';
import { SensorGrid } from './components/SensorGrid';
import { Visuals } from './components/Visuals';
import { Interpretation } from './components/Interpretation';
import { SensorData } from './types';

const initialSensorData: SensorData = {
  soilMoisture: 45,
  temperature: 28,
  lightIntensity: 620,
  rainLevel: 20,
  waterLevel: 70,
  rainStatus: true,
  timestamp: new Date().toLocaleString(),
};

const clampHealth = (score: number) => Math.max(0, Math.min(100, Math.round(score)));

const calculateHealthScore = (data: SensorData, simulationAdjustment = 0) => {
  let score = 78;

  // Good conditions lift the score, while stressors pull it down.
  if (data.soilMoisture >= 30 && data.soilMoisture <= 75) score += 10;
  if (data.temperature >= 18 && data.temperature <= 35) score += 8;
  if (data.lightIntensity >= 250 && data.lightIntensity <= 800) score += 6;
  if (data.rainLevel <= 60) score += 4;
  if (data.waterLevel >= 35) score += 6;

  if (data.soilMoisture < 30) score -= 28;
  if (data.soilMoisture > 85) score -= 12;
  if (data.temperature > 35) score -= 22;
  if (data.lightIntensity < 150 || data.lightIntensity > 900) score -= 10;
  if (data.rainLevel > 75) score -= 8;
  if (data.waterLevel < 25) score -= 18;

  return clampHealth(score + simulationAdjustment);
};

const getPlantStatus = (score: number, data: SensorData) => {
  if (data.soilMoisture < 30 || data.waterLevel < 20) return 'Dry';
  if (score < 65 || data.temperature > 35) return 'Stressed';
  return 'Healthy';
};

const PlantHealthPanel = ({
  data,
  simulationAdjustment,
  isSimulating,
  onSimulate,
}: {
  data: SensorData;
  simulationAdjustment: number;
  isSimulating: boolean;
  onSimulate: () => void;
}) => {
  const healthScore = calculateHealthScore(data, simulationAdjustment);
  const status = getPlantStatus(healthScore, data);
  const statusStyle = {
    Healthy: 'text-emerald-700 bg-emerald-50',
    Dry: 'text-amber-700 bg-amber-50',
    Stressed: 'text-orange-700 bg-orange-50',
  }[status];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-100"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-emerald-900">Plant Health</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700/40">
              Virtual plant system
            </p>
          </div>
        </div>
        <span className={`w-fit rounded-full px-4 py-2 text-sm font-black ${statusStyle}`}>
          Status: {status}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 items-center">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-emerald-50/60 p-8 text-center">
          <Leaf className={`h-20 w-20 ${status === 'Healthy' ? 'text-emerald-500' : 'text-amber-500'}`} />
          <p className="mt-4 text-sm font-bold uppercase tracking-widest text-emerald-800/50">
            {status === 'Healthy' ? 'Plant thriving' : status === 'Dry' ? 'Needs water' : 'Under stress'}
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-700/50">Health Score</p>
              <p className="text-5xl font-black text-emerald-950">{healthScore}</p>
            </div>
            <Activity className="w-8 h-8 text-emerald-500" />
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-emerald-100">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${healthScore}%` }}
            />
          </div>

          {isSimulating && (
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Simulating environmental impact...
            </p>
          )}

          <button
            type="button"
            onClick={onSimulate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-950 px-5 py-4 font-bold text-white transition-all hover:bg-emerald-800 active:scale-95 sm:w-auto"
          >
            <Wand2 className="h-4 w-4" />
            Simulate 7 Days
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default function App() {
  const [analysis, setAnalysis] = useState<SensorData | null>(initialSensorData);
  const [simulationAdjustment, setSimulationAdjustment] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleAnalyze = (data: SensorData, options: { autoScroll?: boolean } = {}) => {
    setAnalysis(data);
    setSimulationAdjustment(0);
    if (options.autoScroll) {
      // Scroll to results after a short delay to feel like "processing".
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleReset = () => {
    setAnalysis({ ...initialSensorData, timestamp: new Date().toLocaleString() });
    setSimulationAdjustment(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSimulate = () => {
    if (!analysis) return;

    setIsSimulating(true);
    window.setTimeout(() => {
      const dailyImpact =
        (analysis.soilMoisture >= 30 ? 2 : -5) +
        (analysis.temperature <= 35 ? 1 : -4) +
        (analysis.rainLevel > 60 ? 2 : 0) +
        (analysis.waterLevel >= 35 ? 1 : -3);

      setSimulationAdjustment((current) => Math.max(-45, Math.min(25, current + dailyImpact * 7)));
      setIsSimulating(false);
    }, 800);
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
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-900 tracking-tight">Dashboard</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-700/40">
                      Last Updated: {analysis.timestamp}
                    </p>
                  </div>
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

              <PlantHealthPanel
                data={analysis}
                simulationAdjustment={simulationAdjustment}
                isSimulating={isSimulating}
                onSimulate={handleSimulate}
              />
              
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
