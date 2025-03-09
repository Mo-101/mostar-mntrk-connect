
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Droplets, Thermometer, AlertTriangle } from 'lucide-react';
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
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (data.alert) {
      setHighlighted(true);
      // Create blinking effect for alerts
      const blinkInterval = setInterval(() => {
        setBlink(prev => !prev);
      }, 500);
      
      const timer = setTimeout(() => {
        setHighlighted(false);
        clearInterval(blinkInterval);
        setBlink(false);
      }, 5000);
      
      return () => {
        clearTimeout(timer);
        clearInterval(blinkInterval);
      };
    }
  }, [data.alert]);

  return (
    <motion.div 
      className={`hud-overlay ${highlighted ? 'glow-alert' : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="hud-header">
        <span className="hud-title">ATMOSPHERIC MONITORING</span>
        <div className="hud-status">
          <span className="status-dot"></span>
          <span>LIVE</span>
        </div>
      </div>
      
      <div className="hud-content">
        <motion.div 
          className="data-panel"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="panel-icon">
            <Thermometer size={18} className="text-cyan-400" />
          </div>
          <div className="panel-content">
            <h3>Temperature</h3>
            <p className="panel-value">{data.temperature?.toFixed(1) || '--'}<span className="unit">°C</span></p>
            <div className="panel-line"></div>
          </div>
        </motion.div>
        
        <motion.div 
          className="data-panel"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="panel-icon">
            <Wind size={18} className="text-blue-400" />
          </div>
          <div className="panel-content">
            <h3>Wind Speed</h3>
            <p className="panel-value">{data.windSpeed?.toFixed(1) || '--'}<span className="unit">m/s</span></p>
            <div className="panel-line"></div>
          </div>
        </motion.div>
        
        <motion.div 
          className="data-panel"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="panel-icon">
            <Droplets size={18} className="text-blue-500" />
          </div>
          <div className="panel-content">
            <h3>Humidity</h3>
            <p className="panel-value">{data.humidity?.toFixed(0) || '--'}<span className="unit">%</span></p>
            <div className="panel-line"></div>
          </div>
        </motion.div>
        
        <AnimatePresence>
          <motion.div 
            className={`data-panel ${data.alert ? 'alert-panel' : ''} ${blink ? 'blink' : ''}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="panel-icon">
              <AlertTriangle size={18} className={data.alert ? "text-red-500" : "text-green-400"} />
            </div>
            <div className="panel-content">
              <h3>System Status</h3>
              <p className={`panel-value ${data.alert ? 'alert-active' : 'alert-inactive'}`}>
                {data.alert ? (data.alertMessage || 'CRITICAL WEATHER ALERT') : 'All Systems Normal'}
              </p>
              <div className="panel-line"></div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="hud-footer">
        <div className="hud-coordinates">
          <span>LAT: 6.5244</span>
          <span>LNG: 3.3792</span>
        </div>
        <div className="hud-timestamp">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

export default FuturisticHUD;
