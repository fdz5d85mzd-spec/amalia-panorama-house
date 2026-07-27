'use client';

import TerraceDivider from './TerraceDivider';
import { useLanguage } from './LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-wine-deep text-limestone-100">
      <TerraceDivider tone="bg-limestone-100/20" />

      <div className="container grid gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl">
            AmaLia <span className="italic text-copper-light">PanoRama</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-limestone-100/70">
            {t('footer_desc')}
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4 text-limestone-100/50">{t('footer_nav_title')}</p>
          <ul className="space-y-3 text-sm">
            <li><a href="#house" className="hover:text-copper-light">{t('nav_house')}</a></li>
            <li><a href="#rooms" className="hover:text-copper-light">{t('nav_rooms')}</a></li>
            <li><a href="#gallery" className="hover:text-copper-light">{t('nav_gallery')}</a></li>
            <li><a href="#contact" className="hover:text-copper-light">{t('nav_contact')}</a></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4 text-limestone-100/50">{t('footer_location_title')}</p>
          <ul className="space-y-3 text-sm text-limestone-100/80">
            <li>{t('footer_loc1')}</li>
            <li>{t('footer_loc2')}</li>
            <li>{t('footer_loc3')}</li>
            <li>{t('footer_loc4')}</li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4 text-limestone-100/50">{t('footer_contact_title')}</p>
          <ul className="space-y-3 text-sm text-limestone-100/80">
            <li>{t('footer_host')}</li>
            <li className="pt-2">
              <a
                href="#book"
                className="eyebrow inline-block rounded-full border border-limestone-100/30 px-5 py-2 hover:border-copper-light hover:text-copper-light"
              >
                {t('footer_cta')}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-limestone-100/10 py-6">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-limestone-100/50 sm:flex-row">
          <p>{t('footer_bottom1')}</p>
          <p>{t('footer_bottom2')}</p>
        </div>
      </div>
    </footer>
  );
}
