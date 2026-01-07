# Tasks: Grocery List

**Input**: Design documents from `specs/grocery-list/`  
**Prerequisites**: plan.md, spec.md (with user stories), research.md, data-model.md, contracts/

**Tests**: Constitution requires 80% test coverage. Test tasks are included for all components and business logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Install @react-native-async-storage/async-storage dependency
- [ ] T002 Install react-native-gesture-handler dependency  
- [ ] T003 Link native modules for iOS (run `cd ios && pod install && cd ..`)
- [ ] T004 Create feature directory structure `src/features/grocery-list/{components,hooks,services,types,utils}`
- [ ] T005 Create test directory structure `__tests__/features/grocery-list/{components,hooks,services,utils}`
- [ ] T006 [P] Create AsyncStorage mock at `__tests__/__mocks__/@react-native-async-storage/async-storage.js`
- [ ] T007 [P] Extract COLORS constant to `src/theme/colors.ts` for shared theme support
- [ ] T008 Update `jest.config.js` to include AsyncStorage mock mapping

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data types and utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 Copy TypeScript contracts from `specs/grocery-list/contracts/` to `src/features/grocery-list/types/`
- [ ] T010 [P] Implement item validation utility in `src/features/grocery-list/utils/itemValidation.ts`
- [ ] T011 [P] Create storage keys constants in `src/features/grocery-list/utils/storageKeys.ts`
- [ ] T012 [P] Write unit tests for itemValidation in `__tests__/features/grocery-list/utils/itemValidation.test.ts`
- [ ] T013 Implement groceryStorageService in `src/features/grocery-list/services/groceryStorageService.ts`
- [ ] T014 Write storage service tests in `__tests__/features/grocery-list/services/groceryStorageService.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Quick Item Entry (Priority: P1) 🎯 MVP Core

**Goal**: Users can add grocery items by typing and pressing enter with input validation and auto-focus

**Independent Test**: Open screen, type "milk", press enter, verify item appears in list and input clears/refocuses

### Implementation for User Story 1

- [ ] T015 [P] [US1] Create useGroceryList hook in `src/features/grocery-list/hooks/useGroceryList.ts` (add, remove, toggle, clear operations)
- [ ] T016 [P] [US1] Create GroceryListInput component in `src/features/grocery-list/components/GroceryListInput.tsx`
- [ ] T017 [P] [US1] Create GroceryListItem component (text display only) in `src/features/grocery-list/components/GroceryListItem.tsx`
- [ ] T018 [US1] Create GroceryListScreen container in `src/features/grocery-list/components/GroceryListScreen.tsx` (assemble input + FlatList)
- [ ] T019 [US1] Configure FlatList with virtualization (getItemLayout, keyExtractor) in GroceryListScreen
- [ ] T020 [US1] Add input validation (trim whitespace, 100 char limit, empty check) in GroceryListInput
- [ ] T021 [US1] Implement auto-focus after item addition in GroceryListInput

### Tests for User Story 1

- [ ] T022 [P] [US1] Write useGroceryList hook tests in `__tests__/features/grocery-list/hooks/useGroceryList.test.ts`
- [ ] T023 [P] [US1] Write GroceryListInput component tests in `__tests__/features/grocery-list/components/GroceryListInput.test.tsx`
- [ ] T024 [P] [US1] Write GroceryListItem component tests in `__tests__/features/grocery-list/components/GroceryListItem.test.tsx`
- [ ] T025 [US1] Write GroceryListScreen integration tests in `__tests__/features/grocery-list/components/GroceryListScreen.test.tsx`

**Checkpoint**: User Story 1 complete - users can add items and see them in a list

---

## Phase 4: User Story 4 - Persist List Data (Priority: P1) 🎯 MVP Essential

**Goal**: Grocery list automatically saves to AsyncStorage and restores on app restart

**Independent Test**: Add items, force close app, reopen, verify all items are still present

**Note**: US4 implemented before US2 because persistence is required for real-world usage of any feature

### Implementation for User Story 4

- [ ] T026 [P] [US4] Create useGroceryStorage hook in `src/features/grocery-list/hooks/useGroceryStorage.ts` (load/save via groceryStorageService)
- [ ] T027 [US4] Integrate useGroceryStorage into useGroceryList hook (auto-save on every change)
- [ ] T028 [US4] Add loading state handling in GroceryListScreen (show spinner while loading)
- [ ] T029 [US4] Add storage error handling (show toast, continue in memory-only mode)
- [ ] T030 [US4] Implement data hydration on mount in GroceryListScreen

### Tests for User Story 4

- [ ] T031 [P] [US4] Write useGroceryStorage hook tests in `__tests__/features/grocery-list/hooks/useGroceryStorage.test.ts`
- [ ] T032 [US4] Write persistence integration test (add → save → load cycle) in `__tests__/features/grocery-list/integration/persistence.test.ts`
- [ ] T033 [US4] Write storage failure tests in useGroceryStorage.test.ts

**Checkpoint**: User Stories 1 & 4 complete - users can add items and data persists across sessions (MVP ready!)

---

## Phase 5: User Story 2 - Check Off Purchased Items (Priority: P1)

**Goal**: Users can tap checkbox to mark items as purchased with visual feedback (strikethrough + 50% opacity)

**Independent Test**: Add items, tap checkbox, verify strikethrough + opacity applied, tap again, verify returns to normal

### Implementation for User Story 2

- [ ] T034 [P] [US2] Add checkbox to GroceryListItem component in `src/features/grocery-list/components/GroceryListItem.tsx`
- [ ] T035 [US2] Implement toggle functionality (onPress handler) in GroceryListItem
- [ ] T036 [US2] Add checked item styling (strikethrough + 50% opacity) in GroceryListItem
- [ ] T037 [US2] Ensure theme-aware styling (light/dark mode) for checked items in GroceryListItem
- [ ] T038 [US2] Optimize item re-renders with React.memo in GroceryListItem

### Tests for User Story 2

- [ ] T039 [P] [US2] Write checkbox toggle tests in `__tests__/features/grocery-list/components/GroceryListItem.test.tsx`
- [ ] T040 [P] [US2] Write checked item styling tests (light/dark mode) in GroceryListItem.test.tsx
- [ ] T041 [US2] Write performance test (rapid checkbox taps < 100ms) in GroceryListItem.test.tsx

**Checkpoint**: User Stories 1, 2, & 4 complete - full shopping workflow functional

---

## Phase 6: User Story 6 - Empty State Guidance (Priority: P2)

**Goal**: Show helpful message when list is empty to guide users

**Independent Test**: Open screen with no items, verify friendly message appears

### Implementation for User Story 6

- [ ] T042 [P] [US6] Create EmptyState component in `src/features/grocery-list/components/EmptyState.tsx`
- [ ] T043 [US6] Integrate EmptyState as ListEmptyComponent in GroceryListScreen FlatList
- [ ] T044 [US6] Add theme-aware styling for EmptyState (light/dark mode)

### Tests for User Story 6

- [ ] T045 [P] [US6] Write EmptyState component tests in `__tests__/features/grocery-list/components/EmptyState.test.tsx`
- [ ] T046 [US6] Write empty state integration test (appears when items.length === 0) in GroceryListScreen.test.tsx

**Checkpoint**: Better UX for new users with guidance

---

## Phase 7: User Story 3 - Remove Items (Priority: P2)

**Goal**: Users can swipe left on items to delete them permanently

**Independent Test**: Add items, swipe left, tap delete, verify item removed

### Implementation for User Story 3

- [ ] T047 [US3] Wrap GroceryListItem with Swipeable component from react-native-gesture-handler
- [ ] T048 [US3] Implement renderRightActions for delete button in GroceryListItem
- [ ] T049 [US3] Add delete handler (onSwipeableOpen → removeItem) in GroceryListItem
- [ ] T050 [US3] Add platform-specific handling (swipe on mobile, button on web) using Platform.OS
- [ ] T051 [US3] Ensure swipe gesture doesn't conflict with scroll in FlatList

### Tests for User Story 3

- [ ] T052 [P] [US3] Write swipe-to-delete tests in `__tests__/features/grocery-list/components/GroceryListItem.test.tsx`
- [ ] T053 [P] [US3] Write delete functionality tests (item removed from list) in GroceryListScreen.test.tsx
- [ ] T054 [US3] Write platform-specific tests (swipe vs button) in GroceryListItem.test.tsx

**Checkpoint**: Users can now add, check, persist, and delete items

---

## Phase 8: User Story 5 - Clear Checked Items (Priority: P3)

**Goal**: Bulk remove all checked items with confirmation dialog

**Independent Test**: Check off multiple items, tap "Clear Checked", confirm, verify only checked items removed

### Implementation for User Story 5

- [ ] T055 [P] [US5] Create ClearCheckedButton component in `src/features/grocery-list/components/ClearCheckedButton.tsx`
- [ ] T056 [US5] Implement clearCheckedItems operation in useGroceryList hook
- [ ] T057 [US5] Add confirmation dialog (Alert.alert) in ClearCheckedButton
- [ ] T058 [US5] Show count of checked items in button text (e.g., "Clear 3 checked items")
- [ ] T059 [US5] Disable button when no checked items exist
- [ ] T060 [US5] Integrate ClearCheckedButton into GroceryListScreen header/footer

### Tests for User Story 5

- [ ] T061 [P] [US5] Write ClearCheckedButton component tests in `__tests__/features/grocery-list/components/ClearCheckedButton.test.tsx`
- [ ] T062 [P] [US5] Write clearCheckedItems logic tests in useGroceryList.test.ts
- [ ] T063 [US5] Write confirmation dialog tests in ClearCheckedButton.test.tsx
- [ ] T064 [US5] Write integration test (clear → only checked removed) in GroceryListScreen.test.tsx

**Checkpoint**: All user stories complete - full feature implemented!

---

## Phase 9: Navigation & Integration

**Purpose**: Integrate grocery list into app navigation

- [ ] T065 Create navigation file `src/navigation/AppNavigator.tsx` (if not exists)
- [ ] T066 Add GroceryListScreen to app navigation with route "GroceryList"
- [ ] T067 Update main App.tsx to link to grocery list from home screen
- [ ] T068 Test navigation flow (Home → GroceryList → Back)

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T069 [P] Add accessibility labels to all interactive elements (checkboxes, buttons, inputs)
- [ ] T070 [P] Ensure minimum 44x44 point touch targets on all buttons/checkboxes
- [ ] T071 [P] Add loading spinner component for async storage operations
- [ ] T072 [P] Create error toast component for storage failures
- [ ] T073 Verify theme switching works correctly (light/dark mode test)
- [ ] T074 Run performance profiling with 500 items (maintain 60fps scrolling)
- [ ] T075 Add JSDoc comments to all exported functions and components
- [ ] T076 Run ESLint and fix any violations
- [ ] T077 Run Prettier to format all code
- [ ] T078 Verify test coverage meets 80% threshold (`npm test -- --coverage`)
- [ ] T079 Update project README with grocery list feature documentation
- [ ] T080 Validate against quickstart.md manual testing checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 4 (Phase 4)**: Depends on US1 (needs list operations to persist)
- **User Story 2 (Phase 5)**: Depends on Foundational + US1 (needs list items to check)
- **User Story 6 (Phase 6)**: Depends on Foundational only (independent)
- **User Story 3 (Phase 7)**: Depends on US1 (needs items to delete)
- **User Story 5 (Phase 8)**: Depends on US2 (needs checked items to clear)
- **Navigation (Phase 9)**: Depends on US1, US2, US4 (core features)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies Graph

```
Foundational (Phase 2)
        ↓
    US1 (P1) ────────┐
        ↓            │
    US4 (P1)         │
        ↓            │
    US2 (P1)         │
        ↓            ↓
    US5 (P3)      US3 (P2)
                     ↑
    US6 (P2) ────────┘
