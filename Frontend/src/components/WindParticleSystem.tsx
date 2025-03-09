
import { CustomDataSource, Entity, Viewer, Cartesian3, BillboardGraphics } from "cesium";
import { useEffect, useRef } from "react";
import { useCesium } from "resium";
import { WindDataPoint } from "@/types/wind";
import { Cloud, CloudRain, CloudSnow, CloudSun, CloudLightning, Sun, Snowflake, Wind, Tornado } from "lucide-react";
import ReactDOMServer from "react-dom/server";

interface WindParticleSystemProps {
  windData: WindDataPoint[];
}

const getWeatherIcon = (conditions: string = 'cloudy') => {
  switch (conditions?.toLowerCase()) {
    case 'rain':
      return ReactDOMServer.renderToString(<CloudRain color="#3b82f6" size={24} />);
    case 'snow':
      return ReactDOMServer.renderToString(<CloudSnow color="#e2e8f0" size={24} />);
    case 'cloudy':
      return ReactDOMServer.renderToString(<Cloud color="#64748b" size={24} />);
    case 'partly cloudy':
      return ReactDOMServer.renderToString(<CloudSun color="#f59e0b" size={24} />);
    case 'thunderstorm':
      return ReactDOMServer.renderToString(<CloudLightning color="#6366f1" size={24} />);
    case 'clear':
      return ReactDOMServer.renderToString(<Sun color="#fbbf24" size={24} />);
    case 'windy':
      return ReactDOMServer.renderToString(<Wind color="#94a3b8" size={24} />);
    case 'tornado':
      return ReactDOMServer.renderToString(<Tornado color="#475569" size={24} />);
    default:
      return ReactDOMServer.renderToString(<Cloud color="#64748b" size={24} />);
  }
};

export const WindParticleSystem = ({ windData }: WindParticleSystemProps) => {
  const { viewer } = useCesium();
  const dataSourceRef = useRef<CustomDataSource | null>(null);

  useEffect(() => {
    if (!viewer) return;

    const dataSource = new CustomDataSource("windParticles");
    viewer.dataSources.add(dataSource);
    dataSourceRef.current = dataSource;

    return () => {
      if (dataSourceRef.current) {
        viewer.dataSources.remove(dataSourceRef.current);
      }
    };
  }, [viewer]);

  useEffect(() => {
    if (!dataSourceRef.current || !viewer) return;
    
    dataSourceRef.current.entities.removeAll();
    
    windData.forEach((point) => {
      // Use coordinates if position is not available
      const longitude = point.position?.longitude || point.coordinates[0];
      const latitude = point.position?.latitude || point.coordinates[1];
      const altitude = point.position?.altitude || 0;
      
      const entity = new Entity({
        position: Cartesian3.fromDegrees(longitude, latitude, altitude),
        billboard: new BillboardGraphics({
          image: `data:image/svg+xml;base64,${btoa(getWeatherIcon(point.weather || 'cloudy'))}`,
          verticalOrigin: 0,
          horizontalOrigin: 0,
          scale: 1,
        })
      });
      
      if (dataSourceRef.current) {
        dataSourceRef.current.entities.add(entity);
      }
    });

    viewer.zoomTo(dataSourceRef.current);
  }, [windData, viewer]);

  return null;
};
