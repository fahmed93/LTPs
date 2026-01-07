# Implementation Plan: Grocery List

**Branch**: `copilot/add-grocery-list-feature` | **Date**: 2026-01-07 | **Spec**: [grocery-list-spec.md](../../.specify/memory/grocery-list-spec.md)

**Input**: Feature specification from `.specify/memory/grocery-list-spec.md`

## Summary

Implement a grocery list feature for the LTPs React Native app that allows users to quickly add items via text input + enter, check off items as purchased, delete items via swipe gesture, and automatically persist data to local storage. The feature emphasizes speed of entry (< 3 seconds to add item) and offline-first architecture using AsyncStorage for data persistence across iOS, Android, and Web platforms.

## Technical Context

**Language/Version**: TypeScript 5.8.3, React 19.2.0, React Native 0.83.1  
**Primary Dependencies**: 
- `react-native` (core framework)
- `react-native-web` (web platform support)
- `react-native-safe-area-context` (safe area handling)
- `@react-native-async-storage/async-storage` (data persistence - **NEEDS INSTALLATION**)

**Storage**: AsyncStorage (local device storage, JSON serialization)  
**Testing**: Jest 29.6.3 + React Test Renderer 19.2.0  
**Target Platform**: iOS, Android, Web (React Native Web via GitHub Pages)  
**Project Type**: Mobile cross-platform (React Native)  
**Performance Goals**: 
- Item addition < 3 seconds (type + enter)
- Checkbox interaction < 100ms response
- 60fps scrolling with up to 500 items
- First Contentful Paint < 2 seconds on 3G

**Constraints**: 
- Offline-first (no network required)
- Light + dark theme support mandatory
- 44x44 point minimum touch targets
- Bundle size < 5MB for web builds

**Scale/Scope**: 
- Single-user per device (no sync in MVP)
- 500 items maximum capacity
- 100 character limit per item name
- 4 primary user interactions (add, check, delete, clear)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle 1: Code Quality Standards ✅
- ✅ Use TypeScript for all code
- ✅ Follow React Native ESLint configuration
- ✅ Use Prettier with single quotes and trailing commas
- ✅ JSDoc comments for exported functions/components
- ✅ Keep functions under 50 lines
- ✅ No console.log statements in production code

### Principle 2: Testing Standards ✅
- ✅ Unit tests for data management logic (add, remove, toggle, clear, persistence)
- ✅ Component tests with React Test Renderer
- ✅ Test light and dark modes
- ✅ Test all user interaction paths
- ✅ 80% code coverage target
- ✅ Mock AsyncStorage in tests

### Principle 3: User Experience Consistency ✅
- ✅ Support light and dark color schemes
- ✅ Use theme-aware colors from COLORS constant
- ✅ Respect safe area insets (using SafeAreaProvider)
- ✅ Consistent spacing (8px grid system)
- ✅ Minimum 14px body text
- ✅ 44x44 point touch targets
- ✅ Loading/empty states
- ✅ Error handling for storage failures

### Principle 4: Performance Requirements ✅
- ✅ Use FlatList with virtualization for list rendering
- ✅ Debounce rapid interactions
- ✅ Use React.memo for list items
- ✅ Optimize re-renders with proper keys
- ✅ Keep animations at 60fps
- ✅ Target < 16ms render time per component

**Gate Status**: ✅ PASS - All constitution requirements are satisfied by design

## Project Structure

### Documentation (this feature)

```text
specs/grocery-list/
├── plan.md              # This file
├── research.md          # Phase 0 output (dependencies, patterns, best practices)
├── data-model.md        # Phase 1 output (GroceryItem, GroceryList models)
├── quickstart.md        # Phase 1 output (developer setup and testing guide)
└── contracts/           # Phase 1 output (TypeScript interfaces)
    ├── GroceryItem.ts   # Item interface
    ├── GroceryList.ts   # List interface
    └── Storage.ts       # Storage service interface
```

### Source Code (repository root)

