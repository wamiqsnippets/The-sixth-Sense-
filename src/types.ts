export interface SensorData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  lightIntensity: number;
  rainStatus: boolean;
  timestamp: string;
}

export type SensorKey = keyof Omit<SensorData, 'rainStatus' | 'timestamp'>;
