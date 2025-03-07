import { cn } from "@/lib/utils";
import { Viewer } from "@cesium/widgets";
import { createWorldTerrainAsync } from "@cesium/engine";
import "@cesium/widgets/Source/widgets.css";
import React from "react";

interface GlobeVisualizationProps {
  className?: string;
}

export const GlobeVisualization = ({ className }: GlobeVisualizationProps) => {
  // Initialize Cesium Viewer after component mounts
  React.useEffect(() => {
    // Initialize viewer
    const viewer = new Viewer("cesiumContainer", {
      // Initialize with basic options first
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false
    });

    // Initialize terrain asynchronously
    createWorldTerrainAsync()
      .then(terrain => {
        viewer.terrainProvider = terrain;
      })
      .catch(error => {
        console.error("Error loading terrain:", error);
      });

    // Clean up when component unmounts
    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, []);

  return (
    <div
      id="cesiumContainer"
      className={cn(
        "top-60% bottom-60% right-0 left-0 bg-black",
        className
      )}
    />
  );
};

export default GlobeVisualization;