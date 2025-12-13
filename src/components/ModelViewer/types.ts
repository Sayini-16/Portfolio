/**
 * ModelViewer Types - Shared type definitions
 */

export interface ModelViewerProps {
  url: string;
  className?: string;
  tintColor?: string;
  anchor?: "center" | "base" | "top";
  centerAxes?: "xyz" | "xy" | "xz" | "yz";
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  yOffset?: number;
  autoRotate?: boolean;
  rotateSpeed?: number;
  licenseHtml?: string;
  rainSpeed?: number;
  rainOpacity?: number;
}

export interface ModelComponentProps {
  url: string;
  tint?: string;
  anchor?: "center" | "base" | "top";
  centerAxes?: "xyz" | "xy" | "xz" | "yz";
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  yOffset?: number;
  autoRotate?: boolean;
  rotateSpeed?: number;
  onReady?: () => void;
}
