/**
 * Theme colors for light and dark modes
 * Extracted from App.tsx for shared use across the application
 */

export const COLORS = {
  light: {
    background: '#f5f5f5',
    text: '#000000',
    cardBackground: 'rgba(100, 150, 250, 0.1)',
    border: '#E0E0E0',
    checkedText: '#666666',
    inputBackground: '#ffffff',
    deleteBackground: '#ff3b30',
    deleteText: '#ffffff',
    buttonBackground: 'rgba(100, 150, 250, 0.2)',
    buttonText: '#000000',
    disabledBackground: '#e0e0e0',
    disabledText: '#999999',
    // Navigation Sidebar colors
    sidebarBackground: '#ffffff',
    sidebarText: '#000000',
    sidebarTextSecondary: '#666666',
    sidebarHighlight: 'rgba(100, 150, 250, 0.15)',
    sidebarHighlightText: '#000000',
    sidebarOverlay: 'rgba(0, 0, 0, 0.4)',
    sidebarBorder: '#E0E0E0',
  },
  dark: {
    background: '#1a1a1a',
    text: '#ffffff',
    cardBackground: 'rgba(100, 150, 250, 0.1)',
    border: '#333333',
    checkedText: '#999999',
    inputBackground: '#2a2a2a',
    deleteBackground: '#ff453a',
    deleteText: '#ffffff',
    buttonBackground: 'rgba(100, 150, 250, 0.3)',
    buttonText: '#ffffff',
    disabledBackground: '#3a3a3a',
    disabledText: '#666666',
    // Navigation Sidebar colors
    sidebarBackground: '#2a2a2a',
    sidebarText: '#ffffff',
    sidebarTextSecondary: '#999999',
    sidebarHighlight: 'rgba(100, 150, 250, 0.25)',
    sidebarHighlightText: '#ffffff',
    sidebarOverlay: 'rgba(0, 0, 0, 0.4)',
    sidebarBorder: '#444444',
  },
} as const;

export type Theme = typeof COLORS.light;
export type ColorScheme = keyof typeof COLORS;
