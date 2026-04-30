import React, { useMemo, useState } from 'react';
import { CloudRain, Sprout, Sun, Thermometer, Waves, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { SensorData } from '../types';

interface SensorFormProps {
  onAnalyze: (data: SensorData, options?: { autoScroll?: boolean }) => void;
}

type SensorFormState = Omit<SensorData, 'rainStatus' | 'timestamp'>;

const getIndicator = (name: keyof SensorFormState, value: number) => {
  const ranges: Record<keyof SensorFormState, { low: number; high: number }> = {
    soilMoisture: { low: 30, high: 75 },
    temperature: { low: 15, high: 35 },
    lightIntensity: { low: 250, high: 800 },
    rainLevel: { low: 20, high: 60 },
    waterLevel: { low: 30, high: 80 },
  };

  if (value < ranges[name].low) {
    return { label: 'Low', color: 'text-amber-600', bg: 'bg-amber-50', track: 'accent-amber-500' };
  }

  if (value > ranges[name].high) {
    return { label: 'High', color: 'text-blue-600', bg: 'bg-blue-50', track: 'accent-blue-500' };
  }

  return { label: 'Normal', color: 'text-emerald-600', bg: 'bg-emerald-50', track: 'accent-emerald-500' };
};

export const SensorForm: React.FC<SensorFormProps> = ({ onAnalyze }) => {
  const [formData, setFormData] = useState<SensorFormState>({
    soilMoisture: 45,
    temperature: 28,
    lightIntensity: 620,
    rainLevel: 20,
    waterLevel: 70,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const inputFields = useMemo(
    () => [
      { name: 'soilMoisture' as const, label: 'Soil Moisture', unit: '%', icon: Sprout, min: 0, max: 100 },
      { name: 'temperature' as const, label: 'Temperature', unit: 'C', icon: Thermometer, min: 0, max: 50 },
      { name: 'lightIntensity' as const, label: 'Light Intensity', unit: 'lux', icon: Sun, min: 0, max: 1000 },
      { name: 'rainLevel' as const, label: 'Rain Level', unit: '%', icon: CloudRain, min: 0, max: 100 },
      { name: 'waterLevel' as const, label: 'Water Level', unit: '%', icon: Waves, min: 0, max: 100 },
    ],
    [],
  );

  const publishData = (nextData: SensorFormState, options?: { autoScroll?: boolean }) => {
    onAnalyze({
      ...nextData,
      rainStatus: nextData.rainLevel > 0,
      timestamp: new Date().toLocaleString(),
    }, options);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    window.setTimeout(() => setIsAnalyzing(false), 500);
    publishData(formData, { autoScroll: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextData = { ...formData, [name]: Number(value) };

    setFormData(nextData);
    // Sliders act like live simulated sensors, so every change refreshes the dashboard.
    publishData(nextData, { autoScroll: false });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-100"
    >
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-emerald-900">
          <Zap className="w-5 h-5 text-emerald-500" />
          Sensor Inputs
        </h2>
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-700/50">
          Simulated ESP32 readings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inputFields.map((field) => {
            const indicator = getIndicator(field.name, formData[field.name]);

            return (
              <div key={field.name} className="space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                    <field.icon className="w-4 h-4" />
                    {field.label}
                  </label>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${indicator.bg} ${indicator.color}`}>
                    {indicator.label}
                  </span>
                </div>

                <div className="flex items-end justify-between gap-4">
                  <p className="text-3xl font-black text-emerald-950 tracking-tight">
                    {formData[field.name]}
                    <span className="ml-1 text-sm font-bold text-emerald-700/60">{field.unit}</span>
                  </p>
                  <p className="text-xs font-semibold text-emerald-700/50">
                    {field.min}-{field.max} {field.unit}
                  </p>
                </div>

                <input
                  type="range"
                  name={field.name}
                  min={field.min}
                  max={field.max}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className={`w-full cursor-pointer ${indicator.track}`}
                />
              </div>
            );
          })}
        </div>

        {isAnalyzing && (
          <p className="text-center text-sm font-semibold text-emerald-600">
            Analyzing data...
          </p>
        )}

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
