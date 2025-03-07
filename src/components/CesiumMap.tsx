
import { useEffect, useRef } from "react";
import { Viewer, Scene, Globe, Camera } from "resium";
import { 
  Ion, ShadowMap, Cartesian3, Matrix4, 
  CameraFlyToBoundingSphere, BoundingSphere 
} from "cesium";
import { WindParticleSystem3D } from "./WindParticleSystem3D";

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
        <Scene 
          skyBox={false}
          backgroundColor={{ red: 0, green: 0, blue: 0, alpha: 1 }}
          globe={{ enableLighting: true }}
        />
        <Globe 
          enableLighting={true}
          baseColor={{ red: 0.1, green: 0.1, blue: 0.2, alpha: 1 }}
        />
        <Camera 
          position={Cartesian3.fromDegrees(8.6753, 9.0820, 2000000)}
          direction={new Cartesian3(0, 0, -1)}
          frustum={{ near: 100, far: 10000000 }}
        />
        
        {viewerRef.current && viewerRef.current.cesiumElement && (
          <WindParticleSystem3D viewer={viewerRef.current.cesiumElement} />
        )}
      </Viewer>
    </div>
  );
};
