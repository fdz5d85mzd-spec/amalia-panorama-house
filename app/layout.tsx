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

const title = 'AmaLia PanoRama House | Πέτρινο αρχοντικό στο Σούνι, Λεμεσός';
const description =
  'Ένα πέτρινο σπίτι 150 ετών στο Σούνι-Ζανακιά, αναπαλαιωμένο με σεβασμό στον χαρακτήρα του. Πανοραμική θέα 360°, βεράντα στο ηλιοβασίλεμα, 20 λεπτά από τη Λεμεσό.';

export const metadata: Metadata = {
  metadataBase: new URL('https://amalia-panorama-house.vercel.app'),
  title,
  description,
  openGraph: {
    title,
    description,
    url: '/',
    siteName: 'AmaLia PanoRama House',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: title }],
    locale: 'el_GR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.jpg'],
  },
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
