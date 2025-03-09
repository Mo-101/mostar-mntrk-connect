
import React from "react";
import { CesiumMap } from "./cesium-map";

interface MapProps {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}

const Map: React.FC<MapProps> = ({ center, zoom }) => {
  return (
    <div className="w-full h-full">
      <CesiumMap center={center} zoom={zoom} />
    </div>
  );
};

export default Map;
