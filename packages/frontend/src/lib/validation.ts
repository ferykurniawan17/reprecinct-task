const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const validateAttributeString = (value: string): boolean => {
  // Only allow alphabets (unicode), numbers, spaces, and single quotes
  const regex = /^[\p{L}\d\s']+$/u;
  return regex.test(value);
};

export const sanitizeAttributeString = (value: string): string => {
  return value.trim();
};

export const validateAndSanitize = (
  value: string
): { isValid: boolean; sanitized: string } => {
  const sanitized = sanitizeAttributeString(value);
  const isValid = sanitized.length > 0 && validateAttributeString(sanitized);
  return { isValid, sanitized };
};
