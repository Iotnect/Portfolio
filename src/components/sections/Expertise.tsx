import { CapabilityCard } from '@/components/CapabilityCard';
import { SectionHeading } from '@/components/SectionHeading';
import { capabilities } from '@/lib/content';

export function Expertise() {
  return (
    <section className="section expertise" id="expertise">
      <div className="container">
        <SectionHeading eyebrow="02 / OUR EXPERTISE" title={['Connected capabilities.', 'Complete possibilities.']} description={['From the physical world to digital insights,', 'we bring the pieces together.']} />
        <div className="capability-grid">
          {capabilities.map(capability => <CapabilityCard key={capability.number} capability={capability} />)}
        </div>
      </div>
    </section>
  );
}
