# Research: Navigation Sidebar

**Feature**: Navigation Sidebar  
**Date**: 2026-01-07  
**Branch**: `1-navigation-sidebar`

## Overview

This document contains research findings for implementing a cross-platform navigation sidebar in React Native with Web support. Research focuses on animation approaches, gesture handling, navigation patterns, accessibility, and theme integration.

---

## 1. React Native Animation Approaches

### Decision: Use Animated API with Native Driver

**Rationale**:
- **Performance**: Native driver runs animations on native thread (60fps guaranteed)
- **Control**: Fine-grained control over timing and easing
- **Compatibility**: Works consistently across iOS, Android, and Web
- **Integration**: Easy to integrate with gesture handlers
- **Testing**: Predictable behavior in tests (can mock timing)

**Implementation Pattern**:
```typescript
const slideAnim = useRef(new Animated.Value(-320)).current;

// Open animation
Animated.timing(slideAnim, {
  toValue: 0,
  duration: 300,
  easing: Easing.out(Easing.cubic),
  useNativeDriver: true, // CRITICAL for performance
}).start();
```

### Alternatives Considered

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Animated API + Native Driver** | 60fps, fine control, testable | More code than LayoutAnimation | ✅ **SELECTED** |
| LayoutAnimation | Very simple API, less code | No native driver, harder to test, less control | ❌ Rejected |
| react-native-reanimated | Best performance, worklets | Large dependency (500KB+), overkill for simple slide | ❌ Rejected |
| CSS transitions (web only) | Simple for web | Platform-specific, doesn't work on mobile | ❌ Rejected |

### Animation Configuration

**Timing**: 300ms (spec requirement: < 300ms)  
**Easing**: `Easing.out(Easing.cubic)` - Standard Material Design curve  
**Properties to Animate**:
- Sidebar position: `translateX` (-320px → 0px)
- Backdrop opacity: 0 → 0.4
- Use `useNativeDriver: true` for both

**Animation State Management**:
```typescript
interface AnimationState {
  isAnimating: boolean;
  isOpen: boolean;
  position: Animated.Value; // translateX
  backdropOpacity: Animated.Value;
}
```

---

## 2. Cross-Platform Gesture Handling

### Decision: Use PanResponder for Swipe, Platform-Specific for Back/Escape

**Rationale**:
- **PanResponder**: Built-in, zero dependencies, sufficient for horizontal swipe
- **Platform-specific handlers**: BackHandler (Android), keyboard events (Web)
- **Touch targets**: React Native Pressable with 44x44pt minimum
- **No external library needed**: Keeps bundle size down

**PanResponder Implementation**:
```typescript
const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Only respond to leftward swipes (dx < 0) when sidebar is open
      return isOpen && gestureState.dx < -10;
    },
    onPanResponderMove: (evt, gestureState) => {
      // Move sidebar with finger (clamped to -320...0)
      const newPosition = Math.max(-320, Math.min(0, gestureState.dx));
      slideAnim.setValue(newPosition);
    },
    onPanResponderRelease: (evt, gestureState) => {
      // If swiped > 50% or velocity high, close; otherwise snap back
      if (gestureState.dx < -160 || gestureState.vx < -0.5) {
        closeSidebar();
      } else {
        openSidebar(); // Snap back to open
      }
    },
  })
).current;
```

### Platform-Specific Handlers

**Android Back Button**:
```typescript
useEffect(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    if (isSidebarOpen) {
      closeSidebar();
      return true; // Prevent default back navigation
    }
    return false; // Allow default behavior
  });
  return () => backHandler.remove();
}, [isSidebarOpen]);
```

**Web Escape Key**:
```typescript
useEffect(() => {
  if (Platform.OS !== 'web') return;
  
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isSidebarOpen) {
      closeSidebar();
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [isSidebarOpen]);
```

### Alternatives Considered

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **PanResponder** | Built-in, simple, sufficient | Lower-level API | ✅ **SELECTED** |
| React Native Gesture Handler | More features, better performance | 300KB+ dependency, overkill | ❌ Rejected |
| TouchableOpacity + pan events | Very simple | No gesture velocity, less control | ❌ Rejected |

