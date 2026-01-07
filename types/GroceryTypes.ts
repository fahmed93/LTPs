/**
 * Types for Grocery List feature
 */

export interface GroceryItem {
  id: string;
  name: string;
  checked: boolean;
  quantity?: string;
  notes?: string;
}
