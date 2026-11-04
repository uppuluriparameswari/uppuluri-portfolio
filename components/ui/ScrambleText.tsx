
"use client";

import { useEffect, useState } from "react";

interface ScrambleTextProps {
  text: string;
  duration?: number;
  delay?: number;
  className?: string;
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

export function ScrambleText({
  text,
  duration = 1800,
  delay = 1200,
  className = "",
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    let iteration = 0;
    const totalIterations = 30;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";

              if (index < iteration) return text[index];

              return characters[
                Math.floor(Math.random() * characters.length)
              ];
            })
            .join("")
        );

        iteration += text.length / totalIterations;

        if (iteration >= text.length) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, duration / totalIterations);

      return () => clearInterval(interval);
    }, runId === 0 ? delay : 0);

    return () => clearTimeout(timeout);
  }, [text, duration, delay, runId]);

  const handleMouseEnter = () => {
    setRunId((prev) => prev + 1);
  };

  return (
    <span
      className={className}
      onMouseEnter={handleMouseEnter}
      aria-label={text}
    >
      <span aria-hidden="true">{displayText}</span>
    </span>
  );
}
