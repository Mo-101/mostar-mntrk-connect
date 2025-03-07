import React from "react";
import { CesiumMap } from "./cesium-map";

export function Map() {
  return (
    <div className="flex inset-0 w-screen h-screen">
      <CesiumMap />
    </div>
  );
}
