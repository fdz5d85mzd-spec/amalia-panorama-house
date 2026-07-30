'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { CONTACT_EMAIL } from '@/lib/site';

export default function ContactForm() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `AmaLia PanoRama House — ${name}`;
    const body = `${message}\n\n— ${name} (${email})`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="eyebrow text-ink/50">
          {t('contact_form_name')}
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 font-body outline-none transition-colors focus:border-copper"
        />
      </div>

      <div>
        <label htmlFor="email" className="eyebrow text-ink/50">
          {t('contact_form_email')}
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 font-body outline-none transition-colors focus:border-copper"
        />
      </div>

      <div>
        <label htmlFor="message" className="eyebrow text-ink/50">
          {t('contact_form_message')}
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 w-full resize-none border-b border-ink/20 bg-transparent py-3 font-body outline-none transition-colors focus:border-copper"
        />
      </div>

      <div className="flex flex-col items-start gap-3 pt-2">
        <button
          type="submit"
          className="rounded-full bg-ink px-8 py-3 eyebrow text-limestone-50 transition-colors hover:bg-copper"
        >
          {t('contact_form_submit')}
        </button>
        <p className="text-xs text-ink-soft/60">{t('contact_form_hint')}</p>
      </div>
    </form>
  );
}
