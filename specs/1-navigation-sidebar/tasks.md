# Tasks: Navigation Sidebar

**Input**: Design documents from `specs/1-navigation-sidebar/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are included as this is a production feature requiring 80% coverage per constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single React Native project: `src/features/navigation/`, `__tests__/features/navigation/`
- Theme updates: `src/theme/colors.ts`
- App integration: `App.tsx`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and theme foundation for navigation sidebar

- [X] T001 [P] Create navigation feature directory structure: `src/features/navigation/` with subdirectories (components/, hooks/, types/, utils/)
- [X] T002 [P] Create test directory structure: `__tests__/features/navigation/` with subdirectories (components/, hooks/, integration/, utils/)
- [X] T003 Add sidebar colors to `src/theme/colors.ts` for both light and dark themes (sidebarBackground, sidebarText, sidebarTextSecondary, sidebarHighlight, sidebarHighlightText, sidebarOverlay, sidebarBorder)

**Checkpoint**: Directory structure and theme colors ready for component development

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core configuration and types that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Create `src/features/navigation/utils/navigationConfig.ts` with NAVIGATION_ITEMS array (5 features: Home, Recipes, Grocery List, Travel, Home Projects)
- [X] T005 [P] Create `src/features/navigation/utils/animationConfig.ts` with animation constants (duration: 300ms, easing, native driver, sidebar widths, backdrop opacity: 0.4, z-indexes)
- [X] T006 [P] Create TypeScript interface `src/features/navigation/types/NavigationItem.ts` (id, name, icon, route, order)
- [X] T007 [P] Create TypeScript interface `src/features/navigation/types/SidebarState.ts` (isOpen, isAnimating, currentRoute, position, backdropOpacity)
- [X] T008 [P] Write unit test `__tests__/features/navigation/utils/navigationConfig.test.ts` for NAVIGATION_ITEMS validation
- [X] T009 [P] Write unit test `__tests__/features/navigation/utils/animationConfig.test.ts` for animation constants

**Checkpoint**: Foundation ready - all config, types, and constants available for user story implementation

---

## Phase 3: User Story 1 + 2 - Open Sidebar & Navigate (Priority: P1) 🎯 MVP

**Goal**: Users can open the navigation sidebar from any screen and navigate between features

**Independent Test**: Tap hamburger menu → sidebar slides in → tap any feature → navigates to that screen and sidebar closes. This is the complete MVP - users can navigate throughout the entire app.

### Tests for User Story 1 & 2 (Combined MVP)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Write component test `__tests__/features/navigation/components/NavigationSidebar.test.tsx` for sidebar rendering, light/dark themes, proper item count
- [ ] T011 [P] [US1] Write component test `__tests__/features/navigation/components/SidebarHeader.test.tsx` for branding display (🌱 + LTPs + subtitle), theme support
- [ ] T012 [P] [US1] Write component test `__tests__/features/navigation/components/SidebarItem.test.tsx` for item rendering, press handling, active/inactive states, both themes
- [ ] T013 [P] [US1] Write hook test `__tests__/features/navigation/hooks/useSidebarAnimation.test.ts` for animation timing (300ms), state transitions, input blocking during animation
- [ ] T014 [P] [US2] Write integration test `__tests__/features/navigation/integration/navigation-flow.test.tsx` for full open→navigate→close flow across all 5 features

### Implementation for User Story 1 & 2

- [X] T015 [P] [US1] Implement `src/features/navigation/hooks/useSidebarAnimation.ts` custom hook (manage position/opacity Animated.Values, openSidebar/closeSidebar functions, isAnimating flag, 300ms timing)
- [X] T016 [P] [US1] Create `src/features/navigation/components/SidebarHeader.tsx` component (display 🌱 + "LTPs" + "Long Term Plans", theme-aware styling, safe area support)
- [X] T017 [P] [US2] Create `src/features/navigation/components/SidebarItem.tsx` component (display icon + name, handle press, 44x44pt touch target, React.memo optimization, theme support)
- [X] T018 [US1] Create `src/features/navigation/components/NavigationSidebar.tsx` main container (integrate useSidebarAnimation hook, render SidebarHeader, map NAVIGATION_ITEMS to SidebarItem components, SafeAreaView, theme integration)
- [X] T019 [US2] Update `App.tsx` to integrate NavigationSidebar (add isSidebarOpen state, add currentScreen state tracking, add onNavigate handler, add hamburger menu button, pass props to NavigationSidebar)
- [X] T020 [US2] Create placeholder screen components (Recipes, Travel, Home Projects) in `src/features/` with hamburger menu buttons and proper theming

**Checkpoint**: MVP Complete! Users can open sidebar and navigate between all 5 features. Sidebar closes automatically after navigation.

---

## Phase 4: User Story 3 - Close Sidebar Without Navigating (Priority: P2)

**Goal**: Users can dismiss the sidebar without changing screens using backdrop tap, swipe, back button (Android), or Escape key (web)

**Independent Test**: Open sidebar → tap backdrop OR swipe left OR press back/Escape → sidebar closes without navigation, user remains on current screen

### Tests for User Story 3

- [ ] T021 [P] [US3] Write component test `__tests__/features/navigation/components/SidebarBackdrop.test.tsx` for backdrop rendering, opacity animation, press handling
- [ ] T022 [P] [US3] Write gesture test in `NavigationSidebar.test.tsx` for swipe-to-close behavior (PanResponder simulation)
- [ ] T023 [P] [US3] Write platform-specific test for Android back button handling in `NavigationSidebar.test.tsx`
- [ ] T024 [P] [US3] Write platform-specific test for web Escape key handling in `NavigationSidebar.test.tsx`

### Implementation for User Story 3

- [ ] T025 [P] [US3] Create `src/features/navigation/components/SidebarBackdrop.tsx` component (Animated opacity 0→0.4, Pressable with onPress to close, conditional rendering based on visibility)
- [ ] T026 [US3] Add PanResponder to `NavigationSidebar.tsx` for swipe-to-close gesture (horizontal swipe detection, threshold checks, snap-back behavior, mobile only)
- [ ] T027 [US3] Add BackHandler listener to `NavigationSidebar.tsx` for Android back button (close sidebar when open, return true to prevent default, cleanup on unmount)
- [ ] T028 [US3] Add keyboard event listener to `NavigationSidebar.tsx` for web Escape key (Platform.OS === 'web' check, addEventListener/removeEventListener, close sidebar on Escape)
- [ ] T029 [US3] Integrate SidebarBackdrop into `NavigationSidebar.tsx` (render with animated opacity, wire onPress to onClose callback, ensure proper z-index layering)

**Checkpoint**: All close mechanisms working - users can dismiss sidebar via backdrop, swipe, back button, or Escape without changing screens

---

## Phase 5: User Story 4 - Visual Feedback for Current Location (Priority: P2)

**Goal**: Users see which feature they're currently on highlighted in the sidebar (background color + bold text)

**Independent Test**: Navigate to each of the 5 features → open sidebar → verify current feature has background highlight + bold text → verify other features don't have highlight

### Tests for User Story 4

- [ ] T030 [P] [US4] Write test in `SidebarItem.test.tsx` for active state styling (background color, bold text weight, contrast verification)
- [ ] T031 [P] [US4] Write integration test in `navigation-flow.test.tsx` for highlight persistence across navigation (navigate to feature → open sidebar → verify only that feature highlighted)

### Implementation for User Story 4

- [ ] T032 [US4] Update `SidebarItem.tsx` to accept isActive prop and apply highlight styles when true (background: sidebarHighlight color, text: sidebarHighlightText color, fontWeight: 'bold')
- [ ] T033 [US4] Update `NavigationSidebar.tsx` to pass isActive prop to each SidebarItem (compare item.route === currentScreen, ensure currentScreen prop is passed from App.tsx)

**Checkpoint**: Active feature highlight working - users always know their current location in the app

---

## Phase 6: User Story 5 - Sidebar Adapts to Theme (Priority: P3)

**Goal**: Sidebar automatically matches device light/dark theme with proper colors and contrast

**Independent Test**: Toggle device theme (Settings → Display → Theme) → verify sidebar colors update → test in both light and dark mode → verify WCAG AA contrast ratios

### Tests for User Story 5

- [ ] T034 [P] [US5] Write theme test in `NavigationSidebar.test.tsx` for light mode rendering (verify all light theme colors applied)
- [ ] T035 [P] [US5] Write theme test in `NavigationSidebar.test.tsx` for dark mode rendering (verify all dark theme colors applied)
- [ ] T036 [P] [US5] Write theme test in `SidebarHeader.test.tsx` for both themes
- [ ] T037 [P] [US5] Write theme test in `SidebarItem.test.tsx` for both themes and active/inactive states
- [ ] T038 [P] [US5] Write theme test in `SidebarBackdrop.test.tsx` (backdrop opacity should be same in both themes: 0.4)

### Implementation for User Story 5

- [ ] T039 [US5] Verify `App.tsx` passes isDarkMode prop from useColorScheme() hook to NavigationSidebar
- [ ] T040 [US5] Verify all navigation components use theme prop instead of hardcoded colors (NavigationSidebar, SidebarHeader, SidebarItem, SidebarBackdrop)
- [ ] T041 [US5] Add dynamic theme color selection in all components based on isDarkMode prop (reference COLORS.light vs COLORS.dark)
- [ ] T042 [US5] Test theme switching manually on iOS, Android, and Web platforms (verify instant update when sidebar open, verify correct colors on next open when closed)

**Checkpoint**: Theme support complete - sidebar seamlessly adapts to device theme in all scenarios

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements, accessibility, performance optimization, and final QA

- [ ] T043 [P] Add accessibility labels to all interactive elements in `NavigationSidebar.tsx` (accessibilityLabel, accessibilityRole, accessibilityState, accessibilityHint)
- [ ] T044 [P] Add accessibility labels to hamburger menu button in `App.tsx` and placeholder screens ("Open navigation menu", role: "button")
- [ ] T045 [P] Add accessibility labels to `SidebarItem.tsx` ("Navigate to [feature name]", role: "button", state: {selected: isActive})
- [ ] T046 [P] Add accessibility labels to `SidebarBackdrop.tsx` ("Close navigation menu", role: "button")
- [ ] T047 [P] Optimize `SidebarItem.tsx` with React.memo to prevent unnecessary re-renders (memoize based on isActive prop changes only)
- [ ] T048 Verify useNativeDriver: true in all animations in `useSidebarAnimation.ts` (CRITICAL for 60fps performance)
- [ ] T049 Add error boundary around `NavigationSidebar.tsx` in `App.tsx` to gracefully handle any rendering errors
- [ ] T050 Run full test suite and verify 80%+ code coverage for navigation feature (`npm test -- --coverage --collectCoverageFrom='src/features/navigation/**/*.{ts,tsx}'`)
- [ ] T051 Perform manual QA testing per `quickstart.md` checklist on iOS simulator (25+ checks: open, close, navigate, theme, gestures, safe areas, accessibility)
- [ ] T052 Perform manual QA testing per `quickstart.md` checklist on Android emulator (include back button testing)
- [ ] T053 Perform manual QA testing per `quickstart.md` checklist on web browser (include Escape key and mouse interactions)
- [ ] T054 Performance profiling: measure animation FPS with Debug Perf Monitor (should maintain 60fps on all platforms)
- [ ] T055 Performance profiling: measure open/close timing with console.time (should complete in < 300ms)
- [ ] T056 Run ESLint and fix any violations (`npm run lint -- src/features/navigation/`)
- [ ] T057 Run Prettier to format all navigation code (`npx prettier --write "src/features/navigation/**/*.{ts,tsx}"`)
- [ ] T058 Review all navigation code for console.log statements and remove before commit (constitution requirement)
- [ ] T059 Final TypeScript type check (`npx tsc --noEmit`) - ensure no type errors in navigation feature

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) - BLOCKS all user stories
- **MVP (Phase 3)**: Depends on Foundational (Phase 2) - User Stories 1 & 2 combined
- **User Story 3 (Phase 4)**: Depends on MVP (Phase 3) - Adds close mechanisms
- **User Story 4 (Phase 5)**: Depends on MVP (Phase 3) - Can run in parallel with Phase 4
- **User Story 5 (Phase 6)**: Depends on MVP (Phase 3) - Can run in parallel with Phases 4 & 5
- **Polish (Phase 7)**: Depends on completion of all desired user stories

### User Story Dependencies

- **User Story 1 (Open Sidebar) - P1**: No dependencies on other stories, but requires Foundational
- **User Story 2 (Navigate) - P1**: Tightly coupled with US1, implemented together as MVP
- **User Story 3 (Close Mechanisms) - P2**: Depends on US1 (must be able to open first)
- **User Story 4 (Visual Highlight) - P2**: Depends on US2 (needs navigation to test)
- **User Story 5 (Theme Support) - P3**: Depends on US1 (needs sidebar to render)

**Note**: US1 & US2 are implemented together because navigation without the ability to open/close the sidebar would be incomplete.

### Within Each Phase

**Phase 3 (MVP)**:
1. Tests first (T010-T014) - can all run in parallel, must fail initially
2. Hook and components (T015-T017) - can run in parallel (different files)
3. Main container (T018) - depends on T015-T017 being complete
4. Integration (T019-T020) - depends on T018 being complete

**Phase 4 (US3)**:
1. Tests first (T021-T024) - can all run in parallel
2. Backdrop component (T025) - parallel with T026-T028
3. Gesture handlers (T026-T028) - can run in parallel (different handlers)
4. Integration (T029) - depends on T025 being complete

**Phases 5 & 6**: Can run in parallel with each other and with Phase 4

### Parallel Opportunities

**Setup Phase**: All 3 tasks (T001-T003) can run in parallel

**Foundational Phase**: All tasks except tests can run in parallel:
- Parallel: T004, T005, T006, T007 (different files)
- After above complete: T008, T009 in parallel (tests)

**MVP Phase (US1+US2)**: 
- Tests in parallel: T010, T011, T012, T013, T014
- Implementation in parallel: T015, T016, T017
- Sequential: T018 → T019 → T020

**US3 Phase**:
- Tests in parallel: T021, T022, T023, T024
- Implementation parallel: T025, T026, T027, T028
- Sequential: T029

**US4 & US5 Phases**: Can work on both phases simultaneously
- US4 tests: T030, T031 in parallel
- US5 tests: T034, T035, T036, T037, T038 in parallel
- US4 & US5 implementation tasks can interleave

**Polish Phase**: Most tasks (T043-T046, T047, T050) can run in parallel

---

## Parallel Example: MVP Phase (US1+US2)

```bash
# Step 1: Launch all MVP tests together (should fail):
Task T010: "Component test for NavigationSidebar"
Task T011: "Component test for SidebarHeader" 
Task T012: "Component test for SidebarItem"
Task T013: "Hook test for useSidebarAnimation"
Task T014: "Integration test for navigation flow"

