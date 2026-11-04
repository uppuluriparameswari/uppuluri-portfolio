"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export function Globe({
  className,
  globeConfig, // We accept these props so your section doesn't throw errors
  data,
}: {
  className?: string;
  globeConfig?: any;
  data?: any[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    let currentWidth = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onResize = () => {
      if (canvas) {
        currentWidth = canvas.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: currentWidth * 2,
      height: currentWidth * 2,
      phi: 0,
      theta: 0.15,
      dark: 1, // Deep obsidian theme
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.04, 0.04, 0.05], // Obsidian background
      markerColor: [0.23, 0.51, 0.96], // Blue accent for markers
      glowColor: [0.12, 0.15, 0.3], // Subtle atmospheric glow
      markers: [
        { location: [12.9716, 77.5946], size: 0.07 }, // Bengaluru
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003; // Smooth auto-rotation speed
        state.width = currentWidth * 2;
        state.height = currentWidth * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={`w-full max-w-[550px] md:max-w-[700px] aspect-square flex items-center justify-center ${className || ""}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain pointer-events-none opacity-90 mix-blend-screen"
      />
    </div>
  );
}
