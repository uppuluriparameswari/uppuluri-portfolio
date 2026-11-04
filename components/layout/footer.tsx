"use client";

import { useEffect, useState } from "react";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full px-6 py-12 md:px-12 md:py-16 mt-20 border-t border-border">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-mono text-xs text-muted">
        
        {/* Left Column */}
        <div className="flex flex-col gap-1">
          <span className="text-foreground font-medium">Uppuluri Parameswari</span>
          <span>Scientific Visualist & Frontend Designer</span>
        </div>

        {/* Right Column */}
        <div className="flex flex-col md:text-right gap-1">
          <span>&copy; {year ?? 2026} — Bengaluru, India</span>
          <div className="flex gap-4 md:justify-end mt-1">
            <a
              href="https://www.linkedin.com/in/uppuluriparameswari/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:Parameswari.u@outlook.com"
              className="hover:text-foreground transition-colors"
            >
              Email
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
