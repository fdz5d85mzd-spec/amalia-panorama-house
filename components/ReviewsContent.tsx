'use client';

import PageHero from './PageHero';
import TerraceDivider from './TerraceDivider';
import Reveal from './Reveal';
import { useLanguage } from './LanguageProvider';
import { AIRBNB_URL } from '@/lib/site';

/**
 * No real guest reviews are wired in yet — the host will supply actual
 * Airbnb quotes to replace this empty state (see reviews_empty_copy).
 */
export default function ReviewsContent() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero eyebrow={t('reviews_eyebrow')} title={t('reviews_h1')} intro={t('reviews_intro')} />

      <section className="bg-limestone-50">
        <TerraceDivider />
        <div className="container pb-24 sm:pb-32">
          <Reveal className="mx-auto max-w-lg rounded-sm border border-ink/10 bg-limestone-100/60 p-12 text-center">
            <p className="font-display text-2xl">{t('reviews_empty_title')}</p>
            <p className="mt-4 leading-relaxed text-ink-soft/90">{t('reviews_empty_copy')}</p>
            <a
              href={AIRBNB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow mt-8 inline-block rounded-full border border-ink px-6 py-3 transition-colors hover:bg-ink hover:text-limestone-50"
            >
              {t('reviews_cta_airbnb')}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
