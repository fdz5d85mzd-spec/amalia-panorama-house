export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';

export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export type Action = 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT';

export type CardDestination = 'player' | 'dealer' | 'other';

export interface StrategyResult {
  action: Action;
  label: string;
  detail: string;
}

export interface CountState {
  decks: number;
  runningCount: number;
  cardsSeen: number;
}
