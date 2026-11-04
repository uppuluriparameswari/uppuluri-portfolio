
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

const PROJECTS = [
  {
    year: "2024",
    title: "Swasthya — Mental Wellness Platform",
    description:
      "An AI-powered wellness platform featuring multi-modal health tracking, clinician connectivity, and automated prediction pipelines.",
    tags: ["Python", "Flask", "Deep Learning", "MySQL"],
    github:
      "https://github.com/uppuluriparameswari/Swasthya",
  },
  {
    year: "2024",
    title: "Down Syndrome Detection System",
    description:
      "A facial-image classification system using VGG16, MobileNet, and SVM models with Flask-based real-time inference.",
    tags: ["Python", "VGG16", "MobileNet", "SVM"],
    github:
      "https://github.com/uppuluriparameswari/Down-Syndrome-Detection",
  },
  {
    year: "2024",
    title: "Speech Classification & Speaker Recognition",
    description:
      "An audio processing system for speaker identification, audio classification, and speech disfluency detection.",
    tags: ["Python", "Librosa", "TensorFlow", "SVM"],
    github:
      "https://github.com/uppuluriparameswari/Speech-Classification-Speaker-Recognition",
  },
];

export function ProjectsExpandable() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      id="projects"
      className="min-h-screen min-h-[100dvh] w-full flex flex-col justify-center items-center px-6 py-16 snap-start font-sans"
    >
      <div className="w-full max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between pb-5 mb-3">
          <h2 className="text-sm font-medium uppercase tracking-wider text-foreground">
            Selected Projects
          </h2>

          <a
            href="https://github.com/uppuluriparameswari?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            All Repositories ↗
          </a>
        </div>

        {/* Projects List */}
        <div className="space-y-1">
          {PROJECTS.map((project, index) => {
            const isActive = active === project.title;
            const triggerId = `project-trigger-${index}`;
            const panelId = `project-details-${index}`;

            return (
              <motion.div
                key={project.title}
                onPointerEnter={(event) => {
                  // Expand on desktop hover; touch and pen keep explicit activation.
                  if (event.pointerType === "mouse") setActive(project.title);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") {
                    setActive((current) =>
                      current === project.title ? null : current,
                    );
                  }
                }}
                animate={{
                  backgroundColor: isActive
                    ? "var(--surface-accent, rgba(128,128,128,0.07))"
                    : "rgba(128,128,128,0)",
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className={`relative px-3 py-5 rounded-lg overflow-hidden transition-colors duration-300 ${
                  isActive ? "bg-accent/5" : "hover:bg-muted/30"
                }`}
              >
                {/* Left Accent Indicator */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scaleY: isActive ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-accent"
                />

                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={panelId}
                  onClick={() => setActive(isActive ? null : project.title)}
                  className="grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                >
                  <span className="text-xs font-mono text-muted-foreground">
                    {project.year}
                  </span>

                  <span
                    className={`text-sm md:text-base font-medium transition-colors duration-300 ${
                      isActive ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {project.title}
                  </span>

                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                    className={`transition-all duration-300 ${
                      isActive
                        ? "text-accent translate-x-0.5 -translate-y-0.5"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>

                {/* Expandable Content */}
                <AnimatePresence initial={false}>
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    aria-hidden={!isActive}
                    inert={!isActive}
                    initial={false}
                    animate={{
                      height: isActive ? "auto" : 0,
                      opacity: isActive ? 1 : 0,
                      y: isActive ? 0 : -5,
                    }}
                    transition={{
                      height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                      opacity: { duration: 0.25 },
                      y: { duration: 0.3, ease: "easeOut" },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pl-12 pt-4 pb-1 space-y-4">

                        {/* Description */}
                        <p className="max-w-xl text-sm text-muted-foreground leading-relaxed">
                          {project.description}
                        </p>

                        {/* Technologies + GitHub */}
                        <div className="flex flex-wrap items-center justify-between gap-3">

                          {/* Technology Tags */}
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[11px] font-mono text-muted-foreground border border-border/70 rounded px-2 py-1"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* GitHub Link */}
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-foreground transition-colors whitespace-nowrap"
                          >
                            View Source Code
                            <ArrowUpRight
                              size={13}
                              className="transition-transform duration-200 group-hover:translate-x-0.5"
                            />
                          </a>
                        </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 px-3 py-5 rounded-lg border border-dashed border-border/70 flex items-center gap-4"
        >
          <div className="w-9 h-9 rounded-full border border-border/70 flex items-center justify-center shrink-0">
            <Sparkles
              size={15}
              className="text-muted-foreground"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground">
              More things are brewing...
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              New ideas, little experiments, and projects in the making.
              Stay tuned!
            </p>
          </div>

          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-border/70 rounded px-2 py-1 shrink-0">
            Coming Soon
          </span>
        </motion.div>

      </div>
    </section>
  );
}
