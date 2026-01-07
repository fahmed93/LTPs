# Implementation Plan: Navigation Sidebar

**Branch**: `1-navigation-sidebar` | **Date**: 2026-01-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/1-navigation-sidebar/spec.md`

## Summary

Implement a slide-in navigation sidebar for the LTPs React Native app that provides app-wide navigation between features (Home, Recipes, Grocery List, Travel, Home Projects). The sidebar opens from the left via hamburger menu button, displays all features with visual highlighting for the current location, supports multiple close mechanisms (backdrop tap, swipe, back button, Escape key), and works consistently across iOS, Android, and Web platforms. Uses React state management in App.tsx for navigation state tracking (interim solution before navigation library selection) and achieves 60fps animations with <300ms open/close timing.

## Technical Context

**Language/Version**: TypeScript 5.8.3, React 19.2.0, React Native 0.83.1  
**Primary Dependencies**: 
- `react-native` (core framework)
- `react-native-web` (web platform support)
- `react-native-safe-area-context` (safe area handling - already installed)
- React Navigation or equivalent (TBD in Phase 0 research - for future migration)

**Storage**: N/A (navigation state is ephemeral, only persisted within session via React state)  
**Testing**: Jest 29.6.3 + React Test Renderer 19.2.0  
**Target Platform**: iOS 13+, Android 8+, Web (React Native Web via GitHub Pages)  
**Project Type**: Mobile cross-platform (React Native with Web support)  
**Performance Goals**: 
- Sidebar animation 60fps on supported devices
- Open/close complete within 300ms
- Navigation between features < 5 seconds total
- No visible lag on theme changes

**Constraints**: 
- Offline-first (no network dependency for navigation)
- Light + dark theme support mandatory
- 44x44pt minimum touch targets
- Bundle size impact < 50KB
- Must work with existing App.tsx state management
- Cross-platform gesture support (swipe on mobile, Escape key on web)

**Scale/Scope**: 
- 5 initial features (Home, Recipes, Grocery List, Travel, Home Projects)
- Single sidebar (left side only)
- Maximum 10-15 features anticipated (scalable design)
- App-wide component (used on every screen)
- State management via props (no global state initially)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle 1: Code Quality Standards ✅
- ✅ Use TypeScript for all code (strict mode)
- ✅ Follow React Native ESLint configuration (@react-native)
- ✅ Use Prettier with single quotes and trailing commas
- ✅ JSDoc comments for exported functions/components
- ✅ Keep functions under 50 lines where possible
- ✅ No console.log statements in production code
- ✅ Meaningful names (NavigationSidebar, SidebarItem, useSidebarState)
- ✅ Extract reusable logic (animation helpers, gesture handlers)

### Principle 2: Testing Standards ✅
- ✅ Unit tests for business logic (navigation state management, animation timing)
- ✅ Component tests with React Test Renderer for all UI components
- ✅ Test light and dark modes for all components
- ✅ Test all user interaction paths (open, close, navigate, gestures)
- ✅ Test error states (invalid route, animation conflicts)
- ✅ 80% code coverage target
- ✅ Mock navigation functions in tests

### Principle 3: User Experience Consistency ✅
- ✅ Support light and dark color schemes (via COLORS constant)
- ✅ Use theme-aware colors (sidebarBackground, sidebarText, sidebarHighlight, sidebarOverlay)
- ✅ Respect safe area insets (SafeAreaProvider already in use)
- ✅ Consistent spacing (8px grid system)
- ✅ Minimum 14px body text (16px for feature names)
- ✅ 44x44pt touch targets for all interactive elements
- ✅ Loading/animation states handled gracefully
- ✅ Visual feedback for active feature (background highlight + bold text)
- ✅ Smooth animations (< 300ms, 60fps target)

### Principle 4: Performance Requirements ✅
- ✅ Bundle size impact < 50KB (sidebar component is small)
- ✅ Use native driver for animations (useNativeDriver: true)
- ✅ Avoid unnecessary re-renders (React.memo for SidebarItem)
- ✅ Optimize component rendering (< 16ms per frame target)
- ✅ 60fps animations on supported devices
- ✅ Debounce rapid interactions (ignore input during animation)
- ✅ No heavy computations on UI thread

**Gate Status**: ✅ PASS - All constitution requirements are satisfied by design

## Project Structure

### Documentation (this feature)

```text
specs/1-navigation-sidebar/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (navigation patterns, animation approaches)
├── data-model.md        # Phase 1 output (NavigationItem, SidebarState models)
├── quickstart.md        # Phase 1 output (developer setup and testing guide)
├── contracts/           # Phase 1 output (TypeScript interfaces)
│   ├── NavigationItem.ts
│   ├── SidebarState.ts
│   └── SidebarProps.ts
└── checklists/
    └── requirements.md  # Spec quality checklist (already created)
