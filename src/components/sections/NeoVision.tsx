import { ProductMedia } from '@/components/ProductMedia';
import { productVideos } from '@/lib/productVideos';
import GradientWaves from '@/components/effects/GradientWaves';

export function NeoVision() {
  return (
    <section className="section product product-vision" id="neo-vision">
      <div className="neo-vision-background" aria-hidden="true" inert>
        <GradientWaves
          horizonColor="#321252"
          waveColor="#9B4DE0"
          crestColor="#F784DC"
          speed={0.22}
          amplitude={2.5}
          brightness={1.2}
          opacity={0.95}
          fogDepth={28}
          detail="low"
          grain={false}
          mouseInteraction={false}
        />
      </div>
      <div className="container product-grid">
        <div className="product-copy"><p className="eyebrow">03 / MEET NEO VISION™</p><h2>Your cameras.<br /><span>A smarter perspective.</span></h2><p>Meet your Eagle Eye Partner. Neo Vision turns conventional CCTV into intelligent surveillance — using the cameras you already have.</p><ul className="feature-list"><li>Real-time event detection and monitoring</li><li>Automated alerts and notifications</li><li>Actionable insights through AI video analytics</li><li>Designed for enterprises, smart cities and industry</li></ul><a className="button" href="#contact">Talk to us about Neo Vision <span aria-hidden="true">↗</span></a></div>
        <ProductMedia title="NEO VISION" poster="/assets/flood-dashboard.webp" posterAlt="Neo Vision dashboard displaying CCTV flood monitoring and water level information" video={productVideos.neoVision} frame="laptop" autoPlay caption="From footage to foresight." description="Connected monitoring. Clearer decisions." />
      </div>
    </section>
  );
}
