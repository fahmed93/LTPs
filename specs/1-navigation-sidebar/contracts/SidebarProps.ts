/**
 * SidebarProps Interface
 * 
 * Props contract for the NavigationSidebar component.
 * Defines the external API for integrating the sidebar into App.tsx.
 * 
 * @example
 * ```typescript
 * <NavigationSidebar
 *   isOpen={isSidebarOpen}
 *   currentScreen="home"
 *   onNavigate={(screen) => {
 *     setCurrentScreen(screen);
 *     setIsSidebarOpen(false);
 *   }}
 *   onClose={() => setIsSidebarOpen(false)}
 *   isDarkMode={useColorScheme() === 'dark'}
 * />
 * ```
 */
export interface SidebarProps {
  /**
   * External control of sidebar visibility
   * Controlled by parent component (App.tsx)
   * @required
   */
  isOpen: boolean;

  /**
   * Currently active screen identifier
   * Used to highlight the active feature in the sidebar
   * Must match a NavigationItem.route value
   * @required
   * @example 'home', 'grocery-list', 'recipes'
   */
  currentScreen: string;

  /**
   * Callback invoked when user selects a feature from the sidebar
   * Parent should:
   * 1. Update currentScreen state
   * 2. Close the sidebar (setIsOpen(false))
   * 3. Render the selected screen
   * @required
   * @param screen - The route identifier of the selected feature
   */
  onNavigate: (screen: string) => void;

  /**
   * Callback invoked when sidebar should close without navigation
   * Triggered by:
   * - Backdrop tap
   * - Swipe left gesture (mobile)
   * - Android back button press
   * - Escape key press (web)
   * @required
   */
  onClose: () => void;

  /**
   * Current theme mode
   * Used to apply theme-aware colors from COLORS constant
   * @required
   * @default false (light mode)
   */
  isDarkMode: boolean;
}

/**
 * SidebarItemProps Interface
 * 
 * Props for individual sidebar navigation items (SidebarItem component).
 */
export interface SidebarItemProps {
  /**
   * The navigation item to display
   * Contains id, name, icon, route, and order
   * @required
   */
  item: {
    id: string;
    name: string;
    icon: string;
    route: string;
    order: number;
  };

  /**
   * Whether this item represents the currently active screen
   * When true, item is styled with background highlight + bold text
   * @required
   */
  isActive: boolean;

  /**
   * Callback when item is tapped
   * Should call parent's onNavigate with the item's route
   * @required
   */
  onPress: () => void;

  /**
   * Current theme mode
   * @required
   */
  isDarkMode: boolean;
}

/**
 * SidebarBackdropProps Interface
 * 
 * Props for the semi-transparent backdrop overlay (SidebarBackdrop component).
 */
export interface SidebarBackdropProps {
  /**
   * Animated opacity value (0 to 0.4)
   * Controlled by parent's animation hook
   * @required
   */
  opacity: any; // Animated.Value from react-native

  /**
   * Callback when backdrop is tapped
   * Should call parent's onClose
   * @required
   */
  onPress: () => void;

  /**
   * Whether backdrop is currently visible
   * Controls rendering (only render when sidebar is open/opening)
   * @required
   */
  visible: boolean;
}

/**
 * SidebarHeaderProps Interface
 * 
 * Props for the sidebar header (SidebarHeader component).
 * Displays app branding: 🌱 emoji + "LTPs" + "Long Term Plans" subtitle
 */
export interface SidebarHeaderProps {
  /**
   * Current theme mode
   * @required
   */
  isDarkMode: boolean;
}
