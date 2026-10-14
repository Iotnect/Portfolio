import { solutions } from '@/lib/content';
import FlexCarousel from './FlexCarousel';

const items = solutions.map(solution => ({
  src: solution.image,
  alt: solution.imageAlt,
  title: solution.title,
}));

export function ApplicationBackdrop() {
  return (
    <div className="application-backdrop" aria-hidden="true" inert>
      <div className="application-backdrop-flow">
      <div className="application-backdrop-fallback">
        <div className="application-backdrop-track">
          {[...solutions, ...solutions].map((solution, index) => (
            <img key={`${solution.category}-${index}`} src={solution.image} alt="" width={solution.width} height={solution.height} loading="lazy" draggable={false} />
          ))}
        </div>
      </div>
      <FlexCarousel
        items={items}
        preset="ribbon"
        intro="none"
        fit="landscape"
        cardHeight={0.25}
        gap={28}
        radius={16}
        bend={0.18}
        dispersion={0.16}
        squeeze={0}
        continuousSpeed={24}
        autoplay={false}
        captions={false}
        focusOnClick={false}
        followCursor={false}
        captureWheel={false}
        decorative
      />
      </div>
    </div>
  );
}
