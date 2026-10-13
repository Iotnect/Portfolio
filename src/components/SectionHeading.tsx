type SectionHeadingProps = {
  eyebrow: string;
  title: readonly [string, string];
  description: readonly [string, string];
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div><p className="eyebrow">{eyebrow}</p><h2>{title[0]}<br />{title[1]}</h2></div>
      <p>{description[0]}<br />{description[1]}</p>
    </div>
  );
}
