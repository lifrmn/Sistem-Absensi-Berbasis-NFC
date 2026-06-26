export function sanitizeText(input: string): string {
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

export function normalizeIdentifier(input: string): string {
  return sanitizeText(input).toLowerCase();
}
