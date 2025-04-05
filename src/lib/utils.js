import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names with Tailwind CSS support
 * @param {...string} inputs - The classes to be combined
 * @returns {string} - The combined class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
