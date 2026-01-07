/**
 * GroceryList Component
 * A shared grocery list where users can add, remove, check off items,
 * and add notes and quantities to each item.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Platform,
} from 'react-native';
import { GroceryItem as GroceryItemType } from '../types/GroceryTypes';

interface GroceryListProps {
  isDarkMode: boolean;
}

export function GroceryList({ isDarkMode }: GroceryListProps) {
  const [items, setItems] = useState<GroceryItemType[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [editingItem, setEditingItem] = useState<GroceryItemType | null>(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const theme = isDarkMode
    ? {
        background: '#1a1a1a',
        text: '#ffffff',
        inputBackground: '#2a2a2a',
        inputBorder: '#3a3a3a',
        buttonBackground: '#4a90e2',
        buttonText: '#ffffff',
        itemBackground: '#2a2a2a',
        checkedText: '#888888',
      }
    : {
        background: '#f5f5f5',
        text: '#000000',
        inputBackground: '#ffffff',
        inputBorder: '#dddddd',
        buttonBackground: '#4a90e2',
        buttonText: '#ffffff',
        itemBackground: '#ffffff',
        checkedText: '#888888',
      };

  const addItem = () => {
    if (newItemName.trim() === '') return;

    const newItem: GroceryItemType = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newItemName.trim(),
      checked: false,
    };

    setItems([...items, newItem]);
    setNewItemName('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toggleChecked = (id: string) => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const openEditModal = (item: GroceryItemType) => {
    setEditingItem(item);
    setEditQuantity(item.quantity || '');
    setEditNotes(item.notes || '');
  };

  const saveEditedItem = () => {
    if (!editingItem) return;

    setItems(
      items.map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              quantity: editQuantity.trim() || undefined,
              notes: editNotes.trim() || undefined,
            }
          : item,
      ),
    );

    setEditingItem(null);
    setEditQuantity('');
    setEditNotes('');
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditQuantity('');
    setEditNotes('');
  };

  const renderItem = ({ item }: { item: GroceryItemType }) => (
    <View style={[styles.itemContainer, { backgroundColor: theme.itemBackground }]}>
      <View style={styles.itemContent}>
        <TouchableOpacity
          onPress={() => toggleChecked(item.id)}
          style={styles.checkboxContainer}>
          <View
            style={[
              styles.checkbox,
              { borderColor: theme.inputBorder },
              item.checked && { backgroundColor: theme.buttonBackground },
            ]}>
            {item.checked && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <View style={styles.itemDetails}>
          <Text
            style={[
              styles.itemName,
              { color: item.checked ? theme.checkedText : theme.text },
              item.checked && styles.itemNameChecked,
            ]}>
            {item.name}
          </Text>
          {item.quantity && (
            <Text style={[styles.itemMeta, { color: theme.checkedText }]}>
              Quantity: {item.quantity}
            </Text>
          )}
          {item.notes && (
            <Text style={[styles.itemMeta, { color: theme.checkedText }]}>
              Notes: {item.notes}
            </Text>
          )}
        </View>

        <View style={styles.itemActions}>
          <TouchableOpacity
            onPress={() => openEditModal(item)}
            style={[styles.actionButton, { backgroundColor: theme.buttonBackground }]}>
            <Text style={[styles.actionButtonText, { color: theme.buttonText }]}>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => removeItem(item.id)}
            style={[styles.actionButton, styles.deleteButton]}>
            <Text style={styles.actionButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>🛒 Grocery List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
          placeholder="Add new item..."
          placeholderTextColor={theme.checkedText}
          value={newItemName}
          onChangeText={setNewItemName}
          onSubmitEditing={addItem}
        />
        <TouchableOpacity
          onPress={addItem}
          style={[styles.addButton, { backgroundColor: theme.buttonBackground }]}>
          <Text style={[styles.addButtonText, { color: theme.buttonText }]}>
            Add
          </Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.checkedText }]}>
            No items yet. Add your first item above!
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}

      {/* Edit Modal */}
      <Modal
        visible={editingItem !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelEdit}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.background },
            ]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Edit Item: {editingItem?.name}
            </Text>

            <Text style={[styles.label, { color: theme.text }]}>Quantity/Weight</Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.inputBorder,
                  color: theme.text,
                },
              ]}
              placeholder="e.g., 2 lbs, 3 items, 1 gallon"
              placeholderTextColor={theme.checkedText}
              value={editQuantity}
              onChangeText={setEditQuantity}
            />

            <Text style={[styles.label, { color: theme.text }]}>Notes</Text>
            <TextInput
              style={[
                styles.modalInput,
                styles.notesInput,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.inputBorder,
                  color: theme.text,
                },
              ]}
              placeholder="Additional notes..."
              placeholderTextColor={theme.checkedText}
              value={editNotes}
              onChangeText={setEditNotes}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={cancelEdit}
                style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveEditedItem}
                style={[
                  styles.modalButton,
                  { backgroundColor: theme.buttonBackground },
                ]}>
                <Text style={[styles.modalButtonText, { color: theme.buttonText }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    borderRadius: 8,
    marginBottom: 10,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      },
    }),
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
  },
  itemMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
      },
    }),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  modalButton: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
