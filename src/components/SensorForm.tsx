import React, { useState } from 'react';
import { Sprout, Thermometer, Droplets, Sun, CloudRain, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { SensorData } from '../types';

interface SensorFormProps {
  onAnalyze: (data: SensorData) => void;
}

export const SensorForm: React.FC<SensorFormProps> = ({ onAnalyze }) => {
  const [formData, setFormData] = useState({
    soilMoisture: '',
    temperature: '',
    humidity: '',
    lightIntensity: '',
    rainStatus: 'No',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      soilMoisture: Number(formData.soilMoisture) || 0,
      temperature: Number(formData.temperature) || 0,
      humidity: Number(formData.humidity) || 0,
      lightIntensity: Number(formData.lightIntensity) || 0,
      rainStatus: formData.rainStatus === 'Yes',
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputFields = [
    { name: 'soilMoisture', label: 'Soil Moisture (%)', icon: Sprout, type: 'number', placeholder: '0-100' },
    { name: 'temperature', label: 'Temperature (°C)', icon: Thermometer, type: 'number', placeholder: 'e.g. 25' },
    { name: 'humidity', label: 'Humidity (%)', icon: Droplets, type: 'number', placeholder: '0-100' },
    { name: 'lightIntensity', label: 'Light Intensity (LUX)', icon: Sun, type: 'number', placeholder: 'e.g. 500' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-100"
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-emerald-900">
        <Zap className="w-5 h-5 text-emerald-500" />
        Sensor Input
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inputFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                <field.icon className="w-4 h-4" />
                {field.label}
              </label>
              <input
                required
                type={field.type}
                name={field.name}
                value={(formData as any)[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-emerald-50/30 text-emerald-900"
              />
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-800 flex items-center gap-2">
              <CloudRain className="w-4 h-4" />
              Rain Status
            </label>
            <select
              name="rainStatus"
              value={formData.rainStatus}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-emerald-50/30 text-emerald-900 appearance-none"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-emerald-200 active:scale-95"
        >
          Analyze Data
        </button>
      </form>
    </motion.div>
  );
};
