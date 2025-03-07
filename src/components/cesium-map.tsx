
import { useEffect, useRef } from "react";
import { Viewer, Scene, Globe, Camera } from "resium";
import {
  Cartesian3,
  createWorldTerrainAsync,
  Ion,
  IonImageryProvider,
  createOsmBuildingsAsync,
  ShadowMode
} from "@cesium/engine";
import { WindParticleSystem3D } from "./WindParticleSystem3D";

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
      });

    // Set initial camera position
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
        viewer.destroy();
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
        <Scene 
          shadowMap={{ 
            enabled: true,
            size: 2048,
            softShadows: true
          }}
        />
        <Globe
          enableLighting={true}
          showGroundAtmosphere={true}
          depthTestAgainstTerrain={true}
        />
        <Camera />
        {viewerRef.current && <WindParticleSystem3D viewerRef={viewerRef} />}
      </Viewer>
    </div>
  );
};
