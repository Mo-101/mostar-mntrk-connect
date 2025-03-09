"use client";

import { useEffect, useState } from "react";
import { Viewer, Entity } from "resium";
import { Cartesian3, Ion, Color } from "cesium";
import React from "react";

const CESIUM_ACCESS_TOKEN = "YOUR_CESIUM_ACCESS_TOKEN"; // Replace with your actual token

export function ResiumViewer() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // ✅ Important: Set CESIUM_BASE_URL *before* using any Cesium functionality
    (window as any).CESIUM_BASE_URL = "/cesium/";

    Ion.defaultAccessToken = CESIUM_ACCESS_TOKEN;
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null; // Or a loading indicator
  }

  return (
    <Viewer full>
      <Entity position={Cartesian3.fromDegrees(10, 8, 70000)} point={{ pixelSize: 10, color: Color.RED }} />
    </Viewer>
  );
}