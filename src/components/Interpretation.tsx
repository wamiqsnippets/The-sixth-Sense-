import React from 'react';
import { AlertCircle, CheckCircle2, Droplets, Flame, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { SensorData } from '../types';

interface InterpretationProps {
  data: SensorData;
}

export const Interpretation: React.FC<InterpretationProps> = ({ data }) => {
  const getInsights = () => {
    const insights = [];

    if (data.soilMoisture < 30) {
      insights.push({
        text: 'Irrigation Required: soil moisture is below the safe threshold.',
        icon: Droplets,
        color: 'text-amber-700',
        bg: 'bg-amber-50',
      });
    }

    if (data.temperature > 35) {
      insights.push({
        text: 'Heat Stress: high temperature may slow growth and increase water demand.',
        icon: Flame,
        color: 'text-orange-700',
        bg: 'bg-orange-50',
      });
    }

    if (data.rainLevel > 60) {
      insights.push({
        text: 'No Irrigation Needed: rainfall is high enough to pause watering.',
        icon: CheckCircle2,
        color: 'text-blue-700',
        bg: 'bg-blue-50',
      });
    }

    if (data.waterLevel < 25) {
      insights.push({
        text: 'Reservoir Low: refill the water tank before the next irrigation cycle.',
        icon: AlertCircle,
        color: 'text-rose-700',
        bg: 'bg-rose-50',
      });
    }

    if (insights.length === 0) {
      insights.push({
        text: 'Optimal Conditions: inputs are balanced for healthy plant growth.',
        icon: CheckCircle2,
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
      });
    }

    return insights;
  };

  const insights = getInsights();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Leaf className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-900">AI Insights</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700/40">
            Rule-based prototype analysis
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-4 p-5 rounded-2xl ${insight.bg} transition-all border border-transparent hover:border-current/10`}
          >
            <insight.icon className={`w-6 h-6 mt-1 flex-shrink-0 ${insight.color}`} />
            <p className={`text-sm md:text-base font-medium leading-relaxed ${insight.color}`}>
              {insight.text}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
