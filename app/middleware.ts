import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Define redirects map (old path -> new path)
  const redirects: Record<string, string> = {
    '/dashboard': '/employee/dashboard', // Default to employee dashboard
    '/job-match': '/employee/job-match',
    '/profile': '/employee/profile',
    '/cv-assistant': '/employee/cv-assistant',
    '/interviewer': '/employee/interviewer',
    '/roadmap': '/employee/roadmap',
    '/settings': '/employee/settings',
    '/resources': '/admin/resources',
    '/choose-role': '/auth/choose-role',
    '/login': '/auth/login',
    '/register': '/auth/register',
    '/forgot-password': '/auth/forgot-password',
    '/reset-password': '/auth/reset-password',
    '/blog': '/shared/blog',
    '/help': '/shared/help',
    '/pricing': '/shared/pricing',
    '/confirmation': '/shared/confirmation'
  };

  // Check if the current path needs redirection
  if (path in redirects) {
    url.pathname = redirects[path];
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    '/dashboard',
    '/job-match',
    '/profile', 
    '/cv-assistant',
    '/interviewer',
    '/roadmap',
    '/settings',
    '/resources',
    '/choose-role',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/blog',
    '/help',
    '/pricing',
    '/confirmation'
  ]
}; 