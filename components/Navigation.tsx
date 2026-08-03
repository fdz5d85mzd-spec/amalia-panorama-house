'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageProvider';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const hidden = pathname?.startsWith('/blackjack');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const solid = !isHome || scrolled || open;

  if (hidden) return null;

  const LINKS = [
    { href: '/#house', label: t('nav_house') },
    { href: '/#rooms', label: t('nav_rooms') },
    { href: '/#gallery', label: t('nav_gallery') },
    { href: '/#experiences', label: t('nav_experiences') },
    { href: '/contact', label: t('nav_contact') },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? 'bg-limestone-50/95 shadow-sm backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav className="container flex h-20 items-center justify-between gap-4">
        <a
          href="/#top"
          className={`font-display text-lg tracking-wide transition-colors duration-500 ${
            solid ? 'text-ink' : 'text-limestone-50'
          }`}
        >
          AmaLia <span className="italic text-copper">PanoRama</span>
        </a>

        <ul
          className={`hidden items-center gap-8 lg:flex ${
            solid ? 'text-ink' : 'text-limestone-50'
          }`}
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="eyebrow transition-opacity hover:opacity-70">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LanguageSwitcher solid={solid} />
          </div>
          <a
            href="/#book"
            className={`hidden rounded-full border px-5 py-2 eyebrow transition-colors lg:inline-block ${
              solid
                ? 'border-ink text-ink hover:bg-ink hover:text-limestone-50'
                : 'border-limestone-50 text-limestone-50 hover:bg-limestone-50 hover:text-ink'
            }`}
          >
            {t('nav_cta')}
          </a>

          <button
            aria-label={open ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`flex h-8 w-8 flex-col items-center justify-center gap-1.5 lg:hidden ${
              solid ? 'text-ink' : 'text-limestone-50'
            }`}
          >
            <span
              className={`h-px w-6 bg-current transition-transform duration-300 ${
                open ? 'translate-y-[3.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-px w-6 bg-current transition-transform duration-300 ${
                open ? '-translate-y-[3.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {open && (
        <div className="flex flex-col gap-6 border-t border-ink/10 bg-limestone-50 px-6 py-8 text-ink lg:hidden">
          <ul className="flex flex-col gap-6">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-2xl"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/#book"
            onClick={() => setOpen(false)}
            className="eyebrow inline-block self-start rounded-full border border-ink px-5 py-2"
          >
            {t('nav_cta')}
          </a>
          <div className="pt-2">
            <LanguageSwitcher solid={true} />
          </div>
        </div>
      )}
    </header>
  );
}
