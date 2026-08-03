'use client';

import { useEffect, useMemo, useReducer } from 'react';
import RankPad from '@/components/blackjack/RankPad';
import Hand from '@/components/blackjack/Hand';
import StrategyCard from '@/components/blackjack/StrategyCard';
import CountDisplay from '@/components/blackjack/CountDisplay';
import ShoeSettings from '@/components/blackjack/ShoeSettings';
import CameraPanel from '@/components/blackjack/CameraPanel';
import { computeStrategy, handValue } from '@/lib/blackjack/strategy';
import { hiLoTag, summarizeCount } from '@/lib/blackjack/counting';
import type { Rank } from '@/lib/blackjack/types';

interface State {
  decks: number;
  shoeRunningCount: number;
  shoeCardsSeen: number;
  playerCards: Rank[];
  dealerCards: Rank[];
  otherCards: Rank[];
}

const INITIAL_STATE: State = {
  decks: 6,
  shoeRunningCount: 0,
  shoeCardsSeen: 0,
  playerCards: [],
  dealerCards: [],
  otherCards: [],
};

type StateAction =
  | { type: 'SET_DECKS'; decks: number }
  | { type: 'ADD_PLAYER'; rank: Rank }
  | { type: 'REMOVE_PLAYER'; index: number }
  | { type: 'CLEAR_PLAYER' }
  | { type: 'SET_DEALER'; rank: Rank }
  | { type: 'CLEAR_DEALER' }
  | { type: 'ADD_OTHER'; rank: Rank }
  | { type: 'REMOVE_OTHER'; index: number }
  | { type: 'CLEAR_OTHER' }
  | { type: 'NEW_ROUND' }
  | { type: 'NEW_SHOE' }
  | { type: 'LOAD'; state: State };

function reducer(state: State, action: StateAction): State {
  switch (action.type) {
    case 'SET_DECKS':
      return { ...state, decks: action.decks };
    case 'ADD_PLAYER':
      return { ...state, playerCards: [...state.playerCards, action.rank] };
    case 'REMOVE_PLAYER':
      return { ...state, playerCards: state.playerCards.filter((_, i) => i !== action.index) };
    case 'CLEAR_PLAYER':
      return { ...state, playerCards: [] };
    case 'SET_DEALER':
      return { ...state, dealerCards: [action.rank] };
    case 'CLEAR_DEALER':
      return { ...state, dealerCards: [] };
    case 'ADD_OTHER':
      return { ...state, otherCards: [...state.otherCards, action.rank] };
    case 'REMOVE_OTHER':
      return { ...state, otherCards: state.otherCards.filter((_, i) => i !== action.index) };
    case 'CLEAR_OTHER':
      return { ...state, otherCards: [] };
    case 'NEW_ROUND': {
      const roundCards = [...state.playerCards, ...state.dealerCards, ...state.otherCards];
      const roundCount = roundCards.reduce((sum, r) => sum + hiLoTag(r), 0);
      return {
        ...state,
        shoeRunningCount: state.shoeRunningCount + roundCount,
        shoeCardsSeen: state.shoeCardsSeen + roundCards.length,
        playerCards: [],
        dealerCards: [],
        otherCards: [],
      };
    }
    case 'NEW_SHOE':
      return {
        ...state,
        shoeRunningCount: 0,
        shoeCardsSeen: 0,
        playerCards: [],
        dealerCards: [],
        otherCards: [],
      };
    case 'LOAD':
      return action.state;
    default:
      return state;
  }
}

const STORAGE_KEY = 'blackjack-master-state-v1';

export default function BlackjackPage() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'LOAD', state: { ...INITIAL_STATE, ...JSON.parse(raw) } });
    } catch {
      // αγνόησε κατεστραμμένα δεδομένα localStorage
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage μη διαθέσιμο (π.χ. private mode) — δεν πειράζει
    }
  }, [state]);

  const roundCards = useMemo(
    () => [...state.playerCards, ...state.dealerCards, ...state.otherCards],
    [state.playerCards, state.dealerCards, state.otherCards]
  );
  const roundCount = useMemo(
    () => roundCards.reduce((sum, r) => sum + hiLoTag(r), 0),
    [roundCards]
  );
  const countSummary = useMemo(
    () =>
      summarizeCount(
        state.decks,
        state.shoeRunningCount + roundCount,
        state.shoeCardsSeen + roundCards.length
      ),
    [state.decks, state.shoeRunningCount, roundCount, state.shoeCardsSeen, roundCards.length]
  );

  const playerTotal = useMemo(
    () => (state.playerCards.length > 0 ? handValue(state.playerCards) : null),
    [state.playerCards]
  );

  const strategy = useMemo(() => {
    if (state.playerCards.length < 2 || state.dealerCards.length < 1) return null;
    return computeStrategy(state.playerCards, state.dealerCards[0]);
  }, [state.playerCards, state.dealerCards]);

  return (
    <div className="min-h-screen bg-felt-900 pb-16 pt-8 text-limestone-50">
      <div className="container max-w-2xl">
        <header className="mb-6 text-center">
          <p className="eyebrow text-copper-light">Blackjack Master</p>
          <h1 className="font-display text-3xl">Στρατηγική &amp; μέτρηση χαρτιών</h1>
          <p className="mt-1 text-sm text-limestone-100/50">
            v0.1 — χειροκίνητη καταχώρηση χαρτιών, κάμερα ζωντανά, αναγνώριση χαρτιών έρχεται σε επόμενο βήμα.
          </p>
        </header>

        <div className="flex flex-col gap-6">
          <CameraPanel />

          <StrategyCard result={strategy} />

          <section className="flex flex-col gap-3">
            <Hand
              title="Ανοιχτό χαρτί dealer"
              cards={state.dealerCards}
              onRemove={() => dispatch({ type: 'CLEAR_DEALER' })}
              onClear={() => dispatch({ type: 'CLEAR_DEALER' })}
              emptyHint="Διάλεξε το ανοιχτό χαρτί του dealer"
            />
            <RankPad onSelect={(rank) => dispatch({ type: 'SET_DEALER', rank })} />
          </section>

          <section className="flex flex-col gap-3">
            <Hand
              title="Χέρι παίκτη"
              cards={state.playerCards}
              total={playerTotal?.total}
              soft={playerTotal?.soft}
              onRemove={(index) => dispatch({ type: 'REMOVE_PLAYER', index })}
              onClear={() => dispatch({ type: 'CLEAR_PLAYER' })}
              emptyHint="Πρόσθεσε τα χαρτιά του παίκτη"
            />
            <RankPad onSelect={(rank) => dispatch({ type: 'ADD_PLAYER', rank })} />
          </section>

          <CountDisplay summary={countSummary} />

          <section className="flex flex-col gap-3">
            <Hand
              title="Άλλα χαρτιά που είδες (dealer hole, άλλοι παίκτες, burn)"
              cards={state.otherCards}
              onRemove={(index) => dispatch({ type: 'REMOVE_OTHER', index })}
              onClear={() => dispatch({ type: 'CLEAR_OTHER' })}
              emptyHint="Καταχώρησε επιπλέον χαρτιά για ακριβή μέτρηση"
            />
            <RankPad onSelect={(rank) => dispatch({ type: 'ADD_OTHER', rank })} />
          </section>

          <ShoeSettings
            decks={state.decks}
            onDecksChange={(decks) => dispatch({ type: 'SET_DECKS', decks })}
            onNewRound={() => dispatch({ type: 'NEW_ROUND' })}
            onNewShoe={() => dispatch({ type: 'NEW_SHOE' })}
          />
        </div>
      </div>
    </div>
  );
}
