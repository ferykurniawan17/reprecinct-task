const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Regular expression for validating attribute names.
 * Allows only letters (any unicode letter), numbers, regular spaces, and single quotes.
 * Rejects:
 * - Special characters: !, @, #, $, %, ^, &, *, (, ), _, -, +, =, {}, [], |, \, :, ;, <, >, ,, ., ?, /
 * - Double quotes (")
 * - Whitespace characters other than regular space: tab (\t), newline (\n), carriage return (\r)
 * - Emojis and special non-alphabet characters (except single quotes)
 * - Control characters
 */
export const VALID_RE = /^[a-zA-Z0-9 ']+$/;

/**
 * Regular expression to match characters that are not allowed in attribute names.
 * Matches any character that is NOT a letter (a-z, A-Z), number (0-9), regular space, or single quote.
 * This will catch all invalid characters including special chars, double quotes, whitespace chars, emojis, etc.
 */
const BAD_CHARS = /[^a-zA-Z0-9 ']/g;

export const validateAttributeString = (value: string): boolean => {
  return VALID_RE.test(value);
};

export const sanitizeAttributeString = (value: string): string => {
  return value.trim().replace(BAD_CHARS, "");
};

export const validateAndSanitize = (
  value: string
): { isValid: boolean; sanitized: string; error?: string } => {
  const sanitized = sanitizeAttributeString(value);

  if (!sanitized) {
    return { isValid: false, sanitized, error: "Empty string" };
  }

  const isValid = validateAttributeString(sanitized);

  if (!isValid) {
    return {
      isValid: false,
      sanitized,
      error:
        "Invalid characters detected. Only letters, numbers, regular spaces, and single quotes are allowed. No special characters, double quotes, tabs, newlines, emojis, or control characters permitted.",
    };
  }

  return { isValid: true, sanitized };
};
