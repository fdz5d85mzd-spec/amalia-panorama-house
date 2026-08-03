'use client';

import { RANKS, type Rank } from '@/lib/blackjack/types';

export default function RankPad({
  onSelect,
  disabled,
}: {
  onSelect: (rank: Rank) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {RANKS.map((rank) => (
        <button
          key={rank}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(rank)}
          className="rounded-lg border border-felt-line bg-felt-800 py-3 text-lg font-semibold text-limestone-50 transition-colors hover:bg-felt-700 active:bg-felt-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {rank}
        </button>
      ))}
    </div>
  );
}