```

### Source Code (repository root)

```text
src/
├── features/
│   └── navigation/
│       ├── components/
│       │   ├── NavigationSidebar.tsx      # Main sidebar container
│       │   ├── SidebarHeader.tsx          # 🌱 LTPs branding header
│       │   ├── SidebarItem.tsx            # Individual feature nav item
│       │   └── SidebarBackdrop.tsx        # Semi-transparent overlay
│       ├── hooks/
│       │   └── useSidebarAnimation.ts     # Animation state and timing
│       ├── types/
│       │   ├── NavigationItem.ts          # Feature item interface
│       │   └── SidebarState.ts            # Sidebar state interface
│       └── utils/
│           ├── navigationConfig.ts        # Feature list configuration
│           └── animationConfig.ts         # Animation constants (300ms, easing)
└── theme/
    └── colors.ts                           # Add sidebar colors (already exists)

App.tsx                                     # Update with sidebar integration

__tests__/
└── features/
    └── navigation/
        ├── components/
        │   ├── NavigationSidebar.test.tsx
        │   ├── SidebarHeader.test.tsx
        │   ├── SidebarItem.test.tsx
        │   └── SidebarBackdrop.test.tsx
        ├── hooks/
        │   └── useSidebarAnimation.test.ts
        ├── integration/
        │   └── navigation-flow.test.tsx   # Full open→navigate→close flow
        └── utils/
            ├── navigationConfig.test.ts
            └── animationConfig.test.ts
```

**Structure Decision**: Following established feature-based architecture from grocery-list feature. Navigation is treated as a feature (not shared component) because it's a distinct user-facing capability with its own behavior and state. This aligns with the project's feature-first organization and keeps all navigation logic co-located.

## Complexity Tracking

> **No violations - this section is empty**

The implementation follows all constitution principles without requiring any exceptions or increased complexity.

---

## Phase 0: Research

### Research Topics

1. **React Native Animation Approaches**
   - Animated API vs. LayoutAnimation
   - Native driver usage for performance (useNativeDriver: true)
   - Timing functions and easing curves
   - Handling animation interruptions
   - Performance monitoring (60fps target)

2. **Cross-Platform Gesture Handling**
   - PanResponder for swipe-to-close (built-in)
   - React Native Gesture Handler pros/cons
   - Platform-specific gestures (Android back button, web Escape key)
   - Gesture conflict resolution
   - Touch target optimization

3. **Navigation State Management Patterns**
   - Prop drilling vs. Context API
   - React state in App.tsx (current approach)
   - Migration path to React Navigation
   - Screen state persistence

4. **Sidebar Layout and Styling Patterns**
   - Absolute positioning vs. flexbox
   - Modal overlay patterns
   - Z-index management
   - Responsive width calculation (80% mobile, 280px desktop)
   - Safe area handling

5. **Accessibility Best Practices**
   - Screen reader support (accessibilityLabel, accessibilityRole)
   - Keyboard navigation (web)
   - Focus management (trap focus in sidebar)
   - WCAG AA compliance (contrast ratios, touch targets)

6. **Testing Strategies for Animated Components**
   - Jest fake timers for animations
   - Testing gesture handlers
   - Snapshot testing for theming
   - Integration test patterns (open→navigate→close)

7. **Performance Optimization Techniques**
   - React.memo for list items
   - Native driver benefits
   - Minimizing re-renders
   - Bundle size impact assessment

### Research Output Destination

All research findings are documented in `specs/1-navigation-sidebar/research.md` with decisions, rationales, implementation patterns, and code examples.

**Research Status**: ✅ Complete - All technical decisions made (see research.md)

---

## Phase 1: Design & Contracts

### Data Model

**Primary Entities** (detailed in `data-model.md`):

1. **NavigationItem**
   - `id: string` (unique, kebab-case)
   - `name: string` (1-30 chars, display name)
   - `icon: string` (emoji character)
   - `route: string` (screen identifier)
   - `order: number` (1-5, display order)

2. **SidebarState**
   - `isOpen: boolean` (visibility state)
   - `isAnimating: boolean` (prevents input conflicts)
   - `currentRoute: string` (active screen)
   - `position: Animated.Value` (-320 to 0)
   - `backdropOpacity: Animated.Value` (0 to 0.4)

3. **SidebarProps**
   - `isOpen: boolean` (controlled by parent)
   - `currentScreen: string` (for highlighting)
   - `onNavigate: (screen: string) => void`
   - `onClose: () => void`
   - `isDarkMode: boolean` (theme)

**Data Flow**:
```
User Action (tap menu) 
  ↓