### Gesture Interaction Matrix

| Platform | Open Gesture | Close Gestures |
|----------|-------------|----------------|
| iOS | Tap hamburger menu | Swipe left, tap backdrop |
| Android | Tap hamburger menu | Swipe left, tap backdrop, back button |
| Web | Click hamburger menu | Click backdrop, Escape key |

---

## 3. Navigation State Management Patterns

### Decision: React State in App.tsx with Prop Drilling (Interim Solution)

**Rationale**:
- **Current pattern**: App.tsx already uses `currentScreen` state
- **Zero dependencies**: No Context API, no Redux, no library
- **Simple migration path**: Easy to refactor when React Navigation is added
- **Sufficient for 5 screens**: Prop drilling manageable at this scale
- **Constitution compliance**: Avoids unnecessary complexity

**Implementation Pattern**:
```typescript
// App.tsx
function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleNavigate = (screen: ScreenName) => {
    setCurrentScreen(screen);
    setIsSidebarOpen(false); // Auto-close after navigation
  };
  
  return (
    <SafeAreaProvider>
      <NavigationSidebar
        isOpen={isSidebarOpen}
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onClose={() => setIsSidebarOpen(false)}
      />
      {/* Render current screen with hamburger menu button */}
      {renderScreen(currentScreen, () => setIsSidebarOpen(true))}
    </SafeAreaProvider>
  );
}
```

### Alternatives Considered

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **React state + props** | Simple, no deps, current pattern | Prop drilling (acceptable for 5 screens) | ✅ **SELECTED** |
| Context API | Avoids prop drilling | Overkill for simple navigation, harder to test | ❌ Deferred to future |
| React Navigation | Industry standard, full-featured | Not yet selected, requires research phase | ❌ Future migration target |
| URL-based (Web only) | Works with browser back button | Platform-specific, doesn't work on mobile | ❌ Rejected |

### Future Migration Path

When React Navigation is integrated:
1. Replace `currentScreen` state with React Navigation's `navigation` object
2. Replace `setCurrentScreen` with `navigation.navigate()`
3. Sidebar becomes navigation-aware via `useNavigation()` hook
4. Zero changes to sidebar UI components (only prop sources change)

---

## 4. Sidebar Layout and Styling Patterns

### Decision: Absolute Positioning with Modal Overlay

**Rationale**:
- **Overlay pattern**: Sidebar sits above content (standard mobile pattern)
- **Absolute positioning**: Allows slide animation without affecting layout
- **Backdrop**: Semi-transparent overlay (40% opacity) focuses attention
- **Z-index management**: Sidebar (z:1000), Backdrop (z:999), Content (z:1)
- **Safe area handling**: SafeAreaView inside sidebar for notched devices

**Layout Structure**:
```typescript
<View style={{ flex: 1 }}>
  {/* Main Content */}
  <ScreenContent />
  
  {/* Backdrop (visible when sidebar open) */}
  {isSidebarOpen && (
    <Pressable 
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 999,
      }}
      onPress={closeSidebar}
    />
  )}
  
  {/* Sidebar (slides from left) */}
  <Animated.View 
    style={{
      position: 'absolute',
      top: 0, bottom: 0, left: 0,
      width: sidebarWidth,
      transform: [{ translateX: slideAnim }],
      zIndex: 1000,
    }}
  >
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.sidebarBackground }}>
      {/* Sidebar content */}
    </SafeAreaView>
  </Animated.View>
</View>
```

### Width Calculation

**Mobile (< 768px)**: 80% of screen width, max 320px  
**Tablet/Desktop (≥ 768px)**: Fixed 280px

```typescript
const useResponsiveSidebarWidth = () => {
  const { width } = useWindowDimensions();
  
  if (width >= 768) {
    return 280; // Fixed width on larger screens
  }
  
  return Math.min(width * 0.8, 320); // 80% up to 320px on mobile
};
```

### Theme Colors (to add to colors.ts)

