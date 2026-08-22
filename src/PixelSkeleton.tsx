"use client";

import { useEffect, useRef } from "react";

export type PixelSkeletonProps = {
  className?: string;
  circular?: boolean;
  squareSize?: number;
  gridGap?: number;
  color?: string;
  maxOpacity?: number;
  sweepDuration?: number;
  sweepWidth?: number;
  sweepNoise?: number;
};

/**
 * Canvas-based pixel-sweep skeleton. The animation runs entirely inside
 * requestAnimationFrame — no React state, so no re-render per frame.
 */
export function PixelSkeleton({
  className = "",
  circular = false,
  squareSize = 4,
  gridGap = 2,
  color = "var(--text-color-cui-secondary)",
  maxOpacity = 0.05,
  sweepDuration = 1.5,
  sweepWidth = 0.4,
  sweepNoise = 0.1,
}: PixelSkeletonProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = squareSize + gridGap;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    // Canvas fillStyle cannot resolve CSS variables — read it from computed style.
    let fill = color;
    if (fill.startsWith("var(")) {
      const name = fill.slice(4, -1).trim();
      fill = getComputedStyle(wrapper).getPropertyValue(name).trim() || "#eeeaf0";
    }

    let columns = 1;
    let rows = 1;
    let noise = new Float32Array(0);
    let raf = 0;
    let startTime = 0;

    const resize = () => {
      const { width, height } = wrapper.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      columns = Math.max(1, Math.ceil(width / cellSize));
      rows = Math.max(1, Math.ceil(height / cellSize));
      noise = new Float32Array(columns * rows);
      for (let i = 0; i < noise.length; i++) {
        noise[i] = (Math.random() - 0.5) * 2 * sweepNoise;
      }
    };

    const draw = (time: number) => {
      if (!startTime) startTime = time;
      const progress = ((time - startTime) / 1000 / sweepDuration) % 1;
      const sweepPosition = progress * (1 + sweepWidth * 2) - sweepWidth;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = fill;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const index = row * columns + col;
          const normalizedX = columns > 1 ? col / (columns - 1) : 0.5;
          const distance = Math.abs(normalizedX + noise[index] - sweepPosition);
          let strength = Math.max(0, 1 - distance / sweepWidth);
          strength = strength * strength * (3 - 2 * strength);
          const opacity = strength * maxOpacity;
          if (opacity < 0.01) continue;
          ctx.globalAlpha = opacity;
          ctx.fillRect(col * cellSize * dpr, row * cellSize * dpr, squareSize * dpr, squareSize * dpr);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      draw(time);
    };

    const start = () => {
      if (!raf) {
        startTime = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    intersectionObserver.observe(wrapper);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [squareSize, gridGap, color, maxOpacity, sweepDuration, sweepWidth, sweepNoise]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={`relative overflow-hidden bg-[#29272d] ${circular ? "rounded-full" : "rounded-[2px]"} ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
