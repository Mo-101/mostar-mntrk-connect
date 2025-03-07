
import { useEffect, useRef } from "react";
import { Viewer, Scene, Globe, Camera } from "resium";
import { 
  Ion, Cartesian3, Color, BoundingSphere,
  createWorldTerrainAsync, ShadowMap
} from "@cesium/engine";

// Set up your Cesium ion access token
Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ODM3ODdlYy0yMDEwLTQzODYtODA3Mi0xN2IzNmFlZWZkNWMiLCJpZCI6MTcyMDQ1LCJpYXQiOjE2OTcxMDAyMjl9.6gSfTWv-L3QQiyIwUQ-c7dw8bQbVyMoVn9qGVrBePZI";

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
    
    viewer.camera.flyToBoundingSphere(boundingSphere, {
      duration: 2,
      offset: {
        heading: 0,
        pitch: -Math.PI / 4,
        range: 1000000
      }
    });

    // Clean up
    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
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
