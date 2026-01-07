/**
 * Custom hook for managing grocery list state
 * Provides operations for adding, removing, toggling, and clearing items
 */

import {useState, useCallback} from 'react';
import {GroceryItem, createGroceryItem} from '../types/GroceryItem';
import {GroceryList, createEmptyGroceryList, ClearCheckedResult} from '../types/GroceryList';

/**
 * Hook return type
 */
export interface UseGroceryListReturn {
  /** Current grocery list */
  list: GroceryList;
  /** All items in the list */
  items: GroceryItem[];
  /** Add a new item to the list */
  addItem: (name: string) => void;
  /** Remove an item by ID */
  removeItem: (itemId: string) => void;
  /** Toggle an item's checked status */
  toggleItem: (itemId: string) => void;
  /** Clear all checked items */
  clearCheckedItems: () => number;
  /** Get only checked items */
  getCheckedItems: () => GroceryItem[];
  /** Get only unchecked items */
  getUncheckedItems: () => GroceryItem[];
  /** Replace entire list (for hydration) */
  setList: (newList: GroceryList) => void;
}

/**
 * Custom hook for managing grocery list operations
 * @param initialList - Optional initial list (for hydration from storage)
 * @returns Grocery list state and operations
 */
export function useGroceryList(initialList?: GroceryList): UseGroceryListReturn {
  const [list, setList] = useState<GroceryList>(
    initialList ?? createEmptyGroceryList(),
  );

  /**
   * Add a new item to the list
   */
  const addItem = useCallback((name: string) => {
    setList(currentList => {
      // Check max items limit
      if (currentList.items.length >= 500) {
        throw new Error('Cannot add more than 500 items');
      }

      const newItem = createGroceryItem(name);
      return {
        items: [...currentList.items, newItem],
        lastModified: Date.now(),
      };
    });
  }, []);

  /**
   * Remove an item by ID
   */
  const removeItem = useCallback((itemId: string) => {
    setList(currentList => ({
      items: currentList.items.filter(item => item.id !== itemId),
      lastModified: Date.now(),
    }));
  }, []);

  /**
   * Toggle an item's checked status
   */
  const toggleItem = useCallback((itemId: string) => {
    setList(currentList => ({
      items: currentList.items.map(item =>
        item.id === itemId ? {...item, checked: !item.checked} : item,
      ),
      lastModified: Date.now(),
    }));
  }, []);

  /**
   * Clear all checked items
   * @returns Number of items removed
   */
  const clearCheckedItems = useCallback((): number => {
    const currentItems = list.items;
    const uncheckedItems = currentItems.filter(item => !item.checked);
    const removedCount = currentItems.length - uncheckedItems.length;
    
    setList({
      items: uncheckedItems,
      lastModified: Date.now(),
    });
    
    return removedCount;
  }, [list.items]);

  /**
   * Get only checked items
   */
  const getCheckedItems = useCallback((): GroceryItem[] => {
    return list.items.filter(item => item.checked);
  }, [list.items]);

  /**
   * Get only unchecked items
   */
  const getUncheckedItems = useCallback((): GroceryItem[] => {
    return list.items.filter(item => !item.checked);
  }, [list.items]);

  return {
    list,
    items: list.items,
    addItem,
    removeItem,
    toggleItem,
    clearCheckedItems,
    getCheckedItems,
    getUncheckedItems,
    setList,
  };
}
