
"use client";

import ParticleText from "@/components/ui/ParticleText";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { ArrowDown } from "lucide-react";

export function Hero() {
  const handleScrollToNext = () => {
    const target = document.getElementById("introduction");

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="relative h-screen min-h-[100dvh] w-full flex flex-col items-center justify-center px-6 snap-start">

      {/* Centered Monolith */}
      <div className="w-full flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-spring">

        {/* Particle Name */}
        <div className="w-full max-w-[1100px] flex justify-center items-center">
          <div
            className="w-full"
            style={{
              height: "clamp(120px, 16vw, 180px)",
            }}
          >
            <ParticleText
              text="uppuluriparameswari"
              particleSize={2.2}
              density={4}
              color="currentColor"
              highlightColor="var(--brand-accent)"
              highlightMode="motion"
              shape="circle"
              intro="gather"
              scatter={190}
              gatherDuration={1600}
              stagger={420}
              clickBurst
              burstStrength={1}
              pointerRepel={42}
              repelRadius={120}
              idleDrift={0.8}
              trigger="mount"
              fontSize="clamp(2.5rem, 5vw + 1rem, 4.75rem)"
              fontWeight={600}
              fontFamily="inherit"
              glow
            />
          </div>
        </div>

        {/* Scramble Subtitle */}
        <p className="font-sans text-muted text-sm md:text-base tracking-wide flex items-center gap-1.5 text-center">
          <ScrambleText
            text="I Dream It. I Design It. I Bring It to Life."
            duration={1800}
            delay={1200}
          />
        </p>

      </div>

      {/* Interactive Smooth-Scroll Arrow */}
      <button
        type="button"
        onClick={handleScrollToNext}
        className="group absolute bottom-10 flex flex-col items-center gap-2 text-muted hover:text-foreground transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-border rounded-full p-2 animate-in fade-in duration-1000 delay-500 fill-mode-both"
        aria-label="Scroll to introduction section"
      >
        <span className="font-mono text-[11px] tracking-widest uppercase text-muted group-hover:text-accent transition-colors">
          Explore
        </span>

        <ArrowDown
          className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-y-1 transition-all duration-300 animate-bounce"
          strokeWidth={1.5}
        />
      </button>

    </section>
  );
}
