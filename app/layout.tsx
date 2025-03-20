import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'JobFit.AI - AI-Powered Job Matching Platform',
  description: 'Find the perfect job match with our AI-powered platform. Smart job searching and recruiting made easy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <body suppressHydrationWarning className="font-sans bg-background">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