```

### Critical Path for MVP

1. Setup (Phase 1)
2. Foundational (Phase 2)
3. User Story 1 - Quick Item Entry (Phase 3)
4. User Story 4 - Persist List Data (Phase 4)

**Stop here for minimal MVP** - Users can add items and data persists

### Recommended MVP (Add Shopping Workflow)

Continue with:
5. User Story 2 - Check Off Items (Phase 5)

**Stop here for full shopping MVP** - Users can add, check off, and persist items

### Within Each User Story

- Implementation tasks before tests (TDD optional but tests required for 80% coverage)
- Components in dependency order:
  - Hooks before components (components use hooks)
  - Simple components before container components
  - Container components before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1 (Setup)**: T001-T003 can run sequentially (native dependencies), T006-T007 can run parallel after T005
- **Phase 2 (Foundational)**: T010, T011, T012 can run in parallel; T013-T014 sequential
- **Phase 3 (US1)**: T015, T016, T017 can run parallel; then T018-T021 sequential; T022-T024 can run parallel
- **Phase 4 (US4)**: T026 parallel, T027-T030 sequential; T031-T033 can run parallel
- **Phase 5 (US2)**: T034-T037 sequential, T038 last; T039-T040 can run parallel
- **Phase 6 (US6)**: T042-T043 sequential; T045-T046 can run parallel
- **Phase 7 (US3)**: T047-T051 sequential; T052-T054 can run parallel
- **Phase 8 (US5)**: T055-T060 sequential; T061-T063 can run parallel
- **Phase 10 (Polish)**: T069-T072 can run in parallel

---

## Parallel Example: User Story 1 Implementation

```bash
# Launch models and utilities together (different files):
Task T015: "Create useGroceryList hook in src/features/grocery-list/hooks/useGroceryList.ts"
Task T016: "Create GroceryListInput component in src/features/grocery-list/components/GroceryListInput.tsx"
Task T017: "Create GroceryListItem component in src/features/grocery-list/components/GroceryListItem.tsx"

