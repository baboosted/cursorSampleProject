"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { cn } from "../../lib/utils";

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
};

export function Globe({ className, config = GLOBE_CONFIG }) {
  let phi = 0;
  let width = 0;
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const [r, setR] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [isLowPerfMode, setIsLowPerfMode] = useState(false);

  // Check if the device is mobile or low performance
  useEffect(() => {
    const checkDeviceCapabilities = () => {
      // Check device type with more granularity
      const smallMobile = window.innerWidth < 480; // iPhone and small phones
      const tablet = window.innerWidth >= 480 && window.innerWidth < 768; // iPad mini and tablets

      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(smallMobile);

      // Update config for different device types
      if (canvasRef.current) {
        if (smallMobile) {
          canvasRef.current.dataset.deviceType = "small-mobile";
        } else if (tablet) {
          canvasRef.current.dataset.deviceType = "tablet";
        } else {
          canvasRef.current.dataset.deviceType = "desktop";
        }
      }
    };

    checkDeviceCapabilities();
    window.addEventListener("resize", checkDeviceCapabilities);

    return () => window.removeEventListener("resize", checkDeviceCapabilities);
  }, []);

  const updatePointerInteraction = (value) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      setR(delta / 200);
    }
  };

  const onRender = useCallback(
    (state) => {
      // Get the specific device type
      const deviceType =
        canvasRef.current?.dataset?.deviceType || "small-mobile";
      const isSmallMobile = deviceType === "small-mobile";
      const isTablet = deviceType === "tablet";

      // For all devices, we want a gentle spinning effect
      if (!pointerInteracting.current) {
        phi += 0.002; // Slower rotation for a more gentle effect
      }

      if (isSmallMobile) {
        // For iPhone - now with spinning
        state.phi = phi;
        state.theta = 0;
        state.width = width * 1.2;
        state.height = width * 1.2;
        state.offset = [0, 0];
        return;
      } else if (isTablet) {
        // For tablets (like iPad Pro) - now with spinning
        state.phi = phi;
        state.theta = 0;
        state.width = width * 2.5;
        state.height = width * 2.5;
        state.offset = [0, 0];
        return;
      }

      // For desktop - maintain existing rotation behavior
      state.phi = phi + r;
      state.width = width * 2;
      state.height = width * 2;
    },
    [r, width]
  );

  const onResize = () => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();

    // Get the current device type
    const deviceType = canvasRef.current?.dataset?.deviceType || "small-mobile";
    const isSmallMobile = deviceType === "small-mobile";

    // Create a device-specific configuration based on screen size
    const smallMobileConfig = {
      ...config,
      width: width * 1.2, // Increased slightly to fill the container
      height: width * 1.2,
      phi: 0,
      theta: 0,
      dark: 0,
      diffuse: 0.9, // Increased diffuse for better visibility
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [0, 0, 0],
      glowColor: [0.1, 0.1, 0.1],
      offset: [0, 0],
      mapSamples: 10000,
      devicePixelRatio: 1,
    };

    const tabletConfig = {
      ...config,
      width: width * 2.5,
      height: width * 2.5,
      phi: 0,
      theta: 0,
      dark: 0,
      diffuse: 0.85,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [0, 0, 0],
      glowColor: [0.1, 0.1, 0.1],
      offset: [0, 0],
      mapSamples: 16000,
      devicePixelRatio: 2,
    };

    const desktopConfig = {
      ...config,
      width: width * 2,
      height: width * 2,
    };

    // Select the appropriate config based on device type
    let adaptiveConfig;
    if (isSmallMobile) {
      adaptiveConfig = smallMobileConfig;
    } else if (isMobile) {
      adaptiveConfig = tabletConfig;
    } else {
      adaptiveConfig = desktopConfig;
    }

    const globe = createGlobe(canvasRef.current, {
      ...adaptiveConfig,
      onRender,
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 200);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [isMobile, isLowPerfMode]);

  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[600px] flex items-center justify-center overflow-hidden rounded-full cursor-grab active:cursor-grabbing",
        isSmallMobile ? "scale-100" : "",
        className
      )}
    >
      <canvas
        className={cn(
          "h-full w-full opacity-0 transition-opacity duration-500 rounded-full touch-none",
          isSmallMobile ? "transform-gpu scale-[1.5]" : ""
        )}
        ref={canvasRef}
        onPointerDown={(e) =>
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current
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
  );
}
