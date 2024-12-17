import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('Authorization')?.value;
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

    // If user is on auth page and has token, redirect to home
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If user is not on auth page and has no token, redirect to auth
    if (!isAuthPage && !token) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/auth', '/search', '/projects', '/resources', '/requests', '/collaborations']
};
