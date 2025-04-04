'use client'

import React, { Suspense, lazy, useEffect } from 'react'
import './spline-fix.css'
const Spline = lazy(() => import('@splinetool/react-spline'))

export function SplineScene({ scene, className }) {
  // Function to remove gray background after component loads
  useEffect(() => {
    const removeGrayBox = () => {
      // Find and remove gray background elements
      const grayElements = document.querySelectorAll('[style*="background-color: rgb(229, 229, 229)"]');
      grayElements.forEach(el => {
        el.style.backgroundColor = 'transparent';
      });
      
      // Also check for canvas elements
      const canvasElements = document.querySelectorAll('canvas');
      canvasElements.forEach(canvas => {
        canvas.style.background = 'transparent';
      });
    };
    
    // Run initially and periodically to catch dynamically added elements
    removeGrayBox();
    const interval = setInterval(removeGrayBox, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
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
          background: 'transparent',
          backgroundColor: 'transparent'
        }}
      />
    </Suspense>
  )
} 