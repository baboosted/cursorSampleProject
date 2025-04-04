"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import createGlobe from "cobe"
import { cn } from "../../lib/utils"

const GLOBE_CONFIG = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.8,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [0, 0, 0],
  glowColor: [0.1, 0.1, 0.1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}) {
  let phi = 0
  let width = 0
  const canvasRef = useRef(null)
  const pointerInteracting = useRef(null)
  const pointerInteractionMovement = useRef(0)
  const [r, setR] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isLowPerfMode, setIsLowPerfMode] = useState(false)

  // Check if the device is mobile or low performance
  useEffect(() => {
    const checkDeviceCapabilities = () => {
      // Check if mobile
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      
      // Simple performance detection
      let isLowPerf = false;
      
      // Check for older browsers/devices
      try {
        // Try to detect low performance devices
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        if (!gl) {
          isLowPerf = true;
        } else {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            // Look for terms that might indicate lower performance
            isLowPerf = /(intel|microsoft|swiftshader|llvmpipe)/i.test(renderer);
          }
        }
      } catch (e) {
        console.warn("Error detecting performance capabilities", e);
        // Default to low performance mode if detection fails
        isLowPerf = true;
      }
      
      setIsLowPerfMode(isLowPerf || isMobileDevice);
    };
    
    checkDeviceCapabilities();
    window.addEventListener('resize', checkDeviceCapabilities);
    
    return () => window.removeEventListener('resize', checkDeviceCapabilities);
  }, []);

  const updatePointerInteraction = (value) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      setR(delta / 200)
    }
  }

  const onRender = useCallback(
    (state) => {
      // Adjust rotation speed based on device type and performance
      if (!pointerInteracting.current) {
        // Slower rotation for mobile and low-performance devices
        const baseSpeed = 0.005;
        const performanceFactor = isLowPerfMode ? 0.4 : 1;
        const mobileFactor = isMobile ? 0.6 : 1;
        phi += baseSpeed * performanceFactor * mobileFactor;
      }
      state.phi = phi + r
      
      // Adjust resolution for better performance on low-end devices
      const resolutionFactor = isLowPerfMode ? 1.5 : 2;
      state.width = width * resolutionFactor
      state.height = width * resolutionFactor
    },
    [r, isMobile, isLowPerfMode],
  )

  const onResize = () => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth
    }
  }

  useEffect(() => {
    window.addEventListener("resize", onResize)
    onResize()

    // Modify config for low-performance devices
    const adaptiveConfig = {
      ...config,
      mapSamples: isLowPerfMode ? 8000 : config.mapSamples, // Reduce sample count
      devicePixelRatio: isLowPerfMode ? 1 : config.devicePixelRatio, // Lower resolution
    };

    const globe = createGlobe(canvasRef.current, {
      ...adaptiveConfig,
      width: width * (isLowPerfMode ? 1.5 : 2),
      height: width * (isLowPerfMode ? 1.5 : 2),
      onRender,
    })

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1"
      }
    }, 200)
    
    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [isMobile, isLowPerfMode])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className,
      )}
    >
      <canvas
        className={cn(
          "h-full w-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]",
        )}
        ref={canvasRef}
        onPointerDown={(e) =>
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current,
          )
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
} 