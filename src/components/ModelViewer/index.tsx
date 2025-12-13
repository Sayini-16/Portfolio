/**
 * ModelViewer - 3D model viewer with theme-aware tinting
 * Supports GLTF/GLB and FBX formats with auto-rotation and centering
 */

import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useProgress } from "@react-three/drei";
import { AnimatePresence } from "framer-motion";

import { MatrixRain } from "../MatrixRain";
import { GLTFModel } from "./GLTFModel";
import { FBXModel } from "./FBXModel";
import { LoadingOverlay } from "./LoadingOverlay";
import type { ModelViewerProps } from "./types";

// Re-export types and utilities
export type { ModelViewerProps } from "./types";
export { recenterObject } from "./useModelSetup";

// Progress wrapper to access useProgress inside Canvas context
const ProgressTracker: React.FC<{ onProgress: (p: number) => void }> = ({ onProgress }) => {
  const { progress } = useProgress();
  React.useEffect(() => {
    onProgress(progress);
  }, [progress, onProgress]);
  return null;
};

export const ModelViewer: React.FC<ModelViewerProps> = ({
  url,
  className = "",
  tintColor,
  anchor = "center",
  centerAxes = "xyz",
  position,
  rotation,
  scale,
  yOffset,
  autoRotate = true,
  rotateSpeed = -0.3,
  licenseHtml,
  rainSpeed = 1,
  rainOpacity = 0.4,
}) => {
  const isFBX = url.toLowerCase().endsWith(".fbx");
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  const ModelComponent = isFBX ? FBXModel : GLTFModel;
  const color = tintColor || "#4ade80";

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Background Matrix Rain */}
      <MatrixRain color={color} speed={rainSpeed} opacity={rainOpacity} />

      {/* Loading overlay */}
      <AnimatePresence>
        {!ready && <LoadingOverlay progress={progress} tintColor={color} />}
      </AnimatePresence>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10">
        <Canvas shadows camera={{ position: [0, 0, 3], fov: 45 }}>
          {/* Track loading progress */}
          <ProgressTracker onProgress={setProgress} />

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[3, 5, 2]}
            intensity={0.9}
            castShadow
            color={tintColor}
          />

          {/* Model */}
          <Suspense fallback={null}>
            <ModelComponent
              url={url}
              tint={tintColor}
              anchor={anchor}
              centerAxes={centerAxes}
              position={position}
              rotation={rotation}
              scale={scale}
              yOffset={yOffset}
              autoRotate={autoRotate}
              rotateSpeed={rotateSpeed}
              onReady={() => setReady(true)}
            />

            {/* Delay environment until model is ready */}
            {ready && <Environment preset="city" />}
          </Suspense>

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            target={[0, 0, 0]}
          />
        </Canvas>
      </div>

      {/* License attribution */}
      {licenseHtml && (
        <div className="absolute left-3 right-3 bottom-2 text-[11px] leading-snug opacity-80 select-text z-20">
          <style>{`
            .mv-license a {
              color: ${color};
              text-decoration: underline;
              text-underline-offset: 2px;
            }
            .mv-license a:hover {
              opacity: 0.9;
            }
          `}</style>
          <div
            className="mv-license px-2 py-1 rounded-md border border-white/10 bg-black/30 backdrop-blur-sm"
            style={{ color: "rgba(255,255,255,0.85)" }}
            dangerouslySetInnerHTML={{ __html: licenseHtml }}
          />
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
