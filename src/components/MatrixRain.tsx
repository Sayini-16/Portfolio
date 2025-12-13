import React, { useEffect, useRef } from "react";

interface MatrixRainProps {
  color?: string; // glyph color
  opacity?: number; // overall opacity [0..1]
  speed?: number; // fall speed multiplier, default 1
  className?: string;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ color = "#4ade80", opacity = 0.4, speed = 1, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const resize = () => {
      const parent = canvas.parentElement as HTMLElement | null;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const chars = "01{}[]<>/=+*#@$%&|".split("");
    const fontSize = 14;
    const width = () => canvas.width / dpr;
    const height = () => canvas.height / dpr;
    const cols = () => Math.ceil(width() / fontSize);
    let columns = new Array(cols()).fill(0).map(() => Math.random() * -50);

    let last = performance.now();
    const baseFall = 30; // rows per second at speed=1

    const draw = () => {
      const now = performance.now();
      const dt = Math.max(0, (now - last) / 1000);
      last = now;

      const w = width();
      const h = height();
      ctx.fillStyle = `rgba(0,0,0,${Math.min(0.12 * speed, 0.25)})`;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = color;
      ctx.globalAlpha = Math.max(0.1, Math.min(opacity, 1));
      ctx.font = `${fontSize}px Consolas, monospace`;

      const fall = baseFall * speed * dt; // rows to advance this frame

      // ensure columns array matches width
      const c = cols();
      if (columns.length !== c) {
        columns = new Array(c).fill(0).map(() => Math.random() * -50);
      }

      for (let i = 0; i < columns.length; i++) {
        const y = columns[i];
        const text = chars[(Math.random() * chars.length) | 0];
        const x = i * fontSize;
        ctx.fillText(text, x, y * fontSize);
        // reset after bottom with a small randomness window controlled by speed
        const atBottom = y * fontSize > h;
        const resetChance = Math.min(0.02 + speed * 0.01, 0.12);
        if (atBottom && Math.random() < resetChance) {
          columns[i] = (Math.random() * -30) | 0;
        } else {
          columns[i] = y + fall;
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [color, opacity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ pointerEvents: "none" }}
      aria-hidden
    />
  );
};

export default MatrixRain;

