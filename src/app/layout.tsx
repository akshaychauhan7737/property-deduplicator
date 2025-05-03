import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = "https://devtoolsforfree.com/property-deduplicator/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), // Set the base URL
  title: 'Property Deduplicator - Online Key-Value Pair Parser | DevToolsForFree', // SEO Optimized Title
  description: 'Easily parse, clean, and deduplicate key-value pairs online. Handles invalid formats and ensures unique keys. Free developer tool from DevToolsForFree.', // SEO Optimized Description
  alternates: {
    canonical: '/', // Sets the canonical URL relative to metadataBase
  },
  openGraph: {
    title: 'Property Deduplicator - Online Key-Value Pair Parser | DevToolsForFree',
    description: 'Easily parse, clean, and deduplicate key-value pairs online. Handles invalid formats and ensures unique keys.',
    url: siteUrl,
    siteName: 'DevToolsForFree',
    type: 'website',
    // Add images if you have a preview image URL
    // images: [
    //   {
    //     url: 'https://devtoolsforfree.com/og-image.png', // Replace with your actual image URL
    //     width: 1200,
    //     height: 630,
    //     alt: 'Property Deduplicator Tool Preview',
    //   },
    // ],
  },
  // Add keywords if desired, though their importance for SEO is debated
  // keywords: ['property parser', 'key-value parser', 'deduplicate properties', 'online tool', 'developer tools', 'free tools', 'configuration parser'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster */}
      </body>
    </html>
  );
}
