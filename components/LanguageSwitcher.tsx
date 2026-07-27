'use client';

import { useState } from 'react';
import { langOrder, langMeta } from '@/lib/i18n';
import { useLanguage } from './LanguageProvider';

export default function LanguageSwitcher({ solid }: { solid: boolean }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`eyebrow flex items-center gap-1 rounded-full border px-3 py-1.5 transition-colors ${
          solid ? 'border-ink/25 text-ink' : 'border-limestone-50/50 text-limestone-50'
        }`}
      >
        🌐 {langMeta[lang].code}
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[60] flex min-w-[140px] flex-col overflow-hidden rounded-lg border border-ink/10 bg-limestone-50 shadow-xl">
          {langOrder.map((code) => (
            <button
              key={code}
              onClick={() => {
                setLang(code);
                setOpen(false);
              }}
              className={`px-4 py-2.5 text-left text-sm hover:bg-copper/10 ${
                lang === code ? 'font-semibold text-copper' : 'text-ink'
              }`}
            >
              {langMeta[code].name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
