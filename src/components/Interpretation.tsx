import React from 'react';
import { Leaf, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { SensorData } from '../types';

interface InterpretationProps {
  data: SensorData;
}

export const Interpretation: React.FC<InterpretationProps> = ({ data }) => {
  const getInsights = () => {
    const insights = [];

    // Moisture Analysis
    if (data.soilMoisture < 30) {
      insights.push({
        type: 'warning',
        text: 'Soil moisture is critically low. Immediate irrigation is recommended to prevent crop wilting.',
        icon: AlertCircle,
        color: 'text-amber-600',
        bg: 'bg-amber-50'
      });
    } else if (data.soilMoisture > 80) {
      insights.push({
        type: 'warning',
        text: 'Soil is oversaturated. Reduce irrigation to prevent root rot and nutrient leaching.',
        icon: AlertCircle,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
      });
    } else {
      insights.push({
        type: 'success',
        text: 'Soil moisture levels are optimal for plant growth.',
        icon: CheckCircle2,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
      });
    }

    // Environmental Analysis
    if (data.temperature > 35) {
      insights.push({
        type: 'info',
        text: 'High ambient temperature detected. Consider activating misting systems or providing shade.',
        icon: Info,
        color: 'text-orange-600',
        bg: 'bg-orange-50'
      });
    }

    if (data.rainStatus) {
      insights.push({
        type: 'info',
        text: 'Precipitation detected. Automated irrigation scheduled to pause.',
        icon: CheckCircle2,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
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
        <h2 className="text-xl font-bold text-emerald-900">Interpretation & Insights</h2>
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
