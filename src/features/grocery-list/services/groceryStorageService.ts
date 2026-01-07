/**
 * Storage service for persisting grocery list data to AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {GroceryList} from '../types/GroceryList';
import {IGroceryStorageService, StorageError, StorageErrorType} from '../types/Storage';
import {STORAGE_KEYS} from '../utils/storageKeys';

/**
 * Implementation of grocery list storage service
 * Handles persistence to AsyncStorage with error handling
 */
class GroceryStorageService implements IGroceryStorageService {
  /**
   * Load the grocery list from AsyncStorage
   * @returns Promise resolving to GroceryList or null if no data exists
   */
  async loadGroceryList(): Promise<GroceryList | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.GROCERY_LIST);
      
      if (jsonValue === null) {
        return null;
      }

      const parsed = JSON.parse(jsonValue);
      return parsed as GroceryList;
    } catch (error) {
      // Log error but don't throw - return null to start fresh
      if (error instanceof SyntaxError) {
        throw new StorageError(
          StorageErrorType.PARSE_FAILED,
          'Failed to parse grocery list data',
          error as Error,
        );
      }
      
      // For any other error, return null to allow app to continue
      console.error('Failed to load grocery list:', error);
      return null;
    }
  }

  /**
   * Save the grocery list to AsyncStorage
   * @param list - Grocery list to save
   * @throws StorageError if save operation fails
   */
  async saveGroceryList(list: GroceryList): Promise<void> {
    try {
      const jsonValue = JSON.stringify(list);
      await AsyncStorage.setItem(STORAGE_KEYS.GROCERY_LIST, jsonValue);
    } catch (error) {
      // Check if quota exceeded
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new StorageError(
          StorageErrorType.QUOTA_EXCEEDED,
          'Storage quota exceeded',
          error,
        );
      }
      
      throw new StorageError(
        StorageErrorType.SAVE_FAILED,
        'Failed to save grocery list',
        error as Error,
      );
    }
  }

  /**
   * Clear all grocery list data from AsyncStorage
   * @throws StorageError if clear operation fails
   */
  async clearGroceryList(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.GROCERY_LIST);
    } catch (error) {
      throw new StorageError(
        StorageErrorType.SAVE_FAILED,
        'Failed to clear grocery list',
        error as Error,
      );
    }
  }
}

/**
 * Singleton instance of the storage service
 */
export const groceryStorageService = new GroceryStorageService();
