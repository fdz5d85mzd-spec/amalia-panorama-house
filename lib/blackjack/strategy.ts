import type { Action, Rank, StrategyResult } from './types';

// Βασική στρατηγική (basic strategy) για παιχνίδι πολλαπλών τράπουλων
// (4-8 decks), dealer stands on soft 17, double after split επιτρέπεται.
// Αυτό είναι το σημείο εκκίνησης — προσαρμόσιμο αργότερα ανά κανόνες τραπεζιού.

function cardValue(rank: Rank): number {
  if (rank === 'A') return 11;
  if (rank === '10') return 10;
  return Number(rank);
}

export function handValue(ranks: Rank[]): { total: number; soft: boolean } {
  let total = 0;
  let aces = 0;
  for (const r of ranks) {
    total += cardValue(r);
    if (r === 'A') aces += 1;
  }
  let softAcesLeft = aces;
  while (total > 21 && softAcesLeft > 0) {
    total -= 10;
    softAcesLeft -= 1;
  }
  // "soft" hand = υπάρχει άσος που μετράει ακόμα ως 11
  const soft = softAcesLeft > 0;
  return { total, soft };
}

// dealer index: 2,3,4,5,6,7,8,9,10,A -> 0..9
function dealerIndex(dealer: Rank): number {
  return dealer === 'A' ? 9 : Number(dealer) - 2;
}

const HARD_TABLE: Record<number, Action[]> = {
  8: Array(10).fill('HIT'),
  9: ['HIT', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'HIT', 'HIT', 'HIT', 'HIT', 'HIT'],
  10: ['DOUBLE', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'HIT', 'HIT'],
  11: ['DOUBLE', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'HIT'],
  12: ['HIT', 'HIT', 'STAND', 'STAND', 'STAND', 'HIT', 'HIT', 'HIT', 'HIT', 'HIT'],
  13: ['STAND', 'STAND', 'STAND', 'STAND', 'STAND', 'HIT', 'HIT', 'HIT', 'HIT', 'HIT'],
  14: ['STAND', 'STAND', 'STAND', 'STAND', 'STAND', 'HIT', 'HIT', 'HIT', 'HIT', 'HIT'],
  15: ['STAND', 'STAND', 'STAND', 'STAND', 'STAND', 'HIT', 'HIT', 'HIT', 'HIT', 'HIT'],
  16: ['STAND', 'STAND', 'STAND', 'STAND', 'STAND', 'HIT', 'HIT', 'HIT', 'HIT', 'HIT'],
};

const SOFT_TABLE: Record<number, Action[]> = {
  13: ['HIT', 'HIT', 'HIT', 'DOUBLE', 'DOUBLE', 'HIT', 'HIT', 'HIT', 'HIT', 'HIT'], // A,2
  14: ['HIT', 'HIT', 'HIT', 'DOUBLE', 'DOUBLE', 'HIT', 'HIT', 'HIT', 'HIT', 'HIT'], // A,3
  15: ['HIT', 'HIT', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'HIT', 'HIT', 'HIT', 'HIT', 'HIT'], // A,4
  16: ['HIT', 'HIT', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'HIT', 'HIT', 'HIT', 'HIT', 'HIT'], // A,5
  17: ['HIT', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'HIT', 'HIT', 'HIT', 'HIT', 'HIT'], // A,6
  18: ['STAND', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'DOUBLE', 'STAND', 'STAND', 'HIT', 'HIT', 'HIT'], // A,7
  19: ['STAND', 'STAND', 'STAND', 'STAND', 'DOUBLE', 'STAND', 'STAND', 'STAND', 'STAND', 'STAND'], // A,8 (double vs 6)
};
// A,9 (soft 20) και soft 21 (blackjack) -> πάντα STAND, χειρίζεται στο computeStrategy

const PAIR_SPLIT: Record<string, boolean[]> = {
  A: Array(10).fill(true),
  '10': Array(10).fill(false),
  '9': [true, true, true, true, true, false, true, true, false, false],
  '8': Array(10).fill(true),
  '7': [true, true, true, true, true, true, false, false, false, false],
  '6': [true, true, true, true, true, false, false, false, false, false],
  '5': Array(10).fill(false),
  '4': [false, false, false, true, true, false, false, false, false, false],
  '3': [true, true, true, true, true, true, true, false, false, false],
  '2': [true, true, true, true, true, true, true, false, false, false],
};

