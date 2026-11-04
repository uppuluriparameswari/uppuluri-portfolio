"use client";

import { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { cn } from "@/lib/utils";

interface RoleRecord {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
}

interface HubNode {
  id: string;
  name: string;
  state: string;
  mapCoordinates: [number, number];
  roles: RoleRecord[];
}

const CAREER_HUBS: HubNode[] = [
  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    mapCoordinates: [73.8567, 18.5204],
    roles: [
      {
        role: "UI/UX Intern (Hybrid)",
        company: "Predulive Innovations",
        period: "Nov 2024 – Dec 2024",
        location: "Pune, Maharashtra",
        highlights: [
          "Architected accessible, user-centered interfaces for an assistive image-to-speech platform.",
          "Applied inclusive design heuristics and accessibility standards (WCAG 2.2) to high-fidelity prototypes.",
        ],
      },
    ],
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    mapCoordinates: [77.5946, 12.9716],
    roles: [
      {
        role: "Scientific Visual Designer",
        company: "Qpi AI",
        period: "May 2025 – Present",
        location: "Bengaluru, Karnataka",
        highlights: [
          "Engineer production-grade frontend components using Next.js, React, TypeScript, and Tailwind CSS for AI and quantum platforms.",
          "Transform complex quantum computing models and machine learning pipelines into interactive technical dashboards.",
          "Design system architecture, technical visualizations, and educational content for the Qpi AI Explorer platform.",
        ],
      },
      {
        role: "AI/ML Graphic Intern",
        company: "Qpi AI",
        period: "Jan 2025 – Apr 2025",
        location: "Bengaluru, Karnataka",
        highlights: [
          "Developed visual communication frameworks and technical assets for enterprise AI demonstrations and technical whitepapers.",
        ],
      },
    ],
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    mapCoordinates: [78.4867, 17.385],
    roles: [
      {
        role: "Application Developer",
        company: "Medicover Corporate Office",
        period: "Sep 2024 – Oct 2024",
        location: "Hyderabad, Telangana",
        highlights: [
          "Engineered and optimized internal healthcare application modules, improving runtime speed and UX consistency.",
        ],
      },
      {
        role: "Speech Processing Intern",
        company: "IIIT Hyderabad",
        period: "May 2024 – Jun 2024",
        location: "Hyderabad, Telangana",
        highlights: [
          "Developed acoustic feature extraction pipelines and neural audio classifiers for speaker identification and disfluency detection.",
        ],
      },
    ],
  },
  {
    id: "visakhapatnam",
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    mapCoordinates: [83.2185, 17.6868],
    roles: [
      {
        role: "B.Tech in Artificial Intelligence & Data Science",
        company: "Vignan Institute of Information Technology",
        period: "2021 – 2025",
        location: "Visakhapatnam, Andhra Pradesh",
        highlights: [
          "Core specialization in Machine Learning, Computer Vision, Speech Processing, and Human-Centered UI/UX.",
          "Awarded 2nd Place at National Hackathon for rapid application prototyping and MVP delivery.",
        ],
      },
    ],
  },
  {
    id: "rajahmundry",
    name: "Rajahmundry",
    state: "Andhra Pradesh",
    mapCoordinates: [81.72, 16.9891],
    roles: [
      {
        role: "Data Analytics Intern",
        company: "Technical Hub",
        period: "May 2023 – Jun 2023",
        location: "Hybrid",
        highlights: [
          "Analyzed datasets using Excel and Tableau to create dashboards and analytical reports.",
          "Performed data cleaning, validation, and exploratory data analysis.",
        ],
      },
    ],
  },
];

const CITY_LABELS: Record<
  string,
  {
    x: number;
    y: number;
    anchor: "start" | "end" | "middle";
  }
> = {
  pune: { x: 0, y: -23, anchor: "middle" },
  hyderabad: { x: -28, y: -12, anchor: "end" },
  visakhapatnam: { x: 24, y: -20, anchor: "start" },
  rajahmundry: { x: 0, y: 31, anchor: "middle" },
  bengaluru: { x: 0, y: 29, anchor: "middle" },
};

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

