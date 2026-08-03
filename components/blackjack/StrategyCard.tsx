'use client';

import type { StrategyResult } from '@/lib/blackjack/types';

const ACTION_STYLES: Record<string, string> = {
  HIT: 'bg-sky-600',
  STAND: 'bg-emerald-600',
  DOUBLE: 'bg-copper',
  SPLIT: 'bg-violet-600',
};

export default function StrategyCard({ result }: { result: StrategyResult | null }) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-felt-line p-6 text-center text-sm text-limestone-100/50">
        Πρόσθεσε τα χαρτιά του παίκτη και το ανοιχτό χαρτί του dealer για να δεις πρόταση.
      </div>
    );
  }

  const color = ACTION_STYLES[result.action] ?? 'bg-felt-700';

  return (
    <div className={`rounded-xl p-6 text-center text-limestone-50 shadow-lg ${color}`}>
      <p className="font-display text-3xl font-semibold tracking-wide">{result.label}</p>
      <p className="mt-2 text-sm text-limestone-50/85">{result.detail}</p>
    </div>
  );
}
