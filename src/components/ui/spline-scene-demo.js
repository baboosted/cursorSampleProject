"use client";

import React, { useState, useEffect } from "react";
import { SplineScene } from "./spline-scene";
import { Card } from "./card";
import { Spotlight } from "./spotlight";
import { motion } from "framer-motion";

export function SplineSceneBasic() {
  const [isMobile, setIsMobile] = useState(false);
  const [showIndicator, setShowIndicator] = useState(true);

  // Detect mobile devices
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Handle click on the scene to dismiss the indicator
  const handleSceneClick = () => {
    if (showIndicator) {
      setShowIndicator(false);
    }
  };

  return (
    <Card className="w-full h-[500px] bg-black/[0.96] border-0 relative overflow-hidden">
      <Spotlight
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        fill="white"
      />

      {/* Centered robot with transparent background */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        onClick={handleSceneClick}
      >
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />

        {/* Mobile click indicator */}
        {isMobile && showIndicator && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 text-black px-5 py-3 rounded-full font-medium text-sm shadow-lg flex items-center justify-center z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0.7, 1, 0.7],
              y: [5, 0, 5],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <span className="mr-2 w-3 h-3 bg-blue-500 rounded-full inline-block animate-ping"></span>
            Click to interact
          </motion.div>
        )}
      </div>
    </Card>
  );
}
