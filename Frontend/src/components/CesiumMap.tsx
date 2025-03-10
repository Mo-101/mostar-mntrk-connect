
import { useRef, useEffect, useState } from 'react';
import { Viewer, Entity, CameraFlyTo } from 'resium';
import { WindDataPoint } from '@/types/wind';
import * as Cesium from '@cesium/engine';

interface CesiumMapProps {
  initialLocation?: [number, number]; // [longitude, latitude]
  wind?: WindDataPoint[];
}

const CesiumMap: React.FC<CesiumMapProps> = ({ 
  initialLocation = [7.5, 9.0], // Default to Nigeria
  wind = [] 
}) => {
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<WindDataPoint | null>(null);

  // Create some sample wind data points if none provided
  const windData = wind.length > 0 ? wind : [
    {
      id: 'wind-1',
      coordinates: [8.0, 9.5],
      u: 5,
      v: 2,
      speed: 5.4,
      direction: 21.8,
      timestamp: new Date().toISOString(),
      position: {
        longitude: 8.0,
        latitude: 9.5,
        altitude: 500
      },
      weather: 'cloudy',
      color: '#3498db'  // Now valid with updated type
    },
    {
      id: 'wind-2',
      coordinates: [7.5, 9.0],
      u: -3,
      v: 4,
      speed: 5.0,
      direction: 126.9,
      timestamp: new Date().toISOString(),
      position: {
        longitude: 7.5,
        latitude: 9.0,
        altitude: 500
      },
      weather: 'clear',
      color: '#f39c12'  // Now valid with updated type
    },
    {
      id: 'wind-3',
      coordinates: [7.0, 8.5],
      u: 1,
      v: -6,
      speed: 6.1,
      direction: 350.5,
      timestamp: new Date().toISOString(),
      position: {
        longitude: 7.0,
        latitude: 8.5,
        altitude: 500
      },
      weather: 'rain',
      color: '#2ecc71'  // Now valid with updated type
    }
  ];

  const handleViewerReady = (viewer: Cesium.Viewer) => {
    viewerRef.current = viewer;
    
    // Configure viewer settings
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.showWaterEffect = true;
    
    // Enable shadows
    viewer.shadows = true;
    viewer.terrainShadows = Cesium.ShadowMode.ENABLED;
    
    // Set a more realistic atmosphere
    viewer.scene.skyAtmosphere.hueShift = 0.0;
    viewer.scene.skyAtmosphere.saturationShift = 0.1;
    viewer.scene.skyAtmosphere.brightnessShift = 0.1;
    
    // Set initial view
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(initialLocation[0], initialLocation[1], 500000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-60),
        roll: 0.0
      }
    });
  };

  return (
    <div className="w-full h-full">
      <Viewer
        full
        timeline={false}
        animation={false}
        homeButton={false}
        navigationHelpButton={false}
        sceneModePicker={false}
        baseLayerPicker={false}
        geocoder={false}
        className="w-full h-full"
        onReady={handleViewerReady}
        shadows
      >
        {windData.map((point) => (
          <Entity 
            key={point.id}
            position={Cesium.Cartesian3.fromDegrees(
              point.position.longitude, 
              point.position.latitude, 
              point.position.altitude || 500
            )}
            billboard={{
              image: '/assets/wind-arrow.png',
              width: 32,
              height: 32,
              rotation: Cesium.Math.toRadians(point.direction || 0),
              color: point.color ? Cesium.Color.fromCssColorString(point.color) : Cesium.Color.WHITE
            }}
            label={{
              text: `${point.speed.toFixed(1)} m/s`,
              font: '12px sans-serif',
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 2,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0, -36)
            }}
            onClick={() => setSelectedPoint(point)}
          >
            {selectedPoint && selectedPoint.id === point.id && (
              <EntityDescription>
                <h3 className="text-lg font-bold">Wind Data</h3>
                <p>Speed: {point.speed.toFixed(1)} m/s</p>
                <p>Direction: {point.direction.toFixed(1)}°</p>
                <p>Weather: {point.weather}</p>
                <p>Time: {new Date(point.timestamp).toLocaleTimeString()}</p>
              </EntityDescription>
            )}
          </Entity>
        ))}
        
        {/* Fly to selected point */}
        {selectedPoint && (
          <CameraFlyTo 
            destination={Cesium.Cartesian3.fromDegrees(
              selectedPoint.position.longitude, 
              selectedPoint.position.latitude, 
              50000
            )}
            duration={2.0}
          />
        )}
      </Viewer>
    </div>
  );
};

export default CesiumMap;
