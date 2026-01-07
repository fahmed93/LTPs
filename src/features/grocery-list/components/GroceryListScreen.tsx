/**
 * Main screen component for the grocery list feature
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  useColorScheme,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useGroceryList} from '../hooks/useGroceryList';
import {useGroceryStorage} from '../hooks/useGroceryStorage';
import {GroceryListInput} from './GroceryListInput';
import {GroceryListItem} from './GroceryListItem';
import {GroceryItem} from '../types/GroceryItem';
import {COLORS} from '../../../theme/colors';

/**
 * Fixed height for each item (for FlatList optimization)
 */
const ITEM_HEIGHT = 60;

interface GroceryListScreenProps {
  /** Callback to open the navigation sidebar */
  onOpenSidebar?: () => void;
}

/**
 * Main grocery list screen component
 * Features:
 * - Input for adding items
 * - Virtualized FlatList for performance
 * - Empty state when no items
 * - Theme-aware styling
 */
export function GroceryListScreen({
  onOpenSidebar,
}: GroceryListScreenProps): React.JSX.Element {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme ?? 'light'];
  
  const {items, addItem, toggleItem, removeItem, setList, list} = useGroceryList();
  const {loading, error, loadList, saveList} = useGroceryStorage();
  const [isHydrated, setIsHydrated] = useState(false);

  /**
   * Load data from storage on mount
   */
  useEffect(() => {
    const hydrate = async () => {
      const storedList = await loadList();
      if (storedList) {
        setList(storedList);
      }
      setIsHydrated(true);
    };
    
    hydrate();
  }, [loadList, setList]);

  /**
   * Auto-save to storage whenever list changes (after hydration)
   */
  useEffect(() => {
    if (isHydrated) {
      saveList(list);
    }
  }, [list, saveList, isHydrated]);

  /**
   * Render a single grocery item
   */
  const renderItem = ({item}: {item: GroceryItem}) => (
    <GroceryListItem item={item} onToggle={toggleItem} onDelete={removeItem} />
  );

  /**
   * Key extractor for FlatList
   */
  const keyExtractor = (item: GroceryItem) => item.id;

  /**
   * Get item layout for virtualization optimization
   */
  const getItemLayout = (_data: ArrayLike<GroceryItem> | null | undefined, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  /**
   * Render empty state
   */
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyIcon, {color: theme.text}]}>🛒</Text>
      <Text style={[styles.emptyText, {color: theme.text}]}>
        Your grocery list is empty
      </Text>
      <Text style={[styles.emptySubtext, {color: theme.checkedText}]}>
        Add items above to get started
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.header}>
        {onOpenSidebar && (
          <TouchableOpacity
            onPress={onOpenSidebar}
            style={styles.hamburgerButton}
            accessibilityLabel="Open navigation menu"
            accessibilityRole="button">
            <Text style={[styles.hamburgerIcon, {color: theme.text}]}>☰</Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.title, {color: theme.text}]}>Grocery List</Text>
        {error && (
          <Text style={styles.errorText}>
            Storage error - changes may not be saved
          </Text>
        )}
      </View>
      
      {loading && !isHydrated ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.text} />
          <Text style={[styles.loadingText, {color: theme.text}]}>
            Loading...
          </Text>
        </View>
      ) : (
        <>
          <GroceryListInput onAddItem={addItem} />
          
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={21}
            initialNumToRender={15}
            ListEmptyComponent={renderEmptyComponent}
            style={[styles.list, {backgroundColor: theme.background}]}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburgerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  hamburgerIcon: {
    fontSize: 28,
    fontWeight: '300',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    color: '#ff3b30',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});