```text
src/
├── features/
│   └── grocery-list/
│       ├── components/
│       │   ├── GroceryListScreen.tsx         # Main screen component
│       │   ├── GroceryListItem.tsx           # Individual item component (with checkbox, swipe)
│       │   ├── GroceryListInput.tsx          # Input field component
│       │   ├── EmptyState.tsx                # Empty list guidance
│       │   └── ClearCheckedButton.tsx        # Clear checked items button
│       ├── hooks/
│       │   ├── useGroceryList.ts             # Custom hook for list state management
│       │   └── useGroceryStorage.ts          # Custom hook for AsyncStorage operations
│       ├── services/
│       │   └── groceryStorageService.ts      # AsyncStorage wrapper with error handling
│       ├── types/
│       │   ├── GroceryItem.ts                # TypeScript interface for items
│       │   └── GroceryList.ts                # TypeScript interface for list
│       └── utils/
│           ├── itemValidation.ts             # Validation helpers (trim, length check)
│           └── storageKeys.ts                # Constants for storage keys
├── navigation/
│   └── AppNavigator.tsx                      # Add grocery list screen to navigation
└── theme/
    └── colors.ts                             # Extract COLORS constant to shared theme

__tests__/
├── features/
│   └── grocery-list/
│       ├── components/
│       │   ├── GroceryListScreen.test.tsx
│       │   ├── GroceryListItem.test.tsx
│       │   ├── GroceryListInput.test.tsx
│       │   ├── EmptyState.test.tsx
│       │   └── ClearCheckedButton.test.tsx
│       ├── hooks/
│       │   ├── useGroceryList.test.ts
│       │   └── useGroceryStorage.test.ts
│       ├── services/
│       │   └── groceryStorageService.test.ts
│       └── utils/
│           └── itemValidation.test.ts
└── __mocks__/
    └── @react-native-async-storage/
        └── async-storage.js                  # Mock AsyncStorage for testing
```

**Structure Decision**: Using a feature-based architecture under `src/features/grocery-list/` to encapsulate all grocery list functionality in one place. This follows the React Native community best practice of organizing by feature rather than file type, making the codebase more maintainable as the app grows. The structure separates concerns clearly: components for UI, hooks for state logic, services for data persistence, types for TypeScript contracts, and utils for helper functions. Tests mirror the source structure for easy navigation.

## Complexity Tracking

> **No violations - this section is empty**

The implementation follows all constitution principles without requiring any exceptions or increased complexity.

---

## Phase 0: Research

### Research Topics

1. **AsyncStorage Best Practices for React Native**
   - Async/await patterns vs. callback patterns
   - Error handling strategies
   - Data serialization (JSON.stringify/parse)
   - Storage limits and quota management
   - Web platform differences (localStorage fallback)

2. **FlatList Optimization Patterns**
   - VirtualizedList configuration
   - getItemLayout for fixed-height items
   - keyExtractor best practices
   - Avoiding unnecessary re-renders
   - Performance monitoring

