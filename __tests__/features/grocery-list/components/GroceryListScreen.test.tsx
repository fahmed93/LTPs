/**
 * Tests for GroceryListScreen component
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {GroceryListScreen} from '../../../../src/features/grocery-list/components/GroceryListScreen';

describe('GroceryListScreen', () => {
  it('should render screen title', () => {
    const {getByText} = render(<GroceryListScreen />);
    
    expect(getByText('Grocery List')).toBeTruthy();
  });

  it('should render input field', () => {
    const {getByPlaceholderText} = render(<GroceryListScreen />);
    
    expect(getByPlaceholderText('Add grocery item...')).toBeTruthy();
  });

  it('should show empty state when no items', () => {
    const {getByText} = render(<GroceryListScreen />);
    
    expect(getByText('Your grocery list is empty')).toBeTruthy();
    expect(getByText('Add items above to get started')).toBeTruthy();
  });

  it('should add item when submitting input', () => {
    const {getByPlaceholderText, getByText, queryByText} = render(
      <GroceryListScreen />,
    );
    
    const input = getByPlaceholderText('Add grocery item...');
    
    fireEvent.changeText(input, 'Milk');
    fireEvent(input, 'onSubmitEditing');
    
    // Empty state should disappear
    expect(queryByText('Your grocery list is empty')).toBeNull();
    
    // Item should appear
    expect(getByText('Milk')).toBeTruthy();
  });

  it('should render multiple items', () => {
    const {getByPlaceholderText, getByText} = render(<GroceryListScreen />);
    
    const input = getByPlaceholderText('Add grocery item...');
    
    fireEvent.changeText(input, 'Milk');
    fireEvent(input, 'onSubmitEditing');
    
    fireEvent.changeText(input, 'Eggs');
    fireEvent(input, 'onSubmitEditing');
    
    fireEvent.changeText(input, 'Bread');
    fireEvent(input, 'onSubmitEditing');
    
    expect(getByText('Milk')).toBeTruthy();
    expect(getByText('Eggs')).toBeTruthy();
    expect(getByText('Bread')).toBeTruthy();
  });

  it('should toggle item when checkbox pressed', () => {
    const {getByPlaceholderText, getAllByRole} = render(<GroceryListScreen />);
    
    const input = getByPlaceholderText('Add grocery item...');
    
    fireEvent.changeText(input, 'Milk');
    fireEvent(input, 'onSubmitEditing');
    
    const checkboxes = getAllByRole('checkbox');
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

  it('should use FlatList for virtualization', () => {
    const {UNSAFE_getByType} = render(<GroceryListScreen />);
    const {FlatList} = require('react-native');
    
    expect(UNSAFE_getByType(FlatList)).toBeTruthy();
  });

  it('should have proper FlatList optimization props', () => {
    const {UNSAFE_getByType} = render(<GroceryListScreen />);
    const {FlatList} = require('react-native');
    
    const flatList = UNSAFE_getByType(FlatList);
    
    expect(flatList.props.removeClippedSubviews).toBe(true);
    expect(flatList.props.maxToRenderPerBatch).toBe(10);
    expect(flatList.props.windowSize).toBe(21);
    expect(flatList.props.initialNumToRender).toBe(15);
    expect(flatList.props.getItemLayout).toBeDefined();
  });
});