# Then launch tests together after implementation:
Task T022: "Write useGroceryList hook tests"
Task T023: "Write GroceryListInput component tests"
Task T024: "Write GroceryListItem component tests"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 4 Only)

**Timeline**: 2-3 days for single developer

1. Complete Phase 1: Setup (~30 min)
2. Complete Phase 2: Foundational (~2 hours)
3. Complete Phase 3: User Story 1 (~4 hours)
4. Complete Phase 4: User Story 4 (~3 hours)
5. **STOP and VALIDATE**: Test independently, ensure 80% coverage
6. Deploy/demo if ready

**Deliverable**: Users can add items and data persists - core value delivered

### Incremental Delivery (Recommended)

**Timeline**: 4-5 days for single developer

1. Complete Setup + Foundational → Foundation ready
2. Add US1 (Quick Entry) → Test independently (~4 hours)
3. Add US4 (Persistence) → Test independently (~3 hours)
4. **DEPLOY MVP** - Users can add and save items
5. Add US2 (Check Off) → Test independently (~3 hours)
6. **DEPLOY v1.1** - Full shopping workflow
7. Add US6 (Empty State) → Test independently (~2 hours)
8. Add US3 (Delete) → Test independently (~3 hours)
9. Add US5 (Clear Checked) → Test independently (~3 hours)
10. Polish & integrate → Final testing
11. **DEPLOY v1.2** - Complete feature

