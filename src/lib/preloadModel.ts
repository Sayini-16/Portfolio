// Kicks off an early fetch of the 3D model so it’s cached
// by the time the canvas mounts. Safe to import for side effects.
import { useGLTF, useFBX } from "@react-three/drei";

const url = (import.meta as any).env.VITE_MODEL_URL as string | undefined;

if (url) {
  const isFBX = url.toLowerCase().endsWith(".fbx");
  try {
    if (isFBX) useFBX.preload(url);
    else useGLTF.preload(url);
  } catch {}
}

export {};

