# Quickstart Guide: Navigation Sidebar

**Feature**: Navigation Sidebar  
**Date**: 2026-01-07  
**Branch**: `1-navigation-sidebar`

## Overview

This guide helps developers set up, test, and troubleshoot the navigation sidebar feature. Follow these steps to get started quickly.

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- iOS simulator / Android emulator (for mobile testing)
- Modern web browser (for web testing)

---

## Installation

### 1. Check Out Feature Branch

```bash
git checkout 1-navigation-sidebar
```

### 2. Install Dependencies

No new external dependencies are required for this feature! The sidebar uses built-in React Native APIs:
- `Animated` (for animations)
- `PanResponder` (for swipe gestures)
- `BackHandler` (for Android back button)
- `useWindowDimensions` (for responsive sizing)

All dependencies are already included in React Native 0.83.1.

### 3. Verify Existing Setup

```bash
# Install project dependencies (if not already done)
npm install

# For iOS native modules
cd ios && bundle exec pod install && cd ..
```

---

## Running the App

### iOS Simulator

```bash
npm run ios
```

**Expected behavior**:
- App launches in iOS simulator
- Home screen displays with hamburger menu (☰) in top-left
- Tap hamburger → sidebar slides in from left
- Tap "Grocery List" → navigates to Grocery List screen
- Sidebar closes automatically after navigation

### Android Emulator

```bash
npm run android
```