App.tsx: setIsSidebarOpen(true)
  ↓
NavigationSidebar: receives isOpen={true}
  ↓
useSidebarAnimation: triggers animation
  - position: -320 → 0 (300ms)
  - backdropOpacity: 0 → 0.4 (300ms)
  ↓
Animation complete: isAnimating = false
  ↓
User taps feature → onNavigate('grocery-list')
  ↓
App.tsx: setCurrentScreen + setIsSidebarOpen(false)
  ↓
useSidebarAnimation: triggers close animation
  ↓
Render new screen
```

### API Contracts

TypeScript interfaces define component contracts (see `contracts/` directory):

**NavigationItem Interface** (`contracts/NavigationItem.ts`):
```typescript
interface NavigationItem {
  id: string;           // 'grocery-list', 'recipes'
  name: string;         // 'Grocery List', 'Recipes'
  icon: string;         // '🛒', '📖'
  route: string;        // 'grocery-list', 'recipes'
  order: number;        // 1, 2, 3, 4, 5
}
```

**SidebarState Interface** (`contracts/SidebarState.ts`):
```typescript
interface SidebarState {
  isOpen: boolean;
  isAnimating: boolean;
  currentRoute: string;
  position: Animated.Value;      // -320 to 0
  backdropOpacity: Animated.Value; // 0 to 0.4
}
```

**SidebarProps Interface** (`contracts/SidebarProps.ts`):
```typescript
interface SidebarProps {
  isOpen: boolean;
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onClose: () => void;
  isDarkMode: boolean;
}
```

### Component Architecture

```
App.tsx (State Container)
  ├── currentScreen: string
  ├── isSidebarOpen: boolean
  └── NavigationSidebar
      ├── useSidebarAnimation (custom hook)
      │   ├── position: Animated.Value
      │   ├── backdropOpacity: Animated.Value
      │   ├── openSidebar()
      │   └── closeSidebar()
      ├── SidebarBackdrop (Pressable overlay)
      │   └── onPress → onClose
      ├── Animated.View (sidebar container)
      │   ├── PanResponder (swipe gestures)
      │   ├── BackHandler (Android back button)
      │   ├── Keyboard listener (web Escape key)
      │   ├── SafeAreaView
      │   │   ├── SidebarHeader
      │   │   │   ├── 🌱 emoji
      │   │   │   ├── "LTPs" title
      │   │   │   └── "Long Term Plans" subtitle
      │   │   └── ScrollView (feature list)
      │   │       └── SidebarItem (×5)
      │   │           ├── icon (emoji)
      │   │           ├── name (text)
      │   │           ├── onPress → onNavigate
      │   │           └── isActive → highlight style
