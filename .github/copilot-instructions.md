# AI Coding Agent Instructions for LTPs

## Project Overview

LTPs (Long Term Plans) is a React Native app for couples to manage shared life activities (recipes, grocery lists, travel, home projects). Built with **TypeScript, React Native 0.83.1, React Native Web**, targeting iOS, Android, and Web (GitHub Pages).

## Critical Architecture Patterns

### Spec-Kit Driven Development
This project uses **Spec-Kit** for spec-driven development. Features follow a strict workflow:

1. **Constitution** (`.specify/memory/constitution.md`) - Non-negotiable principles governing all development
2. **Specify** → **Clarify** → **Plan** → **Tasks** → **Implement**
3. All specs live in `specs/[feature-name]/` with: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `tasks.md`, `contracts/`

**Key Commands**: Located in `.github/agents/speckit.*.agent.md` - these define the development workflow AI agents must follow.

### Feature-Based Organization
Features use **feature-based architecture** (not file-type based):

```
src/features/[feature-name]/
├── components/      # UI components
├── hooks/          # Custom React hooks (business logic)
├── services/       # Data persistence, APIs
├── types/          # TypeScript interfaces
└── utils/          # Helper functions

__tests__/features/[feature-name]/
└── [mirrors src structure]
```

Example: See `specs/grocery-list/` for full feature spec → implementation planning.

### Constitution Requirements (NON-NEGOTIABLE)

All code MUST comply with `.specify/memory/constitution.md`:

**Code Quality**:
- TypeScript strict mode (no `any`)
- ESLint (@react-native config) and Prettier (single quotes, trailing commas)
- JSDoc comments on all exported functions/components
- Functions under 50 lines
- No `console.log` in commits

**Testing** (80% coverage minimum):
- Jest + React Test Renderer
- Test both light/dark themes
- Mock external deps (AsyncStorage, navigation, APIs)
- Tests in `__tests__/` mirroring `src/` structure

**UX Consistency**:
- Support light/dark via `useColorScheme()` with COLORS constant (see `App.tsx` lines 22-32)
- Use `SafeAreaProvider` from `react-native-safe-area-context`
- 8px spacing grid, minimum 14px font, 44x44pt touch targets
- FlatList virtualization for lists > 50 items

**Performance**:
- Web bundle < 5MB, FCP < 2s on 3G
- 60fps scrolling, < 16ms component render
- React.memo, useMemo, useCallback for optimization

## Developer Workflows

### Build & Test Commands
```bash
npm start                # Metro bundler
npm run ios              # iOS simulator (after: cd ios && pod install)
npm run android          # Android emulator
npm run web              # Web dev server (localhost:3000)
npm run build:web        # Production web build for GitHub Pages
npm test                 # Jest tests
npm test -- --coverage   # Check 80% coverage requirement
npm run lint             # ESLint check
```

### iOS Native Setup (Required after native dependency changes)
```bash
cd ios
bundle install           # First time only
bundle exec pod install  # Every time native deps change
cd ..
```

### Testing Patterns
- **AsyncStorage**: Mock at `__tests__/__mocks__/@react-native-async-storage/async-storage.js`
- **Theme testing**: Test components with both `isDarkMode={true}` and `isDarkMode={false}`
- **Component tests**: Use `ReactTestRenderer.create()` with `act()` wrapper

## Project-Specific Conventions

### Theme Management
- COLORS constant in `App.tsx` (to be extracted to `src/theme/colors.ts`)
- Use `useColorScheme()` hook in components
- Dynamic styles computed inside component (not `StyleSheet.create` for theme-dependent values)

### Cross-Platform Differences
- **Web**: No swipe gestures (use buttons), localStorage fallback for AsyncStorage
- **Mobile**: Full gesture support, native AsyncStorage
- **Platform detection**: Use `Platform.OS === 'web'` for conditional rendering

### Data Persistence
- Use `@react-native-async-storage/async-storage` for local storage
- JSON serialization for complex objects
- Auto-save pattern: save on every state change in hooks
- Error handling: show toast, continue in memory-only mode

### File Naming
- Components: PascalCase (e.g., `GroceryListScreen.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useGroceryList.ts`)
- Services: camelCase with Service suffix (e.g., `groceryStorageService.ts`)
- Tests: Same name as source file + `.test.tsx` or `.test.ts`

## Integration Points

### Web Deployment
- Webpack config at `webpack.config.js` with `react-native-web` alias
- Entry point: `index.web.js` (separate from native `index.js`)
- Auto-deploys to GitHub Pages on `main` branch push
- Public path: `/LTPs/` (repo name)

### Navigation
- To be implemented (not yet present)
- Future: React Navigation or similar
- Plan for feature-based screen routing

### External Dependencies
- Minimal external deps (see `package.json`)
- For new deps: add to research.md in feature spec, justify in plan.md
- Native deps require iOS pod install

## Common Pitfalls

1. **Don't break constitution**: ESLint, Prettier, 80% coverage are REQUIRED before merge
2. **Don't skip Spec-Kit workflow**: Features without specs in `specs/` are non-compliant
3. **Don't ignore theme support**: Every UI component must work in light AND dark mode
4. **Don't forget FlatList**: Lists > 50 items MUST use FlatList with `getItemLayout`
5. **Don't use file-type folders**: Use feature folders (`src/features/`) not `src/components/`, `src/hooks/`

## Key Files to Reference

- **Constitution**: `.specify/memory/constitution.md` (the law)
- **Current spec**: `specs/grocery-list/` (active feature implementation)
- **App entry**: `App.tsx` (theme pattern, SafeAreaProvider setup)
- **Test example**: `__tests__/App.test.tsx` (React Test Renderer pattern)
- **ESLint config**: `.eslintrc.js` (ignore patterns, React Native rules)
- **Package scripts**: `package.json` (build/test commands)

## When Starting New Features

1. Read constitution: `.specify/memory/constitution.md`
2. Follow Spec-Kit workflow: specify → clarify → plan → tasks
3. Create feature folder: `src/features/[feature-name]/`
4. Create spec folder: `specs/[feature-name]/`
5. Write tests FIRST (or alongside), ensure 80% coverage
6. Test both themes, all platforms (iOS, Android, Web)
7. Run `npm run lint && npm test` before committing

---

**When in doubt**: Check the constitution first, then existing specs in `specs/grocery-list/` for patterns.
