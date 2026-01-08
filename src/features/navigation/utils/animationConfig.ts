/**
 * Animation configuration for sidebar transitions
 * Centralizes timing, easing, and visual constants
 */

import {Easing} from 'react-native';

/**
 * Duration of sidebar open/close animation in milliseconds
 */
export const ANIMATION_DURATION = 300;

/**
 * Easing function for smooth, natural motion
 * Uses bezier curve for ease-out effect
 */
export const ANIMATION_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);

/**
 * Enable native driver for 60fps performance
 * CRITICAL: All animations must use this flag
 */
export const USE_NATIVE_DRIVER = true;

/**
 * Sidebar width as percentage of screen width
 * Mobile: 80% (leaves room for backdrop visibility)
 */
export const SIDEBAR_WIDTH_PERCENTAGE = 0.8;

/**
 * Maximum sidebar width in pixels for tablets/web
 */
export const SIDEBAR_MAX_WIDTH = 320;

/**
 * Backdrop opacity when sidebar is fully open
 * Range: 0 (transparent) to 1 (opaque)
 */
export const BACKDROP_OPACITY = 0.4;

/**
 * Z-index for sidebar layer (above content)
 */
export const SIDEBAR_Z_INDEX = 1000;

/**
 * Z-index for backdrop layer (between content and sidebar)
 */
export const BACKDROP_Z_INDEX = 999;

/**
 * Swipe gesture threshold in pixels to trigger close
 * User must swipe at least this distance to close sidebar
 */
export const SWIPE_THRESHOLD = 50;

/**
 * Velocity threshold in pixels/second for quick swipe detection
 */
export const SWIPE_VELOCITY_THRESHOLD = 0.3;
