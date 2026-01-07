/**
 * Storage key constants for grocery list feature
 * Centralized to avoid typos and ensure consistency
 */

/**
 * Key for storing the grocery list in AsyncStorage
 */
export const GROCERY_LIST_KEY = '@grocery_list';

/**
 * All storage keys used by the grocery list feature
 */
export const STORAGE_KEYS = {
  GROCERY_LIST: GROCERY_LIST_KEY,
} as const;
