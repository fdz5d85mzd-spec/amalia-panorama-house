'use client';

const DECK_OPTIONS = [1, 2, 4, 6, 8];

export default function ShoeSettings({
  decks,
  onDecksChange,
  onNewRound,
  onNewShoe,
}: {
  decks: number;
  onDecksChange: (decks: number) => void;
  onNewRound: () => void;
  onNewShoe: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-felt-line bg-felt-900/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow text-limestone-100/60">Τράπουλες στο shoe</p>
        <div className="flex gap-1.5">
          {DECK_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onDecksChange(d)}
              className={`h-8 w-8 rounded-md text-sm font-semibold transition-colors ${
                decks === d
                  ? 'bg-copper text-limestone-50'
                  : 'bg-felt-800 text-limestone-100/70 hover:bg-felt-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onNewRound}
          className="flex-1 rounded-lg border border-limestone-100/20 py-2 text-sm text-limestone-50 hover:bg-felt-800"
        >
          Νέος γύρος (κράτα count)
        </button>
        <button
          type="button"
          onClick={onNewShoe}
          className="flex-1 rounded-lg border border-wine/60 py-2 text-sm text-wine/90 hover:bg-wine/10"
        >
          Νέο shoe (μηδενισμός count)
        </button>
      </div>
    </div>
  );
}
