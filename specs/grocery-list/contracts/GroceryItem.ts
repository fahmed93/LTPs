/**
 * GroceryItem.ts
 * TypeScript interface for a single grocery list item
 */

/**
 * Represents a single item on the grocery list.
 * Items can be added, checked off, and deleted.
 */
export interface GroceryItem {
  /**
   * Unique identifier for the item (UUID v4 format)
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;

  /**
   * Display name of the grocery item (1-100 characters, trimmed)
   * @example "Whole milk"
   */
  name: string;

  /**
   * Whether the item has been checked off as purchased
   * @default false
   */
  checked: boolean;

  /**
   * Unix timestamp in milliseconds when the item was created
   * @example 1704672000000
   */
  createdAt: number;
}

/**
 * Factory function to create a new GroceryItem with validation
 * @param name - The name of the grocery item (will be trimmed)
 * @returns A new GroceryItem object
 * @throws Error if name is empty or exceeds 100 characters after trimming
 */
export function createGroceryItem(name: string): GroceryItem {
  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    throw new Error('Item name cannot be empty');
  }

  if (trimmedName.length > 100) {
    throw new Error('Item name cannot exceed 100 characters');
  }

  return {
    id: crypto.randomUUID(),
    name: trimmedName,
    checked: false,
    createdAt: Date.now(),
  };
}

/**
 * Type guard to check if an object is a valid GroceryItem
 * @param obj - Object to check
 * @returns True if object matches GroceryItem interface
 */
export function isGroceryItem(obj: any): obj is GroceryItem {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.checked === 'boolean' &&
    typeof obj.createdAt === 'number' &&
    obj.name.length > 0 &&
    obj.name.length <= 100
  );
}
