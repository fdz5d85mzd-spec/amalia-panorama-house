import type { Rank } from './types';

// Σύστημα μέτρησης Hi-Lo
export function hiLoTag(rank: Rank): number {
  if (['2', '3', '4', '5', '6'].includes(rank)) return 1;
  if (['7', '8', '9'].includes(rank)) return 0;
  return -1; // 10, J, Q, K, A
}

export interface CountSummary {
  runningCount: number;
  cardsSeen: number;
  decksRemaining: number;
  trueCount: number;
  betUnits: number;
}

export function summarizeCount(decks: number, runningCount: number, cardsSeen: number): CountSummary {
  const totalCards = decks * 52;
  const cardsLeft = Math.max(totalCards - cardsSeen, 1);
  const decksRemaining = Math.max(cardsLeft / 52, 0.5);
  const trueCount = runningCount / decksRemaining;
  const betUnits = suggestBetUnits(trueCount);
  return {
    runningCount,
    cardsSeen,
    decksRemaining,
    trueCount,
    betUnits,
  };
}

// Απλή κλίμακα στοιχηματισμού βάσει true count (Hi-Lo ramp)
export function suggestBetUnits(trueCount: number): number {
  if (trueCount < 1) return 1;
  if (trueCount < 2) return 2;
  if (trueCount < 3) return 4;
  if (trueCount < 4) return 6;
  if (trueCount < 5) return 8;
  return 12;
}

export function countAdvantageLabel(trueCount: number): string {
  if (trueCount <= 0) return 'Πλεονέκτημα τραπεζιού';
  if (trueCount < 1) return 'Ουδέτερο';
  if (trueCount < 2) return 'Ελαφρύ πλεονέκτημα παίκτη';
  if (trueCount < 4) return 'Καλό πλεονέκτημα παίκτη';
  return 'Ισχυρό πλεονέκτημα παίκτη';
}
