# Research: Grocery List Implementation

**Feature**: Grocery List  
**Date**: 2026-01-07  
**Purpose**: Resolve technical unknowns and establish best practices for implementation

---

## 1. AsyncStorage Best Practices for React Native

### Decision: Use @react-native-async-storage/async-storage with async/await

**Rationale**:
- Official React Native community package (formerly part of core)
- Cross-platform: iOS (native), Android (native), Web (localStorage fallback)
- Simple async/await API (better than callbacks)
- Well-maintained with TypeScript support
- 1.6M+ weekly downloads, actively maintained

**Implementation Pattern**:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save
try {
  const jsonValue = JSON.stringify(groceryList);
  await AsyncStorage.setItem('@grocery_list', jsonValue);
} catch (error) {
  // Handle error (show toast, continue in memory)
  console.error('Failed to save grocery list:', error);
}

// Load
try {
  const jsonValue = await AsyncStorage.getItem('@grocery_list');
  return jsonValue != null ? JSON.parse(jsonValue) : null;
} catch (error) {
  console.error('Failed to load grocery list:', error);
  return null;
}
```

**Storage Limits**:
- iOS: 6MB default (can be increased in native code)
- Android: No hard limit (depends on device storage)
- Web: 5-10MB (localStorage limit varies by browser)
- Our need: 500 items × 150 bytes avg = ~75KB (well within limits)

**Error Handling Strategy**:
- Wrap all AsyncStorage calls in try/catch
- On save failure: show error toast, continue in memory-only mode
- On load failure: return null, start with empty list
- Never throw errors to user (graceful degradation)

**Alternatives Considered**:
- SQLite (react-native-sqlite-storage): Overkill for simple key-value storage
- Realm: Too heavy (adds 3MB+ to bundle size)
- MMKV: Faster but less mature, doesn't work on web

---

## 2. FlatList Optimization Patterns

### Decision: Use FlatList with getItemLayout and proper key extraction

**Rationale**:
- FlatList is React Native's built-in virtualization component
- Handles 500+ items efficiently
- No external dependencies needed
- Works on all platforms (iOS, Android, Web)

**Implementation Pattern**:
```typescript
<FlatList
  data={items}
  renderItem={({ item }) => (
    <GroceryListItem item={item} onToggle={toggleItem} onDelete={removeItem} />
  )}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={21}
  initialNumToRender={15}
  ListEmptyComponent={<EmptyState />}
/>
```

**Key Optimizations**:
1. **getItemLayout**: Tells FlatList exact item height (skips measurement)
   - Assumes fixed height items (ITEM_HEIGHT = 60)
   - Dramatically improves scroll performance

2. **keyExtractor**: Uses item.id (UUID) for stable keys
   - Prevents unnecessary re-renders on data changes
   - Required for React's reconciliation algorithm

3. **removeClippedSubviews**: Removes off-screen views from native hierarchy
   - iOS: Significant memory savings
   - Android: Less impactful but still helps

4. **maxToRenderPerBatch**: Renders 10 items per scroll batch
   - Balance between performance and blank space
   - Lower = better FPS, higher = less blank space

5. **windowSize**: 21 screen heights (10 above + 10 below + 1 visible)
   - Default is 21, works well for most cases
   - Can reduce to 11 if performance issues arise

**Component Optimization**:
```typescript
export const GroceryListItem = React.memo(({ item, onToggle, onDelete }) => {
  // Component code
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if item changed
  return prevProps.item.id === nextProps.item.id &&
         prevProps.item.checked === nextProps.item.checked &&
         prevProps.item.name === nextProps.item.name;
});
```

**Alternatives Considered**:
- ScrollView: No virtualization (all items rendered), poor performance > 50 items
- SectionList: Overkill (we don't need sections in MVP)
- RecyclerListView (external lib): More complex, not needed for 500 items

---

## 3. Swipeable List Item Interactions

### Decision: Use react-native-gesture-handler for swipe-to-delete

**Rationale**:
- Standard library for gestures in React Native
- Provides `Swipeable` component out of the box
- Better performance than PanResponder (runs on native thread)
- Works on iOS and Android (not needed on Web - can use button)
- Already used by React Navigation (likely already in dependencies)

**Implementation Pattern**:
```typescript
import { Swipeable } from 'react-native-gesture-handler';