```typescript
// src/theme/colors.ts
export const COLORS = {
  light: {
    // ...existing colors
    sidebarBackground: '#FFFFFF',
    sidebarText: '#000000',
    sidebarTextSecondary: '#666666',
    sidebarHighlight: '#E3F2FD', // Light blue
    sidebarHighlightText: '#1976D2', // Dark blue
    sidebarOverlay: 'rgba(0, 0, 0, 0.4)',
    sidebarBorder: '#E0E0E0',
  },
  dark: {
    // ...existing colors
    sidebarBackground: '#1E1E1E',
    sidebarText: '#FFFFFF',
    sidebarTextSecondary: '#B0B0B0',
    sidebarHighlight: '#1E3A5F', // Dark blue
    sidebarHighlightText: '#64B5F6', // Light blue
    sidebarOverlay: 'rgba(0, 0, 0, 0.4)', // Same opacity both themes
    sidebarBorder: '#333333',
  },
};
```

---

## 5. Accessibility Considerations

### Decision: Screen Reader + Keyboard Navigation + ARIA Labels

**Rationale**:
- **Constitution requirement**: 100% assistive technology compatibility
- **Screen readers**: Use `accessibilityLabel`, `accessibilityHint`, `accessibilityRole`
- **Keyboard navigation**: Web users can Tab through items, Enter to select
- **Focus management**: Trap focus in sidebar when open, restore on close
- **WCAG AA compliance**: Contrast ratios, touch targets, readable text

**Implementation Patterns**:

**Hamburger Menu Button**:
```typescript
<Pressable
  accessibilityLabel="Open navigation menu"
  accessibilityHint="Opens sidebar with app navigation"
  accessibilityRole="button"
  onPress={openSidebar}
>
  <Text style={{ fontSize: 24 }}>☰</Text>
</Pressable>
```

**Sidebar Item**:
```typescript
<Pressable
  accessibilityLabel={`Navigate to ${feature.name}`}
  accessibilityHint={isActive ? "Currently on this screen" : `Opens ${feature.name} screen`}
  accessibilityRole="button"
  accessibilityState={{ selected: isActive }}
  onPress={() => onNavigate(feature.route)}
>
  <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
    <Text style={{ fontSize: 24, marginRight: 12 }}>{feature.icon}</Text>
    <Text style={[styles.itemText, isActive && styles.itemTextBold]}>
      {feature.name}
    </Text>
  </View>
</Pressable>
```

**Backdrop**:
```typescript
<Pressable
  accessibilityLabel="Close navigation menu"
  accessibilityHint="Tap to close sidebar and return to content"
  accessibilityRole="button"
  onPress={closeSidebar}
  style={styles.backdrop}
/>
```

### Focus Management (Web)

```typescript
useEffect(() => {
  if (Platform.OS !== 'web') return;
  
  if (isSidebarOpen) {
    // Store currently focused element
    const previousFocus = document.activeElement;
    
    // Focus first sidebar item
    const firstItem = document.querySelector('[data-sidebar-item="0"]');
    if (firstItem) firstItem.focus();
    
    return () => {
      // Restore focus when sidebar closes
      if (previousFocus) previousFocus.focus();
    };
  }
}, [isSidebarOpen]);
```

---

## 6. Testing Strategies

### Decision: Jest + React Test Renderer + Integration Tests

**Rationale**:
- **Unit tests**: Individual components (SidebarItem, SidebarHeader, etc.)
- **Hook tests**: Animation hooks, state management
- **Component tests**: Full sidebar with mocked navigation
- **Integration tests**: Open → Navigate → Close flow
- **Theme tests**: Light/dark mode rendering for all components
- **80% coverage target**: Constitution requirement

**Testing Patterns**:

**Component Test Example**:
```typescript
describe('NavigationSidebar', () => {
  it('renders with correct items in light mode', () => {
    const tree = create(
      <NavigationSidebar
        isOpen={true}
        currentScreen="home"
        onNavigate={mockNavigate}
        onClose={mockClose}
        isDarkMode={false}
      />
    ).toJSON();
    
    expect(tree).toMatchSnapshot();
    // Verify all 5 features rendered
    // Verify "home" is highlighted
  });
  
  it('calls onNavigate when item tapped', () => {
    const mockNavigate = jest.fn();
    const tree = create(<NavigationSidebar {...props} onNavigate={mockNavigate} />);
    
    // Find and tap "Grocery List" item
    const groceryItem = tree.root.findByProps({ testID: 'sidebar-item-grocery-list' });
    act(() => {
      groceryItem.props.onPress();
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('grocery-list');
  });
});
```

