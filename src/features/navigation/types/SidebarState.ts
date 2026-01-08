/**
 * Sidebar animation and interaction state
 * Tracks the current state of the sidebar component
 */

export interface SidebarState {
  /**
   * Whether the sidebar is currently open
   */
  isOpen: boolean;

  /**
   * Whether an animation is currently in progress
   * When true, user interactions should be blocked
   */
  isAnimating: boolean;

  /**
   * Current route/screen the user is on
   * Used for highlighting the active navigation item
   */
  currentRoute: string;

  /**
   * Animated position value (0 to 1)
   * 0 = fully closed, 1 = fully open
   */
  position: number;

  /**
   * Animated backdrop opacity value (0 to BACKDROP_OPACITY)
   * 0 = transparent, BACKDROP_OPACITY = fully visible
   */
  backdropOpacity: number;
}
