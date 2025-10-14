import React, { useEffect, useRef } from "react";
import { themes } from "../lib/themes";
import type { ThemeKey } from "../lib/themes";

interface MatrixRainProps {
  currentTheme: (typeof themes)[ThemeKey];
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ currentTheme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const resize = () => {
      const parent = canvas.parentElement;
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
    const getCols = () => Math.ceil(canvas.width / (fontSize * dpr));
    let columns = new Array(getCols()).fill(0).map(() => Math.random() * -50);

    const primary = currentTheme.primary || "#4ade80";
    const bgFade = "rgba(0, 0, 0, 0.08)";

    const draw = () => {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // fade old frames
      ctx.fillStyle = bgFade;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = primary;
      ctx.font = `${fontSize}px Consolas, monospace`;
      columns.forEach((y, i) => {
        const text = chars[(Math.random() * chars.length) | 0];
        const x = i * fontSize;
        ctx.fillText(text, x, y * fontSize);
        // reset with random start for variety
        if (y * fontSize > height && Math.random() > 0.975) {
          columns[i] = (Math.random() * -30) | 0;
        }
        columns[i] = y + 1;
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [currentTheme.primary]);

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-50" aria-hidden />;
};

