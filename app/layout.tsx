import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import type { LayoutProps } from '@/types';
import type { Metadata, Viewport } from 'next';

import { TooltipProvider } from '@/components/ui/tooltip';
import { siteConfig } from '@/config/site';


import './globals.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const RootLayout = ({ children }: LayoutProps): React.ReactElement => (
  <html
    lang="en"
    className={`${GeistSans.variable} ${GeistMono.variable}`}
    suppressHydrationWarning
  >
    <body className="min-h-screen bg-background font-sans antialiased">
      <TooltipProvider>{children}</TooltipProvider>
    </body>
  </html>
);

export default RootLayout;
