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

export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    ...options,
  }).format(new Date(date));
}

export const filterBySearch = <T>(
  items: T[],
  search: string,
  key: keyof T,
): T[] => {
  if (!search.trim()) return items;

  const query = search.toLowerCase();

  return items.filter((item) => {
    const value = item[key];

    if (typeof value !== "string") return false;

    return value.toLowerCase().includes(query);
  });
};
