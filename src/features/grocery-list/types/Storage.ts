/**
 * Storage.ts
 * TypeScript interface for grocery list storage operations
 */

import { GroceryList } from './GroceryList';

/**
 * Storage service interface for persisting grocery list data
 * Uses AsyncStorage for cross-platform local storage
 */
export interface IGroceryStorageService {
  /**
   * Load the grocery list from persistent storage
   * @returns Promise resolving to GroceryList or null if no data exists
   * @throws Never - errors are caught and null is returned instead
   */
  loadGroceryList(): Promise<GroceryList | null>;

  /**
   * Save the grocery list to persistent storage
   * @param list - Grocery list to save
   * @returns Promise resolving when save completes
   * @throws Error if storage operation fails (caller should handle)
   */
  saveGroceryList(list: GroceryList): Promise<void>;

  /**
   * Clear all grocery list data from persistent storage
   * @returns Promise resolving when clear completes
   * @throws Error if storage operation fails (caller should handle)
   */
  clearGroceryList(): Promise<void>;
}

/**
 * Storage key constants
 */
export const STORAGE_KEYS = {
  /**
   * Key for storing the grocery list in AsyncStorage
   */
  GROCERY_LIST: '@grocery_list',
} as const;

/**
 * Storage error types
 */
export enum StorageErrorType {
  /**
   * Failed to save data (quota exceeded, permissions, etc.)
   */
  SAVE_FAILED = 'SAVE_FAILED',

  /**
   * Failed to load data (corrupted data, permissions, etc.)
   */
  LOAD_FAILED = 'LOAD_FAILED',

  /**
   * Failed to parse JSON data
   */
  PARSE_FAILED = 'PARSE_FAILED',

  /**
   * Storage quota exceeded
   */
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
}

/**
 * Custom error class for storage operations
 */
export class StorageError extends Error {
  constructor(
    public type: StorageErrorType,
    message: string,
    public originalError?: Error,
  ) {
    super(message);
    this.name = 'StorageError';
  }
}