**Expected behavior**:
- App launches in Android emulator
- Same navigation flow as iOS
- **Additional**: Press back button when sidebar open → sidebar closes (doesn't exit app)

### Web Browser

```bash
npm run web
```

Then open `http://localhost:3000` in your browser.

**Expected behavior**:
- App loads in browser
- Same navigation flow as mobile
- **Additional**: Press Escape key when sidebar open → sidebar closes
- Click backdrop (outside sidebar) → sidebar closes

---

## Running Tests

### All Tests

```bash
npm test
```

### Specific Test Suites

```bash
# Test navigation components only
npm test -- navigation

# Test with coverage report
npm test -- --coverage

# Watch mode (auto-rerun on file changes)
npm test -- --watch
```

### Coverage Goals

Ensure **80% coverage** for all navigation feature files:

```bash
npm test -- --coverage --collectCoverageFrom='src/features/navigation/**/*.{ts,tsx}'
```

Expected output:
```
File                          | % Stmts | % Branch | % Funcs | % Lines
------------------------------|---------|----------|---------|--------
All files                     |   85.00 |    80.00 |   90.00 |   85.00
 components/                  |   90.00 |    85.00 |   95.00 |   90.00
  NavigationSidebar.tsx       |   92.00 |    88.00 |  100.00 |   92.00
  SidebarItem.tsx             |   95.00 |    90.00 |  100.00 |   95.00
  ...
```

---

## Manual Testing Checklist

### ✅ Core Functionality

- [ ] **Open Sidebar**: Tap hamburger menu button → sidebar slides in from left (< 300ms)
- [ ] **Navigate**: Tap any feature in sidebar → closes sidebar → opens selected screen
- [ ] **Close via Backdrop**: Tap outside sidebar → closes without navigation
- [ ] **Close via Swipe** (mobile): Swipe sidebar to the left → closes smoothly
- [ ] **Close via Back Button** (Android): Press back button → closes sidebar (doesn't exit app)
- [ ] **Close via Escape** (web): Press Escape key → closes sidebar

### ✅ Visual Feedback

- [ ] **Active Highlight**: Current screen is highlighted in sidebar (background color + bold text)
- [ ] **Smooth Animation**: Sidebar slides smoothly without jank (60fps)
- [ ] **Backdrop Opacity**: Semi-transparent backdrop (40% opacity) allows underlying content to be partially visible
- [ ] **Safe Areas**: Sidebar respects device notches/safe areas (test on iPhone X+)

### ✅ Theme Support

- [ ] **Light Mode**: Sidebar has light background, dark text
- [ ] **Dark Mode**: Sidebar has dark background, light text
- [ ] **Theme Switch**: Change device theme → sidebar updates immediately (if open) or on next open

### ✅ Responsive Behavior

- [ ] **Mobile** (< 768px): Sidebar width is 80% of screen (max 320px)
- [ ] **Tablet/Desktop** (≥ 768px): Sidebar width is fixed 280px
- [ ] **Rotation**: Rotate device → sidebar width recalculates correctly
- [ ] **Split Screen** (tablet): Sidebar width based on available space

### ✅ Edge Cases

- [ ] **Rapid Taps**: Tap hamburger button rapidly → only first tap registers until animation completes
- [ ] **Animation Interrupt**: Tap backdrop while opening → input ignored until open
- [ ] **Small Screen**: Test on 320px wide device → sidebar is 240px wide (minimum)
- [ ] **Long Feature Names**: Add a very long feature name → truncates with ellipsis

### ✅ Accessibility

- [ ] **Screen Reader** (iOS VoiceOver): Navigate sidebar with swipes → reads "Navigate to Grocery List"
- [ ] **Screen Reader** (Android TalkBack): Same as iOS
- [ ] **Keyboard Nav** (web): Tab through sidebar items → Enter to select
- [ ] **Touch Targets**: All items have minimum 44x44pt touch area

---

## Common Issues & Troubleshooting

### Issue: Sidebar animation is laggy/stuttering

**Symptoms**: Sidebar doesn't slide smoothly, drops below 60fps

**Solutions**:
1. Verify `useNativeDriver: true` in animation config
2. Check device performance (test on physical device, not just simulator)
3. Disable "Slow Animations" in simulator (if enabled)
4. Profile with React DevTools Performance tab

**Verify**:
```typescript
// In useSidebarAnimation.ts
Animated.timing(position, {
  toValue: 0,
  duration: 300,
  easing: Easing.out(Easing.cubic),
  useNativeDriver: true, // ✅ MUST be true
}).start();
```

---

### Issue: Sidebar not appearing on Android

**Symptoms**: Hamburger button works, but sidebar doesn't slide in

**Solutions**:
1. Check z-index values (sidebar should be higher than content)
2. Verify absolute positioning is correct
3. Check for conflicting styles in parent views

**Verify**:
```typescript
// In NavigationSidebar.tsx
<Animated.View 
  style={{
    position: 'absolute', // ✅ Required
    zIndex: 1000, // ✅ Higher than backdrop (999)
    transform: [{translateX: position}], // ✅ Animated
  }}
>
```

---

### Issue: Swipe gesture not working

**Symptoms**: Can't swipe to close sidebar on mobile

**Solutions**:
1. Verify PanResponder is attached to sidebar view
2. Check gesture threshold (should trigger at dx < -10)
3. Ensure no parent view is capturing touch events

**Verify**:
```typescript
// In NavigationSidebar.tsx
<Animated.View 
  {...panResponder.panHandlers} // ✅ Must be attached
  style={styles.sidebar}
>
```

---

### Issue: Theme not updating

**Symptoms**: Sidebar stays in light/dark mode when device theme changes

**Solutions**:
1. Verify `isDarkMode` prop is passed from `useColorScheme()` hook
2. Check COLORS constant includes sidebar colors for both themes
3. Ensure components use theme prop, not hardcoded colors

**Verify**:
```typescript
// In App.tsx
const isDarkMode = useColorScheme() === 'dark'; // ✅ Use hook

<NavigationSidebar
  isDarkMode={isDarkMode} // ✅ Pass to sidebar
  // ...
/>
```

---

### Issue: Tests failing with "Cannot read property 'Value' of undefined"

**Symptoms**: Jest tests fail when importing components with Animated

**Solutions**:
1. Verify Jest is configured to mock react-native
2. Use `jest.useFakeTimers()` for animation tests
3. Mock Animated.Value in test setup

**Verify**:
```typescript
// In __tests__/setup.js or jest.config.js
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
```

---

### Issue: Sidebar doesn't close on Android back button

**Symptoms**: Back button exits app instead of closing sidebar

**Solutions**:
1. Verify BackHandler is imported and used correctly
2. Ensure listener returns `true` when sidebar is open
3. Check that listener is cleaned up in useEffect return

**Verify**:
```typescript
// In NavigationSidebar.tsx (or useSidebarAnimation.ts)
useEffect(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    if (isOpen) {
      closeSidebar();
      return true; // ✅ Prevent default back navigation
    }
    return false; // ✅ Allow default when sidebar closed
  });
  
  return () => backHandler.remove(); // ✅ Cleanup
}, [isOpen]);
```

---

## Performance Testing

### Measure Animation FPS

**iOS Simulator**:
1. Debug menu → Show Perf Monitor
2. Open/close sidebar
3. Check "JS" and "UI" frame rates (should be ~60fps)

**Android Emulator**:
1. Developer menu → Show FPS Monitor
2. Open/close sidebar
3. Green bar should stay steady (no red dips)

**Web Browser**:
1. Open DevTools → Performance tab
2. Start recording
3. Open/close sidebar
4. Stop recording → check for 60fps (no frame drops)

### Measure Animation Timing

```typescript
// Add console timing (remove before commit)
const openSidebar = () => {
  console.time('sidebar-open');
  Animated.timing(/* ... */).start(() => {
    console.timeEnd('sidebar-open'); // Should print ~300ms
  });
};
```

**Expected**: Console output shows `sidebar-open: 300-310ms`

---

## Debugging Tips

### Enable Debug Logging

Add temporary logging to understand state flow:

```typescript
// In useSidebarAnimation.ts (REMOVE BEFORE COMMIT)
useEffect(() => {
  console.log('Sidebar state changed:', { isOpen, isAnimating });
}, [isOpen, isAnimating]);
```

### Inspect Animation Values

```typescript
// Check animated value during development
position.addListener(({ value }) => {
  console.log('Sidebar position:', value); // -320 to 0
});

// REMEMBER: Remove listener in cleanup
return () => position.removeAllListeners();
```

### React DevTools

1. Install React DevTools browser extension
2. Open sidebar
3. Inspect `<NavigationSidebar>` component
4. Check props and state values

---

## Code Style Checks

Before committing, ensure code passes all checks:

```bash
# Lint check
npm run lint

# Fix auto-fixable lint errors
npm run lint -- --fix

# Format with Prettier
npx prettier --write "src/features/navigation/**/*.{ts,tsx}"

# TypeScript type check
npx tsc --noEmit
```

**Expected**: All checks pass with 0 errors.

---

## Next Steps

After setup and testing:

1. ✅ Run full test suite: `npm test`
2. ✅ Check coverage: `npm test -- --coverage` (ensure 80%+)
3. ✅ Test on all platforms: iOS, Android, Web
4. ✅ Test both themes: Light and Dark
5. ✅ Manual QA: Complete checklist above
6. ✅ Code review: Ensure constitution compliance
7. ✅ Merge: Create PR against `main` branch

---

## Resources

- **Spec**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Research**: [research.md](./research.md)
- **Contracts**: [contracts/](./contracts/)
- **Constitution**: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)

---

## Support

If you encounter issues not covered in this guide:

1. Check [research.md](./research.md) for technical decisions
2. Review [data-model.md](./data-model.md) for state management
3. Consult [spec.md](./spec.md) for requirements
4. Check existing tests for usage examples

---

**Quickstart Status**: ✅ Complete - Ready for development
