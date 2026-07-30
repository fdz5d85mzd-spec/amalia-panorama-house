'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from './LanguageProvider';

export default function Hero() {
  const { t } = useLanguage();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        {reducedMotion ? (
          <Image
            src="/images/IMG_5613.jpg"
            alt="Πανοραμική θέα προς τη θάλασσα από τους λόφους του Σουνίου"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/IMG_5613.jpg"
            aria-hidden="true"
            className="h-full w-full object-cover"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        )}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/75 via-ink/15 to-ink/35"
      />

      <div className="container relative z-10 pb-20 pt-40 sm:pb-28">
        <p className="eyebrow mb-6 animate-[heroFadeUp_0.8s_ease-out_forwards] text-limestone-100/80 opacity-0">
          {t('hero_eyebrow')}
        </p>

        <h1 className="max-w-3xl animate-[heroFadeUp_0.9s_ease-out_0.15s_forwards] font-display text-4xl leading-[1.1] text-limestone-50 opacity-0 drop-shadow-lg sm:text-6xl lg:text-7xl">
          {t('hero_h1_line1')}
          <br />
          <span className="italic text-limestone-100/95">{t('hero_h1_line2')}</span>
        </h1>

        <p className="mt-8 max-w-md animate-[heroFadeUp_0.9s_ease-out_0.3s_forwards] font-body text-base leading-relaxed text-limestone-100/90 opacity-0 sm:text-lg">
          {t('hero_sub')}
        </p>

        <div className="mt-10 flex animate-[heroFadeUp_0.9s_ease-out_0.45s_forwards] flex-wrap items-center gap-6 opacity-0">
          <a
            href="#book"
            className="rounded-full bg-limestone-50 px-7 py-3 eyebrow text-ink transition-colors hover:bg-copper hover:text-limestone-50"
          >
            {t('hero_cta1')}
          </a>
          <a
            href="#rooms"
            className="eyebrow text-limestone-100/80 underline-offset-4 hover:underline"
          >
            {t('hero_cta2')}
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-limestone-100/70 sm:flex">
        <span className="eyebrow">{t('hero_scroll')}</span>
        <span className="h-10 w-px animate-pulse bg-limestone-100/50" />
      </div>
    </section>
  );
}
