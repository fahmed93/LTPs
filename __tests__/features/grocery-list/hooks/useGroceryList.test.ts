/**
 * Tests for useGroceryList hook
 */

import {renderHook, act} from '@testing-library/react-native';
import {useGroceryList} from '../../../../src/features/grocery-list/hooks/useGroceryList';
import {createEmptyGroceryList} from '../../../../src/features/grocery-list/types/GroceryList';

describe('useGroceryList', () => {
  it('should initialize with empty list', () => {
    const {result} = renderHook(() => useGroceryList());
    
    expect(result.current.items).toEqual([]);
    expect(result.current.list.items).toEqual([]);
  });

  it('should initialize with provided list', () => {
    const initialList = createEmptyGroceryList();
    initialList.items = [
      {id: '1', name: 'Milk', checked: false, createdAt: Date.now()},
    ];
    
    const {result} = renderHook(() => useGroceryList(initialList));
    
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].name).toBe('Milk');
  });

  describe('addItem', () => {
    it('should add item to list', () => {
      const {result} = renderHook(() => useGroceryList());
      
      act(() => {
        result.current.addItem('Milk');
      });
      
      expect(result.current.items.length).toBe(1);
      expect(result.current.items[0].name).toBe('Milk');
      expect(result.current.items[0].checked).toBe(false);
    });

    it('should trim item name before adding', () => {
      const {result} = renderHook(() => useGroceryList());
      
      act(() => {
        result.current.addItem('  Eggs  ');
      });
      
      expect(result.current.items[0].name).toBe('Eggs');
    });

    it('should throw error for empty name', () => {
      const {result} = renderHook(() => useGroceryList());
      
      expect(() => {
        act(() => {
          result.current.addItem('   ');
        });
      }).toThrow('Item name cannot be empty');
    });

    it('should throw error when exceeding max items', () => {
      const initialList = createEmptyGroceryList();
      initialList.items = Array.from({length: 500}, (_, i) => ({
        id: `item-${i}`,
        name: `Item ${i}`,
        checked: false,
        createdAt: Date.now(),
      }));
      
      const {result} = renderHook(() => useGroceryList(initialList));
      
      expect(() => {
        act(() => {
          result.current.addItem('Extra item');
        });
      }).toThrow('Cannot add more than 500 items');
    });

    it('should update lastModified when adding item', () => {
      const {result} = renderHook(() => useGroceryList());
      const beforeTime = Date.now();
      
      act(() => {
        result.current.addItem('Milk');
      });
      
      expect(result.current.list.lastModified).toBeGreaterThanOrEqual(beforeTime);
    });
  });

  describe('removeItem', () => {
    it('should remove item by id', () => {
      const {result} = renderHook(() => useGroceryList());
      
      act(() => {
        result.current.addItem('Milk');
        result.current.addItem('Eggs');
      });
      
      const itemIdToRemove = result.current.items[0].id;
      
      act(() => {
        result.current.removeItem(itemIdToRemove);
      });
      
      expect(result.current.items.length).toBe(1);
      expect(result.current.items[0].name).toBe('Eggs');
    });

    it('should do nothing if item id not found', () => {
      const {result} = renderHook(() => useGroceryList());
      
      act(() => {
        result.current.addItem('Milk');
      });
      
      act(() => {
        result.current.removeItem('non-existent-id');
      });
      
      expect(result.current.items.length).toBe(1);
    });
  });

  describe('toggleItem', () => {
    it('should toggle item checked status', () => {
      const {result} = renderHook(() => useGroceryList());
      
      act(() => {
        result.current.addItem('Milk');
      });
      
      const itemId = result.current.items[0].id;
      
      act(() => {
        result.current.toggleItem(itemId);
      });
      
      expect(result.current.items[0].checked).toBe(true);
      
      act(() => {
        result.current.toggleItem(itemId);
      });
      
      expect(result.current.items[0].checked).toBe(false);
    });
  });

  describe('clearCheckedItems', () => {
    it('should remove all checked items', () => {
      const {result} = renderHook(() => useGroceryList());
      
      act(() => {
        result.current.addItem('Milk');
        result.current.addItem('Eggs');
        result.current.addItem('Bread');
      });
      
      const item1Id = result.current.items[0].id;
      const item2Id = result.current.items[1].id;
      
      act(() => {
        result.current.toggleItem(item1Id);
        result.current.toggleItem(item2Id);
      });
      
      let removedCount = 0;
      act(() => {
        removedCount = result.current.clearCheckedItems();
      });
      
      expect(removedCount).toBe(2);
      expect(result.current.items.length).toBe(1);
      expect(result.current.items[0].name).toBe('Bread');
    });

    it('should return 0 when no checked items', () => {
      const {result} = renderHook(() => useGroceryList());
      
      act(() => {
        result.current.addItem('Milk');
      });
      
      let removedCount = 0;
      act(() => {
        removedCount = result.current.clearCheckedItems();
      });
      
      expect(removedCount).toBe(0);
      expect(result.current.items.length).toBe(1);
    });
  });

  describe('getCheckedItems', () => {
    it('should return only checked items', () => {
      const {result} = renderHook(() => useGroceryList());
      
      act(() => {
        result.current.addItem('Milk');
        result.current.addItem('Eggs');
        result.current.addItem('Bread');
      });
      
      const item1Id = result.current.items[0].id;
      
      act(() => {
        result.current.toggleItem(item1Id);
      });
      
      const checkedItems = result.current.getCheckedItems();
      
      expect(checkedItems.length).toBe(1);
      expect(checkedItems[0].name).toBe('Milk');
      expect(checkedItems[0].checked).toBe(true);
    });
  });

  describe('getUncheckedItems', () => {
    it('should return only unchecked items', () => {
      const {result} = renderHook(() => useGroceryList());
      
      act(() => {
        result.current.addItem('Milk');
        result.current.addItem('Eggs');
      });
      
      const item1Id = result.current.items[0].id;
      
      act(() => {
        result.current.toggleItem(item1Id);
      });
      
      const uncheckedItems = result.current.getUncheckedItems();
      
      expect(uncheckedItems.length).toBe(1);
      expect(uncheckedItems[0].name).toBe('Eggs');
      expect(uncheckedItems[0].checked).toBe(false);
    });
  });

  describe('setList', () => {
    it('should replace entire list', () => {
      const {result} = renderHook(() => useGroceryList());
      
      const newList = createEmptyGroceryList();
      newList.items = [
        {id: '1', name: 'New Item', checked: true, createdAt: Date.now()},
      ];
      
      act(() => {
        result.current.setList(newList);
      });
      
      expect(result.current.items.length).toBe(1);
      expect(result.current.items[0].name).toBe('New Item');
      expect(result.current.items[0].checked).toBe(true);
    });
  });
});
