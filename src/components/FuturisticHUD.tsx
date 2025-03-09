
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/futuristic.css';

interface WeatherData {
  temperature?: number;
  windSpeed?: number;
  humidity?: number;
  precipitation?: number;
  alert?: boolean;
  alertMessage?: string;
}

interface FuturisticHUDProps {
  data: WeatherData;
}

const FuturisticHUD = ({ data }: FuturisticHUDProps) => {
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    if (data.alert) {
      setHighlighted(true);
      const timer = setTimeout(() => setHighlighted(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [data.alert]);

  return (
    <motion.div 
      className={`hud-overlay ${highlighted ? 'glow-alert' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="hud-header">REAL-TIME WEATHER MONITOR</div>
      <div className="hud-content">
        <motion.div 
          className="data-panel"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3>Temperature</h3>
          <p>{data.temperature?.toFixed(1) || '--'}°C</p>
        </motion.div>
        <motion.div 
          className="data-panel"
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3>Wind Speed</h3>
          <p>{data.windSpeed?.toFixed(1) || '--'} m/s</p>
        </motion.div>
        <motion.div 
          className="data-panel"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h3>Humidity</h3>
          <p>{data.humidity || '--'}%</p>
        </motion.div>
        <motion.div 
          className="data-panel"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Alerts</h3>
          <p className={data.alert ? 'alert-active' : 'alert-inactive'}>
            {data.alert ? (data.alertMessage || 'SEVERE WEATHER DETECTED') : 'No Alerts'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FuturisticHUD;
