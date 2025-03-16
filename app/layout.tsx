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
  // Prevent hydration issues by using a static string for the class name
  const fontClass = spaceGrotesk.variable;
  
  return (
    <html lang="en" className={fontClass}>
      <body suppressHydrationWarning className="font-sans bg-background">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
