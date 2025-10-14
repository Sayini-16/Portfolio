import React, { useEffect, useRef } from "react";
import { themes } from "../lib/themes";
import type { ThemeKey } from "../lib/themes";

interface NetworkGraphProps {
  currentTheme: (typeof themes)[ThemeKey];
}

// Minimal network (nodes + edges) overlay
export const NetworkGraph: React.FC<NetworkGraphProps> = ({ currentTheme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const cursorRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

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

    const width = () => canvas.width / dpr;
    const height = () => canvas.height / dpr;

    const prefersReduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const N = prefersReduce ? 24 : 40; // nodes
    const nodes = new Array(N).fill(0).map(() => ({
      x: Math.random() * width(),
      y: Math.random() * height(),
      vx: (Math.random() - 0.5) * (prefersReduce ? 0.25 : 0.4),
      vy: (Math.random() - 0.5) * (prefersReduce ? 0.25 : 0.4),
    }));
    const maxDist = prefersReduce ? 110 : 130;
    const nodeColor = currentTheme.primary || "#4ade80";
    let t = 0;

    const tick = () => {
      const w = width();
      const h = height();
      ctx.clearRect(0, 0, w, h);

      // edges
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < maxDist) {
            const alpha = 1 - d / maxDist;
            // subtle breathing of edges
            const pulse = 0.85 + 0.15 * Math.sin(t + (i + j) * 0.05);
            ctx.strokeStyle = `rgba(255,255,255,${(0.06 + alpha * 0.18) * pulse})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      ctx.fillStyle = nodeColor;
      const cursor = cursorRef.current;
      if (cursor.active) {
        // draw influence circle
        ctx.beginPath();
        ctx.arc(cursor.x, cursor.y, 80, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      nodes.forEach((n) => {
        // gentle attraction towards cursor
        if (cursor.active) {
          const dx = cursor.x - n.x;
          const dy = cursor.y - n.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120 && dist > 1) {
            const f = (prefersReduce ? 0.015 : 0.025) * (1 - dist / 120);
            n.vx += dx * f * 0.01;
            n.vy += dy * f * 0.01;
          }
        }
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        ctx.beginPath();
        const r = 2 + 0.6 * Math.sin(t * 0.5 + n.x * 0.02);
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      t += prefersReduce ? 0.02 : 0.035;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    const onEnter = () => { cursorRef.current.active = true; };
    const onLeave = () => { cursorRef.current.active = false; };
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursorRef.current.x = e.clientX - rect.left;
      cursorRef.current.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mouseenter', onEnter);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('mousemove', onMove);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener('mouseenter', onEnter);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('mousemove', onMove);
    };
  }, [currentTheme.primary]);

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-60" aria-hidden />;
};
