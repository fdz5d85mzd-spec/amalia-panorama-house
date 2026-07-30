import type { Metadata } from 'next';
import AboutContent from '@/components/AboutContent';

export const metadata: Metadata = {
  title: 'Η Ιστορία | AmaLia PanoRama House',
  description:
    'Η ιστορία ενός πέτρινου σπιτιού 150 ετών στο Σούνι-Ζανακιά και του ανθρώπου που το φροντίζει.',
};

export default function AboutPage() {
  return <AboutContent />;
}
