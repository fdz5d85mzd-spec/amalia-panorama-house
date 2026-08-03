import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blackjack Master',
  description: 'Στρατηγική blackjack και μέτρηση χαρτιών σε πραγματικό χρόνο.',
  robots: { index: false, follow: false },
};

export default function BlackjackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
