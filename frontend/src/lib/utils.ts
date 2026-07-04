import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sanitizeErrorMessage = (rawMessage: unknown, fallback: string) => {
  if (!rawMessage || typeof rawMessage !== "string") return fallback
  const sanitized = rawMessage.trim()
  if (/failed query|insert into|syntax error|database|internal server error|unauthorized|forbidden/i.test(sanitized)) {
    return fallback
  }
  return sanitized
}
