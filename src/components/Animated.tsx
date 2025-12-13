/**
 * Animated Components - Framer Motion based animations
 * Replaces the old anime.js AnimatedOnMount component
 */

import React from "react";
import { motion } from "framer-motion";
import { mountVariants, prefersReducedMotion } from "../lib/motion";

// Props for AnimatedOnMount (backwards compatible API)
interface AnimatedOnMountProps {
  as?: "div" | "section" | "article" | "aside" | "main" | "header" | "footer" | "nav" | "span";
  className?: string;
  style?: React.CSSProperties;
  anime?: {
    delay?: number;
    duration?: number;
  };
  children?: React.ReactNode;
}

/**
 * AnimatedOnMount - Animates children on mount with fade + slide up
 * Backwards compatible with the old anime.js API
 */
export function AnimatedOnMount({
  as = "div",
  anime,
  children,
  className,
  style,
}: AnimatedOnMountProps) {
  const delay = (anime?.delay ?? 0) / 1000; // Convert ms to seconds
  const duration = (anime?.duration ?? 700) / 1000;

  // Skip animations for users who prefer reduced motion
  if (prefersReducedMotion()) {
    const Component = as;
    return (
      <Component className={className} style={style}>
        {children}
      </Component>
    );
  }

  // Use motion[as] for dynamic element types
  const MotionComponent = motion[as] as typeof motion.div;

  return (
    <MotionComponent
      className={className}
      style={style}
      variants={mountVariants}
      initial="initial"
      animate="animate"
      transition={{
        duration,
        delay,
        ease: [0, 0, 0.2, 1], // easeOut
      }}
    >
      {children}
    </MotionComponent>
  );
}

export default AnimatedOnMount;
