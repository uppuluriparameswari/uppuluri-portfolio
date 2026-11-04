"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Mouse position state
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth trailing spring physics for the outer target ring
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only mount on devices that use a fine pointer (mouse/trackpad)
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Track when hovering over clickable/interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, .cursor-pointer'
      );
      setIsHovered(Boolean(interactive));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleElementHover);

    // Set initial visibility safely on mount
    setIsVisible(true);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleElementHover);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    // Updated z-index to z-[9999] so it stays above the postcard modal
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* 1. Outer Smooth Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          width: isHovered ? 46 : isClicked ? 24 : 30,
          height: isHovered ? 46 : isClicked ? 24 : 30,
          borderColor: isHovered
            ? "var(--brand-accent, #C28E38)"
            : "rgba(128, 128, 128, 0.35)",
          backgroundColor: isHovered
            ? "rgba(194, 142, 56, 0.08)"
            : "transparent",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      />

      {/* 2. Core Focal Dot (Immediate, no spring delay) */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform bg-accent"
        style={{
          x: mouseX,
          y: mouseY,
        }}
        animate={{
          width: isClicked ? 3 : isHovered ? 6 : 4,
          height: isClicked ? 3 : isHovered ? 6 : 4,
          opacity: isHovered ? 0.9 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
