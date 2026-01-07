/**
 * Tests for useGroceryStorage hook
 */

import {renderHook, act, waitFor} from '@testing-library/react-native';
import {useGroceryStorage} from '../../../../src/features/grocery-list/hooks/useGroceryStorage';
import {groceryStorageService} from '../../../../src/features/grocery-list/services/groceryStorageService';
import {createEmptyGroceryList} from '../../../../src/features/grocery-list/types/GroceryList';
import {StorageError, StorageErrorType} from '../../../../src/features/grocery-list/types/Storage';

// Mock the storage service
jest.mock('../../../../src/features/grocery-list/services/groceryStorageService');

describe('useGroceryStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading false and no error', () => {
    const {result} = renderHook(() => useGroceryStorage());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  describe('loadList', () => {
    it('should load list from storage', async () => {
      const mockList = createEmptyGroceryList();
      mockList.items = [{id: '1', name: 'Milk', checked: false, createdAt: Date.now()}];
      
      (groceryStorageService.loadGroceryList as jest.Mock).mockResolvedValue(mockList);
      
      const {result} = renderHook(() => useGroceryStorage());
      
      let loadedList;
      await act(async () => {
        loadedList = await result.current.loadList();
      });
      
      expect(loadedList).toEqual(mockList);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set loading state while loading', async () => {
      (groceryStorageService.loadGroceryList as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(null), 100)),
      );
      
      const {result} = renderHook(() => useGroceryStorage());
      
      act(() => {
        result.current.loadList();
      });
      
      expect(result.current.loading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle storage errors', async () => {
      const storageError = new StorageError(
        StorageErrorType.LOAD_FAILED,
        'Failed to load',
      );
      
      (groceryStorageService.loadGroceryList as jest.Mock).mockRejectedValue(storageError);
      
      const {result} = renderHook(() => useGroceryStorage());
      
      let loadedList;
      await act(async () => {
        loadedList = await result.current.loadList();
      });
      
      expect(loadedList).toBeNull();
      expect(result.current.error).toEqual(storageError);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('saveList', () => {
    it('should save list to storage', async () => {
      const mockList = createEmptyGroceryList();
      
      (groceryStorageService.saveGroceryList as jest.Mock).mockResolvedValue(undefined);
      
      const {result} = renderHook(() => useGroceryStorage());
      
      await act(async () => {
        await result.current.saveList(mockList);
      });
      
      expect(groceryStorageService.saveGroceryList).toHaveBeenCalledWith(mockList);
      expect(result.current.error).toBeNull();
    });

    it('should handle save errors without throwing', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const storageError = new StorageError(
        StorageErrorType.SAVE_FAILED,
        'Failed to save',
      );
      
      (groceryStorageService.saveGroceryList as jest.Mock).mockRejectedValue(storageError);
      
      const {result} = renderHook(() => useGroceryStorage());
      const mockList = createEmptyGroceryList();
      
      await act(async () => {
        await result.current.saveList(mockList);
      });
      
      expect(result.current.error).toEqual(storageError);
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });

    it('should not set loading state for saves', async () => {
      (groceryStorageService.saveGroceryList as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100)),
      );
      
      const {result} = renderHook(() => useGroceryStorage());
      const mockList = createEmptyGroceryList();
      
      act(() => {
        result.current.saveList(mockList);
      });
      
      // Loading should remain false (saves are background operations)
      expect(result.current.loading).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      const storageError = new StorageError(
        StorageErrorType.LOAD_FAILED,
        'Failed to load',
      );
      
      (groceryStorageService.loadGroceryList as jest.Mock).mockRejectedValue(storageError);
      
      const {result} = renderHook(() => useGroceryStorage());
      
      await act(async () => {
        await result.current.loadList();
      });
      
      expect(result.current.error).toEqual(storageError);
      
      act(() => {
        result.current.clearError();
      });
      
      expect(result.current.error).toBeNull();
    });
  });
});
