'use client';

import PageHero from './PageHero';
import TerraceDivider from './TerraceDivider';
import Reveal from './Reveal';
import ContactForm from './ContactForm';
import { useLanguage } from './LanguageProvider';
import { AIRBNB_URL, CONTACT_EMAIL } from '@/lib/site';

export default function ContactContent() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero eyebrow={t('contact_eyebrow')} title={t('contact_h1')} intro={t('contact_intro')} />

      <section className="bg-limestone-50">
        <TerraceDivider />
        <div className="container grid gap-16 pb-24 sm:pb-32 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-sm border border-ink/10 bg-limestone-100/60 p-8">
              <p className="eyebrow text-ink/40">{t('contact_direct_h2')}</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-3 block font-display text-xl text-copper hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              <p className="mt-2 text-sm text-ink-soft/70">{t('footer_host')}</p>

              <div className="mt-8 border-t border-ink/10 pt-6">
                <p className="eyebrow text-ink/40">{t('book_eyebrow')}</p>
                <a
                  href={AIRBNB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block eyebrow text-ink-soft/80 underline-offset-4 hover:underline"
                >
                  {t('book_cta_airbnb')} →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
