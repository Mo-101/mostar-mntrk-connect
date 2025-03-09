
import { motion } from 'framer-motion';
import { AlertTriangle, Wind, Droplets, Thermometer, Users, Activity, Signal } from 'lucide-react';
import '../styles/futuristic.css';

interface MapStats {
  riskLevel?: number;
  population?: number;
  precipitationChance?: number;
  temperatureChange?: number;
}

interface FuturisticMapOverlayProps {
  stats: MapStats;
  newsItems: string[];
}

const FuturisticMapOverlay = ({ stats, newsItems }: FuturisticMapOverlayProps) => {
  const getRiskColor = (risk: number = 0) => {
    if (risk > 70) return '#ff3e3e';
    if (risk > 40) return '#ffa500';
    return '#00cc88';
  };

  return (
    <>
      <motion.div 
        className="map-overlay cyber-panel"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="overlay-header">
          <span>TACTICAL ASSESSMENT</span>
          <div className="scanner-line"></div>
        </div>
        
        <div className="map-stats">
          <div className="stat-item">
            <div className="stat-icon">
              <Activity size={16} />
            </div>
            <div className="stat-value" style={{ color: getRiskColor(stats.riskLevel) }}>
              {stats.riskLevel || 0}%
            </div>
            <div className="stat-ring" style={{ 
              background: `conic-gradient(${getRiskColor(stats.riskLevel)} ${(stats.riskLevel || 0)}%, transparent ${(stats.riskLevel || 0)}%)` 
            }}></div>
            <div className="stat-label">Risk Level</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <Users size={16} />
            </div>
            <div className="stat-value">{stats.population?.toLocaleString() || 0}</div>
            <div className="stat-label">Population</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <Droplets size={16} />
            </div>
            <div className="stat-value">{stats.precipitationChance || 0}%</div>
            <div className="stat-label">Precipitation</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <Thermometer size={16} />
            </div>
            <div className="stat-value">{stats.temperatureChange || 0}°</div>
            <div className="stat-label">Temp. Change</div>
          </div>
        </div>
        
        <div className="data-panel analysis-panel">
          <h3>Environmental Analysis</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center gap-2 analysis-item">
              <Wind size={14} className="text-blue-400" />
              <span className="text-xs">Wind direction optimal</span>
              <div className="analysis-indicator"></div>
            </div>
            <div className="flex items-center gap-2 analysis-item">
              <Droplets size={14} className="text-blue-400" />
              <span className="text-xs">Humidity rising</span>
              <div className="analysis-indicator"></div>
            </div>
            <div className="flex items-center gap-2 analysis-item">
              <Thermometer size={14} className="text-blue-400" />
              <span className="text-xs">Temperature stable</span>
              <div className="analysis-indicator"></div>
            </div>
            <div className="flex items-center gap-2 analysis-item">
              <AlertTriangle size={14} className="text-yellow-400" />
              <span className="text-xs">Warning zone nearby</span>
              <div className="analysis-indicator warning"></div>
            </div>
          </div>
        </div>
        
        <div className="overlay-footer">
          <Signal size={14} className="animate-pulse" />
          <span>Monitoring active</span>
        </div>
      </motion.div>
      
      <div className="news-ticker">
        <div className="news-ticker-label">ALERT</div>
        <div className="news-ticker-content">
          {newsItems.join(' • ')}
        </div>
      </div>
    </>
  );
};

export default FuturisticMapOverlay;
