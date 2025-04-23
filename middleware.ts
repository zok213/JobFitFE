import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Define route protection rules with proper TypeScript type
type RouteRoles = {
  [path: string]: string[];
};

const routePermissions: RouteRoles = {
  // Admin routes only accessible by admin
  '/admin': ['admin'],
  
  // Employee routes
  '/employee': ['employee', 'admin'],
  '/job-match': ['employee', 'admin'],
  '/cv-assistant': ['employee', 'admin'],
  '/interviewer': ['employee', 'admin'],
  '/roadmap': ['employee', 'admin'],
  
  // Employer routes
  '/employer': ['employer', 'admin'],
  
  // Public routes - no protection needed
  '/login': [],
  '/register': [],
  '/choose-role': [],
  '/forgot-password': [],
  '/reset-password': [],
  '/': [],
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session nếu hết hạn
  await supabase.auth.getSession();
  
  // Get current path
  const path = req.nextUrl.pathname;
  
  // Get user profile to check role
  let role = null;
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    role = profile?.role;
  }

  // Check if path is protected and requires specific roles
  const isProtectedRoute = Object.keys(routePermissions).some(route => {
    if (path.startsWith(route) && routePermissions[route].length > 0) {
      return true;
    }
    return false;
  });

  // Check if user has required role for this route
  const hasAccess = Object.keys(routePermissions).some(route => {
    if (path.startsWith(route)) {
      // If no roles defined, the route is public
      if (routePermissions[route].length === 0) return true;
      return role && routePermissions[route].includes(role);
    }
    return false;
  });

  // Redirect to login if protected route and no session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to unauthorized page if user doesn't have the required role
  if (isProtectedRoute && session && !hasAccess) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return res;
}

// Apply middleware to specific paths, excluding static files
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 