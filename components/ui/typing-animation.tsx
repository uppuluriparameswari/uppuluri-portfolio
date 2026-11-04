
"use client";

import { useEffect, useState } from "react";

interface TypingAnimationProps {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDelay?: number;
  loop?: boolean;
  className?: string;
}

export function TypingAnimation({
  words,
  typeSpeed = 50,
  deleteSpeed = 35,
  pauseDelay = 1800,
  loop = true,
  className,
}: TypingAnimationProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (!words.length) return;

    const currentWord = words[wordIndex];

    const delay = isDeleting
      ? deleteSpeed
      : text === currentWord
        ? pauseDelay
        : typeSpeed;

    const timeout = setTimeout(() => {
      if (!isDeleting && text === currentWord) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && text === "") {
        setIsDeleting(false);

        if (loop || wordIndex < words.length - 1) {
          setWordIndex((prev) => (prev + 1) % words.length);
        }

        return;
      }

      setText((prev) =>
        isDeleting
          ? prev.slice(0, -1)
          : currentWord.slice(0, prev.length + 1)
      );
    }, delay);

    return () => clearTimeout(timeout);
  }, [
    text,
    isDeleting,
    wordIndex,
    words,
    typeSpeed,
    deleteSpeed,
    pauseDelay,
    loop,
    animationKey,
  ]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setText("");
    setWordIndex(0);
    setIsDeleting(false);
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <span
      className={`inline-block cursor-pointer ${className ?? ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={handleMouseEnter}
      tabIndex={0}
      role="text"
      aria-label={words[wordIndex]}
    >
      {text}
      <span
        className={`inline-block ml-1 h-[1em] w-[1px] bg-current align-middle ${
          isHovered ? "animate-pulse" : "animate-pulse"
        }`}
        aria-hidden="true"
      />
    </span>
  );
}
