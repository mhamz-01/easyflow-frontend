import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const truncateWord = (word: string, limit: number = 20): string => {
  if (word.length <= limit) return word;

  return `${word.slice(0, limit)}...`;
};

// check user role
// return as string
export const checkUserRole = (userID: string, workspaceAdminID: string) => {
  return userID === workspaceAdminID ? "Admin" : "Member";
};

// if string exceeds 15 characters,
export const isLong = (string: string) => {
  return string.length > 20;
};

export const normalizeUrl = (url: string) => {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};
