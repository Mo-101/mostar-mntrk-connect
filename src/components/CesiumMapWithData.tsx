
import { useEffect, useRef, useState } from "react";
import { Viewer, Entity } from "resium";
import { Cartesian3, Color, ScreenSpaceEventHandler, ScreenSpaceEventType } from "cesium";
import { createWorldTerrainAsync, Cesium3DTileset, Cesium3DTileStyle, IonResource } from "@cesium/engine";
import { WindParticleSystem3D } from "@/components/WindParticleSystem3D";
import { useApi } from "@/hooks/useApi";
import { MapLocation } from "@/types/api";

interface CesiumMapWithDataProps {
  onViewerCreated?: (viewer: any) => void;
}

export const CesiumMapWithData = ({ onViewerCreated }: CesiumMapWithDataProps) => {
  const viewerRef = useRef<any>(null);
  const { apiCall, api } = useApi();
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const [viewerInstance, setViewerInstance] = useState<any>(null);

  useEffect(() => {
    // Fetch map locations
    const fetchMapLocations = async () => {
      try {
        // Modified to match the correct return type
        const response = await api.mapData.getLocations();
        if (response && Array.isArray(response)) {
          setLocations(response);
        }
      } catch (error) {
        console.error("Error fetching map locations:", error);
      }
    };

    fetchMapLocations();

    // Set up the viewer when it's available
    if (!viewerRef.current) return;

    const viewer = viewerRef.current.cesiumElement;
    if (!viewer) return;

    // Store viewer instance
    setViewerInstance(viewer);
    
    // Call the onViewerCreated callback if provided
    if (onViewerCreated) {
      onViewerCreated(viewer);
    }

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

    // Set up event handling for entity selection
    const handler = new ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction((click: any) => {
      const pickedObject = viewer.scene.pick(click.position);
      if (pickedObject && pickedObject.id) {
        const entity = pickedObject.id;
        if (entity && entity.name) {
          console.log("Selected entity:", entity.name);
          // Additional entity selection logic could go here
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    // Dynamic camera movement for more visual interest
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
      handler.destroy();
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, [api, apiCall, onViewerCreated]);

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
        {/* Add entities for each location */}
        {locations.map((location, index) => (
          <Entity
            key={index}
            name={location.name}
            position={Cartesian3.fromDegrees(
              location.coordinates[0],
              location.coordinates[1]
            )}
            point={{
              pixelSize: 10,
              color: location.risk_level === 'HIGH' 
                ? Color.RED 
                : location.risk_level === 'MEDIUM' 
                  ? Color.YELLOW 
                  : Color.GREEN,
              outlineColor: Color.WHITE,
              outlineWidth: 2
            }}
            description={`Type: ${location.type}, Risk Level: ${location.risk_level || 'N/A'}`}
          />
        ))}
        
        {/* Add WindParticleSystem when viewer is loaded */}
        {viewerLoaded && viewerInstance && <WindParticleSystem3D viewer={viewerInstance} />}
      </Viewer>
      {/* Overlay gradient for better UI integration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0F1C] to-transparent pointer-events-none" />
    </div>
  );
};