# Step 2: Launch all parallel components together:
Task T015: "Implement useSidebarAnimation hook"
Task T016: "Create SidebarHeader component"
Task T017: "Create SidebarItem component"

# Step 3: Sequential integration:
Task T018: "Create NavigationSidebar container" (needs T015-T017)
Task T019: "Update App.tsx integration" (needs T018)
Task T020: "Create placeholder screens" (needs T019)

# Verify: Run tests (T010-T014) - they should now PASS
```

---

## Parallel Example: Close Mechanisms (US3)

```bash
# Step 1: Launch all US3 tests together:
Task T021: "Test SidebarBackdrop component"
Task T022: "Test swipe gesture"
Task T023: "Test Android back button"
Task T024: "Test web Escape key"

# Step 2: Launch all parallel implementations:
Task T025: "Create SidebarBackdrop component"
Task T026: "Add PanResponder for swipe"
Task T027: "Add BackHandler for Android"
Task T028: "Add keyboard listener for web"

# Step 3: Integration:
Task T029: "Integrate backdrop into sidebar" (needs T025)
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. ✅ Complete Phase 1: Setup (T001-T003)
2. ✅ Complete Phase 2: Foundational (T004-T009) - **CRITICAL CHECKPOINT**
3. ✅ Complete Phase 3: MVP (T010-T020)
4. **STOP and VALIDATE**: 
   - Run all MVP tests (should pass)
   - Manual test on all 3 platforms
   - Verify: Can open sidebar, navigate to all 5 features, sidebar closes
