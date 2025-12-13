/**
 * GLTFModel - GLTF/GLB model loader component
 * Uses shared useModelSetup hook for centering and tinting
 */

import React from "react";
import { useGLTF } from "@react-three/drei";
import { useModelSetup } from "./useModelSetup";
import type { ModelComponentProps } from "./types";

export const GLTFModel: React.FC<ModelComponentProps> = ({
  url,
  tint,
  anchor = "center",
  centerAxes = "xyz",
  position,
  rotation,
  scale,
  yOffset,
  autoRotate,
  rotateSpeed = 0.15,
  onReady,
}) => {
  const { scene } = useGLTF(url);

  const { groupRef, containerRef } = useModelSetup({
    object: scene,
    tint,
    anchor,
    centerAxes,
    yOffset,
    autoRotate,
    rotateSpeed,
    onReady,
  });

  return (
    <group ref={containerRef} position={position} rotation={rotation} scale={scale}>
      <group ref={groupRef}>
        {/* @ts-ignore - drei primitive typing */}
        <primitive object={scene} />
      </group>
    </group>
  );
};
