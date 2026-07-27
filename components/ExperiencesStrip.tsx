'use client';

import TerraceDivider from './TerraceDivider';
import Reveal from './Reveal';
import { useLanguage } from './LanguageProvider';

export default function ExperiencesStrip() {
  const { t } = useLanguage();

  const EXPERIENCES = [
    { time: '10′', name: t('exp1_name'), copy: t('exp1_copy') },
    { time: '15′', name: t('exp2_name'), copy: t('exp2_copy') },
    { time: '20′', name: t('exp3_name'), copy: t('exp3_copy') },
  ];

  return (
    <section id="experiences" className="bg-wine-deep text-limestone-100">
      <TerraceDivider tone="bg-limestone-100/20" />

      <div className="container pb-24 sm:pb-32">
        <Reveal>
          <p className="eyebrow mb-4 text-limestone-100/50">{t('exp_eyebrow')}</p>
          <h2 className="max-w-xl font-display text-3xl leading-tight text-limestone-50 sm:text-4xl lg:text-5xl">
            {t('exp_h2_1')} <span className="italic text-copper-light">{t('exp_h2_2')}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-sm bg-limestone-100/10 sm:grid-cols-3">
          {EXPERIENCES.map((exp, i) => (
            <Reveal key={exp.name} delay={i * 100} className="h-full">
              <div className="h-full bg-wine-deep p-8">
                <p className="font-mono text-3xl text-copper-light">{exp.time}</p>
                <h3 className="mt-4 font-display text-xl text-limestone-50">{exp.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-limestone-100/70">{exp.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
