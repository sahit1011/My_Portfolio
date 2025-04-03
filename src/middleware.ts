import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the cookie that tracks if this is the initial load
  const initialLoadCookie = request.cookies.get('initial-load');
  
  // If this is the initial load (no cookie), serve the static loading page
  if (!initialLoadCookie && request.nextUrl.pathname === '/') {
    // Create a response that serves the static loading page
    const response = NextResponse.rewrite(new URL('/loading.html', request.url));
    
    // Set a cookie to track that we've handled the initial load
    response.cookies.set('initial-load', 'true', {
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });
    
    return response;
  }
  
  // For all other requests, proceed normally
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/',
};
