/**
 * Integration tests for grocery list persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {groceryStorageService} from '../../../../src/features/grocery-list/services/groceryStorageService';
import {createEmptyGroceryList} from '../../../../src/features/grocery-list/types/GroceryList';
import {createGroceryItem} from '../../../../src/features/grocery-list/types/GroceryItem';
import {STORAGE_KEYS} from '../../../../src/features/grocery-list/utils/storageKeys';

describe('Grocery List Persistence Integration', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('should complete full save and load cycle', async () => {
    // Create a list with items
    const list = createEmptyGroceryList();
    list.items = [
      createGroceryItem('Milk'),
      createGroceryItem('Eggs'),
      createGroceryItem('Bread'),
    ];
    list.items[1].checked = true; // Check the second item
    
    // Save to storage
    await groceryStorageService.saveGroceryList(list);
    
    // Verify it was saved
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.GROCERY_LIST,
      JSON.stringify(list),
    );
    
    // Load from storage
    const loadedList = await groceryStorageService.loadGroceryList();
    
    // Verify loaded data matches original
    expect(loadedList).not.toBeNull();
    expect(loadedList!.items.length).toBe(3);
    expect(loadedList!.items[0].name).toBe('Milk');
    expect(loadedList!.items[1].name).toBe('Eggs');
    expect(loadedList!.items[1].checked).toBe(true);
    expect(loadedList!.items[2].name).toBe('Bread');
  });

  it('should handle empty list persistence', async () => {
    const emptyList = createEmptyGroceryList();
    
    await groceryStorageService.saveGroceryList(emptyList);
    const loadedList = await groceryStorageService.loadGroceryList();
    
    expect(loadedList).not.toBeNull();
    expect(loadedList!.items).toEqual([]);
  });

  it('should return null when no data exists', async () => {
    const loadedList = await groceryStorageService.loadGroceryList();
    
    expect(loadedList).toBeNull();
  });

  it('should handle multiple save operations', async () => {
    const list = createEmptyGroceryList();
    
    // First save
    list.items = [createGroceryItem('Milk')];
    await groceryStorageService.saveGroceryList(list);
    
    // Second save
    list.items.push(createGroceryItem('Eggs'));
    await groceryStorageService.saveGroceryList(list);
    
    // Third save
    list.items.push(createGroceryItem('Bread'));
    await groceryStorageService.saveGroceryList(list);
    
    // Load and verify final state
    const loadedList = await groceryStorageService.loadGroceryList();
    
    expect(loadedList).not.toBeNull();
    expect(loadedList!.items.length).toBe(3);
  });

  it('should preserve item properties across save/load', async () => {
    const list = createEmptyGroceryList();
    const item = createGroceryItem('Test Item');
    item.checked = true;
    list.items = [item];
    
    await groceryStorageService.saveGroceryList(list);
    const loadedList = await groceryStorageService.loadGroceryList();
    
    expect(loadedList!.items[0].id).toBe(item.id);
    expect(loadedList!.items[0].name).toBe(item.name);
    expect(loadedList!.items[0].checked).toBe(item.checked);
    expect(loadedList!.items[0].createdAt).toBe(item.createdAt);
  });

  it('should handle clear operation', async () => {
    const list = createEmptyGroceryList();
    list.items = [createGroceryItem('Milk')];
    
    await groceryStorageService.saveGroceryList(list);
    await groceryStorageService.clearGroceryList();
    
    const loadedList = await groceryStorageService.loadGroceryList();
    
    expect(loadedList).toBeNull();
  });
});
