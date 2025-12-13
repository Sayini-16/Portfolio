/**
 * LazyModelViewer - Lazy-loaded 3D model viewer wrapper
 * Defers loading of Three.js until the component is actually rendered
 */

import React, { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Box } from "lucide-react";
import type { ModelViewerProps } from "./ModelViewer/types";

// Lazy load the heavy ModelViewer component
const ModelViewer = lazy(() => import("./ModelViewer"));

interface LazyModelViewerProps extends ModelViewerProps {
  /** Delay before starting to load (gives time for critical content) */
  loadDelay?: number;
}

// Loading placeholder shown while Three.js loads
const LoadingPlaceholder: React.FC<{ tintColor?: string }> = ({ tintColor = "#4ade80" }) => (
  <div className="w-full h-full flex items-center justify-center bg-black/20">
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Box size={32} style={{ color: tintColor }} />
      </motion.div>
      <div className="flex items-center gap-2 text-sm" style={{ color: tintColor }}>
        <Loader2 size={14} className="animate-spin" />
        <span>Loading 3D viewer...</span>
      </div>
    </motion.div>
  </div>
);

export const LazyModelViewer: React.FC<LazyModelViewerProps> = ({
  loadDelay = 0,
  ...props
}) => {
  const [shouldLoad, setShouldLoad] = useState(loadDelay === 0);

  // Delay loading to prioritize critical content
  useEffect(() => {
    if (loadDelay > 0) {
      const timer = setTimeout(() => setShouldLoad(true), loadDelay);
      return () => clearTimeout(timer);
    }
  }, [loadDelay]);

  // Start preloading the model once we decide to load
  useEffect(() => {
    if (shouldLoad && props.url) {
      // Dynamically import preload utilities
      import("@react-three/drei").then(({ useGLTF, useFBX }) => {
        const isFBX = props.url.toLowerCase().endsWith(".fbx");
        try {
          if (isFBX) useFBX.preload(props.url);
          else useGLTF.preload(props.url);
        } catch {}
      });
    }
  }, [shouldLoad, props.url]);

  if (!shouldLoad) {
    return <LoadingPlaceholder tintColor={props.tintColor} />;
  }

  return (
    <Suspense fallback={<LoadingPlaceholder tintColor={props.tintColor} />}>
      <ModelViewer {...props} />
    </Suspense>
  );
};

export default LazyModelViewer;
