import type { Metadata } from 'next';
import { Oswald, Inter, JetBrains_Mono } from 'next/font/google';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Studio Link — Remote Guest',
  description: 'Preflight έλεγχος κάμερας/μικροφώνου και σύνδεση remote guest με το στούντιο.',
  robots: { index: false, follow: false },
};

export default function StudioLinkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${oswald.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      {children}
    </div>
  );
}
