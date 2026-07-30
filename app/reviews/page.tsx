import type { Metadata } from 'next';
import ReviewsContent from '@/components/ReviewsContent';

export const metadata: Metadata = {
  title: 'Κριτικές | AmaLia PanoRama House',
  description: 'Τι λένε οι επισκέπτες για τη διαμονή τους στο AmaLia PanoRama House.',
};

export default function ReviewsPage() {
  return <ReviewsContent />;
}
