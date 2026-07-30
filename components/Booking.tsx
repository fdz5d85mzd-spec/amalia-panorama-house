'use client';

import TerraceDivider from './TerraceDivider';
import Reveal from './Reveal';
import { useLanguage } from './LanguageProvider';
import { AIRBNB_URL } from '@/lib/site';

export default function Booking() {
  const { t } = useLanguage();

  return (
    <section id="book" className="bg-limestone-100/60">
      <TerraceDivider />

      <div className="container pb-24 text-center sm:pb-32">
        <Reveal className="mx-auto max-w-2xl">
          <p className="eyebrow mb-4 text-olive">{t('book_eyebrow')}</p>
          <h2 className="font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {t('book_h2_1')} <span className="italic text-copper">{t('book_h2_2')}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md font-body leading-relaxed text-ink-soft/90">
            {t('book_copy')}
          </p>

          <div className="mt-10 flex flex-col items-center gap-5">
            <a
              href={AIRBNB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink px-8 py-4 eyebrow text-limestone-50 transition-colors hover:bg-copper"
            >
              {t('book_cta_airbnb')}
            </a>
            <a
              href="/contact"
              className="eyebrow text-ink-soft/80 underline-offset-4 hover:underline"
            >
              {t('book_cta_contact')}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
