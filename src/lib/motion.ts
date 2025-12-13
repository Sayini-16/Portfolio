/**
 * Framer Motion Configuration
 * Centralized animation variants, transitions, and utilities
 */

import type { Variants, Transition } from 'framer-motion';

// ============================================
// DURATION PRESETS (in seconds for Framer Motion)
// ============================================
export const durations = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
} as const;

// ============================================
// EASING PRESETS
// ============================================
export const easings = {
  // Cubic bezier easings
  default: [0.25, 0.1, 0.25, 1.0],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],

  // Spring configurations
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
  springBouncy: { type: 'spring' as const, stiffness: 400, damping: 15 },
  springGentle: { type: 'spring' as const, stiffness: 200, damping: 25 },
  springSnappy: { type: 'spring' as const, stiffness: 500, damping: 35 },
} as const;

// ============================================
// TRANSITION PRESETS
// ============================================
export const transitions = {
  fast: { duration: durations.fast, ease: easings.easeOut },
  normal: { duration: durations.normal, ease: easings.easeOut },
  slow: { duration: durations.slow, ease: easings.easeOut },
  spring: easings.spring,
  springBouncy: easings.springBouncy,
} as const;

// ============================================
// ANIMATION VARIANTS
// ============================================

// Basic fade
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Slide up with fade
export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

// Slide down with fade
export const slideDownVariants: Variants = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
};

// Scale with fade (for modals, overlays)
export const scaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

// Terminal line animation (for history entries)
export const terminalLineVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, height: 0, marginBottom: 0 },
};

// Command palette backdrop
export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Command palette sheet
export const sheetVariants: Variants = {
  initial: { opacity: 0, scale: 0.98, y: -10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: easings.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -10,
    transition: { duration: durations.fast },
  },
};

// List item (for command palette items)
export const listItemVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

// Toast notification
export const toastVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: easings.spring,
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.95,
    transition: { duration: durations.fast },
  },
};

// Mount animation (replaces AnimatedOnMount)
export const mountVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

// ============================================
// STAGGER CONTAINER VARIANTS
// ============================================

// Container for staggered children (terminal history)
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.01,
      staggerDirection: -1,
    },
  },
};

// Faster stagger for command palette
export const fastStaggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.08,
    },
  },
};

// ============================================
// MICRO-INTERACTION PROPS
// ============================================

// Button/interactive element hover/tap
export const buttonInteraction = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring', stiffness: 400, damping: 17 },
};

// Input focus interaction
export const inputInteraction = {
  whileFocus: { scale: 1.01 },
  transition: { type: 'spring', stiffness: 300, damping: 20 },
};

// Subtle pulse for active elements
export const pulseInteraction = {
  animate: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create a delayed transition
 */
export const withDelay = (delay: number, transition: Transition = transitions.normal): Transition => ({
  ...transition,
  delay,
});

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation props respecting reduced motion preference
 */
export const getMotionProps = (variants: Variants) => {
  if (prefersReducedMotion()) {
    return {}; // No animation for users who prefer reduced motion
  }
  return {
    initial: 'initial',
    animate: 'animate',
    exit: 'exit',
    variants,
  };
};