**Benefits**: Each deployment adds value without breaking previous features

### Parallel Team Strategy

With 2-3 developers after Foundational phase:

**Week 1**:
- Developer A: US1 + US4 (core MVP)
- Developer B: US6 (empty state - independent)
- Developer C: Setup navigation and integration

**Week 2**:
- Developer A: US2 (check off)
- Developer B: US3 (delete)
- Developer C: US5 (clear checked)

**Week 3**: All developers on Polish + integration testing

---

## Task Completion Checklist

Before marking a task complete:

- [ ] Code written and follows TypeScript strict mode
- [ ] ESLint passes (no violations)
- [ ] Prettier formatting applied
- [ ] JSDoc comments added for exported functions
- [ ] Tests written and passing (if test task)
- [ ] Test coverage checked (if implementation task)
- [ ] Manual testing completed (if UI task)
- [ ] Light and dark mode verified (if UI task)
- [ ] Code committed with clear message

---

## Success Metrics (from spec.md)

Track these after implementation:

- [ ] **SC-001**: Users can add a new grocery item in under 3 seconds
- [ ] **SC-002**: Checkbox responds in under 100ms
- [ ] **SC-003**: 60fps scrolling with up to 500 items
- [ ] **SC-004**: 100% data persistence across restarts
- [ ] **SC-005**: Empty state renders correctly
- [ ] **SC-006**: Light/dark modes work without artifacts
- [ ] **SC-007**: 44x44 point touch targets on all interactive elements
- [ ] **SC-008**: Input auto-focuses after item addition
- [ ] **SC-009**: Checked items have strikethrough + 50% opacity
- [ ] **SC-010**: Clear checked works with single confirmation

---

## Notes

- Constitution requires 80% test coverage - all test tasks are mandatory
- Each user story should be independently testable at its checkpoint
- FlatList virtualization is required from the start (constitution: performance for 50+ items)
- Theme support (light/dark) is mandatory per constitution
- Stop at any checkpoint to validate and potentially deploy
- Commit frequently (after each task or logical group)
- Use feature flags if deploying incrementally to production

---

**Total Tasks**: 80 tasks  
**Parallel Opportunities**: 25+ tasks marked [P] can run in parallel within their phase  
**MVP Scope**: 31 tasks (Phases 1-4) for core add + persist functionality  
**Recommended First Release**: 48 tasks (Phases 1-5) for full shopping workflow  
**Story Distribution**: US1(11), US4(8), US2(8), US6(5), US3(8), US5(10), Navigation(4), Polish(12)
