/**
 * Individual navigation item in the sidebar
 * Displays icon, name, and handles press events
 */

import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '../../../theme/colors';
import {NavigationItem} from '../types/NavigationItem';

interface SidebarItemProps {
  /** Navigation item data */
  item: NavigationItem;
  /** Whether this item represents the current route */
  isActive: boolean;
  /** Whether dark mode is active */
  isDarkMode: boolean;
  /** Callback when item is pressed */
  onPress: (route: string) => void;
}

/**
 * Renders a single navigation item in the sidebar
 * @param props Component props
 * @returns Sidebar item component
 */
export const SidebarItem: React.FC<SidebarItemProps> = React.memo(
  ({item, isActive, isDarkMode, onPress}) => {
    const colors = isDarkMode ? COLORS.dark : COLORS.light;

    const handlePress = () => {
      onPress(item.route);
    };

    return (
      <TouchableOpacity
        style={[
          styles.container,
          isActive && {
            backgroundColor: colors.sidebarHighlight,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityLabel={`Navigate to ${item.name}`}
        accessibilityRole="button"
        accessibilityState={{selected: isActive}}>
        <Text style={styles.icon}>{item.icon}</Text>
        <Text
          style={[
            styles.name,
            {color: isActive ? colors.sidebarHighlightText : colors.sidebarText},
            isActive && styles.nameActive,
          ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  },
);

SidebarItem.displayName = 'SidebarItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44, // WCAG touch target minimum
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  name: {
    fontSize: 16,
    flex: 1,
  },
  nameActive: {
    fontWeight: 'bold',
  },
});
