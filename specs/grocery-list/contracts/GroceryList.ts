/**
 * GroceryList.ts
 * TypeScript interface and operations for the grocery list collection
 */

import { GroceryItem } from './GroceryItem';

/**
 * Represents the complete grocery list with all items.
 * Maximum 500 items allowed.
 */
export interface GroceryList {
  /**
   * Ordered array of grocery items (newest items at the end)
   * @maxItems 500
   */
  items: GroceryItem[];

  /**
   * Unix timestamp in milliseconds when the list was last modified
   * Updated on any add, remove, toggle, or clear operation
   * @example 1704672000000
   */
  lastModified: number;
}

/**
 * Result of clearing checked items operation
 */
export interface ClearCheckedResult {
  /**
   * Updated grocery list with checked items removed
   */
  list: GroceryList;

  /**
   * Number of items that were removed
   */
  removedCount: number;
}

/**
 * Operations interface for managing the grocery list
 */
export interface IGroceryListOperations {
  /**
   * Add a new item to the list
   * @param list - Current grocery list
   * @param name - Name of the item to add
   * @returns Updated grocery list with new item
   * @throws Error if list already has 500 items or name is invalid
   */
  addItem(list: GroceryList, name: string): GroceryList;

  /**
   * Remove an item from the list by ID
   * @param list - Current grocery list
   * @param itemId - ID of the item to remove
   * @returns Updated grocery list without the item
   */
  removeItem(list: GroceryList, itemId: string): GroceryList;

  /**
   * Toggle the checked status of an item
   * @param list - Current grocery list
   * @param itemId - ID of the item to toggle
   * @returns Updated grocery list with toggled item
   */
  toggleItem(list: GroceryList, itemId: string): GroceryList;

  /**
   * Remove all checked items from the list
   * @param list - Current grocery list
   * @returns Result containing updated list and count of removed items
   */
  clearCheckedItems(list: GroceryList): ClearCheckedResult;

  /**
   * Get all items from the list
   * @param list - Current grocery list
   * @returns Array of all items
   */
  getAllItems(list: GroceryList): GroceryItem[];

  /**
   * Get only checked items from the list
   * @param list - Current grocery list
   * @returns Array of checked items
   */
  getCheckedItems(list: GroceryList): GroceryItem[];

  /**
   * Get only unchecked items from the list
   * @param list - Current grocery list
   * @returns Array of unchecked items
   */
  getUncheckedItems(list: GroceryList): GroceryItem[];
}

/**
 * Create an empty grocery list
 * @returns New empty grocery list
 */
export function createEmptyGroceryList(): GroceryList {
  return {
    items: [],
    lastModified: Date.now(),
  };
}

/**
 * Type guard to check if an object is a valid GroceryList
 * @param obj - Object to check
 * @returns True if object matches GroceryList interface
 */
export function isGroceryList(obj: any): obj is GroceryList {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Array.isArray(obj.items) &&
    typeof obj.lastModified === 'number' &&
    obj.items.length <= 500
  );
}