5. **Deploy/Demo MVP**: Users can navigate entire app!

### Incremental Delivery

1. ✅ Foundation (Phase 1 + 2) → All config, types, theme ready
2. ✅ MVP (Phase 3) → Full navigation working → **DEPLOY** 🚀
3. ✅ Add US3 (Phase 4) → Close mechanisms → **DEPLOY** 🚀
4. ✅ Add US4 (Phase 5) → Visual highlights → **DEPLOY** 🚀
5. ✅ Add US5 (Phase 6) → Theme support → **DEPLOY** 🚀
6. ✅ Polish (Phase 7) → Accessibility, performance, QA → **FINAL DEPLOY** 🚀

Each deployment adds value without breaking previous functionality!

### Parallel Team Strategy

With multiple developers after Foundational phase completes:

- **Developer A**: Phase 3 (MVP - US1+US2)
- **Developer B**: Phase 4 (US3 - Close mechanisms) - starts after Phase 3 complete
- **Developer C**: Phase 5 (US4 - Visual feedback) - can start after Phase 3
- **Developer D**: Phase 6 (US5 - Theme support) - can start after Phase 3

Or work on tests vs implementation:
- **Developer A**: Write all tests (T010-T014, T021-T024, T030-T031, T034-T038)
- **Developer B**: Implement components after tests exist

