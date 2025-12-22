import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility Functions
export const getInitials = (name: string | null): string => {
  if (!name) return 'T';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const getGreeting = (currentTime: Date | null, isClient: boolean): string => {
  if (!isClient || !currentTime) return 'Hello';
  
  const hour = currentTime.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getGreetingEmoji = (currentTime: Date | null, isClient: boolean): string => {
  if (!isClient || !currentTime) return '👋';
  
  const hour = currentTime.getHours();
  if (hour < 12) return '🌅';
  if (hour < 17) return '☀️';
  return '🌙';
};

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")     // remove special chars
    .replace(/\s+/g, "-")             // spaces → hyphens
    .replace(/-+/g, "-");             // collapse duplicates
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));