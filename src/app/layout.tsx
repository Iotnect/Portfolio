import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import './globals.css';

export const metadata: Metadata = {
  title: 'IOTNECT — Intelligent vision. Real-world impact.',
  description:
    'IOTNECT Sdn Bhd delivers AI computer vision, IoT, hardware and custom dashboard solutions. Discover Neo Vision, your eagle eye partner.',
  icons: { icon: '/assets/iotnect-logo.jpeg' },
};

export const viewport: Viewport = { themeColor: '#6023a8' };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
