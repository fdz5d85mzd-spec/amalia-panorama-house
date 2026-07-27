import type { Metadata } from 'next';
import { Fraunces, Karla, Space_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageProvider';

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const karla = Karla({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-karla',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AmaLia PanoRama House | Πέτρινο αρχοντικό στο Σούνι, Λεμεσός',
  description:
    'Ένα πέτρινο σπίτι 150 ετών στο Σούνι-Ζανακιά, αναπαλαιωμένο με σεβασμό στον χαρακτήρα του. Πανοραμική θέα 360°, βεράντα στο ηλιοβασίλεμα, 20 λεπτά από τη Λεμεσό.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el" className={`${fraunces.variable} ${karla.variable} ${spaceMono.variable}`}>
      <body>
        <LanguageProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
