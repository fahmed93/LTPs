/**
 * Sidebar header component displaying app branding
 * Shows the LTPs logo and subtitle with theme support
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../../theme/colors';

interface SidebarHeaderProps {
  /** Whether dark mode is active */
  isDarkMode: boolean;
}

/**
 * Displays the app branding at the top of the sidebar
 * @param props Component props
 * @returns Sidebar header component
 */
export const SidebarHeader: React.FC<SidebarHeaderProps> = ({isDarkMode}) => {
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.icon}>🌱</Text>
        <Text style={[styles.title, {color: colors.sidebarText}]}>LTPs</Text>
      </View>
      <Text style={[styles.subtitle, {color: colors.sidebarTextSecondary}]}>
        Long Term Plans
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginLeft: 32, // Align with title (icon width + margin)
  },
});
