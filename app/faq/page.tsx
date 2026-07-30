import type { Metadata } from 'next';
import FaqContent from '@/components/FaqContent';

export const metadata: Metadata = {
  title: 'Συχνές Ερωτήσεις | AmaLia PanoRama House',
  description:
    'Ώρες check-in/check-out, πάρκινγκ, κατοικίδια και άλλες πρακτικές πληροφορίες για τη διαμονή σας.',
};

export default function FaqPage() {
  return <FaqContent />;
}
