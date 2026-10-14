'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import './Aurora.css';

export interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  speed?: number;
  time?: number;
  height?: number;
  scale?: number;
  glow?: number;
  brightness?: number;
  layers?: number;
  direction?: 'top' | 'bottom';
  mouseInteraction?: boolean;
  intro?: boolean;
  opacity?: number;
  lightMode?: boolean;
  paused?: boolean;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
}

type RGB = readonly [number, number, number];

function parseColor(hex: string): RGB {
  let value = hex.trim().replace('#', '');
  if (value.length === 3) value = [...value].map(c => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(value)) return [116, 49, 188];
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)];
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export default function Aurora({
  colorStops = ['#7431BC', '#F25BD0', '#8B45DB'],
  amplitude = 1, blend = 0.5, speed = 1, time,
  height = 0.45, scale = 1, glow = 0.6, brightness = 1,
  layers = 2, direction = 'top', mouseInteraction = true, intro = true,
  opacity = 1, lightMode = false, paused = false, dpr = 1,
  className = '', style,
}: AuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef({ colorStops, amplitude, blend, speed, time, height, scale, glow, brightness, layers, direction, mouseInteraction, intro, opacity, lightMode, paused, dpr });
  settingsRef.current = { colorStops, amplitude, blend, speed, time, height, scale, glow, brightness, layers, direction, mouseInteraction, intro, opacity, lightMode, paused, dpr };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!container || !canvas || !ctx) return;
    let width = 1, viewHeight = 1;
    let clock = 0, reveal = 0;
    let raf = 0, last = 0, visible = true;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: 0.5, targetX: 0.5, strength: 0, inside: false };
    const pointerSurface = container.closest('.hero--centered') ?? container;
    let cachedStops = '';
    let palette: RGB[] = [];

    const draw = () => {
      const s = settingsRef.current;
      const key = s.colorStops.join('|');
      if (key !== cachedStops || !palette.length) {
        cachedStops = key;
        palette = s.colorStops.length ? s.colorStops.map(parseColor) : [[116, 49, 188], [242, 91, 208]];
      }
      ctx.clearRect(0, 0, width, viewHeight);
      ctx.globalCompositeOperation = 'screen';
      const t = s.time ?? clock;
      const fade = !s.intro || motion.matches ? 1 : 1 - (1 - Math.min(1, reveal / 2.4)) ** 3;
      ctx.globalAlpha = clamp(s.opacity, 0, 1) * Math.min(1.5, Math.max(0, s.brightness)) * fade * (s.lightMode ? 0.7 : 1);
      const columns = Math.ceil(width / 5);
      const columnWidth = width / columns;
      const layerCount = Math.round(clamp(s.layers, 1, 3));
      for (let layer = 0; layer < layerCount; layer++) {
        for (let column = 0; column < columns; column++) {
          const x = column * columnWidth;
          const u = x / width;
          const fieldX = (x - width / 2) / viewHeight * Math.max(0.1, s.scale);
          const wave = Math.sin(fieldX * 2.4 + t * 0.35 + layer * 2.1) * 0.48
            + Math.sin(fieldX * 5.2 - t * 0.23 + layer * 1.8) * 0.28
            + Math.sin(fieldX * 8.3 + t * 0.16 + layer * 4.5) * 0.12;
          const reach = Math.exp(-((u - pointer.x) ** 2) / 0.035) * 0.06 * pointer.strength;
          const hem = viewHeight * (clamp(s.height, 0, 1) + layer * 0.075 + wave * 0.12 * Math.max(0, s.amplitude) + reach);
          const centre = s.direction === 'bottom' ? viewHeight - hem : hem;
          const spread = viewHeight * (0.14 + clamp(s.blend, 0, 1) * 0.12 + s.glow * 0.025);
          const position = clamp(u + layer * 0.09 + Math.sin(t * 0.12) * 0.05, 0, 1) * (palette.length - 1);
          const index = Math.min(Math.floor(position), palette.length - 1);
          const a = palette[index], b = palette[Math.min(index + 1, palette.length - 1)];
          const mix = position - index;
          const rgb = a.map((v, i) => Math.round(v + (b[i] - v) * mix)).join(',');
          const thread = 0.7 + Math.sin(x * 0.035 + t * 0.4 + layer) * 0.18;
          const strength = thread * (layer === 0 ? 1 : 0.55);
          const gradient = ctx.createLinearGradient(0, centre - spread * 1.6, 0, centre + spread);
          gradient.addColorStop(0, `rgba(${rgb},0)`);
          gradient.addColorStop(0.35, `rgba(${rgb},${strength * 0.12})`);
          gradient.addColorStop(0.65, `rgba(${rgb},${strength * 0.42})`);
          gradient.addColorStop(0.78, `rgba(${rgb},${strength * 0.7})`);
          gradient.addColorStop(0.86, `rgba(${rgb},${strength * 0.38})`);
          gradient.addColorStop(1, `rgba(${rgb},0)`);
          ctx.fillStyle = gradient;
          ctx.fillRect(x, centre - spread * 1.6, columnWidth + 0.5, spread * 2.6);
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; last = 0; };
    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (last && now - last < 1000 / 30) { raf = requestAnimationFrame(frame); return; }
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 1 / 30;
      last = now;
      const s = settingsRef.current;
      // Ease position and influence independently. Boundary events only change
      // targets, so leaving/re-entering never switches the ribbon displacement.
      const engaged = s.mouseInteraction && pointer.inside && !motion.matches;
      pointer.x += (pointer.targetX - pointer.x) * (1 - Math.exp(-dt / 0.7));
      pointer.strength += ((engaged ? 1 : 0) - pointer.strength)
        * (1 - Math.exp(-dt / (engaged ? 0.8 : 1.2)));
      if (!motion.matches && !s.paused) clock += dt * s.speed;
      reveal += dt;
      draw();
      if (!motion.matches && !s.paused) raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
    const resize = () => {
      width = Math.max(1, container.clientWidth);
      viewHeight = Math.max(1, container.clientHeight);
      const ratio = Math.min(settingsRef.current.dpr || 1, 1.5);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(viewHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(); start();
    };
    const move = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(1, rect.width);
      pointer.inside = x >= 0 && x <= 1 && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (pointer.inside) pointer.targetX = clamp(x, 0, 1);
    };
    const leave = () => { pointer.inside = false; };
    const out = (event: PointerEvent) => { if (!event.relatedTarget) leave(); };
    const release = (event: PointerEvent) => { if (event.pointerType !== 'mouse') leave(); };
    const visibility = () => { if (document.hidden) { leave(); stop(); } else start(); };
    const changeMotion = () => {
      stop();
      if (motion.matches) pointer.strength = 0;
      draw(); start();
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    const observer = new ResizeObserver(resize);
    observer.observe(container); intersection.observe(container);
    window.addEventListener('pointermove', move, { passive: true });
    pointerSurface.addEventListener('pointerleave', leave);
    window.addEventListener('pointerout', out);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', leave);
    window.addEventListener('blur', leave);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', changeMotion);
    resize();
    return () => {
      stop(); observer.disconnect(); intersection.disconnect();
      window.removeEventListener('pointermove', move);
      pointerSurface.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerout', out);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', leave);
      window.removeEventListener('blur', leave);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', changeMotion);
    };
  }, []);

  return <div ref={containerRef} className={`aurora-container ${className}`} style={style} data-renderer="canvas2d">
    <canvas ref={canvasRef} className="aurora-canvas" aria-hidden="true" />
  </div>;
}

