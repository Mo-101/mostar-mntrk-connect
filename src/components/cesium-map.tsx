
import React, { useEffect, useRef, useState } from "react";
import { Viewer, CameraFlyTo } from "resium";
import { Cartesian3, Color, Ion } from "cesium";
import { createWorldTerrainAsync } from "@cesium/engine";

// Updated Cesium ion access token
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyMjY0NjQ5NH0.XcKpgANiY22ejXTcPEpn1LdtBFmjpfDgL1SJB6cOFS8";

interface CesiumMapProps {
  height?: string;
  width?: string;
}

export const CesiumMapComponent: React.FC<CesiumMapProps> = ({ height = "100vh", width = "100%" }) => {
  const viewerRef = useRef<any>(null);
  const [terrainLoaded, setTerrainLoaded] = useState(false);

  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = viewerRef.current.cesiumElement;
    if (!viewer) return;

    // Configure viewer
    viewer.scene.globe.enableLighting = true;
    viewer.scene.skyAtmosphere.show = true;
    viewer.scene.fog.enabled = true;
    
    // Set background color
    viewer.scene.backgroundColor = Color.fromCssColorString('#0D1326');
    
    // Add terrain with error handling
    createWorldTerrainAsync()
      .then(terrain => {
        viewer.terrainProvider = terrain;
        setTerrainLoaded(true);
      })
      .catch(error => {
        console.error("Error loading terrain:", error);
      });

    // Clean up on unmount
    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, []);

  // Fixed: Remove the parameter from flyToBoundingSphere
  const flyToBoundingSphere = () => {
    if (!viewerRef.current || !viewerRef.current.cesiumElement) return;

    const viewer = viewerRef.current.cesiumElement;
    
    // Use flyTo instead which correctly accepts parameters
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(8.6753, 9.0820, 1500000), // Nigeria coordinates
      orientation: {
        heading: 0.0,
        pitch: -0.5,
        roll: 0.0
      }
    });
  };

  return (
    <div style={{ width, height }} className="relative">
      <Viewer
        ref={viewerRef}
        full
        timeline={false}
        animation={false}
        baseLayerPicker={false}
        geocoder={false}
        homeButton={false}
        sceneModePicker={false}
        navigationHelpButton={false}
      />
    </div>
  );
};
