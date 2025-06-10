/**
 * Regular expression for validating attribute names.
 * Allows only letters (any unicode letter), numbers, spaces, and single quotes.
 */
export const VALID_RE = /^[\p{L}\p{N} ']+$/u;

/**
 * Regular expression to match characters that are not allowed in attribute names.
 * Used for sanitizing input strings.
 */
const BAD_CHARS = /[^\p{L}\p{N} ']/gu;

/**
 * Sanitizes a raw input string by removing invalid characters and trimming whitespace.
 * @param raw - The raw input string to sanitize
 * @returns The sanitized string with only valid characters
 */
export function sanitize(raw: string): string {
  return raw.trim().replace(BAD_CHARS, "");
}

/**
 * Validates a sanitized string to ensure it meets attribute name requirements.
 * @param s - The string to validate
 * @returns null if valid, or an error message string if invalid
 */
export function validate(s: string): string | null {
  if (!s) return "Empty string";
  if (!VALID_RE.test(s))
    return "Invalid chars; only letters, numbers, spaces, and single quotes allowed";
  return null;
}
