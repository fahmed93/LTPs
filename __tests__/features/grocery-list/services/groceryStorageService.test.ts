/**
 * Tests for grocery storage service
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {groceryStorageService} from '../../../../src/features/grocery-list/services/groceryStorageService';
import {GroceryList, createEmptyGroceryList} from '../../../../src/features/grocery-list/types/GroceryList';
import {StorageErrorType} from '../../../../src/features/grocery-list/types/Storage';
import {STORAGE_KEYS} from '../../../../src/features/grocery-list/utils/storageKeys';

describe('groceryStorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  describe('loadGroceryList', () => {
    it('should return null when no data exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      
      const result = await groceryStorageService.loadGroceryList();
      
      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.GROCERY_LIST);
    });

    it('should return parsed grocery list when data exists', async () => {
      const mockList: GroceryList = {
        items: [
          {
            id: '1',
            name: 'Milk',
            checked: false,
            createdAt: Date.now(),
          },
        ],
        lastModified: Date.now(),
      };
      
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockList),
      );
      
      const result = await groceryStorageService.loadGroceryList();
      
      expect(result).toEqual(mockList);
    });

    it('should throw StorageError for invalid JSON', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        'invalid json{',
      );
      
      await expect(groceryStorageService.loadGroceryList()).rejects.toMatchObject({
        name: 'StorageError',
        type: StorageErrorType.PARSE_FAILED,
      });
    });

    it('should return null for other errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error('Storage error'),
      );
      
      const result = await groceryStorageService.loadGroceryList();
      
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('saveGroceryList', () => {
    it('should save grocery list to AsyncStorage', async () => {
      const mockList = createEmptyGroceryList();
      
      await groceryStorageService.saveGroceryList(mockList);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.GROCERY_LIST,
        JSON.stringify(mockList),
      );
    });

    it('should throw StorageError for quota exceeded', async () => {
      const mockList = createEmptyGroceryList();
      const quotaError = new Error('QuotaExceededError');
      quotaError.name = 'QuotaExceededError';
      
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(quotaError);
      
      await expect(groceryStorageService.saveGroceryList(mockList)).rejects.toMatchObject({
        name: 'StorageError',
        type: StorageErrorType.QUOTA_EXCEEDED,
      });
    });

    it('should throw StorageError for general save failure', async () => {
      const mockList = createEmptyGroceryList();
      
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error('Save failed'),
      );
      
      await expect(groceryStorageService.saveGroceryList(mockList)).rejects.toMatchObject({
        name: 'StorageError',
        type: StorageErrorType.SAVE_FAILED,
      });
    });
  });

  describe('clearGroceryList', () => {
    it('should remove grocery list from AsyncStorage', async () => {
      await groceryStorageService.clearGroceryList();
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.GROCERY_LIST);
    });

    it('should throw StorageError on failure', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(
        new Error('Remove failed'),
      );
      
      await expect(groceryStorageService.clearGroceryList()).rejects.toMatchObject({
        name: 'StorageError',
        type: StorageErrorType.SAVE_FAILED,
      });
    });
  });
});
