/**
 * Tests for GroceryListItem component
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {GroceryListItem} from '../../../../src/features/grocery-list/components/GroceryListItem';
import {GroceryItem} from '../../../../src/features/grocery-list/types/GroceryItem';

describe('GroceryListItem', () => {
  const mockItem: GroceryItem = {
    id: '1',
    name: 'Milk',
    checked: false,
    createdAt: Date.now(),
  };

  it('should render item name', () => {
    const {getByText} = render(<GroceryListItem item={mockItem} />);
    
    expect(getByText('Milk')).toBeTruthy();
  });

  it('should call onToggle when checkbox pressed', () => {
    const onToggle = jest.fn();
    const {getByRole} = render(
      <GroceryListItem item={mockItem} onToggle={onToggle} />,
    );
    
    const checkbox = getByRole('checkbox');
    fireEvent.press(checkbox);
    
    expect(onToggle).toHaveBeenCalledWith('1');
  });

  it('should show checkmark when item is checked', () => {
    const checkedItem: GroceryItem = {...mockItem, checked: true};
    const {getByRole} = render(<GroceryListItem item={checkedItem} />);
    
    const checkbox = getByRole('checkbox');
    expect(checkbox.props.accessibilityState.checked).toBe(true);
  });

  it('should apply strikethrough style when checked', () => {
    const checkedItem: GroceryItem = {...mockItem, checked: true};
    const {getByText} = render(<GroceryListItem item={checkedItem} />);
    
    const text = getByText('Milk');
    const styles = Array.isArray(text.props.style) ? text.props.style : [text.props.style];
    const flatStyle = Object.assign({}, ...styles);
    
    expect(flatStyle.textDecorationLine).toBe('line-through');
    expect(flatStyle.opacity).toBe(0.5);
  });

  it('should not apply strikethrough when unchecked', () => {
    const {getByText} = render(<GroceryListItem item={mockItem} />);
    
    const text = getByText('Milk');
    const styles = Array.isArray(text.props.style) ? text.props.style : [text.props.style];
    const flatStyle = Object.assign({}, ...styles);
    
    expect(flatStyle.textDecorationLine).toBe('none');
    expect(flatStyle.opacity).toBe(1);
  });

  it('should have proper accessibility label', () => {
    const {getByRole} = render(<GroceryListItem item={mockItem} />);
    
    const checkbox = getByRole('checkbox');
    expect(checkbox.props.accessibilityLabel).toBe('Mark Milk as purchased');
  });

  it('should update accessibility label when checked', () => {
    const checkedItem: GroceryItem = {...mockItem, checked: true};
    const {getByRole} = render(<GroceryListItem item={checkedItem} />);
    
    const checkbox = getByRole('checkbox');
    expect(checkbox.props.accessibilityLabel).toBe('Mark Milk as not purchased');
  });
});