```

### State Management Strategy

**Custom Hook Pattern** (no external state library):

```typescript
useSidebarAnimation() {
  // Manages animation state
  // Controls position and opacity
  // Returns: { isOpen, isAnimating, position, backdropOpacity, openSidebar, closeSidebar }
}
```

**Why React State + Props?**
- Simple: No Context API, no Redux needed for 5 screens
- Current pattern: App.tsx already uses this approach
- Testable: Easy to mock props in tests
- Migrateable: Simple to refactor when React Navigation added
- Constitution: Avoids unnecessary complexity

### Theme Integration

**Colors to Add** (`src/theme/colors.ts`):

```typescript
export const COLORS = {
  light: {
    // ...existing
    sidebarBackground: '#FFFFFF',
    sidebarText: '#000000',
    sidebarTextSecondary: '#666666',
    sidebarHighlight: '#E3F2FD',         // Light blue background
    sidebarHighlightText: '#1976D2',     // Dark blue text
    sidebarOverlay: 'rgba(0, 0, 0, 0.4)',
    sidebarBorder: '#E0E0E0',
  },
  dark: {
    // ...existing
    sidebarBackground: '#1E1E1E',
    sidebarText: '#FFFFFF',
    sidebarTextSecondary: '#B0B0B0',
    sidebarHighlight: '#1E3A5F',         // Dark blue background
    sidebarHighlightText: '#64B5F6',     // Light blue text
    sidebarOverlay: 'rgba(0, 0, 0, 0.4)', // Same opacity both themes
    sidebarBorder: '#333333',
  },
};
```

### Testing Strategy

1. **Unit Tests** (80% coverage target):
   - `animationConfig.ts`: constants validation
   - `navigationConfig.ts`: NAVIGATION_ITEMS structure
   - `useSidebarAnimation.ts`: animation timing, state transitions

2. **Component Tests**:
   - `NavigationSidebar.test.tsx`: renders correctly, handles props, light/dark themes
   - `SidebarItem.test.tsx`: displays item, handles press, active state styling
   - `SidebarHeader.test.tsx`: displays branding, theme support
   - `SidebarBackdrop.test.tsx`: opacity animation, press handling

3. **Integration Tests**:
   - Open sidebar → verify animation → tap item → verify close → verify navigation
   - Open sidebar → tap backdrop → verify close without navigation
   - Theme switch → verify colors update
   - Platform-specific: Android back button, web Escape key

### Quickstart Guide

Generated in `quickstart.md` with:
- No new installations required (uses built-in APIs)
- Running tests (`npm test`)
- Manual testing checklist (open, close, navigate, theme, gestures)
- Troubleshooting guide (animation lag, theme issues, gesture conflicts)
- Performance testing (FPS measurement, timing verification)

**Phase 1 Status**: ✅ Complete - All artifacts generated

---

## Phase 2: Implementation Tasks

Implementation tasks will be generated using `/speckit.tasks` command after this plan is complete. Tasks will follow this general order:

### Task Group 1: Setup & Theme (Priority: High)

1. **Update theme colors**
   - Add sidebar colors to `src/theme/colors.ts`
   - Ensure both light and dark themes included
   - Test colors meet WCAG AA contrast ratios

2. **Create directory structure**
   - `src/features/navigation/` with subdirectories
   - `__tests__/features/navigation/` mirroring structure

### Task Group 2: Configuration & Utils (Priority: High)

3. **Create navigation configuration**
   - Implement `navigationConfig.ts` with NAVIGATION_ITEMS
   - Define 5 features with icons and routes
   - Write unit tests for configuration

4. **Create animation configuration**
   - Implement `animationConfig.ts` with constants
   - Duration: 300ms, easing, native driver flag
   - Define sidebar widths and z-indexes

### Task Group 3: Types & Contracts (Priority: High)

5. **Create TypeScript interfaces**
   - Copy contracts from `specs/contracts/` to `src/features/navigation/types/`
   - NavigationItem.ts
   - SidebarState.ts
   - Ensure strict TypeScript compliance

### Task Group 4: Animation Hook (Priority: High)

6. **Implement useSidebarAnimation hook**
   - Manage position and backdrop opacity Animated.Values
   - Implement openSidebar() and closeSidebar() functions
   - Handle animation state (isAnimating flag)
   - Prevent input during animation
   - Write unit tests with fake timers

### Task Group 5: UI Components (Priority: High)

7. **Create SidebarHeader component**
   - Display 🌱 emoji + "LTPs" + "Long Term Plans"
   - Theme-aware styling
   - Test both themes

8. **Create SidebarItem component**
   - Display icon + name
   - Handle press events
   - Active state styling (background + bold text)
   - 44x44pt touch target
   - React.memo optimization
   - Test active/inactive states, both themes

9. **Create SidebarBackdrop component**
   - Animated opacity (0 to 0.4)
   - Handle press to close
   - Only render when visible
   - Test press handling

10. **Create NavigationSidebar component**
    - Compose all sub-components
    - Integrate useSidebarAnimation hook
    - PanResponder for swipe gestures
    - BackHandler for Android back button
    - Keyboard listener for web Escape key
    - SafeAreaView integration
    - Test all interactions, both themes

### Task Group 6: Integration (Priority: Medium)

11. **Update App.tsx**
    - Add isSidebarOpen state
    - Integrate NavigationSidebar component
    - Pass props (isOpen, currentScreen, callbacks)
    - Add hamburger menu button to screens
    - Handle onNavigate callback

12. **Create placeholder screens**
    - Create basic Recipes screen
    - Create basic Travel screen
    - Create basic Home Projects screen
    - Each with hamburger menu button
    - Proper theming

### Task Group 7: Integration Tests (Priority: Medium)

13. **Write navigation flow test**
    - Open sidebar → tap feature → verify navigation
    - Test all 5 features
    - Verify sidebar closes after navigation

14. **Write gesture tests**
    - Swipe to close (mobile)
    - Backdrop tap to close
    - Platform-specific (back button, Escape key)

15. **Write theme tests**
    - Render in light mode → verify colors
    - Render in dark mode → verify colors
    - Switch themes → verify updates

### Task Group 8: Polish & Optimization (Priority: Low)

16. **Performance optimization**
    - Add React.memo to SidebarItem
    - Verify useNativeDriver usage
    - Test 60fps on devices
    - Measure animation timing (< 300ms)

17. **Accessibility**
    - Add accessibilityLabel to all interactive elements
    - Add accessibilityRole appropriately
    - Add accessibilityState for active items
    - Test with screen readers (VoiceOver, TalkBack)
    - Test keyboard navigation on web

18. **Final testing & QA**
    - Run full test suite
    - Check 80% coverage
    - Manual QA on iOS, Android, Web
    - Test edge cases (rapid taps, small screens, rotation)
    - Performance profiling

---

## Implementation Notes

### Key Technical Decisions

1. **Animated API + Native Driver**
   - Rationale: 60fps performance, cross-platform, no dependencies
   - Trade-off: Slightly more code than LayoutAnimation, but better control

2. **PanResponder for Gestures**
   - Rationale: Built-in, zero dependencies, sufficient for horizontal swipe
   - Trade-off: Could use React Native Gesture Handler for more features, but adds 300KB

3. **React State + Props (No Context)**
   - Rationale: Simple, current pattern, only 5 screens
   - Trade-off: Prop drilling, but acceptable at this scale

4. **Feature-Based Organization**
   - Rationale: Consistent with grocery-list, keeps related code together
   - Trade-off: Navigation could be "shared" component, but treating as feature is more explicit

5. **Static Configuration**
   - Rationale: 5 features are hardcoded, no dynamic loading needed
   - Trade-off: Must update code to add features, but acceptable for MVP

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Animation lag on old devices | Medium | Medium | Use native driver, test on iPhone 8 / Android 8 |
| Gesture conflicts with features | Low | Medium | Make swipe optional, ensure backdrop/back button work |
| Web platform differences | Medium | Low | Platform-specific close mechanisms, extensive web testing |
| Theme switching lag | Low | Low | Use static StyleSheet where possible, memo components |
| Test flakiness (async/animation) | Medium | Medium | Use fake timers, proper cleanup, deterministic tests |

### Success Metrics Tracking

After implementation, verify these metrics from spec:

- [ ] **SC-001**: Navigation < 5 seconds (manual test with timer)
- [ ] **SC-002**: 100% assistive tech compatible (screen reader tests)
- [ ] **SC-003**: Cross-platform consistency (iOS, Android, Web)
- [ ] **SC-004**: 60fps animations on 95% devices (FPS monitor)
- [ ] **SC-005**: WCAG AA contrast ratios (color checker tool)
- [ ] **SC-006**: 90% task completion in usability testing
- [ ] **SC-007**: < 5% error rate (automated + manual testing)
- [ ] **SC-008**: 80%+ code coverage (Jest coverage report)

---

## Next Steps

1. ✅ Complete Phase 0 research by creating `research.md`
2. ✅ Complete Phase 1 design by creating `data-model.md` and `contracts/`
3. ✅ Generate `quickstart.md` with setup instructions
4. 🔄 Update agent context with technology decisions (next command)
5. ⏭️ Run `/speckit.tasks` to break down this plan into actionable GitHub issues
6. ⏭️ Begin implementation following task order
7. ⏭️ Run tests after each task to ensure 80% coverage maintained
8. ⏭️ Manual QA testing on iOS, Android, and Web platforms
9. ⏭️ Performance profiling with FPS monitoring
10. ⏭️ Code review and merge to main

---

**Plan Status**: ✅ Complete - Ready for task generation (`/speckit.tasks`)
