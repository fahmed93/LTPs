/**
 * GroceryList Component Tests
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { GroceryList } from '../components/GroceryList';

describe('GroceryList Component', () => {
  test('renders correctly', async () => {
    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<GroceryList isDarkMode={false} />);
    });
  });

  test('renders with dark mode', async () => {
    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<GroceryList isDarkMode={true} />);
    });
  });

  test('displays empty state when no items', async () => {
    let component: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<GroceryList isDarkMode={false} />);
    });
    
    const root = component!.root;
    const emptyText = root.findByProps({ children: 'No items yet. Add your first item above!' });
    expect(emptyText).toBeDefined();
  });

  test('displays title correctly', async () => {
    let component: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<GroceryList isDarkMode={false} />);
    });
    
    const root = component!.root;
    const title = root.findByProps({ children: '🛒 Grocery List' });
    expect(title).toBeDefined();
  });

  test('has input field for adding items', async () => {
    let component: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<GroceryList isDarkMode={false} />);
    });
    
    const root = component!.root;
    const input = root.findByProps({ placeholder: 'Add new item...' });
    expect(input).toBeDefined();
  });

  test('input can accept text changes', async () => {
    let component: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<GroceryList isDarkMode={false} />);
    });

    const root = component!.root;
    const input = root.findByProps({ placeholder: 'Add new item...' });
    
    await ReactTestRenderer.act(() => {
      input.props.onChangeText('Test Item');
    });
    
    // After calling onChangeText, the component state updates and value should be 'Test Item'
    expect(input.props.value).toBe('Test Item');
  });
});

