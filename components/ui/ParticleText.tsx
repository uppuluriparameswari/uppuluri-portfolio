
"use client";

import { useEffect, useRef } from "react";

interface ParticleTextProps {
  text: string;
  particleSize?: number;
  density?: number;
  color?: string;
  highlightColor?: string;
  highlightMode?: "motion" | "all";
  shape?: "circle" | "square";
  intro?: "gather" | "scatter" | "none";
  scatter?: number;
  gatherDuration?: number;
  stagger?: number;
  clickBurst?: boolean;
  burstStrength?: number;
  pointerRepel?: number;
  repelRadius?: number;
  idleDrift?: number;
  trigger?: "mount";
  fontSize?: string;
  fontWeight?: number;
  fontFamily?: string;
  glow?: boolean;
}

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  delay: number;
  phase: number;
}

export default function ParticleText({
  text,
  particleSize = 2.2,
  density = 4,
  color = "currentColor",
  highlightColor = "var(--brand-accent)",
  highlightMode = "motion",
  shape = "circle",
  intro = "gather",
  scatter = 190,
  gatherDuration = 1600,
  stagger = 420,
  clickBurst = true,
  burstStrength = 1,
  pointerRepel = 42,
  repelRadius = 120,
  idleDrift = 0.8,
  fontSize = "clamp(2.5rem, 5vw + 1rem, 4.75rem)",
  fontWeight = 600,
  fontFamily = "inherit",
  glow = true,
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let particles: Particle[] = [];

    let width = 0;
    let height = 0;
    let startTime = 0;
    let disposed = false;

    let pointer = { x: -1000, y: -1000 };
    let pointerActive = false;

    // Resolve CSS colors, including theme variables.
    const resolveColor = (value: string): string => {
      const computed = getComputedStyle(wrapper);

      if (value === "currentColor") {
        return computed.color;
      }

      if (value.startsWith("var(")) {
        const variable = value.match(/--[\w-]+/)?.[0];

        if (variable) {
          return (
            computed.getPropertyValue(variable).trim() ||
            getComputedStyle(document.documentElement)
              .getPropertyValue(variable)
              .trim()
          );
        }
      }

      return value;
    };

    const createParticles = () => {
      if (!width || !height) return;

      const offscreen = document.createElement("canvas");

      offscreen.width = Math.ceil(width);
      offscreen.height = Math.ceil(height);

      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      // Resolve actual CSS typography.
      const fontProbe = document.createElement("span");

      fontProbe.style.position = "absolute";
      fontProbe.style.visibility = "hidden";
      fontProbe.style.whiteSpace = "nowrap";
      fontProbe.style.fontSize = fontSize;
      fontProbe.style.fontWeight = String(fontWeight);
      fontProbe.style.fontFamily = fontFamily;

      wrapper.appendChild(fontProbe);

      const probeStyle = getComputedStyle(fontProbe);

      const resolvedFontSize = parseFloat(probeStyle.fontSize);
      const resolvedFontFamily = probeStyle.fontFamily;
      const resolvedFontWeight = probeStyle.fontWeight;

      wrapper.removeChild(fontProbe);

      let actualFontSize = resolvedFontSize;

      const setFont = (size: number) => {
        offCtx.font = `${resolvedFontWeight} ${size}px ${resolvedFontFamily}`;
      };

      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#ffffff";

      setFont(actualFontSize);

      // Fit the name inside the available canvas width.
      const maxTextWidth = width * 0.96;
      const measuredWidth = offCtx.measureText(text).width;

      if (measuredWidth > maxTextWidth) {
        actualFontSize *= maxTextWidth / measuredWidth;
        setFont(actualFontSize);
      }

      // Generate the text mask.
      offCtx.fillText(text, width / 2, height / 2);

      const imageData = offCtx.getImageData(
        0,
        0,
        offscreen.width,
        offscreen.height
      );

      particles = [];

      const gap = Math.max(2, density);

      for (let y = 0; y < offscreen.height; y += gap) {
        for (let x = 0; x < offscreen.width; x += gap) {
          const index = (y * offscreen.width + x) * 4;

          if (imageData.data[index + 3] > 100) {
            const angle = Math.random() * Math.PI * 2;
            const distance = scatter * (0.5 + Math.random());

            particles.push({
              x:
                intro === "gather"
                  ? x + Math.cos(angle) * distance
                  : intro === "scatter"
                    ? Math.random() * width
                    : x,

              y:
                intro === "gather"
                  ? y + Math.sin(angle) * distance
                  : intro === "scatter"
                    ? Math.random() * height
                    : y,

              tx: x,
              ty: y,
              vx: 0,
              vy: 0,
              delay: Math.random() * stagger,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
      }

      startTime = performance.now();
    };

    const resize = () => {
      if (disposed) return;

      const rect = wrapper.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createParticles();
    };

    const draw = (time: number) => {
      if (disposed) return;

      ctx.clearRect(0, 0, width, height);

      const elapsed = time - startTime;

      const baseColor = resolveColor(color);
      const accentColor = resolveColor(highlightColor);

      particles.forEach((p) => {
        const progress = Math.min(
          1,
          Math.max(0, (elapsed - p.delay) / gatherDuration)
        );

        const eased = 1 - Math.pow(1 - progress, 4);

        // Gather particles into the name.
        if (intro !== "none") {
          const attraction = 0.045 + eased * 0.18;

          p.x += (p.tx - p.x) * attraction;
          p.y += (p.ty - p.y) * attraction;
        }

        // Particle momentum.
        p.vx *= 0.88;
        p.vy *= 0.88;

        // Pointer repulsion.
        if (pointerActive) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < repelRadius && distance > 0) {
            const force =
              ((repelRadius - distance) / repelRadius) *
              pointerRepel *
              0.08;

            p.vx += (dx / distance) * force;
            p.vy += (dy / distance) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Gentle idle movement.
        const drift =
          progress >= 1
            ? Math.sin(time * 0.001 + p.phase) * idleDrift * 0.12
            : 0;

        const px = p.x + drift;
        const py = p.y + drift;

        const dx = px - pointer.x;
        const dy = py - pointer.y;

        const nearPointer =
          pointerActive &&
          dx * dx + dy * dy < repelRadius * repelRadius;

        // Theme-aware highlight.
        const particleColor =
          highlightMode === "all"
            ? accentColor
            : nearPointer
              ? accentColor
              : baseColor;

        ctx.fillStyle = particleColor;

        if (glow) {
          ctx.shadowBlur = nearPointer ? 10 : 3;
          ctx.shadowColor = particleColor;
        } else {
          ctx.shadowBlur = 0;
        }

        if (shape === "circle") {
          ctx.beginPath();
          ctx.arc(
            px,
            py,
            particleSize / 2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        } else {
          ctx.fillRect(px, py, particleSize, particleSize);
        }
      });

      ctx.shadowBlur = 0;

      animationFrame = requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();

      pointer = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      pointerActive = true;
    };

    const handlePointerLeave = () => {
      pointerActive = false;
      pointer = { x: -1000, y: -1000 };
    };

    const handleClick = (event: MouseEvent) => {
      if (!clickBurst) return;

      const rect = canvas.getBoundingClientRect();

      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      particles.forEach((p) => {
        const dx = p.x - clickX;
        const dy = p.y - clickY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repelRadius * 1.5 && distance > 0) {
          const force =
            (1 - distance / (repelRadius * 1.5)) *
            burstStrength *
            18;

          p.vx += (dx / distance) * force;
          p.vy += (dy / distance) * force;
        }
      });
    };

    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("click", handleClick);

    document.fonts.ready.then(() => {
      if (!disposed) resize();
    });

    resize();

    animationFrame = requestAnimationFrame(draw);

    return () => {
      disposed = true;

      cancelAnimationFrame(animationFrame);
      observer.disconnect();

      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("click", handleClick);
    };
  }, [
    text,
    particleSize,
    density,
    color,
    highlightColor,
    highlightMode,
    shape,
    intro,
    scatter,
    gatherDuration,
    stagger,
    clickBurst,
    burstStrength,
    pointerRepel,
    repelRadius,
    idleDrift,
    fontSize,
    fontWeight,
    fontFamily,
    glow,
  ]);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full overflow-visible"
      style={{ color: "inherit" }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-pointer"
        role="img"
        aria-label={text}
      />
    </div>
  );
}
