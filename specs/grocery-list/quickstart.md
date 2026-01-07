# Quickstart Guide: Grocery List Feature

**Feature**: Grocery List  
**Date**: 2026-01-07  
**Audience**: Developers implementing or testing the grocery list feature

---

## Prerequisites

- Node.js 20+ installed
- React Native development environment set up (iOS/Android)
- Repository cloned and dependencies installed (`npm install`)

---

## Installation

### 1. Install Required Dependencies

```bash
npm install @react-native-async-storage/async-storage
npm install react-native-gesture-handler
```

### 2. Link Native Modules (iOS only)

```bash
cd ios
pod install
cd ..
```

### 3. Verify Installation

```bash
npm test
```

All existing tests should pass before starting implementation.

---

## Project Structure

The grocery list feature will be implemented in:

```
src/features/grocery-list/
├── components/          # React components
├── hooks/              # Custom React hooks
├── services/           # Storage and business logic
├── types/              # TypeScript interfaces
└── utils/              # Helper functions

__tests__/features/grocery-list/
├── components/          # Component tests
├── hooks/              # Hook tests
├── services/           # Service tests
└── utils/              # Utility tests
```

---

## Development Workflow

### 1. Create Directory Structure

```bash
mkdir -p src/features/grocery-list/{components,hooks,services,types,utils}
mkdir -p __tests__/features/grocery-list/{components,hooks,services,utils}
mkdir -p __tests__/__mocks__/@react-native-async-storage
```

### 2. Setup AsyncStorage Mock

Create `__tests__/__mocks__/@react-native-async-storage/async-storage.js`:

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

### 3. Copy TypeScript Contracts

Copy the contract files from `specs/grocery-list/contracts/` to `src/features/grocery-list/types/`:

```bash
# Windows PowerShell
Copy-Item -Path "specs\grocery-list\contracts\*" -Destination "src\features\grocery-list\types\" -Recurse

# macOS/Linux
cp -r specs/grocery-list/contracts/* src/features/grocery-list/types/
```

### 4. Implement Features in Order

Follow this order to minimize dependencies:

1. **Types & Validation** (no dependencies)
   - `src/features/grocery-list/types/GroceryItem.ts`
   - `src/features/grocery-list/utils/itemValidation.ts`
   - Test both

2. **Storage Service** (depends on types)
   - `src/features/grocery-list/services/groceryStorageService.ts`
   - Test storage operations

3. **State Management Hooks** (depends on types + storage)
   - `src/features/grocery-list/hooks/useGroceryStorage.ts`
   - `src/features/grocery-list/hooks/useGroceryList.ts`
   - Test both hooks

4. **UI Components** (depends on hooks)
   - `src/features/grocery-list/components/GroceryListInput.tsx`
   - `src/features/grocery-list/components/GroceryListItem.tsx`
   - `src/features/grocery-list/components/EmptyState.tsx`
   - `src/features/grocery-list/components/ClearCheckedButton.tsx`
   - Test each component

5. **Screen Assembly** (depends on all components)
   - `src/features/grocery-list/components/GroceryListScreen.tsx`
   - Test full screen

6. **Navigation Integration**
   - Add screen to navigation
   - Test navigation flow

---

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests for Specific File

```bash
npm test -- GroceryListItem.test
```

### Check Test Coverage

```bash
npm test -- --coverage
```

Target: **80% coverage** per constitution requirements

---

## Manual Testing Checklist

### Phase 1: Basic Functionality

- [ ] Open grocery list screen
- [ ] Add item "Milk" - verify it appears in list
- [ ] Add item "  Eggs  " (with spaces) - verify trimmed
- [ ] Press enter on empty input - verify nothing happens
- [ ] Add 3 more items
- [ ] Verify items are in order (newest at bottom)

### Phase 2: Check Off Items

- [ ] Tap checkbox next to "Milk" - verify strikethrough + 50% opacity
- [ ] Tap checkbox again - verify returns to normal
- [ ] Check off multiple items quickly - verify no lag (< 100ms)
- [ ] Verify checked items stay in same position

### Phase 3: Delete Items

- [ ] Swipe left on "Eggs" - verify delete button appears
- [ ] Tap delete - verify item removed
- [ ] Start swipe then cancel - verify item stays
- [ ] Delete last item - verify empty state appears

### Phase 4: Persistence

- [ ] Add 3 items, check off 1
- [ ] Force close app (swipe away or kill process)
- [ ] Reopen app and go to grocery list
- [ ] Verify all items are present with correct checked state

### Phase 5: Clear Checked Items

