# Data Model: Navigation Sidebar

**Feature**: Navigation Sidebar  
**Date**: 2026-01-07  
**Branch**: `1-navigation-sidebar`

## Overview

This document defines the data structures and state models for the navigation sidebar feature. Since this is a UI-only feature with ephemeral state (no persistence), all data models represent in-memory state managed by React.

---

## Entities

### 1. NavigationItem

Represents a single feature/screen entry in the navigation sidebar.

**Purpose**: Define the structure of each navigable feature in the app.

**Attributes**:

| Attribute | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| `id` | `string` | ✅ | Unique identifier for the feature | Lowercase kebab-case (e.g., 'grocery-list') |
| `name` | `string` | ✅ | Display name shown in sidebar | 1-30 characters, human-readable |
| `icon` | `string` | ✅ | Emoji or icon to display | Single emoji character (e.g., '🛒') |
| `route` | `string` | ✅ | Route/screen identifier for navigation | Matches screen name in App.tsx state |
| `order` | `number` | ✅ | Display order in sidebar (1-based) | Positive integer, unique per item |

**Example**:
```typescript
const groceryListItem: NavigationItem = {
  id: 'grocery-list',
  name: 'Grocery List',
  icon: '🛒',
  route: 'grocery-list',
  order: 3,
};
```

**Relationships**:
- One-to-one mapping with screen/route in App.tsx
- No parent/child relationships (flat list)

**Lifecycle**:
- **Created**: At app initialization (static configuration)
- **Updated**: Never (static for MVP)
- **Deleted**: Never (static for MVP)

---

### 2. SidebarState

Represents the current state of the sidebar (open/closed, animating, etc.).

**Purpose**: Track sidebar visibility and animation status to prevent interaction conflicts.

**Attributes**:

| Attribute | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| `isOpen` | `boolean` | ✅ | Whether sidebar is currently visible | true = open, false = closed |
| `isAnimating` | `boolean` | ✅ | Whether sidebar is currently animating | true = in motion, false = at rest |
| `currentRoute` | `string` | ✅ | Currently active screen/route | Must match a NavigationItem.route |
| `position` | `Animated.Value` | ✅ | Current X position for animation | -320 (closed) to 0 (open) |
| `backdropOpacity` | `Animated.Value` | ✅ | Current backdrop opacity | 0 (transparent) to 0.4 (semi-transparent) |

**Example**:
```typescript
const sidebarState: SidebarState = {
  isOpen: false,
  isAnimating: false,
  currentRoute: 'home',
  position: new Animated.Value(-320), // Closed position
  backdropOpacity: new Animated.Value(0), // Transparent
};
```

**State Transitions**:
```
[Closed] --[tap menu button]--> [Animating Open] --[300ms]--> [Open]
[Open] --[tap backdrop/swipe]--> [Animating Closed] --[300ms]--> [Closed]
[Open] --[tap nav item]--> [Animating Closed] --[300ms]--> [Closed] + [navigate]
```

**Validation Rules**:
- `isAnimating` MUST be `true` during transitions
- User input (menu button, backdrop, nav items) MUST be ignored while `isAnimating === true`
- `currentRoute` MUST always match a valid NavigationItem.route
- `position` MUST be clamped to range [-320, 0]
- `backdropOpacity` MUST be clamped to range [0, 0.4]

---

### 3. SidebarProps

Defines the props interface for the NavigationSidebar component (not persisted data, but contract).

**Purpose**: Define the component API for sidebar integration.

**Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `isOpen` | `boolean` | ✅ | External control of sidebar visibility |
| `currentScreen` | `string` | ✅ | Currently active screen (for highlighting) |
| `onNavigate` | `(screen: string) => void` | ✅ | Callback when user selects a feature |
| `onClose` | `() => void` | ✅ | Callback when sidebar should close |
| `isDarkMode` | `boolean` | ✅ | Theme mode for styling |

**Example**:
```typescript
<NavigationSidebar
  isOpen={isSidebarOpen}
  currentScreen={currentScreen}
  onNavigate={(screen) => {
    setCurrentScreen(screen);
    setIsSidebarOpen(false);
  }}
  onClose={() => setIsSidebarOpen(false)}
  isDarkMode={useColorScheme() === 'dark'}
/>
```

---

## Data Flow

### Opening Sidebar

```
User taps hamburger menu
  ↓
App.tsx: setIsSidebarOpen(true)
  ↓
NavigationSidebar receives isOpen={true}
  ↓
useSidebarAnimation hook triggers:
  - Sets isAnimating = true
  - Animates position: -320 → 0
  - Animates backdropOpacity: 0 → 0.4
  ↓
After 300ms:
  - Sets isAnimating = false
  - Sidebar fully open, interactive
```

### Navigating to Feature

```
User taps "Grocery List" in sidebar
  ↓
SidebarItem calls onPress
  ↓
NavigationSidebar calls onNavigate('grocery-list')
  ↓
App.tsx receives onNavigate callback:
  - setCurrentScreen('grocery-list')
  - setIsSidebarOpen(false)
  ↓
NavigationSidebar receives isOpen={false}
  ↓
useSidebarAnimation hook triggers:
  - Sets isAnimating = true
  - Animates position: 0 → -320
  - Animates backdropOpacity: 0.4 → 0
  ↓
After 300ms:
  - Sets isAnimating = false
  - Sidebar fully closed
  - Screen renders GroceryListScreen
```

### Closing Sidebar (Backdrop Tap)

