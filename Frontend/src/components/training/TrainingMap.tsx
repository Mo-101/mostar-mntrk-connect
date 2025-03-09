
import React, { useEffect, useRef, useState } from 'react';
import { Viewer, Entity } from "resium";
import { Cartesian3, Color, ShadowMode } from "cesium";
import { createWorldTerrainAsync, Cesium3DTileset, Cesium3DTileStyle, IonResource } from "@cesium/engine";
import { WindParticleSystem3D } from "@/components/WindParticleSystem3D";

export function TrainingMap() {
  const viewerRef = useRef<any>(null);
  const [viewerInstance, setViewerInstance] = useState<any>(null);
  const [viewerLoaded, setViewerLoaded] = useState(false);

  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = viewerRef.current.cesiumElement;
    if (!viewer) return;

    // Store the viewer instance
    setViewerInstance(viewer);

    // Enable lighting effects
    viewer.scene.globe.enableLighting = true;
    
    // Set a dark space background
    viewer.scene.backgroundColor = Color.fromCssColorString('#0D0F1C');
    viewer.scene.globe.baseColor = Color.fromCssColorString('#081020');
    
    // Configure viewer settings
    viewer.scene.skyAtmosphere.show = true;
    viewer.scene.fog.enabled = true;
    viewer.scene.fog.density = 0.0002;
    viewer.scene.fog.screenSpaceErrorFactor = 4.0;
    
    // Add terrain
    createWorldTerrainAsync()
      .then(terrain => {
        viewer.terrainProvider = terrain;
        setViewerLoaded(true);
      })
      .catch(error => {
        console.error("Error loading terrain:", error);
      });

    // Dynamic camera movement
    let lastNow = Date.now();
    viewer.clock.onTick.addEventListener(() => {
      const now = Date.now();
      const delta = (now - lastNow) / 1000;
      lastNow = now;
      
      if (viewer.camera.pitch < -0.3) {
        viewer.camera.rotateRight(0.05 * delta);
      }
    });

    // Initial view focused on Nigeria
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(8.6753, 9.0820, 1500000), // Nigeria coordinates
      orientation: {
        heading: 0.0,
        pitch: -0.5,
        roll: 0.0
      }
    });

    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full h-full bg-[#0D1326] relative overflow-hidden">
      <Viewer
        ref={viewerRef}
        full
        timeline={false}
        animation={false}
        homeButton={false}
        navigationHelpButton={false}
        sceneModePicker={false}
        baseLayerPicker={false}
        geocoder={false}
        className="cesium-viewer-dark"
      >
        {viewerLoaded && viewerInstance && <WindParticleSystem3D viewer={viewerInstance} />}
      </Viewer>
      {/* Overlay gradient for better UI integration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0F1C] to-transparent pointer-events-none" />
    </div>
  );
}
