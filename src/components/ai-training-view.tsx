
import React from "react";
import { CesiumMap } from "./cesium-map";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface AITrainingViewProps {
  trainingData?: any;
  locationData?: any;
}

const AITrainingView: React.FC<AITrainingViewProps> = ({ 
  trainingData, 
  locationData 
}) => {
  // Default to Nigeria's coordinates if no location data provided
  const defaultCenter = { lat: 9.0820, lng: 8.6753 };
  
  const markers = locationData 
    ? locationData.map((loc: any, index: number) => ({
        id: loc.id || `loc-${index}`,
        position: {
          lat: loc.latitude || loc.lat,
          lng: loc.longitude || loc.lng
        },
        title: loc.name || `Location ${index + 1}`
      }))
    : [];

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>AI Training Visualization</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-4rem)]">
        <CesiumMap 
          center={locationData?.[0]?.position || defaultCenter} 
          zoom={7}
          markers={markers}
        />
      </CardContent>
    </Card>
  );
};

export default AITrainingView;
