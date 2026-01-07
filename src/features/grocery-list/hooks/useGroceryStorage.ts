/**
 * Custom hook for grocery list persistence
 * Handles loading and saving to AsyncStorage
 */

import {useEffect, useState, useCallback} from 'react';
import {GroceryList, createEmptyGroceryList} from '../types/GroceryList';
import {groceryStorageService} from '../services/groceryStorageService';
import {StorageError, StorageErrorType} from '../types/Storage';

/**
 * Hook return type
 */
export interface UseGroceryStorageReturn {
  /** Whether data is currently loading from storage */
  loading: boolean;
  /** Error that occurred during storage operations */
  error: StorageError | null;
  /** Load the grocery list from storage */
  loadList: () => Promise<GroceryList | null>;
  /** Save the grocery list to storage */
  saveList: (list: GroceryList) => Promise<void>;
  /** Clear the error state */
  clearError: () => void;
}

/**
 * Custom hook for managing grocery list storage
 * @returns Storage operations and state
 */
export function useGroceryStorage(): UseGroceryStorageReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StorageError | null>(null);

  /**
   * Load grocery list from AsyncStorage
   */
  const loadList = useCallback(async (): Promise<GroceryList | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const list = await groceryStorageService.loadGroceryList();
      return list;
    } catch (err) {
      const storageError = err as StorageError;
      setError(storageError);
      // Return null to allow app to continue with empty list
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Save grocery list to AsyncStorage
   */
  const saveList = useCallback(async (list: GroceryList): Promise<void> => {
    // Don't set loading state for saves (background operation)
    setError(null);
    
    try {
      await groceryStorageService.saveGroceryList(list);
    } catch (err) {
      const storageError = err as StorageError;
      setError(storageError);
      // Log but don't throw - allow app to continue in memory-only mode
      console.error('Failed to save grocery list:', storageError);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    loadList,
    saveList,
    clearError,
  };
}
