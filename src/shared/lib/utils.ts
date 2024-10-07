import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const delay = (time: number) => (
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  })
);

export const getErrorMessage = (error: unknown, defaultMessage: string) => (
  error instanceof Error ? error.message : defaultMessage
);