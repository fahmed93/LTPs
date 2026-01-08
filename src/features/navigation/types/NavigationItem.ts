/**
 * Navigation item definition for sidebar menu
 * Represents a single feature/screen in the app
 */

export interface NavigationItem {
  /**
   * Unique identifier for the navigation item
   */
  id: string;

  /**
   * Display name shown in the sidebar
   */
  name: string;

  /**
   * Emoji icon displayed alongside the name
   */
  icon: string;

  /**
   * Route/screen name for navigation
   * Must match the actual screen component name
   */
  route: string;

  /**
   * Display order in the sidebar (1-based)
   * Lower numbers appear first
   */
  order: number;
}
