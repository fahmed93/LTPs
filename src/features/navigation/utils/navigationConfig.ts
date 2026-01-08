/**
 * Navigation configuration for the sidebar
 * Defines all available features and their routing information
 */

import {NavigationItem} from '../types/NavigationItem';

/**
 * Array of navigation items displayed in the sidebar
 * Ordered by priority and user workflow
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'home',
    name: 'Home',
    icon: '🏠',
    route: 'Home',
    order: 1,
  },
  {
    id: 'recipes',
    name: 'Recipes',
    icon: '🍳',
    route: 'Recipes',
    order: 2,
  },
  {
    id: 'grocery-list',
    name: 'Grocery List',
    icon: '🛒',
    route: 'GroceryList',
    order: 3,
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    route: 'Travel',
    order: 4,
  },
  {
    id: 'home-projects',
    name: 'Home Projects',
    icon: '🔨',
    route: 'HomeProjects',
    order: 5,
  },
];
