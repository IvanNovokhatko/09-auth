import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');

  let isAuthenticated = !!accessToken?.value;
  const updatedCookies: Array<{ name: string; value: string; options: any }> = [];

  if (!isAuthenticated && refreshToken?.value) {
    try {
      const sessionResponse = await checkSession();
      const setCookie = sessionResponse.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parseSetCookie(cookieStr);

          if (parsed.value) {
            const { name, value, ...options } = parsed;
            cookieStore.set(name, value, options);
            updatedCookies.push({ name, value, options });
          }
        }
      }

      isAuthenticated = !!cookieStore.get('accessToken')?.value;
    } catch (error) {
      isAuthenticated = false;
    }
  }

  let response: NextResponse;

  if (isPrivateRoute && !isAuthenticated) {
    const signInUrl = new URL('/sign-in', request.url);
    response = NextResponse.redirect(signInUrl);
  } else if (isPublicRoute && isAuthenticated) {
    const homeUrl = new URL('/', request.url);
    response = NextResponse.redirect(homeUrl);
  } else {
    response = NextResponse.next();
  }

  for (const cookie of updatedCookies) {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
