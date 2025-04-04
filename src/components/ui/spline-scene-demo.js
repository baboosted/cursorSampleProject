'use client'

import React from 'react'
import { SplineScene } from "./spline-scene"
import { Card } from "./card"
import { Spotlight } from "./spotlight"
 
export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] border-0 relative overflow-hidden">
      <Spotlight
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        fill="white"
      />
      
      {/* Centered robot with transparent background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <SplineScene 
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </Card>
  )
} 