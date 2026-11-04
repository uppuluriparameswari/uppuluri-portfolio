import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely, resolving conflicts.
 * Essential for components that accept custom className props.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
