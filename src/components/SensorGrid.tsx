import React from 'react';
import { Sprout, Thermometer, Droplets, Sun, CloudRain } from 'lucide-react';
import { motion } from 'motion/react';
import { SensorData } from '../types';

interface SensorGridProps {
  data: SensorData;
}

export const SensorGrid: React.FC<SensorGridProps> = ({ data }) => {
  const sensors = [
    { label: 'Soil Moisture', value: `${data.soilMoisture}%`, icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Temperature', value: `${data.temperature}°C`, icon: Thermometer, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Humidity', value: `${data.humidity}%`, icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Light Intensity', value: `${data.lightIntensity} LUX`, icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Rain Status', value: data.rainStatus ? 'Yes' : 'No', icon: CloudRain, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {sensors.map((sensor, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`p-6 rounded-3xl ${sensor.bg} flex flex-col items-center justify-center text-center border border-white space-y-4`}
        >
          <div className={`p-3 rounded-2xl bg-white shadow-sm`}>
            <sensor.icon className={`w-6 h-6 ${sensor.color}`} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
              {sensor.label}
            </p>
            <p className="text-xl font-black text-gray-800">
              {sensor.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
