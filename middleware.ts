import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client outside the middleware function to avoid recreating it on every request
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

export const config = {
  matcher: [
    // Protected routes that require authentication
    '/dashboard/:path*',
    '/profile/:path*',
    '/roadmap/:path*',
    '/schedule/:path*',
    '/job-match/:path*',
    '/cv-assistant/:path*',
    '/interviewer/:path*',
    '/settings/:path*',
    // Role-specific routes
    '/admin/:path*',
    '/employer/:path*',
    '/employee/:path*',
  ],
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  try {
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();

    // If no session, redirect to login
    if (!session) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Get user role from metadata
    const userRole = session.user.user_metadata?.role || 'employee';

    // Simplified role-based routing
    if (path.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (path.startsWith('/employer') && userRole !== 'employer' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (path.startsWith('/employee') && userRole === 'employer') {
      return NextResponse.redirect(new URL('/employer/dashboard', request.url));
    }

    // Check employer-specific features - combined in a single operation
    if (path.includes('/recruiter') || path.includes('/job-post')) {
      if (userRole !== 'employer' && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    return response;
  } catch (error) {
    // Handle errors gracefully
    console.error('Middleware error:', error);
    
    // In case of error, redirect to login as a fallback
    const redirectUrl = new URL('/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }
} 