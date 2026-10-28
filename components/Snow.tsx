"use client";

import { useEffect, useRef } from "react";

const MAX_FLAKES = 160;

/** Falling snow over the sky; density rises as the temperature drops below freezing. */
export function Snow({ intensity }: { intensity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const level = useRef(intensity);
  level.current = intensity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const flakes = Array.from({ length: MAX_FLAKES }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1 + Math.random() * 2.4,
      speed: 0.5 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const n = Math.round(MAX_FLAKES * level.current);
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      for (let i = 0; i < n; i++) {
        const f = flakes[i];
        f.y += f.speed;
        f.x += Math.sin(t / 1200 + f.phase) * 0.35;
        if (f.y > h + 4) {
          f.y = -4;
          f.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
