'use client';

import type { Rank } from '@/lib/blackjack/types';

export default function Hand({
  title,
  cards,
  total,
  soft,
  onRemove,
  onClear,
  emptyHint,
}: {
  title: string;
  cards: Rank[];
  total?: number;
  soft?: boolean;
  onRemove: (index: number) => void;
  onClear: () => void;
  emptyHint: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="eyebrow text-limestone-100/60">{title}</p>
        {cards.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-limestone-100/50 underline hover:text-copper-light"
          >
            καθαρισμός
          </button>
        )}
      </div>
      <div className="flex min-h-[3.25rem] flex-wrap items-center gap-2 rounded-lg border border-felt-line bg-felt-900/60 p-2">
        {cards.length === 0 && (
          <p className="px-1 text-sm text-limestone-100/40">{emptyHint}</p>
        )}
        {cards.map((rank, i) => (
          <button
            key={`${rank}-${i}`}
            type="button"
            onClick={() => onRemove(i)}
            title="Αφαίρεση"
            className="flex h-11 w-9 items-center justify-center rounded-md border border-limestone-100/20 bg-limestone-50 font-display text-base font-semibold text-ink shadow-sm transition-transform hover:-translate-y-0.5"
          >
            {rank}
          </button>
        ))}
        {typeof total === 'number' && cards.length > 0 && (
          <span className="ml-auto rounded-full bg-copper/90 px-3 py-1 text-sm font-semibold text-limestone-50">
            {soft ? 'soft ' : ''}
            {total}
          </span>
        )}
      </div>
    </div>
  );
}
