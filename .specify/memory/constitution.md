<!--
Sync Impact Report:
- Version: N/A → v1.0.0
- Initial constitution creation
- Principles added:
  1. Code Quality Standards
  2. Testing Standards
  3. User Experience Consistency
  4. Performance Requirements
- Templates requiring updates: N/A (no templates directory exists yet)
- Follow-up TODOs: None
-->

# LTPs Project Constitution

**Version:** 1.0.0  
**Ratified:** 2026-01-07  
**Last Amended:** 2026-01-07

## Purpose

This constitution establishes the core principles and standards that govern the development
of LTPs (Long Term Plans), a React Native mobile application for couples to manage their
shared life together. These principles ensure consistent code quality, reliable testing,
cohesive user experience, and optimal performance across all platforms (iOS, Android, Web).

## Project Overview

**Project Name:** LTPs - Long Term Plans  
**Description:** A React Native mobile app for couples to manage shared recipes, grocery
lists, travel plans, and home projects  
**Tech Stack:** React Native, React Native Web, TypeScript, Spec-Kit  
**Platforms:** iOS, Android, Web (GitHub Pages)

## Core Principles

### Principle 1: Code Quality Standards

**All code MUST adhere to consistent quality standards to ensure maintainability,
readability, and collaboration effectiveness.**

Requirements:
- MUST use TypeScript for all new code to ensure type safety
- MUST follow React Native ESLint configuration (@react-native)
- MUST use Prettier with single quotes and trailing commas for consistent formatting
- MUST include JSDoc comments for exported functions and components explaining purpose
- MUST use meaningful variable and function names that clearly express intent
- MUST avoid magic numbers; use named constants for configuration values
- MUST keep functions focused and under 50 lines when possible
- MUST extract reusable logic into shared utilities or hooks
- MUST handle errors explicitly; never silently swallow exceptions
- MUST remove console.log statements before committing (use proper logging if needed)

Rationale: Consistent code quality reduces technical debt, makes code reviews more
effective, enables new contributors to understand the codebase quickly, and prevents
bugs from unclear or poorly structured code. TypeScript provides compile-time error
detection and better IDE support. ESLint and Prettier automate style enforcement,
eliminating bikeshedding in code reviews.

### Principle 2: Testing Standards

**All features MUST be thoroughly tested to ensure reliability and prevent regressions.**

Requirements:
- MUST write unit tests for all business logic and utility functions
- MUST maintain minimum 80% code coverage for utility modules
- MUST write component tests for all React components using React Test Renderer
- MUST test component rendering in both light and dark modes
- MUST test all user interaction paths (button presses, form submissions, etc.)
- MUST test error states and edge cases explicitly
- MUST run `npm test` successfully before committing
- MUST ensure tests are deterministic and do not rely on external state
- MUST mock external dependencies (APIs, storage, navigation) in tests
- MUST use descriptive test names that explain what is being tested and why

Rationale: Comprehensive testing catches bugs early, enables confident refactoring,
and serves as living documentation of expected behavior. The 80% coverage target
balances thoroughness with pragmatism. Testing both light and dark modes ensures
the app works correctly for all users regardless of their theme preference. React
Native apps must work reliably offline and across multiple platforms, making
thorough testing critical.

### Principle 3: User Experience Consistency

**The app MUST provide a consistent, intuitive, and delightful experience across all
platforms and use cases.**

Requirements:
- MUST support both light and dark color schemes seamlessly
- MUST use theme-aware colors from the COLORS constant throughout the app
- MUST respect system safe area insets on all screens (using SafeAreaProvider)
- MUST provide clear visual feedback for all user interactions
- MUST use consistent spacing (multiples of 4px or 8px) throughout the UI
- MUST ensure text remains readable (minimum 14px font size for body text)
- MUST use consistent icon styles and emoji representations
- MUST maintain the same feature parity across iOS, Android, and Web platforms
- MUST follow platform conventions (iOS Human Interface Guidelines, Material Design)
- MUST ensure all interactive elements are touch-friendly (minimum 44x44 point targets)
- MUST provide loading states for async operations
- MUST handle network errors gracefully with user-friendly messages

Rationale: Consistency builds user trust and reduces cognitive load. Users expect
apps to adapt to their system preferences (light/dark mode) and device characteristics
(safe areas, platform conventions). A couple using the app on different devices
should have the same experience. Poor UX leads to frustration and abandonment,
while delightful UX encourages daily engagement with shared relationship management.

### Principle 4: Performance Requirements

**The app MUST be fast, responsive, and efficient to provide a smooth user experience.**

Requirements:
- MUST keep app bundle size under 5MB for web builds
- MUST achieve First Contentful Paint (FCP) under 2 seconds on 3G networks
- MUST render lists with virtualization for collections over 50 items
- MUST debounce search inputs and high-frequency user interactions
- MUST lazy load images and defer non-critical resources
- MUST avoid unnecessary re-renders (use React.memo, useMemo, useCallback appropriately)
- MUST profile and optimize any component that takes >16ms to render
- MUST keep animations at 60fps by using native drivers when possible
- MUST implement pagination or infinite scroll for large data sets
- MUST cache API responses when appropriate to reduce network requests
- MUST optimize images before committing (compress, use appropriate formats)
- MUST avoid blocking the JavaScript thread with heavy computations

Rationale: Performance directly impacts user satisfaction and retention. Slow apps
frustrate users and drain battery life. React Native runs JavaScript on a separate
thread, but poor practices can still cause jank. A relationship management app will
be used daily, often in quick interactions (adding groceries, checking recipes),
so responsiveness is critical. Web builds must be performant to ensure GitHub Pages
deployment provides a good experience. Many users may have older devices or slower
networks, so optimization is essential for accessibility.

## Governance

### Amendment Process

1. Proposed amendments MUST be discussed with the project maintainer before implementation
2. Amendments that add new principles require a MINOR version bump
3. Amendments that modify or remove existing principles require a MAJOR version bump
4. Clarifications and non-semantic fixes require a PATCH version bump
5. All amendments MUST update the LAST_AMENDED_DATE field
6. The Sync Impact Report MUST be updated with each amendment

### Compliance Review

- Code reviews MUST verify compliance with all applicable principles
- Automated tools (ESLint, Prettier, Jest) MUST pass before merging
- Principle violations MUST be addressed before merging pull requests
- Exceptions to principles MUST be explicitly documented and justified

### Related Documents

- Project README: `/README.md`
- Spec-Kit Commands: `/.github/agents/speckit.*.md`
- Package Configuration: `/package.json`
- Test Configuration: `/jest.config.js`
- Linting Configuration: `/.eslintrc.js`
- Formatting Configuration: `/.prettierrc.js`

---

*This constitution serves as the foundation for all development decisions in the LTPs
project. When in doubt, refer to these principles to guide your choices.*