const renderRightActions = () => (
  <View style={styles.deleteAction}>
    <Text style={styles.deleteText}>Delete</Text>
  </View>
);

<Swipeable
  renderRightActions={renderRightActions}
  onSwipeableOpen={() => onDelete(item.id)}
  rightThreshold={40}
>
  <GroceryListItem item={item} />
</Swipeable>
```

**Platform Considerations**:
- iOS/Android: Full swipe support
- Web: Swipe doesn't work with mouse (touch emulation required)
  - Solution: Show delete button on Web, swipe on mobile
  - Detect platform: `Platform.OS === 'web'`

**Accessibility**:
- Swipe gestures are not accessible via screen readers
- Must provide alternative: long-press or visible delete button
- Decision: Show delete icon on long-press for accessibility

**Alternatives Considered**:
- PanResponder: Lower-level, runs on JS thread (slower)
- Custom solution: Reinventing the wheel, not worth it
- No swipe (button only): Less intuitive on mobile

---

## 4. Testing AsyncStorage in Jest

### Decision: Use official AsyncStorage mock with async/await patterns

**Installation**:
```bash
npm install --save-dev @react-native-async-storage/async-storage
```

**Mock Setup** (`__mocks__/@react-native-async-storage/async-storage.js`):
```javascript
const mockStorage = {};

export default {
  setItem: jest.fn((key, value) => {
    return new Promise((resolve) => {
      mockStorage[key] = value;
      resolve(null);
    });
  }),
  getItem: jest.fn((key) => {
    return new Promise((resolve) => {
      resolve(mockStorage[key] || null);
    });
  }),
  removeItem: jest.fn((key) => {
    return new Promise((resolve) => {
      delete mockStorage[key];
      resolve(null);
    });
  }),
  clear: jest.fn(() => {
    return new Promise((resolve) => {
      Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
      resolve(null);
    });
  }),
};
```

**Test Pattern**:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { groceryStorageService } from '../groceryStorageService';

beforeEach(() => {
  jest.clearAllMocks();
  AsyncStorage.clear();
});

test('saves grocery list to AsyncStorage', async () => {
  const list = { items: [{ id: '1', name: 'milk', checked: false }] };
  
  await groceryStorageService.saveGroceryList(list);
  
  expect(AsyncStorage.setItem).toHaveBeenCalledWith(
    '@grocery_list',
    JSON.stringify(list)
  );
});

test('handles storage failure gracefully', async () => {
  AsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage full'));
  
  // Should not throw
  await expect(
    groceryStorageService.saveGroceryList(list)
  ).resolves.not.toThrow();
});
```

**Best Practices**:
- Clear mocks between tests (`jest.clearAllMocks()`)
- Test both success and failure paths
- Use `async/await` consistently (not `.then()`)
- Test storage quota exceeded scenario
- Test JSON parsing errors

---

## 5. Theme-aware Styling in React Native

### Decision: Use useColorScheme hook with dynamic style objects

**Rationale**:
- `useColorScheme()` is built-in React Native hook
- Automatically detects system theme (light/dark)
- Re-renders component when theme changes
- No external dependencies needed

**Implementation Pattern**:
```typescript
import { useColorScheme, StyleSheet } from 'react-native';

// Shared theme object
const COLORS = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    border: '#E0E0E0',
    checkedText: '#666666',
  },
  dark: {
    background: '#1A1A1A',
    text: '#FFFFFF',
    border: '#333333',
    checkedText: '#999999',
  },
};

// In component
function GroceryListItem({ item }) {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme ?? 'light'];
  
  const dynamicStyles = {
    text: {
      color: item.checked ? theme.checkedText : theme.text,
      opacity: item.checked ? 0.5 : 1,
      textDecorationLine: item.checked ? 'line-through' : 'none',
    },
  };
  
  return (
    <View style={[styles.container, { borderColor: theme.border }]}>
      <Text style={[styles.text, dynamicStyles.text]}>
        {item.name}
      </Text>
    </View>
  );
}

// Static styles (theme-independent)
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 16,
    flex: 1,
  },
});
```

**Performance Considerations**:
- Static styles (StyleSheet.create): Created once, referenced by ID
- Dynamic styles (objects): Created on each render (minor cost)
- Optimization: Extract COLORS to separate file, memoize theme object
- Use React.memo for items to prevent unnecessary re-renders