export function ExperienceIndiaMap() {
  const [selectedHubId, setSelectedHubId] = useState("pune");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeHub =
    CAREER_HUBS.find((hub) => hub.id === selectedHubId) ?? CAREER_HUBS[0];

  return (
    <section
      id="experience"
      className="min-h-screen min-h-[100dvh] w-full flex flex-col justify-center items-center px-5 sm:px-8 lg:px-10 py-12 md:py-16 snap-start font-sans"
    >
      <style>{`
        .career-map-marker:focus-visible {
          outline: none;
          filter: drop-shadow(0 0 3px var(--brand-accent));
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14 items-center min-w-0">
        {/* LEFT — CAREER JOURNEY */}
        <div className="w-full min-w-0 flex flex-col self-center">
          <div className="mb-4">
            <span className="text-muted text-xs font-mono uppercase tracking-[0.2em]">
              Career Journey
            </span>
          </div>

          <div className="w-full flex justify-center items-center">
            <div 
              className="career-map-wrapper w-full max-w-[460px] lg:max-w-[480px] max-h-[50vh] aspect-[760/700] outline-none border-0 shadow-none flex items-center justify-center"
              aria-hidden="true"
            >
              {isMounted ? (
                <ComposableMap
                  width={760}
                  height={700}
                  projection="geoMercator"
                  projectionConfig={{
                    center: [81, 22],
                    scale: 1250,
                  }}
                  className="career-map-svg w-full h-auto select-none outline-none border-0 shadow-none"
                  tabIndex={-1}
                  focusable="false"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    outline: "none",
                    background: "transparent",
                    overflow: "visible",
                  }}
                >
                  <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                      geographies
                        .filter((geo) => geo.properties?.name === "India")
                        .map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="transparent"
                            stroke="#888888"
                            strokeWidth={1.2}
                            style={{
                              default: { outline: "none" },
                              hover: { outline: "none" },
                              pressed: { outline: "none" },
                            } as any}
                          />
                        ))
                    }
                  </Geographies>

                  {CAREER_HUBS.map((hub) => {
                    const isSelected = selectedHubId === hub.id;
                    const label = CITY_LABELS[hub.id];

                    return (
                      <Marker key={hub.id} coordinates={hub.mapCoordinates}>
                        <g
                          className="career-map-marker cursor-pointer"
                          aria-label={`Select ${hub.name}`}
                          aria-pressed={isSelected}
                          onClick={() => setSelectedHubId(hub.id)}
                        >
                          {isSelected && (
                            <circle
                              r={11}
                              fill="#C58D38"
                              opacity={0.13}
                              pointerEvents="none"
                            />
                          )}

                          <circle
                            r={isSelected ? 5 : 4}
                            fill="#C58D38"
                            stroke="var(--background)"
                            strokeWidth={1.5}
                            pointerEvents="none"
                          />

                          <circle r={1.8} fill="#ffffff" pointerEvents="none" />

                          <text
                            x={label.x}
                            y={label.y}
                            textAnchor={label.anchor}
                            dominantBaseline="middle"
                            fontSize={13}
                            fontFamily="Arial, sans-serif"
                            fontWeight={isSelected ? 600 : 450}
                            fill="currentColor"
                            className="text-foreground select-none"
                            pointerEvents="none"
                          >
                            {hub.name}
                          </text>

                          <circle r={15} fill="transparent" pointerEvents="all" />
                        </g>
                      </Marker>
                    );
                  })}
                </ComposableMap>
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center gap-2 font-mono text-xs text-muted/60 select-none animate-pulse"
                >
                  <span className="h-2 w-2 rounded-full bg-accent/60" />
                  <span>Calibrating spatial trajectory...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — PROFESSIONAL EXPERIENCE */}
        <div className="w-full min-w-0 flex flex-col self-center">
          <div className="mb-4">
            <h2 className="text-sm font-medium tracking-[0.08em] uppercase text-foreground">
              Professional Experience
            </h2>
          </div>

          <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
            <h3 className="text-xl md:text-2xl font-medium tracking-tight text-foreground">
              {activeHub.name}, {activeHub.state}
            </h3>

            <span className="text-xs text-muted font-mono whitespace-nowrap pt-1">
              {activeHub.roles.length}{" "}
              {activeHub.roles.length === 1 ? "Position" : "Positions"}
            </span>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {activeHub.roles.map((item, idx) => (
              <article
                key={`${item.company}-${idx}`}
                className="py-5 flex flex-col gap-2.5 min-w-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h4 className="text-lg md:text-xl font-medium text-foreground tracking-tight">
                    {item.role}
                  </h4>

                  <span className="font-mono text-xs text-muted whitespace-nowrap">
                    {item.period}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  <span className="text-foreground font-medium">{item.company}</span>
                  <span className="text-muted">•</span>
                  <span className="text-muted">{item.location}</span>
                </div>

                <ul className="flex flex-col gap-2 mt-1">
                  {item.highlights.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-muted"
                    >
                      <span className="text-accent shrink-0 mt-[2px]">▹</span>
                      <span className="min-w-0">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="pt-5 mt-1 border-t border-border">
            <span className="text-xs font-mono text-muted tracking-wide block mb-3">
              Explore Locations
            </span>

            <div className="flex flex-wrap gap-2">
              {CAREER_HUBS.map((hub) => (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => setSelectedHubId(hub.id)}
                  aria-pressed={selectedHubId === hub.id}
                  aria-label={`View roles in ${hub.name}`}
                  className={cn(
                    "px-3.5 py-2 text-xs sm:text-sm rounded border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    selectedHubId === hub.id
                      ? "border-accent text-accent bg-accent/5 font-medium"
                      : "border-border text-muted hover:text-foreground hover:border-foreground/40"
                  )}
                >
                  {hub.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