**Animation Test Example**:
```typescript
describe('useSidebarAnimation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  it('animates open in 300ms', () => {
    const { result } = renderHook(() => useSidebarAnimation());
    
    act(() => {
      result.current.openSidebar();
      jest.advanceTimersByTime(300);
    });
    
    expect(result.current.isOpen).toBe(true);
    expect(result.current.isAnimating).toBe(false);
  });
});
```

---

## 7. Performance Optimization

### Decision: React.memo + Native Driver + Minimal Re-renders

**Rationale**:
- **60fps target**: Use native driver to offload animations from JS thread
- **React.memo**: Memoize SidebarItem to prevent unnecessary re-renders
- **Minimal state changes**: Only update when necessary
- **No heavy computations**: All navigation config is static

**Optimization Techniques**:

1. **Memoize SidebarItem**:
```typescript
export const SidebarItem = React.memo(({ feature, isActive, onPress }) => {
  return <Pressable onPress={onPress}>{/* ... */}</Pressable>;
}, (prevProps, nextProps) => {
  // Only re-render if isActive changes for this item
  return prevProps.isActive === nextProps.isActive;
});
```

2. **Static Navigation Config**:
```typescript
// utils/navigationConfig.ts
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'home', name: 'Home', icon: '🏠', route: 'home', order: 1 },
  { id: 'recipes', name: 'Recipes', icon: '📖', route: 'recipes', order: 2 },
  { id: 'grocery-list', name: 'Grocery List', icon: '🛒', route: 'grocery-list', order: 3 },
  { id: 'travel', name: 'Travel', icon: '✈️', route: 'travel', order: 4 },
  { id: 'home-projects', name: 'Home Projects', icon: '🏡', route: 'home-projects', order: 5 },
];
```

3. **Disable Interactions During Animation**:
```typescript
const handlePress = (screen: ScreenName) => {
  if (isAnimating) return; // Ignore input during animation (spec requirement)
  onNavigate(screen);
};
```

---

## 8. Bundle Size Impact

### Estimated Impact: < 50KB (minified + gzipped)

**Breakdown**:
- NavigationSidebar component: ~5KB
- SidebarItem component: ~2KB
- SidebarHeader component: ~1KB
- SidebarBackdrop component: ~1KB
- useSidebarAnimation hook: ~2KB
- Utils and config: ~2KB
- Types: ~1KB
- **Total source**: ~14KB
- **After minification + gzip**: ~4-5KB

**No external dependencies added** (using built-in Animated API, PanResponder, BackHandler)

---

## Research Summary

| Topic | Decision | Rationale |
|-------|----------|-----------|
| **Animation** | Animated API + Native Driver | 60fps, cross-platform, testable |
| **Gestures** | PanResponder + Platform Handlers | Built-in, zero deps, sufficient |
| **Navigation State** | React State + Props | Simple, current pattern, easy migration |
| **Layout** | Absolute Position + Overlay | Standard mobile pattern, smooth animation |
| **Accessibility** | ARIA + Screen Reader + Keyboard | WCAG AA compliant, 100% compatible |
| **Testing** | Jest + React Test Renderer | 80% coverage, light/dark tests |
| **Performance** | React.memo + Native Driver | 60fps target, minimal re-renders |
| **Bundle Size** | < 50KB impact | No external deps, small components |

---

## Next Steps

1. ✅ Research complete - All technical decisions made
2. 🔄 Phase 1: Create data-model.md with entity definitions
3. 🔄 Phase 1: Create TypeScript contracts in contracts/
4. 🔄 Phase 1: Create quickstart.md with developer guide
5. 🔄 Phase 1: Update agent context with new technology decisions
6. ⏭️ Phase 2: Generate tasks.md via `/speckit.tasks` command

---

**Research Status**: ✅ Complete - Ready for Phase 1 design