3. **Swipeable List Item Interactions**
   - React Native Gesture Handler (do we need it?)
   - Native swipe-to-delete patterns
   - Accessibility considerations for swipe gestures
   - Web platform alternatives (since swipe doesn't work on desktop)

4. **Testing AsyncStorage in Jest**
   - Mocking @react-native-async-storage/async-storage
   - Testing async operations with async/await in Jest
   - Simulating storage failures
   - Testing persistence across app lifecycle

5. **Theme-aware Styling in React Native**
   - useColorScheme hook best practices
   - Dynamic style objects vs. static StyleSheet
   - Performance implications of theme changes
   - Theme provider patterns vs. prop drilling

### Research Output Destination

All research findings will be documented in `specs/grocery-list/research.md` with decisions, rationales, and code examples.

---

## Phase 1: Design & Contracts

### Data Model

**Primary Entities** (detailed in `data-model.md`):

1. **GroceryItem**
   - `id: string` (UUID v4)
   - `name: string` (1-100 characters, trimmed)
   - `checked: boolean` (default: false)
   - `createdAt: number` (Unix timestamp)

2. **GroceryList**
   - `items: GroceryItem[]` (ordered array)
   - `lastModified: number` (Unix timestamp)

**Data Flow**:
```
User Input → Validation → State Update → AsyncStorage Save → Success/Error Feedback
                ↓                              ↓
         (trim, length)              (JSON.stringify)

App Load → AsyncStorage Load → JSON Parse → State Hydration → UI Render
                ↓
          (error handling)
```

### API Contracts

Since this is a local-only feature with no backend API, contracts will define TypeScript interfaces and service methods:

**Storage Service Contract** (`contracts/Storage.ts`):
```typescript
interface IGroceryStorageService {
  loadGroceryList(): Promise<GroceryList | null>;
  saveGroceryList(list: GroceryList): Promise<void>;
  clearGroceryList(): Promise<void>;
}
```

**List Management Contract** (`contracts/GroceryList.ts`):
```typescript
interface IGroceryListOperations {
  addItem(name: string): GroceryItem;
  removeItem(id: string): void;
  toggleItem(id: string): void;
  clearCheckedItems(): number; // returns count of removed items
  getItems(): GroceryItem[];
  getCheckedItems(): GroceryItem[];
  getUncheckedItems(): GroceryItem[];
}
```

### Component Architecture

```
GroceryListScreen (Container)
├── GroceryListInput (text input + submit)
├── FlatList (virtualized list)
│   └── GroceryListItem (checkbox + text + swipe)
│       ├── Checkbox (Pressable)
│       ├── Text (strikethrough when checked)
│       └── Swipeable Delete Action
├── EmptyState (when items.length === 0)
└── ClearCheckedButton (header/footer action)
```

### State Management Strategy

**Custom Hook Pattern** (no external state library):
```typescript
useGroceryList() {
  // Manages items array in useState
  // Provides CRUD operations
  // Handles auto-save to AsyncStorage
  // Returns: { items, addItem, removeItem, toggleItem, clearChecked, loading, error }
}
```

**Why not Redux/MobX?**
- Single feature scope (no cross-feature state sharing needed)
- Simple CRUD operations (no complex async flows)
- Performance: hooks are sufficient for list < 500 items
- Constitution principle: avoid unnecessary complexity

### Testing Strategy

1. **Unit Tests** (80% coverage target):
   - `itemValidation.ts`: trim, length validation, empty string checks
   - `groceryStorageService.ts`: save, load, clear operations with mocked AsyncStorage
   - `useGroceryList.ts`: add, remove, toggle, clear logic

2. **Component Tests**:
   - `GroceryListScreen.test.tsx`: renders empty state, renders with items, light/dark mode
   - `GroceryListItem.test.tsx`: checkbox toggle, swipe delete, styling (checked vs unchecked)
   - `GroceryListInput.test.tsx`: enter key submission, input clearing, empty validation
   - `EmptyState.test.tsx`: displays correct message
   - `ClearCheckedButton.test.tsx`: shows count, triggers confirmation dialog

3. **Integration Tests**:
   - Full flow: add item → persist → reload → verify item exists
   - Error flow: storage failure → show toast → continue in memory
   - Persistence flow: multiple operations → close app → reopen → verify all changes saved

### Quickstart Guide

Will be generated in `quickstart.md` with:
- Installation steps (`npm install @react-native-async-storage/async-storage`)
- Running tests (`npm test`)
- Manual testing checklist (add items, check off, delete, close/reopen)
- Common troubleshooting (AsyncStorage mock issues, theme not switching)

---

## Phase 2: Implementation Tasks

Implementation tasks will be generated using `/speckit.tasks` command after this plan is complete. Tasks will follow this general order:

1. **Setup & Dependencies**
   - Install @react-native-async-storage/async-storage
   - Create directory structure
   - Extract COLORS to shared theme
   - Setup AsyncStorage mock for Jest

2. **Data Layer**
   - Define TypeScript interfaces (GroceryItem, GroceryList)
   - Implement groceryStorageService
   - Write storage service tests
   - Implement validation utilities
   - Write validation tests

3. **Business Logic**
   - Implement useGroceryList hook
   - Implement useGroceryStorage hook
   - Write hook tests
   - Test persistence flow

4. **UI Components**
   - Create GroceryListInput
   - Create GroceryListItem (checkbox + text)
   - Add swipe-to-delete interaction
   - Create EmptyState
   - Create ClearCheckedButton
   - Write component tests

5. **Integration**
   - Create GroceryListScreen (assemble components)
   - Add to navigation
   - Test full flow (add → check → delete → persist)
   - Test light/dark mode
   - Test error states

6. **Polish & Optimization**
   - FlatList performance tuning (getItemLayout, keyExtractor)
   - Add confirmation dialog for clear checked
   - Add error toast for storage failures
   - Accessibility labels
   - Final test coverage check (80%)

---

## Implementation Notes

### Key Technical Decisions

1. **AsyncStorage over other storage solutions**
   - Rationale: React Native standard, cross-platform, simple API, no network needed
   - Trade-off: Limited storage (6MB on iOS), but sufficient for 500 items × 100 chars

2. **Custom hooks over Redux**
   - Rationale: Feature is self-contained, no complex state sharing, simpler to test
   - Trade-off: If we add multi-user sync later, may need to refactor to global state

3. **FlatList over ScrollView**
   - Rationale: Performance at scale (50+ items), constitution requires virtualization
   - Trade-off: Slightly more complex setup (keyExtractor, renderItem), but worth it

4. **Swipe-left only (no long-press)**
   - Rationale: iOS convention, simpler gesture, less accidental triggers
   - Trade-off: Android users may expect long-press, but swipe works on both platforms

5. **No animation library**
   - Rationale: Simple strikethrough + opacity change doesn't need Animated API
   - Trade-off: If we add advanced animations later, may need to refactor

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AsyncStorage failure on web | Medium | High | Implement localStorage fallback, show error toast |
| FlatList performance issues | Low | Medium | Use getItemLayout, profile with 500 items, optimize keys |
| Swipe gesture conflicts | Low | Low | Test on real devices, ensure proper touch handling |
| Theme switching lag | Low | Low | Use static StyleSheet where possible, memo components |
| Test flakiness (async) | Medium | Medium | Use async/await consistently, mock timers properly |

### Success Metrics Tracking

After implementation, verify these metrics from the spec:

- [ ] **SC-001**: Add item in < 3 seconds (manual test with timer)
- [ ] **SC-002**: Checkbox responds in < 100ms (profile with React DevTools)
- [ ] **SC-003**: 60fps scrolling with 500 items (test with Debug → Show Perf Monitor)
- [ ] **SC-004**: 100% persistence across restarts (automated integration test)
- [ ] **SC-005**: Empty state renders correctly (component test)
- [ ] **SC-006**: Light/dark modes work (component test + manual verification)
- [ ] **SC-007**: 44x44 point touch targets (manual measurement in simulator)
- [ ] **SC-008**: Input auto-focuses after add (automated test)
- [ ] **SC-009**: Checked items have strikethrough + 50% opacity (component test)
- [ ] **SC-010**: Clear checked works with one action (integration test)

---

## Next Steps

1. ✅ Complete Phase 0 research by creating `research.md`
2. ✅ Complete Phase 1 design by creating `data-model.md` and `contracts/`
3. ✅ Generate `quickstart.md` with setup instructions
4. Run `/speckit.tasks` to break down this plan into actionable tasks
5. Begin implementation following task order
6. Run tests after each task to ensure 80% coverage maintained
7. Manual QA testing on iOS, Android, and Web platforms
8. Performance profiling with 500 items before merging

---

**Plan Status**: ✅ Complete - Ready for Phase 0 research execution
