import type { Solution } from '@/lib/content';

export function SolutionCard({ solution }: { solution: Solution }) {
  return (
    <article className="solution">
      <div className="solution-image">
        <img src={solution.image} alt={solution.imageAlt} width={solution.width} height={solution.height} loading="lazy" />
        <span>{solution.category}</span>
      </div>
      <div className="solution-content"><h3>{solution.title}</h3><p>{solution.description}</p></div>
    </article>
  );
}
