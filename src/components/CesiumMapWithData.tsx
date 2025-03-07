
import { useEffect, useRef, useState } from "react";
import { Viewer, Entity } from "resium";
import { Cartesian3, Color, ScreenSpaceEventHandler, ScreenSpaceEventType } from "cesium";
import { createWorldTerrainAsync, Cesium3DTileset, Cesium3DTileStyle } from "@cesium/engine";
import { useMockApi } from "@/hooks/useMockApi";
import { MapLocation, AlertMarker } from "@/types/map";
import { fetchMapLocations, fetchMapAlerts, getRiskColor } from "@/utils/mapUtils";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, ThermometerSun, Wind, Droplets, Leaf, Users, Bird, Cloud, CloudRain, CloudSun, Rat, Eye } from "lucide-react";

export const CesiumMapWithData = () => {
  const viewerRef = useRef<any>(null);
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [alerts, setAlerts] = useState<AlertMarker[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const { apiCall } = useMockApi();
  const { toast } = useToast();

  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = viewerRef.current.cesiumElement;
    if (!viewer) return;

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
        
        // Load map data after terrain is loaded
        loadMapData();
      })
      .catch(error => {
        console.error("Error loading terrain:", error);
      });

    // Initial view - centered on Nigeria
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(7.9, 9.0, 2000000),
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

  const loadMapData = async () => {
    try {
      // Fetch locations
      const locationsData = await fetchMapLocations();
      setLocations(locationsData);
      
      // Fetch alerts
      const alertsData = await fetchMapAlerts();
      setAlerts(alertsData);
      
      // Show toast notification
      toast({
        title: "Map Data Loaded",
        description: `${locationsData.length} locations and ${alertsData.length} alerts loaded.`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error loading map data:", error);
      toast({
        title: "Error Loading Map Data",
        description: "There was a problem loading the map data. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleLocationClick = (location: MapLocation) => {
    if (!viewerRef.current?.cesiumElement) return;
    
    const viewer = viewerRef.current.cesiumElement;
    
    // Fly to the location
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        location.coordinates[0], 
        location.coordinates[1], 
        300000
      ),
      orientation: {
        heading: 0.0,
        pitch: -0.5,
        roll: 0.0
      },
      duration: 2
    });
    
    setSelectedLocation(location);
    
    // Show toast with location info
    toast({
      title: `${location.name} - ${location.risk_level} Risk`,
      description: location.details?.description || "No additional information available",
      variant: "default"
    });
  };

  const getLocationColor = (location: MapLocation) => {
    if (!location.risk_level) return Color.GRAY;
    
    switch (location.risk_level) {
      case 'HIGH':
        return Color.RED;
      case 'MEDIUM':
        return Color.ORANGE;
      case 'LOW':
        return Color.GREEN;
      default:
        return Color.GRAY;
    }
  };

  const getAlertIcon = (icon: string) => {
    switch (icon) {
      case 'rat':
        return <Rat className="h-4 w-4 text-white" />;
      case 'alert-triangle':
        return <AlertTriangle className="h-4 w-4 text-white" />;
      case 'thermometer-sun':
        return <ThermometerSun className="h-4 w-4 text-white" />;
      case 'droplets':
        return <Droplets className="h-4 w-4 text-white" />;
      case 'leaf':
        return <Leaf className="h-4 w-4 text-white" />;
      case 'eye':
        return <Eye className="h-4 w-4 text-white" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-white" />;
    }
  };

  return (
    <div className="w-full h-full bg-[#0D1326] relative overflow-hidden">
      <Viewer
        ref={viewerRef}
        full
        timeline={false}
        animation={false}
        baseLayerPicker={false}
        homeButton={false}
        navigationInstructionsInitiallyVisible={false}
        navigationHelpButton={false}
        sceneModePicker={false}
        selectionIndicator={false}
        infoBox={false}
        geocoder={false}
        className="cesium-viewer-dark"
      >
        {viewerLoaded && locations.map(location => (
          <Entity
            key={`location-${location.id}`}
            position={Cartesian3.fromDegrees(location.coordinates[0], location.coordinates[1])}
            point={{
              pixelSize: 15,
              color: getLocationColor(location),
              outlineColor: Color.WHITE,
              outlineWidth: 2,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            }}
            name={location.name}
            description={location.details?.description}
            onClick={() => handleLocationClick(location)}
          />
        ))}
        
        {viewerLoaded && alerts.map(alert => (
          <Entity
            key={`alert-${alert.id}`}
            position={Cartesian3.fromDegrees(alert.coordinates[0], alert.coordinates[1], 10000)}
            point={{
              pixelSize: alert.intensity === 'high' ? 18 : (alert.intensity === 'medium' ? 15 : 12),
              color: Color.fromCssColorString(alert.color).withAlpha(0.8),
              outlineColor: Color.WHITE,
              outlineWidth: 2,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            }}
            name={`Alert: ${alert.message}`}
            description={alert.message}
            onClick={() => {
              toast({
                title: "Alert Information",
                description: alert.message,
                variant: "destructive"
              });
            }}
          />
        ))}
      </Viewer>
      
      {/* Alert Legend */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-3 rounded-md border border-gray-700">
        <h3 className="text-white font-medium mb-2 text-sm">Active Alerts</h3>
        <div className="space-y-2">
          {alerts.map(alert => (
            <div 
              key={alert.id} 
              className="flex items-center gap-2 text-xs text-white cursor-pointer hover:bg-gray-800/50 p-1 rounded"
              onClick={() => {
                if (!viewerRef.current?.cesiumElement) return;
                
                const viewer = viewerRef.current.cesiumElement;
                viewer.camera.flyTo({
                  destination: Cartesian3.fromDegrees(alert.coordinates[0], alert.coordinates[1], 100000),
                  duration: 2
                });
                
                toast({
                  title: "Alert Information",
                  description: alert.message,
                  variant: "destructive"
                });
              }}
            >
              <div 
                className={`w-3 h-3 rounded-full ${
                  alert.intensity === 'high' ? 'animate-ping-fast' : 
                  alert.intensity === 'medium' ? 'animate-ping-medium' : 'animate-ping-slow'
                }`} 
                style={{ backgroundColor: alert.color }}
              />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: alert.color }} />
              <span>{alert.message.substring(0, 30)}...</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm p-4 rounded-md border border-gray-700 max-w-xs">
          <h3 className="text-white font-medium mb-2">
            {selectedLocation.name} 
            <span 
              className={`ml-2 px-2 py-0.5 rounded text-xs ${
                selectedLocation.risk_level === 'HIGH' ? 'bg-red-500/20 text-red-500' :
                selectedLocation.risk_level === 'MEDIUM' ? 'bg-orange-500/20 text-orange-500' :
                'bg-green-500/20 text-green-500'
              }`}
            >
              {selectedLocation.risk_level} RISK
            </span>
          </h3>
          
          <div className="space-y-2 text-sm text-gray-300">
            {selectedLocation.details?.temperature && (
              <div className="flex items-center gap-2">
                <ThermometerSun className="h-4 w-4 text-yellow-500" />
                <span>{selectedLocation.details.temperature}°C</span>
              </div>
            )}
            
            {selectedLocation.details?.humidity && (
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span>{selectedLocation.details.humidity}% Humidity</span>
              </div>
            )}
            
            {selectedLocation.details?.population_count && (
              <div className="flex items-center gap-2">
                <Rat className="h-4 w-4 text-red-500" />
                <span>Population Count: {selectedLocation.details.population_count}</span>
              </div>
            )}
            
            {selectedLocation.details?.description && (
              <p className="text-xs text-gray-400 mt-2">{selectedLocation.details.description}</p>
            )}
            
            {selectedLocation.details?.last_observation && (
              <div className="text-xs text-gray-400 mt-1">
                Last observation: {new Date(selectedLocation.details.last_observation).toLocaleDateString()}
              </div>
            )}
          </div>
          
          <button 
            className="mt-3 w-full bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs py-1.5 rounded transition-colors"
            onClick={() => setSelectedLocation(null)}
          >
            Close
          </button>
        </div>
      )}
      
      {/* Overlay gradient for better UI integration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0F1C] to-transparent pointer-events-none" />
    </div>
  );
};
