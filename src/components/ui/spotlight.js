import React from 'react'
import { cn } from '../../lib/utils'

export function Spotlight({ className, fill = "white", ...props }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-30 transition duration-300", 
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r opacity-0" />
      <div
        className="absolute inset-0 opacity-25 blur-[80px]"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${fill}, transparent 35%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b opacity-10 via-transparent" />
    </div>
  )
} 