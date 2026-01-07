/**
 * Individual grocery list item component
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Pressable,
} from 'react-native';
import {GroceryItem} from '../types/GroceryItem';
import {COLORS} from '../../../theme/colors';

/**
 * Props for GroceryListItem component
 */
export interface GroceryListItemProps {
  /** The grocery item to display */
  item: GroceryItem;
  /** Callback when item checkbox is toggled */
  onToggle?: (itemId: string) => void;
  /** Callback when item is deleted */
  onDelete?: (itemId: string) => void;
}

/**
 * Individual grocery list item with checkbox
 * Features:
 * - Checkbox for marking as purchased
 * - Strikethrough and opacity for checked items
 * - Theme-aware styling
 */
export function GroceryListItem({
  item,
  onToggle,
}: GroceryListItemProps): React.JSX.Element {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme ?? 'light'];

  const textColor = item.checked ? theme.checkedText : theme.text;
  const textDecoration = item.checked ? 'line-through' : 'none';
  const opacity = item.checked ? 0.5 : 1;

  return (
    <View
      style={[
        styles.container,
        {borderBottomColor: theme.border, backgroundColor: theme.background},
      ]}>
      {/* Checkbox */}
      <Pressable
        style={[styles.checkbox, {borderColor: theme.border}]}
        onPress={() => onToggle?.(item.id)}
        accessibilityRole="checkbox"
        accessibilityState={{checked: item.checked}}
        accessibilityLabel={`Mark ${item.name} as ${item.checked ? 'not purchased' : 'purchased'}`}>
        {item.checked && (
          <View style={[styles.checkmark, {backgroundColor: theme.text}]} />
        )}
      </Pressable>

      {/* Item name */}
      <Text
        style={[
          styles.itemText,
          {
            color: textColor,
            textDecorationLine: textDecoration,
            opacity,
          },
        ]}>
        {item.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    minHeight: 60, // Fixed height for FlatList optimization
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
});