---

## Task Summary

**Total Tasks**: 59

**By Phase**:
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 6 tasks
- Phase 3 (MVP - US1+US2): 11 tasks
- Phase 4 (US3): 9 tasks
- Phase 5 (US4): 4 tasks
- Phase 6 (US5): 9 tasks
- Phase 7 (Polish): 17 tasks

**By User Story**:
- US1 (Open Sidebar): 8 tasks (including tests)
- US2 (Navigate): 6 tasks (including tests)
- US3 (Close Mechanisms): 9 tasks (including tests)
- US4 (Visual Feedback): 4 tasks (including tests)
- US5 (Theme Support): 9 tasks (including tests)
- Setup/Foundation: 9 tasks
- Polish/Cross-cutting: 17 tasks

**Parallel Opportunities**: 38 tasks marked [P] can run in parallel within their phase

**MVP Scope**: Phases 1-3 (20 tasks) delivers complete navigation capability

**Test Coverage**: 21 test tasks ensuring 80%+ coverage (constitution requirement)

---

## Notes

- [P] tasks = different files, no blocking dependencies within their phase
- [Story] label maps task to specific user story for traceability
- MVP (US1+US2) provides immediate value - users can navigate entire app
- Each subsequent story adds polish without breaking MVP
- Tests written first, should fail before implementation (TDD)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All tasks include exact file paths for immediate execution
- Constitution requirements embedded: 80% coverage, accessibility, theme support, TypeScript strict, ESLint/Prettier compliance
