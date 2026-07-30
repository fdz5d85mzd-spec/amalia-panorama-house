'use client';

import PageHero from './PageHero';
import FaqAccordion from './FaqAccordion';
import { useLanguage } from './LanguageProvider';

export default function FaqContent() {
  const { t } = useLanguage();

  const ITEMS = [
    { q: t('faq_q1'), a: t('faq_a1') },
    { q: t('faq_q2'), a: t('faq_a2') },
    { q: t('faq_q3'), a: t('faq_a3') },
    { q: t('faq_q4'), a: t('faq_a4') },
    { q: t('faq_q5'), a: t('faq_a5') },
    { q: t('faq_q6'), a: t('faq_a6') },
    { q: t('faq_q7'), a: t('faq_a7') },
  ];

  return (
    <>
      <PageHero eyebrow={t('faq_eyebrow')} title={t('faq_h1')} intro={t('faq_intro')} />
      <section className="bg-limestone-50">
        <div className="container pb-24 sm:pb-32">
          <FaqAccordion items={ITEMS} />
        </div>
      </section>
    </>
  );
}
