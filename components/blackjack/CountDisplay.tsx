'use client';

import type { CountSummary } from '@/lib/blackjack/counting';
import { countAdvantageLabel } from '@/lib/blackjack/counting';

export default function CountDisplay({ summary }: { summary: CountSummary }) {
  const items = [
    { label: 'Running count', value: summary.runningCount > 0 ? `+${summary.runningCount}` : summary.runningCount },
    { label: 'True count', value: summary.trueCount.toFixed(1) },
    { label: 'Decks left', value: summary.decksRemaining.toFixed(1) },
    { label: 'Cards seen', value: summary.cardsSeen },
  ];

  return (
    <div className="rounded-xl border border-felt-line bg-felt-900/60 p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg bg-felt-800/70 p-3 text-center">
            <p className="font-display text-2xl text-limestone-50">{item.value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-limestone-100/50">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-copper/15 px-3 py-2">
        <span className="text-sm text-limestone-50/90">{countAdvantageLabel(summary.trueCount)}</span>
        <span className="text-sm font-semibold text-copper-light">
          Πρόταση στοιχήματος: {summary.betUnits}×μονάδα
        </span>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-limestone-100/40">
        Το true count δείχνει πόσο ευνοϊκή είναι στατιστικά η τράπουλα που απομένει,
        όχι ποιο θα είναι το επόμενο χαρτί. Ισχύει μόνο σε παιχνίδι με πραγματική,
        φυσική τράπουλα (π.χ. live-dealer) — όχι σε ψηφιακά/RNG παιχνίδια.
      </p>
    </div>
  );
}
