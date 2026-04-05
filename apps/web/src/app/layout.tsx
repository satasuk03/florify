import type { Metadata, Viewport } from 'next';
import { Fraunces, Sarabun } from 'next/font/google';
import { StoreHydrator } from '@/store/StoreHydrator';
import { ToastContainer } from '@/components/ToastContainer';
import { MobileFrame } from '@/components/MobileFrame';
import './globals.css';

const sarabun = Sarabun({
  subsets: ['latin', 'thai'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sarabun',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-fraunces',
});

export const metadata: Metadata = {
  title: 'Florify',
  description: 'Plant, water, and collect procedurally-generated trees',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FBF8F3',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${sarabun.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full bg-cream-50 md:bg-cream-200 text-ink-900">
        <StoreHydrator />
        <MobileFrame>{children}</MobileFrame>
        <ToastContainer />
      </body>
    </html>
  );
}
