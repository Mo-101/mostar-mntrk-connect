
import React, { useEffect, useRef, useState } from "react";
import { Viewer, Entity, Globe, Scene, Camera } from "resium";
import {
  Cartesian3,
  Color,
  HeadingPitchRoll,
  JulianDate,
  PolylineGlowMaterialProperty,
  Transforms,
  Viewer as CesiumViewer,
  Math as CesiumMath,
  Ion,
  createWorldTerrain,
  createOsmBuildings,
  IonResource,
} from "cesium";

interface CesiumMapProps {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: {
      lat: number;
      lng: number;
    };
    title?: string;
  }>;
}

// Initialize Cesium with API key
const CESIUM_DEFAULT_KEY = import.meta.env.VITE_CESIUM_KEY || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMmRmYzcxNC0yZjM5LTQ0NzUtYWRkYi1kMjc1NzYwYTQ0NjYiLCJpZCI6MjE0OTQzLCJpYXQiOjE3MTU2NTMyNjN9.1fW--_-6R3TApPF2tAlOfXrqJadYPdwKqpPVkPetHP4";

Ion.defaultAccessToken = CESIUM_DEFAULT_KEY;

const CesiumMapComponent: React.FC<CesiumMapProps> = ({ 
  center = { lat: 9.0820, lng: 8.6753 }, // Default to Nigeria
  zoom = 6,
  markers = [] 
}) => {
  const viewerRef = useRef<CesiumViewer | null>(null);
  const [isViewerReady, setIsViewerReady] = useState(false);

  useEffect(() => {
    if (viewerRef.current && isViewerReady) {
      // Fly to location
      viewerRef.current.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          center.lng,
          center.lat,
          zoom * 10000
        ),
        orientation: {
          heading: CesiumMath.toRadians(0),
          pitch: CesiumMath.toRadians(-45),
          roll: 0.0,
        },
      });
    }
  }, [center, zoom, isViewerReady]);

  const handleViewerReady = (viewer: CesiumViewer) => {
    viewerRef.current = viewer;
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.globe.enableLighting = true;
    
    // Add terrain
    viewer.terrainProvider = createWorldTerrain();
    
    // Add buildings
    viewer.scene.primitives.add(createOsmBuildings());
    
    setIsViewerReady(true);
    
    console.log("Cesium Viewer initialized:", viewer);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Viewer
        full
        timeline={false}
        animation={false}
        baseLayerPicker={true}
        geocoder={true}
        homeButton={true}
        navigationHelpButton={false}
        sceneModePicker={true}
        terrainProvider={createWorldTerrain()}
        onReady={handleViewerReady}
      >
        <Scene />
        <Globe />
        <Camera />
        
        {markers.map((marker) => (
          <Entity
            key={marker.id}
            name={marker.title || `Marker ${marker.id}`}
            position={Cartesian3.fromDegrees(
              marker.position.lng,
              marker.position.lat,
              0
            )}
            point={{ pixelSize: 10, color: Color.RED }}
            description={marker.title || `Marker ${marker.id}`}
          />
        ))}
      </Viewer>
    </div>
  );
};

// Export the component for use in other files
export default CesiumMapComponent;

// Export CesiumMap for backward compatibility with existing imports
export const CesiumMap = CesiumMapComponent;
