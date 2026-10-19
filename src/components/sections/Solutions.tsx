import { SectionHeading } from '@/components/SectionHeading';
import { SolutionCard } from '@/components/SolutionCard';
import { solutions } from '@/lib/content';

export function Solutions() {
  return (
    <section className="section solutions" id="solutions">
      <div className="container">
        <SectionHeading eyebrow="05 / REAL-WORLD APPLICATIONS" title={['One vision.', 'Many possibilities.']} description={['Purpose-built intelligence for the places,', 'people and processes that matter.']} />
        <div className="solution-grid">
          {solutions.map(solution => <SolutionCard key={solution.category} solution={solution} />)}
        </div>
      </div>
    </section>
  );
}
