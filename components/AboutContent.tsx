'use client';

import Image from 'next/image';
import PageHero from './PageHero';
import TerraceDivider from './TerraceDivider';
import Reveal from './Reveal';
import { useLanguage } from './LanguageProvider';

export default function AboutContent() {
  const { t } = useLanguage();

  const VALUES = [
    { h: t('about_value1_h'), p: t('about_value1_p') },
    { h: t('about_value2_h'), p: t('about_value2_p') },
    { h: t('about_value3_h'), p: t('about_value3_p') },
  ];

  return (
    <>
      <PageHero eyebrow={t('about_eyebrow')} title={t('about_h1')} intro={t('about_intro')} />

      <section className="bg-limestone-50">
        <TerraceDivider />
        <div className="container grid items-center gap-12 pb-24 sm:pb-32 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal className="overflow-hidden rounded-sm">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/images/IMG_5630.jpg"
                alt="Πέτρινος τοίχος και παλιά ξύλινη πόρτα του σπιτιού"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">
              {t('about_story_h2_1')} <span className="italic text-copper">{t('about_story_h2_2')}</span>
            </h2>
            <div className="mt-6 space-y-6 font-body leading-relaxed text-ink-soft/90">
              <p>{t('about_story_p1')}</p>
              <p>{t('about_story_p2')}</p>
              <p>{t('about_story_p3')}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-wine-deep text-limestone-100">
        <TerraceDivider tone="bg-limestone-100/20" />
        <div className="container pb-24 sm:pb-32">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-4 text-limestone-100/50">{t('about_host_h2')}</p>
            <p className="font-display text-2xl leading-relaxed text-limestone-50 sm:text-3xl">
              {t('about_host_p')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-limestone-100/60">
        <TerraceDivider />
        <div className="container pb-24 sm:pb-32">
          <Reveal>
            <p className="eyebrow mb-4 text-olive">{t('about_values_h2')}</p>
          </Reveal>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.h} delay={i * 100}>
                <h3 className="font-display text-xl">{v.h}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft/90">{v.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
