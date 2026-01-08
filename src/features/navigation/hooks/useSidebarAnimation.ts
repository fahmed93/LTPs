/**
 * Custom hook for managing sidebar animation state and transitions
 * Handles opening, closing, and preventing interaction during animations
 */

import {useRef, useState, useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  USE_NATIVE_DRIVER,
} from '../utils/animationConfig';

/**
 * Hook return type with animation state and control functions
 */
interface UseSidebarAnimationReturn {
  /** Whether sidebar is currently open */
  isOpen: boolean;
  /** Whether animation is in progress (blocks user interaction) */
  isAnimating: boolean;
  /** Animated value for sidebar position (0=closed, 1=open) */
  position: Animated.Value;
  /** Animated value for backdrop opacity */
  backdropOpacity: Animated.Value;
  /** Function to open the sidebar */
  openSidebar: () => void;
  /** Function to close the sidebar */
  closeSidebar: () => void;
}

/**
 * Manages sidebar animation state with smooth transitions
 * @returns Animation state and control functions
 */
export const useSidebarAnimation = (): UseSidebarAnimationReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const position = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  /**
   * Opens the sidebar with animation
   */
  const openSidebar = useCallback(() => {
    if (isOpen || isAnimating) {
      return;
    }

    setIsAnimating(true);
    setIsOpen(true);

    Animated.parallel([
      Animated.timing(position, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        easing: ANIMATION_EASING,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        easing: ANIMATION_EASING,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    ]).start(() => {
      setIsAnimating(false);
    });
  }, [isOpen, isAnimating, position, backdropOpacity]);

  /**
   * Closes the sidebar with animation
   */
  const closeSidebar = useCallback(() => {
    if (!isOpen || isAnimating) {
      return;
    }

    setIsAnimating(true);

    Animated.parallel([
      Animated.timing(position, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: ANIMATION_EASING,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: ANIMATION_EASING,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    ]).start(() => {
      setIsAnimating(false);
      setIsOpen(false);
    });
  }, [isOpen, isAnimating, position, backdropOpacity]);

  return {
    isOpen,
    isAnimating,
    position,
    backdropOpacity,
    openSidebar,
    closeSidebar,
  };
};
