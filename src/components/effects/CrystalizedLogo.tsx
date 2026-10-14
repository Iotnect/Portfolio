'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Mesh, Program, Renderer, Texture, Triangle } from 'ogl';
import { fragment, vertex } from './logoPlasmaShaders';
import { ParticleLogoIntro } from './ParticleLogoIntro';

type CrystalizedLogoProps = {
  src: string;
  color?: `#${string}`;
  size?: number;
  crackle?: number;
  fill?: number;
  interactive?: boolean;
  hoverStrength?: number;
};

export function CrystalizedLogo({
  src,
  color = '#F25BD0',
  size = 0.77,
  crackle = 0.85,
  fill = 0.5,
  interactive = true,
  hoverStrength = 0.7,
}: CrystalizedLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const completeIntro = useCallback(() => setIntroComplete(true), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setReady(false);
    setShowFallback(false);
    setIntroComplete(false);

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: true, premultipliedAlpha: true, depth: false, antialias: false,
        powerPreference: 'low-power', webgl: 2,
      });
    } catch (error) {
      setShowFallback(true);
      console.warn('IOTNECT plasma: WebGL is unavailable; showing the still logo.', error);
      return; // Keep the original logo visible if WebGL is unavailable.
    }
    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.className = 'plasma-logo-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const texture = new Texture(gl, {
      generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE, wrapT: gl.CLAMP_TO_EDGE, flipY: true,
    });
    // OGL also sets TEXTURE_WRAP_R on 2D textures. WebGL 1 has no such enum;
    // mark that unused state as configured to skip the invalid GL call.
    if (!renderer.isWebgl2) Object.assign(texture.state, { wrapR: texture.wrapR });
    const tint = /^#[0-9a-f]{6}$/i.test(color) ? color : '#F25BD0';
    const uniforms = {
      uLogo: { value: texture },
      uResolution: { value: [1, 1] },
      uLogoSize: { value: [897, 768] },
      uPointer: { value: [0.5, 0.5] },
      uColor: { value: [1, 3, 5].map(offset => parseInt(tint.slice(offset, offset + 2), 16) / 255) },
      uTime: { value: 0 },
      uCrackle: { value: Math.min(1, Math.max(0, crackle)) },
      uFill: { value: Math.min(1, Math.max(0, fill)) },
      uSize: { value: Math.min(0.9, Math.max(0.2, size)) },
      uHover: { value: 0 },
      uStrength: { value: Math.min(1, Math.max(0, hoverStrength)) },
      uReveal: { value: 1 },
    };
    const geometry = new Triangle(gl);
    const shaderVertex = renderer.isWebgl2
      ? '#version 300 es\n' + vertex.replace(/attribute /g, 'in ').replace('varying ', 'out ')
      : vertex;
    const shaderFragment = renderer.isWebgl2
      ? '#version 300 es\n' + fragment
          .replace('precision highp float;', 'precision highp float;\nout vec4 fragColor;')
          .replace('varying ', 'in ')
          .replace(/texture2D\(/g, 'texture(')
          .replace('gl_FragColor', 'fragColor')
      : fragment;
    const program = new Program(gl, { vertex: shaderVertex, fragment: shaderFragment, uniforms, depthTest: false, depthWrite: false });
    if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) {
      setShowFallback(true);
      console.warn('IOTNECT plasma: shader failed to compile.', gl.getProgramInfoLog(program.program));
      geometry.remove();
      program.remove();
      gl.deleteTexture(texture.texture);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return;
    }
    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(canvas);

    let alive = true;
    let loaded = false;
    let visible = true;
    let raf = 0;
    let time = 0;
    let last = 0;
    let hover = 0;
    let lastDraw = 0;
    const pointer = [0.5, 0.5];
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const image = new Image();

    const stop = () => { cancelAnimationFrame(raf); raf = 0; last = 0; };
    const draw = () => {
      uniforms.uTime.value = motion.matches ? 0 : time;
      uniforms.uReveal.value = 1;
      uniforms.uHover.value += ((motion.matches ? 0 : hover) - uniforms.uHover.value) * 0.08;
      uniforms.uPointer.value[0] += (pointer[0] - uniforms.uPointer.value[0]) * 0.08;
      uniforms.uPointer.value[1] += (pointer[1] - uniforms.uPointer.value[1]) * 0.08;
      renderer.render({ scene: mesh });
    };
    const frame = (now: number) => {
      raf = 0;
      if (!alive || !loaded || !visible || document.hidden || gl.isContextLost()) return;
      // Cap to 30fps; pause completely when the hero is out of view.
      if (now - lastDraw >= 1000 / 30) {
        time += last ? Math.min((now - last) / 1000, 0.1) : 0;
        last = now;
        lastDraw = now;
        draw();
      }
      if (!motion.matches) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!alive || !loaded || !visible || document.hidden || gl.isContextLost() || raf) return;
      if (motion.matches) { draw(); return; }
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.dpr = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(700_000 / (width * height)));
      renderer.setSize(width, height);
      uniforms.uResolution.value = [width, height];
      if (loaded) { draw(); start(); }
    };
    const move = (event: PointerEvent) => {
      if (!interactive || motion.matches) return;
      const rect = container.getBoundingClientRect();
      pointer[0] = (event.clientX - rect.left) / rect.width;
      pointer[1] = 1 - (event.clientY - rect.top) / rect.height;
      hover = 1;
    };
    const leave = () => { hover = 0; };
    const changeMotion = () => { stop(); start(); };
    const changeVisibility = () => { if (document.hidden) stop(); else start(); };
    const contextLost = (event: Event) => {
      event.preventDefault();
      stop();
      setReady(false);
      setShowFallback(true);
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    resizeObserver.observe(container);
    intersectionObserver.observe(container);
    container.addEventListener('pointermove', move, { passive: true });
    container.addEventListener('pointerleave', leave);
    container.addEventListener('pointerup', leave);
    canvas.addEventListener('webglcontextlost', contextLost);
    motion.addEventListener('change', changeMotion);
    document.addEventListener('visibilitychange', changeVisibility);

    image.onload = () => {
      if (!alive || gl.isContextLost()) return;
      texture.image = image;
      uniforms.uLogoSize.value = [image.naturalWidth, image.naturalHeight];
      loaded = true;
      // Only inspect errors from uploading/drawing the logo, not stale errors
      // from renderer setup or extension detection.
      for (let i = 0; i < 16 && gl.getError() !== gl.NO_ERROR; i++) { /* drain */ }
      resize();
      const error = gl.getError();
      if (error !== gl.NO_ERROR) {
        setShowFallback(true);
        console.warn('IOTNECT plasma: logo render failed with WebGL error', error);
        loaded = false;
        stop();
        return;
      }
      setReady(true);
      start();
    };
    image.onerror = () => {
      setShowFallback(true);
      console.warn('IOTNECT plasma: could not load logo texture:', src);
    };
    image.src = src;
    resize();

    return () => {
      alive = false;
      stop();
      image.onload = null;
      image.onerror = null;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener('pointermove', move);
      container.removeEventListener('pointerleave', leave);
      container.removeEventListener('pointerup', leave);
      canvas.removeEventListener('webglcontextlost', contextLost);
      motion.removeEventListener('change', changeMotion);
      document.removeEventListener('visibilitychange', changeVisibility);
      geometry.remove();
      program.remove();
      gl.deleteTexture(texture.texture);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  }, [src, color, size, crackle, fill, interactive, hoverStrength]);

  return (
    <div ref={containerRef} className="crystalized-logo" data-ready={ready} data-intro-complete={introComplete} role="img" aria-label="IOTNECT logo with an interactive purple and pink plasma glow">
      {showFallback && <img className="crystalized-logo-fallback" src={src} alt="" width={897} height={768} aria-hidden="true" />}
      <ParticleLogoIntro src={src} size={size} enabled={ready} onComplete={completeIntro} />
    </div>
  );
}
