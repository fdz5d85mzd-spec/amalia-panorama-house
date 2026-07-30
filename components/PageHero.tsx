import Reveal from './Reveal';

export default function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="bg-limestone-50">
      <div className="container pb-16 pt-40 sm:pb-20">
        <Reveal>
          <p className="eyebrow mb-4 text-olive">{eyebrow}</p>
          <h1 className="max-w-2xl font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-6 max-w-xl font-body leading-relaxed text-ink-soft/90">
              {intro}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
