import { CrystalizedLogo } from '@/components/effects/CrystalizedLogo';
import ParticleText from '@/components/effects/ParticleText';
import { heroGather } from '@/components/effects/heroAnimation';
import Aurora from '@/components/effects/Aurora';

export function Hero() {
  return (
    <section className="hero hero--centered" aria-labelledby="hero-title">
      <div className="hero-aurora" aria-hidden="true">
        <Aurora
          colorStops={['#7431BC', '#F25BD0', '#8B45DB']}
          amplitude={1.5}
          blend={0.45}
          speed={0.8}
          height={0.42}
          glow={0.8}
          brightness={1.15}
          layers={2}
          opacity={0.8}
          mouseInteraction
        />
      </div>
      <div className="container hero-brand">
        <h1 id="hero-title" className="sr-only">Iotnect</h1>
        <div className="hero-brand-frame">
          <CrystalizedLogo src="/assets/iotnect-logo.jpeg" color="#F25BD0" size={0.77} crackle={0.85} fill={0.5} interactive hoverStrength={0.7} />
        </div>
        <div className="hero-wordmark" aria-hidden="true">
          <ParticleText
            text="Iotnect"
            fontSize="clamp(3.5rem, 9vw, 6rem)"
            fontWeight={800}
            fontFamily="Manrope, sans-serif"
            color="#F7E8FF"
            highlightColor="#F25BD0"
            particleSize={2}
            density={3}
            scatter={heroGather.scatter}
            gatherDuration={heroGather.duration}
            stagger={heroGather.stagger}
            pointerRepel={28}
            repelRadius={90}
            idleDrift={0.5}
            trigger="mount"
            glow
          />
        </div>
        <p className="hero-brand-tagline">INTELLIGENCE. CONNECTED.</p>
        <a className="hero-scroll" href="#introduction">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
