'use client';

import { useEffect, useRef } from 'react';
import { heroGather } from './heroAnimation';

type Props = { src: string; size: number; enabled: boolean; onComplete: () => void };
type Particle = { x: number; y: number; dx: number; dy: number; seed: number; color: string };

export function ParticleLogoIntro({ src, size, enabled, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !container || !ctx) { onComplete(); return; }
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) { onComplete(); return; }

    let alive = true;
    let raf = 0;
    let elapsed = 0;
    let last = 0;
    let visible = true;
    let finished = false;
    let fontsReady = false;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    const image = new Image();
    const stop = () => { cancelAnimationFrame(raf); raf = 0; last = 0; };
    const finish = () => { finished = true; stop(); if (alive) onComplete(); };
    const frame = (now: number) => {
      raf = 0;
      if (!alive || finished || !visible || document.hidden) return;
      elapsed += last ? Math.min(now - last, 80) : 0;
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.shadowColor = '#F25BD0';
      ctx.shadowBlur = 5;
      for (const p of particles) {
        const progress = Math.min(1, Math.max(0, (elapsed - p.seed * heroGather.stagger) / heroGather.duration));
        const eased = 1 - (1 - progress) ** 3;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.35 + progress * 0.65;
        ctx.fillRect(p.x + p.dx * (1 - eased) - 1, p.y + p.dy * (1 - eased) - 1, 2.2, 2.2);
      }
      ctx.globalAlpha = 1;
      if (elapsed >= heroGather.duration + heroGather.stagger + 180) finish();
      else raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (alive && !finished && visible && !document.hidden && particles.length && !raf) {
        raf = requestAnimationFrame(frame);
      }
    };
    const build = () => {
      if (!image.naturalWidth || !fontsReady || finished) return;
      const rect = container.getBoundingClientRect();
      width = rect.width; height = rect.height;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const fit = Math.min(width / image.naturalWidth, height / image.naturalHeight) * Math.min(0.9, Math.max(0.2, size));
      const w = Math.max(1, Math.round(image.naturalWidth * fit));
      const h = Math.max(1, Math.round(image.naturalHeight * fit));
      const sampler = document.createElement('canvas');
      sampler.width = w; sampler.height = h;
      const sample = sampler.getContext('2d', { willReadFrequently: true });
      if (!sample) { finish(); return; }
      sample.drawImage(image, 0, 0, w, h);
      const data = sample.getImageData(0, 0, w, h).data;
      particles = [];
      // Sample the same coloured strokes as the plasma shader, excluding white.
      const step = Math.max(3, Math.ceil(Math.sqrt(w * h / 18_000)));
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const i = (y * w + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2];
          if (Math.max(r, g, b) - Math.min(r, g, b) < 76) continue;
          const index = particles.length;
          const seed = ((index * 9301 + 49297) % 233280) / 233280;
          const depth = 0.45 + (((index * 233 + 97) % 1000) / 1000) * 0.9;
          const angle = seed * Math.PI * 2;
          const distance = heroGather.scatter * (0.35 + depth * 0.75);
          particles.push({
            x: (width - w) / 2 + x, y: (height - h) / 2 + y, seed,
            dx: Math.cos(angle) * distance + (seed - 0.5) * heroGather.scatter * 0.45,
            dy: Math.sin(angle) * distance + (depth - 0.9) * heroGather.scatter * 0.45,
            color: `rgb(${Math.min(255, r + 75)}, ${Math.min(255, g + 55)}, ${Math.min(255, b + 80)})`,
          });
        }
      }
      if (!particles.length) finish(); else start();
    };
    const visibility = () => { if (document.hidden) stop(); else start(); };
    const reduceMotion = () => { if (motion.matches) finish(); };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    const resize = new ResizeObserver(build);
    intersection.observe(container); resize.observe(container);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', reduceMotion);
    image.onload = async () => {
      // Match the wordmark's font-ready start rather than playing ahead of it.
      try { await document.fonts.load('800 96px Manrope'); await document.fonts.ready; } catch { /* use available font */ }
      if (alive) { fontsReady = true; build(); }
    };
    image.onerror = finish;
    image.src = src;
    return () => {
      alive = false; stop(); image.onload = null; image.onerror = null;
      resize.disconnect(); intersection.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', reduceMotion);
    };
  }, [enabled, onComplete, size, src]);

  return <canvas ref={canvasRef} className="logo-particle-intro" aria-hidden="true" />;
}
