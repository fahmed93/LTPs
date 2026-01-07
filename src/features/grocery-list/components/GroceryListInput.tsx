/**
 * Input component for adding new grocery items
 */

import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  useColorScheme,
  Platform,
} from 'react-native';
import {COLORS} from '../../../theme/colors';

/**
 * Props for GroceryListInput component
 */
export interface GroceryListInputProps {
  /** Callback when user submits a new item */
  onAddItem: (name: string) => void;
  /** Whether the input should auto-focus on mount */
  autoFocus?: boolean;
}

/**
 * Input field for adding grocery items
 * Features:
 * - Auto-focus for quick entry
 * - Submits on Enter/Return key
 * - Clears and re-focuses after submission
 * - Validates input (trim, max length)
 */
export function GroceryListInput({
  onAddItem,
  autoFocus = true,
}: GroceryListInputProps): React.JSX.Element {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme ?? 'light'];

  /**
   * Handle form submission
   */
  const handleSubmit = () => {
    const trimmedText = text.trim();
    
    // Only submit if text is not empty
    if (trimmedText.length > 0) {
      try {
        onAddItem(trimmedText);
        setText('');
        // Re-focus for rapid successive entries
        inputRef.current?.focus();
      } catch (error) {
        // Error handling - could show toast here
        console.error('Failed to add item:', error);
      }
    }
  };

  return (
    <View style={[styles.container, {borderBottomColor: theme.border}]}>
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
          },
        ]}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
        placeholder="Add grocery item..."
        placeholderTextColor={theme.checkedText}
        returnKeyType="done"
        maxLength={100}
        autoFocus={autoFocus}
        blurOnSubmit={false}
        autoCapitalize="sentences"
        autoCorrect={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44, // Minimum touch target per constitution
  },
});