- [ ] Add 5 items, check off 3
- [ ] Tap "Clear Checked Items"
- [ ] Verify confirmation dialog appears
- [ ] Tap Cancel - verify nothing happens
- [ ] Tap "Clear Checked Items" again
- [ ] Tap Confirm - verify only 3 checked items removed
- [ ] Verify 2 unchecked items remain

### Phase 6: Edge Cases

- [ ] Add item with 100 characters - verify accepted
- [ ] Try to add item with 101 characters - verify error/truncation
- [ ] Add 50 items - verify smooth scrolling
- [ ] Test with 0 items (empty state)
- [ ] Test with 1 item
- [ ] Test with all items checked
- [ ] Test with all items unchecked

### Phase 7: Theme Support

- [ ] Switch device to dark mode
- [ ] Verify all colors are readable
- [ ] Verify checked items have correct styling
- [ ] Switch back to light mode
- [ ] Verify styling still correct

### Phase 8: Platform Testing

- [ ] **iOS**: Test on simulator and real device
- [ ] **Android**: Test on emulator and real device
- [ ] **Web**: Test in Chrome, Safari, Firefox
- [ ] Verify swipe works on mobile, buttons work on web

---

## Performance Testing

### Test with 500 Items

```typescript
// Add to manual test script or component
const generate500Items = () => {
  const items = [];
  for (let i = 1; i <= 500; i++) {
    items.push({
      id: `item-${i}`,
      name: `Test Item ${i}`,
      checked: i % 3 === 0,
      createdAt: Date.now() - (500 - i) * 1000,
    });
  }
  return items;
};
```

Performance checklist with 500 items:
- [ ] List renders in < 2 seconds
- [ ] Scrolling maintains 60fps (check FPS counter)
- [ ] Adding new item takes < 100ms
- [ ] Checking item takes < 100ms
- [ ] App remains responsive

---

## Common Issues & Solutions

### Issue: AsyncStorage mock not working

**Symptom**: Tests fail with "Cannot find module '@react-native-async-storage/async-storage'"

**Solution**:
1. Ensure mock file is in `__tests__/__mocks__/@react-native-async-storage/async-storage.js`
2. Add to `jest.config.js`:
   ```javascript
   moduleNameMapper: {
     '@react-native-async-storage/async-storage': '<rootDir>/__tests__/__mocks__/@react-native-async-storage/async-storage.js',
   },
   ```

### Issue: Swipe gesture not working on Android

**Symptom**: Swipe doesn't trigger delete action

**Solution**:
1. Ensure `react-native-gesture-handler` is imported at top of `index.js`:
   ```javascript
   import 'react-native-gesture-handler';
   import { AppRegistry } from 'react-native';
   ```
2. Rebuild app: `npm run android`

### Issue: Theme not switching

**Symptom**: Colors don't change when switching dark mode

**Solution**:
1. Verify `useColorScheme()` is used in component
2. Check that dynamic styles are computed inside component (not outside)
3. Ensure app is restarted after theme change (some platforms require restart)

### Issue: Tests are slow

**Symptom**: Test suite takes > 10 seconds

**Solution**:
1. Use `React.memo` on list items to prevent re-renders
2. Mock `setTimeout`/`setInterval` with `jest.useFakeTimers()`
3. Limit test data size (don't test with 500 items in every test)

### Issue: Storage quota exceeded

**Symptom**: "QuotaExceededError" in browser console

**Solution**:
1. Clear browser storage (DevTools → Application → Storage → Clear)
2. Reduce test data size
3. Implement storage size check in code

---

## Debugging Tips

### Enable React Native Debugger

1. Shake device (or Cmd+D / Ctrl+M)
2. Select "Debug"
3. Open Chrome DevTools to `localhost:8081/debugger-ui`

### View AsyncStorage Contents

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// In development, log storage contents
AsyncStorage.getItem('@grocery_list').then(data => {
  console.log('Stored data:', JSON.parse(data || '{}'));
});
```

### Monitor Performance

1. Enable "Show Perf Monitor" in dev menu
2. Watch FPS counter while scrolling
3. Profile with React DevTools Profiler

---

## Next Steps

After completing implementation and testing:

1. Run full test suite: `npm test`
2. Check coverage: `npm test -- --coverage`
3. Manual test on all platforms (iOS, Android, Web)
4. Performance test with 500 items
5. Create pull request with:
   - Implementation code
   - Tests (80%+ coverage)
   - Manual testing checklist results
   - Screenshots/video of feature working

---

## Additional Resources

- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [FlatList Optimization](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [Testing React Native Apps](https://reactnative.dev/docs/testing-overview)
- [Project Constitution](../../.specify/memory/constitution.md)

---

**Ready to start implementation!** Follow the task list from `/speckit.tasks` command.
