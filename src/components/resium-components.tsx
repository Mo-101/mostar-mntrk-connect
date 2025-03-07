"use client"

import { Viewer, Entity } from "resium"
import { Cartesian3, Ion, Color } from "cesium"

interface ResiumComponentsProps {
  accessToken: string
}

export default function ResiumComponents({ accessToken }: ResiumComponentsProps) {
  Ion.defaultAccessToken = accessToken

  return (
    <Viewer full>
      <Entity position={Cartesian3.fromDegrees(-74.006, 40.7128, 100000)} point={{ pixelSize: 10, color: Color.RED }} />
    </Viewer>
  )
}

