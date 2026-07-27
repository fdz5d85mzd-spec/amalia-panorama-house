'use client';

import Image from 'next/image';
import TerraceDivider from './TerraceDivider';
import Reveal from './Reveal';
import { useLanguage } from './LanguageProvider';

export default function Introduction() {
  const { t } = useLanguage();

  return (
    <section id="house" className="bg-limestone-50">
      <TerraceDivider />

      <div className="container grid items-center gap-12 pb-24 sm:pb-32 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <p className="eyebrow mb-4 text-olive">{t('intro_eyebrow')}</p>
          <h2 className="font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {t('intro_h2_1')} <span className="italic text-copper">{t('intro_h2_2')}</span>
          </h2>
          <div className="mt-6 space-y-6 font-body leading-relaxed text-ink-soft/90">
            <p>{t('intro_p1')}</p>
            <p>{t('intro_p2')}</p>
            <p>{t('intro_p3')}</p>
          </div>
        </Reveal>

        <Reveal delay={150} className="order-1 overflow-hidden rounded-sm lg:order-2">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src="/images/IMG_5611.jpg"
              alt="Η πέτρινη πρόσοψη του σπιτιού με τη σκάλα προς τη ταράτσα"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
