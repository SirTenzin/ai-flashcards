import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth';
import Script from 'next/script';
import { dbConnect } from '@/lib/db/dbConnect';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flashcard Deck Creator',
  description: 'Create and manage flashcard decks with ease',
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  await dbConnect();
  return (
    <html lang="en">
      <body
        className={`${inter.className} `}
        suppressHydrationWarning={true}
      >
        <NextTopLoader showSpinner={false} />
        <Script src="https://js.stripe.com/v3/buy-button.js" async />
        <Providers session={session}>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}