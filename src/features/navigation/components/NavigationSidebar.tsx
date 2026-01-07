/**
 * Main navigation sidebar component
 * Displays the sidebar with header, navigation items, and handles animations
 */

import React from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {COLORS} from '../../../theme/colors';
import {SidebarHeader} from './SidebarHeader';
import {SidebarItem} from './SidebarItem';
import {NAVIGATION_ITEMS} from '../utils/navigationConfig';
import {
  SIDEBAR_WIDTH_PERCENTAGE,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_Z_INDEX,
} from '../utils/animationConfig';

interface NavigationSidebarProps {
  /** Whether the sidebar is open */
  isOpen: boolean;
  /** Animated position value (0=closed, 1=open) */
  position: Animated.Value;
  /** Current route/screen name */
  currentRoute: string;
  /** Whether dark mode is active */
  isDarkMode: boolean;
  /** Callback when user navigates to a different screen */
  onNavigate: (route: string) => void;
  /** Callback to close the sidebar */
  onClose: () => void;
}

/**
 * Renders the navigation sidebar with animated transitions
 * @param props Component props
 * @returns Navigation sidebar component
 */
export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  isOpen,
  position,
  currentRoute,
  isDarkMode,
  onNavigate,
  onClose,
}) => {
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  const screenWidth = Dimensions.get('window').width;
  const sidebarWidth = Math.min(
    screenWidth * SIDEBAR_WIDTH_PERCENTAGE,
    SIDEBAR_MAX_WIDTH,
  );

  // Don't render if not open (performance optimization)
  if (!isOpen) {
    return null;
  }

  // Animated transform for slide-in effect
  const translateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [-sidebarWidth, 0],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: sidebarWidth,
          transform: [{translateX}],
          backgroundColor: colors.sidebarBackground,
          borderRightColor: colors.sidebarBorder,
        },
      ]}>
      <SafeAreaView style={styles.safeArea}>
        <SidebarHeader isDarkMode={isDarkMode} />
        <ScrollView style={styles.scrollView}>
          {NAVIGATION_ITEMS.map(item => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={item.route === currentRoute}
              isDarkMode={isDarkMode}
              onPress={onNavigate}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: SIDEBAR_Z_INDEX,
    borderRightWidth: 1,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 2, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});
