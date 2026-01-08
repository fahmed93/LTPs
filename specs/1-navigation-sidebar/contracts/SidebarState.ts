import {Animated} from 'react-native';

/**
 * SidebarState Interface
 * 
 * Represents the current state of the navigation sidebar including
 * visibility, animation status, and current route.
 * 
 * @example
 * ```typescript
 * const initialState: SidebarState = {
 *   isOpen: false,
 *   isAnimating: false,
 *   currentRoute: 'home',
 *   position: new Animated.Value(-320),
 *   backdropOpacity: new Animated.Value(0),
 * };
 * ```
 */
export interface SidebarState {
  /**
   * Whether the sidebar is currently visible/open
   * true = sidebar is fully open or opening
   * false = sidebar is fully closed or closing
   */
  isOpen: boolean;

  /**
   * Whether the sidebar is currently animating (opening or closing)
   * When true, all user input should be ignored to prevent animation conflicts
   * @see FR-014 in spec: "System MUST prevent multiple simultaneous sidebar open/close animations"
   */
  isAnimating: boolean;

  /**
   * Currently active screen/route identifier
   * Used to highlight the active feature in the sidebar
   * Must match a valid NavigationItem.route
   */
  currentRoute: string;

  /**
   * Animated value for sidebar X position
   * @range -320 (fully closed, off-screen left) to 0 (fully open)
   * @units pixels
   */
  position: Animated.Value;

  /**
   * Animated value for backdrop opacity
   * @range 0 (fully transparent, sidebar closed) to 0.4 (semi-transparent, sidebar open)
   * @note 0.4 opacity chosen based on Material Design standards (clarification session)
   */
  backdropOpacity: Animated.Value;
}

/**
 * State Transition Map
 * 
 * Valid state transitions for the sidebar:
 * - Closed → Animating Open (300ms) → Open
 * - Open → Animating Closed (300ms) → Closed
 * - Open → Animating Closed (300ms) → Closed + Navigate to new screen
 * 
 * Invalid transitions (should be prevented):
 * - Animating Open → Animating Closed (must wait for animation to complete)
 * - Animating Closed → Animating Open (must wait for animation to complete)
 */
export type SidebarStateTransition =
  | {from: 'closed'; to: 'animating-open'}
  | {from: 'animating-open'; to: 'open'}
  | {from: 'open'; to: 'animating-closed'}
  | {from: 'animating-closed'; to: 'closed'};