const ACTION_LABEL: Record<Action, string> = {
  HIT: 'HIT — Τράβα χαρτί',
  STAND: 'STAND — Μείνε',
  DOUBLE: 'DOUBLE — Διπλασίασε',
  SPLIT: 'SPLIT — Μοίρασε το ζευγάρι',
};

export function computeStrategy(playerRanks: Rank[], dealerUp: Rank): StrategyResult | null {
  if (playerRanks.length < 2) return null;
  const di = dealerIndex(dealerUp);
  const { total, soft } = handValue(playerRanks);
  const canDouble = playerRanks.length === 2;

  const fallback = (result: StrategyResult): StrategyResult => {
    if (result.action !== 'DOUBLE' || canDouble) return result;
    // Double δεν επιτρέπεται πια (>2 χαρτιά) -> "double ή αλλιώς hit/stand"
    const standInstead = soft && total === 19; // A,8 vs 6 -> stand αν δεν γίνεται double
    const action: Action = standInstead ? 'STAND' : 'HIT';
    return {
      action,
      label: ACTION_LABEL[action],
      detail: `${result.detail} (Double μη διαθέσιμο πλέον -> ${action === 'HIT' ? 'τράβα' : 'μείνε'}.)`,
    };
  };

  if (total > 21) {
    return { action: 'STAND', label: 'BUST', detail: 'Το χέρι έσκασε (>21).' };
  }
  if (total === 21) {
    return { action: 'STAND', label: ACTION_LABEL.STAND, detail: '21 — μείνε.' };
  }

  // Pair logic (μόνο με ακριβώς 2 χαρτιά ίδιας αξίας)
  if (playerRanks.length === 2 && playerRanks[0] === playerRanks[1]) {
    const rank = playerRanks[0];
    const canSplit = PAIR_SPLIT[rank]?.[di];
    if (rank === 'A') {
      return { action: 'SPLIT', label: ACTION_LABEL.SPLIT, detail: 'Πάντα μοίρασε τους άσους.' };
    }
    if (rank === '10') {
      return { action: 'STAND', label: ACTION_LABEL.STAND, detail: 'Ποτέ μη μοιράζεις τα 10άρια — μείνε.' };
    }
    if (canSplit) {
      return { action: 'SPLIT', label: ACTION_LABEL.SPLIT, detail: `Μοίρασε τα ${rank},${rank} εναντίον ${dealerUp}.` };
    }
    if (rank === '5') {
      // αντιμετώπισε ως σκληρό 10
      const action = di <= 7 ? 'DOUBLE' : 'HIT';
      return { action, label: ACTION_LABEL[action], detail: 'Τα 5,5 παίζονται σαν σκληρό 10.' };
    }
    // fallthrough στη σκληρή/μαλακή στρατηγική παρακάτω
  }

  if (soft) {
    if (total >= 20) {
      return { action: 'STAND', label: ACTION_LABEL.STAND, detail: 'Soft 20/21 — πάντα μείνε.' };
    }
    const row = SOFT_TABLE[total];
    if (row) {
      const action = row[di];
      return fallback({ action, label: ACTION_LABEL[action], detail: `Soft ${total} εναντίον ${dealerUp}.` });
    }
  }

  if (total <= 8) {
    return { action: 'HIT', label: ACTION_LABEL.HIT, detail: 'Σκληρό 8 ή λιγότερο — πάντα τράβα.' };
  }
  if (total >= 17) {
    return { action: 'STAND', label: ACTION_LABEL.STAND, detail: 'Σκληρό 17+ — πάντα μείνε.' };
  }
  const row = HARD_TABLE[total];
  const action = row ? row[di] : 'HIT';
  return fallback({ action, label: ACTION_LABEL[action], detail: `Σκληρό ${total} εναντίον ${dealerUp}.` });
}
