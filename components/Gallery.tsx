'use client';

import Image from 'next/image';
import TerraceDivider from './TerraceDivider';
import Reveal from './Reveal';
import { useLanguage } from './LanguageProvider';

const PHOTOS = [
  { src: '/images/IMG_5615.jpg', alt: 'Ταράτσα με σκάλα και θέα', tall: true },
  { src: '/images/IMG_5624.jpg', alt: 'Κουζίνα με κίτρινους πέτρινους τοίχους' },
  { src: '/images/IMG_5625.jpg', alt: 'Σαλόνι με κόκκινο χαλί' },
  { src: '/images/IMG_5617.jpg', alt: 'Παράθυρο με θέα και κρεβάτι', tall: true },
  { src: '/images/IMG_5620.jpg', alt: 'Πήλινη κανάτα σε πέτρινη κόγχη' },
  { src: '/images/IMG_5623.jpg', alt: 'Παλιό δέντρο στο κτήμα' },
  { src: '/images/IMG_5618.jpg', alt: 'Λεπτομέρεια σιδερένιας πύλης' },
  { src: '/images/IMG_5631.jpg', alt: 'Μονοπάτι με γιούκα δίπλα σε πέτρινο τοίχο' },
];

export default function Gallery() {
  const { t } = useLanguage();

  return (
    <section id="gallery" className="bg-limestone-50">
      <TerraceDivider />

      <div className="container pb-24 sm:pb-32">
        <Reveal>
          <p className="eyebrow mb-4 text-olive">{t('gallery_eyebrow')}</p>
          <h2 className="max-w-xl font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {t('gallery_h2_1')} <span className="italic text-copper">{t('gallery_h2_2')}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {PHOTOS.map((photo, i) => (
            <Reveal
              key={photo.src}
              delay={(i % 4) * 80}
              className={`overflow-hidden rounded-sm bg-limestone-200 ${
                photo.tall ? 'row-span-2' : 'aspect-square'
              }`}
            >
              <div className={`relative h-full w-full ${photo.tall ? 'aspect-auto min-h-[16rem]' : 'aspect-square'}`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(min-width: 640px) 25vw, 50vw"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
