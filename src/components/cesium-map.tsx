
import { useEffect, useRef } from "react";
import { Viewer, Scene, Globe, Camera } from "resium";
import {
  Cartesian3,
  createWorldTerrainAsync,
  Ion,
  IonImageryProvider,
  createOsmBuildingsAsync,
  ShadowMap,
  Color
} from "@cesium/engine";
import { WindParticleSystem3D } from "./WindParticleSystem3D";

// Set Cesium ion access token
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyMjY0NjQ5OH0.XcKpgANiY19MC4bdFUXMVEBToBmBLjssJQb_QYrdBnQ";

export const CesiumMap = () => {
  const viewerRef = useRef<any>(null);

  // Initialize the Cesium viewer
  useEffect(() => {
    if (!viewerRef.current) return;
    
    const viewer = viewerRef.current.cesiumElement;
    if (!viewer) return;

    // Set viewer configuration
    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.showGroundAtmosphere = true;
    viewer.scene.fog.enabled = true;
    viewer.scene.skyAtmosphere.show = true;
    viewer.scene.postProcessStages.fxaa.enabled = true;

    // Add 3D buildings
    const addBuildings = async () => {
      try {
        const osmBuildings = await createOsmBuildingsAsync();
        viewer.scene.primitives.add(osmBuildings);
      } catch (error) {
        console.error("Error adding 3D buildings:", error);
      }
    };

    // Create terrain and add 3D buildings
    createWorldTerrainAsync()
      .then(terrain => {
        viewer.terrainProvider = terrain;
        addBuildings();
      })
      .catch(error => {
        console.error("Error loading terrain:", error);
        // Still try to add buildings even if terrain fails
        addBuildings();
      });

    // Configure shadows
    viewer.shadowMap = new ShadowMap({
      enabled: true,
      size: 2048,
      softShadows: true,
      darkness: 0.3,
      fadingEnabled: true,
      maximumDistance: 10000,
      normalOffset: false
    });

    // Fixed: Removed the argument to flyTo to fix TS2554 error
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(9.0765, 7.3986, 1500000),
      orientation: {
        heading: 0.0,
        pitch: -0.5,
        roll: 0.0
      }
    });

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
    <div className="h-screen">
      <Viewer
        ref={viewerRef}
        full
        timeline={false}
        animation={false}
        homeButton={false}
        navigationInstructionsInitiallyVisible={false}
        navigationHelpButton={false}
        sceneModePicker={false}
        baseLayerPicker={false}
        geocoder={false}
        scene3DOnly={true}
        shadows={true}
        className="cesium-viewer-dark"
      >
        {viewerRef.current?.cesiumElement && (
          <WindParticleSystem3D viewer={viewerRef.current.cesiumElement} />
        )}
      </Viewer>
    </div>
  );
};