**Theme Change Handling**:
```typescript
// Theme changes are automatic via useColorScheme()
// No manual event listeners needed
// Component re-renders when system theme changes
```

**Alternatives Considered**:
- styled-components/Emotion: Adds 50KB+ to bundle, overkill for simple theming
- Context API for theme: More complex, not needed for system theme
- Appearance.addChangeListener: Manual, useColorScheme is simpler

---

## 6. Swipe Gesture on Web Platform

### Decision: Conditional rendering - buttons on Web, swipe on mobile

**Implementation**:
```typescript
import { Platform } from 'react-native';

function GroceryListItem({ item, onDelete }) {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text>{item.name}</Text>
        <Pressable onPress={() => onDelete(item.id)}>
          <Text>🗑️</Text>
        </Pressable>
      </View>
    );
  }
  
  // Mobile: use Swipeable
  return (
    <Swipeable onSwipeableOpen={() => onDelete(item.id)}>
      <View style={styles.container}>
        <Text>{item.name}</Text>
      </View>
    </Swipeable>
  );
}
```

**Rationale**:
- Swipe gestures don't work well with mouse input
- Touch emulation in browsers is not reliable
- Button is more discoverable on desktop
- Maintains consistent UX on each platform

**Alternative Approach**:
- Use hover state on web to show delete button
- Cleaner UI when not in use
- Requires CSS hover (via StyleSheet or styled-components)

---

## 7. Input Handling and Keyboard Management

### Decision: Use TextInput with onSubmitEditing and autoFocus

**Implementation**:
```typescript
function GroceryListInput({ onAddItem }) {
  const [text, setText] = React.useState('');
  const inputRef = React.useRef<TextInput>(null);
  
  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length > 0 && trimmed.length <= 100) {
      onAddItem(trimmed);
      setText('');
      inputRef.current?.focus(); // Re-focus for rapid entry
    }
  };
  
  return (
    <TextInput
      ref={inputRef}
      value={text}
      onChangeText={setText}
      onSubmitEditing={handleSubmit}
      placeholder="Add grocery item"
      returnKeyType="done"
      maxLength={100}
      autoFocus={true}
      blurOnSubmit={false} // Keep keyboard open after submit
    />
  );
}
```

**Key Props**:
- `onSubmitEditing`: Fires when user presses Enter/Return
- `returnKeyType="done"`: Shows "Done" button on iOS keyboard
- `maxLength={100}`: Enforces character limit at input level
- `autoFocus={true}`: Focuses input on mount (speeds up entry)
- `blurOnSubmit={false}`: Keeps keyboard open for rapid successive entries

**Validation**:
- Trim whitespace before adding (`text.trim()`)
- Check empty string after trimming
- Check length <= 100 characters
- Clear input only on successful add

---

## Summary: Tech Stack Decisions

| Component | Choice | Reason |
|-----------|--------|--------|
| **Storage** | @react-native-async-storage/async-storage | Cross-platform, simple API, sufficient for our needs |
| **List Virtualization** | FlatList with getItemLayout | Built-in, handles 500 items, no extra dependencies |
| **Swipe Gesture** | react-native-gesture-handler | Industry standard, performant, easy to use |
| **Theme Detection** | useColorScheme hook | Built-in, automatic, no dependencies |
| **State Management** | React hooks (useState, useEffect) | Simple CRUD, no need for Redux/MobX |
| **Testing** | Jest + React Test Renderer | Already configured, standard for RN |
| **TypeScript** | Strict mode enabled | Type safety, catches errors at compile time |

**Installation Required**:
```bash
npm install @react-native-async-storage/async-storage
npm install react-native-gesture-handler
```

**No Installation Needed** (already in project):
- react-native
- react-native-web
- react-native-safe-area-context
- jest, react-test-renderer
- typescript

---

## Open Questions Resolved

All technical unknowns from the plan have been researched and decisions made:

✅ AsyncStorage usage patterns - Decided  
✅ FlatList optimization approach - Decided  
✅ Swipe interaction library - Decided  
✅ Testing AsyncStorage strategy - Decided  
✅ Theme handling approach - Decided  
✅ Web platform swipe alternative - Decided  
✅ Input handling pattern - Decided

**Ready to proceed to Phase 1: Design & Contracts**
