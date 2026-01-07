/**
 * Tests for GroceryListInput component
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {GroceryListInput} from '../../../../src/features/grocery-list/components/GroceryListInput';

describe('GroceryListInput', () => {
  it('should render correctly', () => {
    const onAddItem = jest.fn();
    const {getByPlaceholderText} = render(
      <GroceryListInput onAddItem={onAddItem} />,
    );
    
    expect(getByPlaceholderText('Add grocery item...')).toBeTruthy();
  });

  it('should call onAddItem when submitting valid text', () => {
    const onAddItem = jest.fn();
    const {getByPlaceholderText} = render(
      <GroceryListInput onAddItem={onAddItem} />,
    );
    
    const input = getByPlaceholderText('Add grocery item...');
    
    fireEvent.changeText(input, 'Milk');
    fireEvent(input, 'onSubmitEditing');
    
    expect(onAddItem).toHaveBeenCalledWith('Milk');
  });

  it('should trim whitespace before submitting', () => {
    const onAddItem = jest.fn();
    const {getByPlaceholderText} = render(
      <GroceryListInput onAddItem={onAddItem} />,
    );
    
    const input = getByPlaceholderText('Add grocery item...');
    
    fireEvent.changeText(input, '  Eggs  ');
    fireEvent(input, 'onSubmitEditing');
    
    expect(onAddItem).toHaveBeenCalledWith('Eggs');
  });

  it('should not call onAddItem for empty text', () => {
    const onAddItem = jest.fn();
    const {getByPlaceholderText} = render(
      <GroceryListInput onAddItem={onAddItem} />,
    );
    
    const input = getByPlaceholderText('Add grocery item...');
    
    fireEvent.changeText(input, '   ');
    fireEvent(input, 'onSubmitEditing');
    
    expect(onAddItem).not.toHaveBeenCalled();
  });

  it('should clear input after successful submission', () => {
    const onAddItem = jest.fn();
    const {getByPlaceholderText} = render(
      <GroceryListInput onAddItem={onAddItem} />,
    );
    
    const input = getByPlaceholderText('Add grocery item...');
    
    fireEvent.changeText(input, 'Milk');
    fireEvent(input, 'onSubmitEditing');
    
    expect(input.props.value).toBe('');
  });

  it('should handle errors gracefully', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const onAddItem = jest.fn().mockImplementation(() => {
      throw new Error('Test error');
    });
    
    const {getByPlaceholderText} = render(
      <GroceryListInput onAddItem={onAddItem} />,
    );
    
    const input = getByPlaceholderText('Add grocery item...');
    
    fireEvent.changeText(input, 'Milk');
    fireEvent(input, 'onSubmitEditing');
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should respect maxLength prop', () => {
    const onAddItem = jest.fn();
    const {getByPlaceholderText} = render(
      <GroceryListInput onAddItem={onAddItem} />,
    );
    
    const input = getByPlaceholderText('Add grocery item...');
    
    expect(input.props.maxLength).toBe(100);
  });

  it('should have blurOnSubmit set to false', () => {
    const onAddItem = jest.fn();
    const {getByPlaceholderText} = render(
      <GroceryListInput onAddItem={onAddItem} />,
    );
    
    const input = getByPlaceholderText('Add grocery item...');
    
    expect(input.props.blurOnSubmit).toBe(false);
  });
});