```
User taps backdrop
  ↓
SidebarBackdrop calls onPress
  ↓
NavigationSidebar calls onClose()
  ↓
App.tsx: setIsSidebarOpen(false)
  ↓
useSidebarAnimation hook triggers close animation
  ↓
After 300ms:
  - Sidebar fully closed
  - User remains on current screen
```

---

## Configuration Data

### Navigation Items Configuration

**Location**: `src/features/navigation/utils/navigationConfig.ts`

**Structure**:
```typescript
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'home',
    name: 'Home',
    icon: '🏠',
    route: 'home',
    order: 1,
  },
  {
    id: 'recipes',
    name: 'Recipes',
    icon: '📖',
    route: 'recipes',
    order: 2,
  },
  {
    id: 'grocery-list',
    name: 'Grocery List',
    icon: '🛒',
    route: 'grocery-list',
    order: 3,
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    route: 'travel',
    order: 4,
  },
  {
    id: 'home-projects',
    name: 'Home Projects',
    icon: '🏡',
    route: 'home-projects',
    order: 5,
  },
];
```

**Characteristics**:
- **Static**: Does not change at runtime
- **Ordered**: Displayed in order 1→5
- **Immutable**: Exported as const array
- **Validated**: Each route maps to a screen in App.tsx

---

## Animation Constants

### Animation Configuration

**Location**: `src/features/navigation/utils/animationConfig.ts`

**Structure**:
```typescript
export const ANIMATION_CONFIG = {
  duration: 300, // milliseconds
  easing: Easing.out(Easing.cubic), // Material Design standard
  useNativeDriver: true, // CRITICAL for 60fps
};

export const SIDEBAR_WIDTH = {
  mobile: {
    percentage: 0.8, // 80% of screen width
    max: 320, // Maximum 320px
  },
  desktop: 280, // Fixed 280px on tablets/web
};

export const BACKDROP_OPACITY = 0.4; // 40% opacity (from clarification)

export const Z_INDEX = {
  content: 1,
  backdrop: 999,
  sidebar: 1000,
};
```

---

## State Management Strategy

### Hook-Based State Management

**Primary Hook**: `useSidebarAnimation`

```typescript
interface UseSidebarAnimationReturn {
  isOpen: boolean;
  isAnimating: boolean;
  position: Animated.Value;
  backdropOpacity: Animated.Value;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const useSidebarAnimation = (): UseSidebarAnimationReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const position = useRef(new Animated.Value(-320)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  
  const openSidebar = useCallback(() => {
    if (isAnimating) return; // Ignore if animating
    
    setIsAnimating(true);
    Animated.parallel([
      Animated.timing(position, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0.4,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimating(false);
      setIsOpen(true);
    });
  }, [isAnimating, position, backdropOpacity]);
  
  // closeSidebar similar implementation
  
  return {
    isOpen,
    isAnimating,
    position,
    backdropOpacity,
    openSidebar,
    closeSidebar,
  };
};
```

---

## Validation Rules Summary

| Entity | Field | Rule | Error Handling |
|--------|-------|------|----------------|
| NavigationItem | `id` | Must be unique, kebab-case | Compile-time TypeScript error |
| NavigationItem | `name` | 1-30 chars | Display truncation with ellipsis if needed |
| NavigationItem | `order` | Unique, positive integer | Sort by order, ignore duplicates |
| NavigationItem | `route` | Must match App.tsx screen | Runtime warning if mismatch |
| SidebarState | `position` | Clamp to [-320, 0] | Animated.Value clamping |
| SidebarState | `backdropOpacity` | Clamp to [0, 0.4] | Animated.Value clamping |
| SidebarState | `isAnimating` | No nested animations | Return early if already animating |

---

## Performance Considerations

### Memory Usage

- **NavigationItem[]**: ~500 bytes (5 items × ~100 bytes each)
- **SidebarState**: ~200 bytes (booleans + strings)
- **Animated.Value**: ~100 bytes per instance (2 instances = 200 bytes)
- **Total**: < 1KB in-memory data

### Re-render Optimization

1. **SidebarItem memoization**: Only re-render when `isActive` changes
2. **Static config**: NAVIGATION_ITEMS never changes, no recalculation
3. **Animated.Value**: Native driver means no JS thread impact during animation
4. **Conditional rendering**: Backdrop only rendered when sidebar open

---

## Testing Data

### Mock Data for Tests

```typescript
export const mockNavigationItems: NavigationItem[] = [
  { id: 'home', name: 'Home', icon: '🏠', route: 'home', order: 1 },
  { id: 'test', name: 'Test Screen', icon: '🧪', route: 'test', order: 2 },
];

export const mockSidebarState: SidebarState = {
  isOpen: false,
  isAnimating: false,
  currentRoute: 'home',
  position: new Animated.Value(-320),
  backdropOpacity: new Animated.Value(0),
};

export const mockSidebarProps: SidebarProps = {
  isOpen: true,
  currentScreen: 'home',
  onNavigate: jest.fn(),
  onClose: jest.fn(),
  isDarkMode: false,
};
```

---

## Future Enhancements (Out of Scope for MVP)

1. **User customization**: Allow users to reorder items (requires persistence)
2. **Dynamic items**: Add/remove features at runtime (requires item CRUD)
3. **Nested navigation**: Sub-items within features (requires tree structure)
4. **Badge counts**: Notification indicators (requires counter state)
5. **Search/filter**: Quick find in large feature list (requires search state)

---

**Data Model Status**: ✅ Complete - Ready for contract generation
