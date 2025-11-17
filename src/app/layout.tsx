import type React from 'react';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
// import { SpeedInsights } from '@vercel/speed-insights/next';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Altaa.ai - Team Management Platform',
  description: 'Modern multi-tenant SaaS platform for team collaboration',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} font-sans antialiased`}>
        {children}
        {/* <SpeedInsights /> */}
        <Toaster richColors />
      </body>
    </html>
  );
}
