/**
 * Validation utilities for grocery items
 */

/**
 * Maximum length for an item name
 */
export const MAX_ITEM_NAME_LENGTH = 100;

/**
 * Minimum length for an item name (after trimming)
 */
export const MIN_ITEM_NAME_LENGTH = 1;

/**
 * Validates and trims a grocery item name
 * @param name - The name to validate
 * @returns The trimmed name if valid
 * @throws Error if name is invalid
 */
export function validateItemName(name: string): string {
  const trimmedName = name.trim();

  if (trimmedName.length < MIN_ITEM_NAME_LENGTH) {
    throw new Error('Item name cannot be empty');
  }

  if (trimmedName.length > MAX_ITEM_NAME_LENGTH) {
    throw new Error(`Item name cannot exceed ${MAX_ITEM_NAME_LENGTH} characters`);
  }

  return trimmedName;
}

/**
 * Checks if an item name is valid without throwing
 * @param name - The name to check
 * @returns True if the name is valid, false otherwise
 */
export function isValidItemName(name: string): boolean {
  try {
    validateItemName(name);
    return true;
  } catch {
    return false;
  }
}

/**
 * Trims an item name safely
 * @param name - The name to trim
 * @returns The trimmed name, or empty string if name is null/undefined
 */
export function trimItemName(name: string | null | undefined): string {
  return (name ?? '').trim();
}
