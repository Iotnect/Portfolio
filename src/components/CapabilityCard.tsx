import type { Capability } from '@/lib/content';

export function CapabilityCard({ capability }: { capability: Capability }) {
  return (
    <article className="capability">
      <div className="capability-top"><span className="service-icon" aria-hidden="true">{capability.icon}</span><span>{capability.number}</span></div>
      <h3>{capability.title}</h3>
      <p>{capability.description}</p>
      <span className="service-tag">{capability.tagline}</span>
    </article>
  );
}
