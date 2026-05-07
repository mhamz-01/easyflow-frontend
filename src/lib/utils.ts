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
export const isAdmin = (userID: string, workspaceAdminID: string): boolean => {
  return userID === workspaceAdminID;
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

// return a random color
const RANDOM_COLORS = [
  "#1A8FE8", // brighter blue
  "#803232", // brighter maroon
  "#D4A92F", // brighter gold
  "#28A57B", // brighter green
  "#7150A0", // brighter purple
  "#B34727", // brighter reddish-brown
];
export const getColorFromGroup = (group: string) => {
  let hash = 0;

  for (let i = 0; i < group.length; i++) {
    hash = group.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % RANDOM_COLORS.length;
  return RANDOM_COLORS[index];
};

// convert r3 file key into a previewable URL
export const getFileUrl = (fileKey: string) => {
  return `${process.env.NEXT_PUBLIC_FILE_BASE_URL}/${fileKey}`;
};

export const getDocPreviewUrl = (fileUrl: string) => {
  return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`;
};
