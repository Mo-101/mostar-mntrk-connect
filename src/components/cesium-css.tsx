"use client"

import { useEffect } from "react";

export default function CesiumCSS() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/cesium/Widgets/widgets.css";
    document.head.appendChild(link);
  }, []);

  return null;
}
