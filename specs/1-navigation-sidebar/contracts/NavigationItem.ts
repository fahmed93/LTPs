/**
 * NavigationItem Interface
 * 
 * Represents a single feature/screen entry in the navigation sidebar.
 * Each item corresponds to a navigable screen in the app.
 * 
 * @example
 * ```typescript
 * const groceryListItem: NavigationItem = {
 *   id: 'grocery-list',
 *   name: 'Grocery List',
 *   icon: '🛒',
 *   route: 'grocery-list',
 *   order: 3,
 * };
 * ```
 */
export interface NavigationItem {
  /**
   * Unique identifier for the feature
   * @format lowercase-kebab-case
   * @example 'grocery-list', 'home-projects'
   */
  id: string;

  /**
   * Display name shown in the sidebar
   * @min 1
   * @max 30
   * @example 'Grocery List', 'Travel Plans'
   */
  name: string;

  /**
   * Emoji or icon to display next to the name
   * @format single emoji character
   * @example '🛒', '✈️', '🏡'
   */
  icon: string;

  /**
   * Route/screen identifier for navigation
   * Must match a screen name in App.tsx currentScreen state
   * @example 'grocery-list', 'recipes', 'home'
   */
  route: string;

  /**
   * Display order in the sidebar (1-based)
   * Items are displayed in ascending order
   * @min 1
   * @example 1 (first item), 5 (fifth item)
   */
  order: number;
}

/**
 * Type alias for screen/route names
 * Represents valid navigation destinations
 */
export type ScreenName = 'home' | 'recipes' | 'grocery-list' | 'travel' | 'home-projects';
