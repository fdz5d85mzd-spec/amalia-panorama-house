'use client';

import Image from 'next/image';
import TerraceDivider from './TerraceDivider';
import Reveal from './Reveal';
import { useLanguage } from './LanguageProvider';

export default function Rooms() {
  const { t } = useLanguage();

  const ROOMS = [
    {
      photo: '/images/IMG_5616.jpg',
      alt: 'Κρεβατοκάμαρα με θέα και ανεμιστήρα οροφής',
      tag: t('room1_tag'),
      name: t('room1_name'),
      detail: t('room1_detail'),
      copy: t('room1_copy'),
    },
    {
      photo: '/images/IMG_5619.jpg',
      alt: 'Πέτρινο καθιστικό-υπνοδωμάτιο με δύο κρεβάτια και καναπέ',
      tag: t('room2_tag'),
      name: t('room2_name'),
      detail: t('room2_detail'),
      copy: t('room2_copy'),
    },
  ];

  return (
    <section id="rooms" className="bg-limestone-100/60">
      <TerraceDivider />

      <div className="container pb-24 sm:pb-32">
        <Reveal>
          <p className="eyebrow mb-4 text-olive">{t('rooms_eyebrow')}</p>
          <h2 className="max-w-xl font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {t('rooms_h2_1')} <span className="italic text-copper">{t('rooms_h2_2')}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {ROOMS.map((room, i) => (
            <Reveal key={room.name} delay={i * 120}>
              <div className="group h-full overflow-hidden rounded-sm border border-ink/10 bg-limestone-50 transition-colors hover:border-copper/40">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={room.photo}
                    alt={room.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 768px) 45vw, 100vw"
                  />
                </div>
                <div className="p-8">
                  <p className="eyebrow text-ink/40">{room.tag}</p>
                  <h3 className="mt-3 font-display text-2xl">{room.name}</h3>
                  <p className="eyebrow mt-2 text-copper">{room.detail}</p>
                  <p className="mt-5 font-body leading-relaxed text-ink-soft/90">{room.copy}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
