'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from './LanguageProvider';

type Photo = { src: string; alt: string };

export default function GalleryLightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const { t } = useLanguage();

  const goPrev = useCallback(
    () => onNavigate((index - 1 + photos.length) % photos.length),
    [index, photos.length, onNavigate]
  );
  const goNext = useCallback(
    () => onNavigate((index + 1) % photos.length),
    [index, photos.length, onNavigate]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, goPrev, goNext]);

  const photo = photos[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex flex-col bg-ink/95 p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label={t('gallery_lightbox_close')}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-limestone-50/80 transition-colors hover:bg-limestone-50/10 hover:text-limestone-50 sm:right-8 sm:top-8"
      >
        <span className="font-mono text-2xl leading-none">×</span>
      </button>

      <div
        className="relative flex flex-1 items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={goPrev}
          aria-label={t('gallery_lightbox_prev')}
          className="absolute left-0 z-10 flex h-12 w-12 items-center justify-center text-limestone-50/70 transition-colors hover:text-limestone-50"
        >
          <span className="font-mono text-3xl leading-none">‹</span>
        </button>

        <div className="relative h-full w-full max-w-4xl">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        <button
          onClick={goNext}
          aria-label={t('gallery_lightbox_next')}
          className="absolute right-0 z-10 flex h-12 w-12 items-center justify-center text-limestone-50/70 transition-colors hover:text-limestone-50"
        >
          <span className="font-mono text-3xl leading-none">›</span>
        </button>
      </div>

      <div
        className="mt-4 flex justify-center gap-2 overflow-x-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {photos.map((p, i) => (
          <button
            key={p.src}
            onClick={() => onNavigate(i)}
            className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-sm transition-opacity ${
              i === index ? 'opacity-100 ring-2 ring-copper' : 'opacity-50 hover:opacity-80'
            }`}
          >
            <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="56px" />
          </button>
        ))}
      </div>
    </div>
  );
}
