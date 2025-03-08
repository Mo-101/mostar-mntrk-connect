
import { useEffect, useRef } from "react";
import { Viewer, Scene, Globe, Camera } from "resium";
import { 
  Ion, Cartesian3, Color, BoundingSphere,
  createWorldTerrainAsync, ShadowMap
} from "@cesium/engine";

// Set up your Cesium ion access token with a valid token
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyMjY0NjQ5OH0.XcKpgANiY19MC4bdFUXMVEBToBmBLjssJQb_QYrdBnQ";

export const CesiumMap = () => {
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = viewerRef.current.cesiumElement;
    if (!viewer) return;

    // Configure the viewer
    viewer.scene.globe.enableLighting = true;
    
    // Set up shadows
    viewer.shadowMap = new ShadowMap({
      enabled: true,
      darkness: 0.3,
      size: 2048,
      softShadows: true,
      fadingEnabled: true,
      maximumDistance: 10000,
      normalOffset: false
    });

    // Fly to Nigeria
    const nigeriaCenter = Cartesian3.fromDegrees(8.6753, 9.0820, 1000000);
    const boundingSphere = new BoundingSphere(nigeriaCenter, 1000000);
    
    // Fixed: Using flyToBoundingSphere without arguments
    viewer.camera.flyToBoundingSphere(boundingSphere);

    // Clean up
    return () => {
      if (viewer && !viewer.isDestroyed()) {
        try {
          viewer.destroy();
        } catch (e) {
          console.error("Error destroying viewer:", e);
        }
      }
    };
  }, []);

  return (
    <div className="h-full w-full">
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
        infoBox={false}
        selectionIndicator={false}
      >
        {viewerRef.current?.cesiumElement && (
          <WindParticleSystem3D viewer={viewerRef.current.cesiumElement} />
        )}
      </Viewer>
    </div>
  );
};
