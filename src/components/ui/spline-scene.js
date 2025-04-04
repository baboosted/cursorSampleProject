"use client";

import React, { Suspense, lazy, useEffect, useState } from "react";
import "./spline-fix.css";
const Spline = lazy(() => import("@splinetool/react-spline"));

// Create a simpler fallback for low-performance devices
function SimpleFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="animate-pulse mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
      </div>
      <p className="text-sm">Loading 3D Scene...</p>
    </div>
  );
}

export function SplineScene({ scene, className }) {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check device performance
  useEffect(() => {
    // Detect low performance device
    const checkPerformance = () => {
      // Check for very low-end devices only
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl");

        if (!gl) {
          setIsLowPerformance(true);
          return;
        }

        // Try to get renderer info
        try {
          const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
          if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            // Look only for very slow GPU/software renderers
            if (/(swiftshader|llvmpipe)/i.test(renderer)) {
              setIsLowPerformance(true);
              return;
            }
          }
        } catch (e) {
          console.warn("Error getting WebGL renderer info:", e);
        }

        // Allow mobile devices to render 3D content
        // Don't automatically flag mobile as low performance

        // If we've gotten this far, device should be capable
        setIsLowPerformance(false);
      } catch (e) {
        console.warn("Error during performance detection:", e);
        setIsLowPerformance(true);
      }
    };

    checkPerformance();
  }, []);

  // Function to remove gray background after component loads
  useEffect(() => {
    const removeGrayBox = () => {
      // Find and remove gray background elements
      const grayElements = document.querySelectorAll(
        '[style*="background-color: rgb(229, 229, 229)"]'
      );
      grayElements.forEach((el) => {
        el.style.backgroundColor = "transparent";
      });

      // Also check for canvas elements
      const canvasElements = document.querySelectorAll("canvas");
      canvasElements.forEach((canvas) => {
        canvas.style.background = "transparent";
      });
    };

    // Run initially and periodically to catch dynamically added elements
    if (isLoaded) {
      removeGrayBox();
      const interval = setInterval(removeGrayBox, 1000);

      return () => clearInterval(interval);
    }
  }, [isLoaded]);

  // If device is low performance, show a simpler 3D scene or static image
  if (isLowPerformance) {
    return (
      <div className={className} style={{ background: "transparent" }}>
        <SimpleFallback />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        style={{
          background: "transparent",
          backgroundColor: "transparent",
        }}
        onLoad={() => setIsLoaded(true)}
      />
    </Suspense>
  );
}
