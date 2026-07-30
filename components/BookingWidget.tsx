'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { buildAirbnbSearchUrl } from '@/lib/site';

export default function BookingWidget() {
  const { t } = useLanguage();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildAirbnbSearchUrl({
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      guests: guests ? Number(guests) : undefined,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-3xl flex-col overflow-hidden rounded-2xl border border-ink/10 bg-limestone-50 lg:flex-row"
    >
      <div className="flex flex-1 flex-col border-b border-ink/10 px-6 py-4 text-left lg:border-b-0 lg:border-r">
        <label htmlFor="checkIn" className="eyebrow text-ink/40">
          {t('book_checkin')}
        </label>
        <input
          id="checkIn"
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="mt-1 bg-transparent font-body text-sm outline-none"
        />
      </div>
      <div className="flex flex-1 flex-col border-b border-ink/10 px-6 py-4 text-left lg:border-b-0 lg:border-r">
        <label htmlFor="checkOut" className="eyebrow text-ink/40">
          {t('book_checkout')}
        </label>
        <input
          id="checkOut"
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="mt-1 bg-transparent font-body text-sm outline-none"
        />
      </div>
      <div className="flex flex-1 flex-col border-b border-ink/10 px-6 py-4 text-left lg:border-b-0 lg:border-r">
        <label htmlFor="guests" className="eyebrow text-ink/40">
          {t('book_guests')}
        </label>
        <input
          id="guests"
          type="number"
          min={1}
          placeholder="2"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="mt-1 bg-transparent font-body text-sm outline-none"
        />
      </div>
      <button
        type="submit"
        className="eyebrow w-full whitespace-normal bg-ink px-6 py-4 text-center leading-snug text-limestone-50 transition-colors hover:bg-copper lg:w-48"
      >
        {t('book_widget_cta')}
      </button>
    </form>
  );
}
