import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, Cell
} from 'recharts';
import { motion } from 'motion/react';
import { SensorData } from '../types';

interface VisualsProps {
  data: SensorData;
}

export const Visuals: React.FC<VisualsProps> = ({ data }) => {
  // Bar Chart Data: Normalized to 100 for comparison view, or just raw values with labels
  const barData = [
    { name: 'Moisture', value: data.soilMoisture, fill: '#10b981' },
    { name: 'Temp', value: data.temperature, fill: '#f59e0b' },
    { name: 'Light', value: data.lightIntensity / 10, fill: '#facc15' }, // Scaled for visibility
    { name: 'Rain', value: data.rainLevel, fill: '#6366f1' },
    { name: 'Water', value: data.waterLevel, fill: '#06b6d4' },
  ];

  // Simulated Trends: Current value as center point
  const generateTrend = (val: number, spread: number) => {
    return Array.from({ length: 7 }, (_, i) => ({
      time: `${i + 1}h ago`,
      value: Math.max(0, val + (Math.random() - 0.5) * spread)
    })).reverse();
  };

  const trendData = generateTrend(data.soilMoisture, 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Bar Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-4 text-emerald-900 px-2">Metric Comparison</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecfdf5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#064e3b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#064e3b' }} />
              <Tooltip 
                cursor={{ fill: '#f0fdf4' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-[10px] text-emerald-500 text-center uppercase tracking-wider font-medium">
          Note: Light intensity is scaled (LUX/10) for comparison
        </p>
      </motion.div>

      {/* Line Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-4 text-emerald-900 px-2">Soil Moisture Trend (Simulated)</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecfdf5" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#064e3b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#064e3b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};
