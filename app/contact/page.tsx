import type { Metadata } from 'next';
import ContactContent from '@/components/ContactContent';

export const metadata: Metadata = {
  title: 'Επικοινωνία | AmaLia PanoRama House',
  description: 'Επικοινωνήστε μαζί μας για ερωτήσεις σχετικά με τη διαμονή σας στο Σούνι-Ζανακιά.',
};

export default function ContactPage() {
  return <ContactContent />;
}
