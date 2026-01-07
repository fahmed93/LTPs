/**
 * Tests for GroceryListScreen component
 */

import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {GroceryListScreen} from '../../../../src/features/grocery-list/components/GroceryListScreen';

// Mock the storage service to return null (no stored data)
jest.mock('../../../../src/features/grocery-list/services/groceryStorageService', () => ({
  groceryStorageService: {
    loadGroceryList: jest.fn().mockResolvedValue(null),
    saveGroceryList: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('GroceryListScreen', () => {
  it('should render screen title', async () => {
    const {getByText} = render(<GroceryListScreen />);
    
    await waitFor(() => {
      expect(getByText('Grocery List')).toBeTruthy();
    });
  });

  it('should render input field after loading', async () => {
    const {getByPlaceholderText} = render(<GroceryListScreen />);
    
    await waitFor(() => {
      expect(getByPlaceholderText('Add grocery item...')).toBeTruthy();
    });
  });

  it('should show empty state when no items', async () => {
    const {getByText} = render(<GroceryListScreen />);
    
    await waitFor(() => {
      expect(getByText('Your grocery list is empty')).toBeTruthy();
      expect(getByText('Add items above to get started')).toBeTruthy();
    });
  });

  it('should add item when submitting input', async () => {
    const {getByPlaceholderText, getByText, queryByText} = render(
      <GroceryListScreen />,
    );
    
    // Wait for hydration to complete
    await waitFor(() => {
      expect(getByPlaceholderText('Add grocery item...')).toBeTruthy();
    });
    
    const input = getByPlaceholderText('Add grocery item...');
    
    fireEvent.changeText(input, 'Milk');
    fireEvent(input, 'onSubmitEditing');
    
    await waitFor(() => {
      // Empty state should disappear
      expect(queryByText('Your grocery list is empty')).toBeNull();
      
      // Item should appear
      expect(getByText('Milk')).toBeTruthy();
    });
  });

  it('should render multiple items', async () => {
    const {getByPlaceholderText, getByText} = render(<GroceryListScreen />);
    
    // Wait for hydration
    await waitFor(() => {
      expect(getByPlaceholderText('Add grocery item...')).toBeTruthy();
    });
    
    const input = getByPlaceholderText('Add grocery item...');
    
    fireEvent.changeText(input, 'Milk');
    fireEvent(input, 'onSubmitEditing');
    
    fireEvent.changeText(input, 'Eggs');
    fireEvent(input, 'onSubmitEditing');
    
    fireEvent.changeText(input, 'Bread');
    fireEvent(input, 'onSubmitEditing');
    
    await waitFor(() => {
      expect(getByText('Milk')).toBeTruthy();
      expect(getByText('Eggs')).toBeTruthy();
      expect(getByText('Bread')).toBeTruthy();
    });
  });

  it('should toggle item when checkbox pressed', async () => {
    const {getByPlaceholderText, getAllByRole} = render(<GroceryListScreen />);
    
    // Wait for hydration
    await waitFor(() => {
      expect(getByPlaceholderText('Add grocery item...')).toBeTruthy();
    });
    
    const input = getByPlaceholderText('Add grocery item...');
    
    fireEvent.changeText(input, 'Milk');
    fireEvent(input, 'onSubmitEditing');
    
    await waitFor(() => {
      const checkboxes = getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
      
      const checkbox = checkboxes[0];
      
      // Initially unchecked
      expect(checkbox.props.accessibilityState.checked).toBe(false);
      
      // Toggle to checked
      fireEvent.press(checkbox);
      expect(checkbox.props.accessibilityState.checked).toBe(true);
      
      // Toggle back to unchecked
      fireEvent.press(checkbox);
      expect(checkbox.props.accessibilityState.checked).toBe(false);
    });
  });

  it('should use FlatList for virtualization', async () => {
    const {UNSAFE_getByType} = render(<GroceryListScreen />);
    const {FlatList} = require('react-native');
    
    await waitFor(() => {
      expect(UNSAFE_getByType(FlatList)).toBeTruthy();
    });
  });

  it('should have proper FlatList optimization props', async () => {
    const {UNSAFE_getByType} = render(<GroceryListScreen />);
    const {FlatList} = require('react-native');
    
    await waitFor(() => {
      const flatList = UNSAFE_getByType(FlatList);
      
      expect(flatList.props.removeClippedSubviews).toBe(true);
      expect(flatList.props.maxToRenderPerBatch).toBe(10);
      expect(flatList.props.windowSize).toBe(21);
      expect(flatList.props.initialNumToRender).toBe(15);
      expect(flatList.props.getItemLayout).toBeDefined();
    });
  });
});
