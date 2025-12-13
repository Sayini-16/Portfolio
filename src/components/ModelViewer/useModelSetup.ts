/**
 * useModelSetup - Shared hook for model centering, tinting, and rotation
 * Eliminates code duplication between GLTF and FBX loaders
 */

import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box3, Color, Material, Mesh, Object3D, Vector3 } from "three";

interface UseModelSetupOptions {
  object: Object3D;
  tint?: string;
  anchor?: "center" | "base" | "top";
  centerAxes?: "xyz" | "xy" | "xz" | "yz";
  yOffset?: number;
  autoRotate?: boolean;
  rotateSpeed?: number;
  onReady?: () => void;
}

// Collect all tintable materials from an object tree
function collectTintableMaterials(object: Object3D): Material[] {
  const set = new Set<Material>();
  object.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mesh = child as Mesh;
      const mat = mesh.material as Material | Material[];
      if (Array.isArray(mat)) {
        mat.forEach((m) => m && set.add(m));
      } else if (mat) {
        set.add(mat);
      }
    }
  });
  return Array.from(set);
}

// Utility for recentering objects
export function recenterObject(object: Object3D, wrapper: Object3D) {
  wrapper.position.set(0, 0, 0);
  const box = new Box3().setFromObject(object);
  const center = new Vector3();
  box.getCenter(center);
  wrapper.position.set(-center.x, -center.y, -center.z);
}

export function useModelSetup({
  object,
  tint,
  anchor = "center",
  centerAxes = "xyz",
  yOffset,
  autoRotate,
  rotateSpeed = 0.15,
  onReady,
}: UseModelSetupOptions) {
  const groupRef = useRef<Object3D>(null!);
  const containerRef = useRef<Object3D>(null!);
  const matsRef = useRef<Material[]>([]);
  const targetColorRef = useRef(new Color(tint || "#ffffff"));
  const targetEmissiveRef = useRef(new Color(tint || "#ffffff").multiplyScalar(0.05));
  const centeredRef = useRef(false);

  // Center once when the model loads
  useLayoutEffect(() => {
    if (!groupRef.current || centeredRef.current) return;

    groupRef.current.position.set(0, 0, 0);
    object.updateWorldMatrix(true, true);

    const box = new Box3().setFromObject(object);
    const center = new Vector3();
    box.getCenter(center);
    const min = box.min;
    const max = box.max;

    let targetY = center.y;
    if (anchor === "base") targetY = min.y;
    if (anchor === "top") targetY = max.y;

    const useX = centerAxes.includes("x");
    const useY = centerAxes.includes("y");
    const useZ = centerAxes.includes("z");

    const px = useX ? -center.x : 0;
    const py = useY ? -targetY : 0;
    const pz = useZ ? -center.z : 0;

    groupRef.current.position.set(px, py, pz);
    if (typeof yOffset === "number") {
      groupRef.current.position.y += yOffset;
    }

    // Collect and initialize materials
    matsRef.current = collectTintableMaterials(object);
    if (tint) {
      matsRef.current.forEach((m: any) => {
        if (m.color) m.color = new Color(tint);
        if (m.emissive) m.emissive = new Color(tint).multiplyScalar(0.05);
        if (typeof m.metalness === "number") m.metalness = 0.1;
        if (typeof m.roughness === "number") m.roughness = 0.6;
        m.needsUpdate = true;
      });
    }

    centeredRef.current = true;
    requestAnimationFrame(() => onReady?.());
  }, [object, anchor, centerAxes, yOffset, tint, onReady]);

  // Update target colors when tint changes
  useLayoutEffect(() => {
    if (!tint) return;
    targetColorRef.current = new Color(tint);
    targetEmissiveRef.current = new Color(tint).multiplyScalar(0.05);
  }, [tint]);

  // Smoothly lerp materials to target tint
  useFrame(() => {
    matsRef.current.forEach((m: any) => {
      if (m.color) m.color.lerp(targetColorRef.current, 0.12);
      if (m.emissive) m.emissive.lerp(targetEmissiveRef.current, 0.12);
    });
  });

  // Auto-rotation
  useFrame((_, dt) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += rotateSpeed * dt;
    }
  });

  return { groupRef, containerRef };
}
