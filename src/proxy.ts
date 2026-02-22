
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJWT } from '@/utils/helper';
import { Role } from '@/utils/enum';
import { cookies } from 'next/headers'

// Define public routes that don't require authentication
const publicPaths = ['/auth/login', '/auth/forgot-password', '/api/login', '/api/logout', '/api/refresh_token'];

// Define role-based route access
// Map URL prefixes to allowed roles
const rolePermissions: Record<string, Role[]> = {
    '/admin': [Role.ADMIN],
    '/kitchen': [Role.CENTRAL_KITCHEN_STAFF],
    '/store': [Role.FRANCHISE_STORE_STAFF],
    '/supply': [Role.SUPPLY_COORDINATOR],
    '/manager': [Role.MANAGER],
};

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const isPublic =
        publicPaths.some(path => pathname.startsWith(path)) ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/public') ||
        pathname === '/';

    // Case 1: Public route
    if (isPublic) {
        return NextResponse.next();
    }
    // Case 2: No refresh_token -> Middleware blocks immediately (As per AuthContext logic)
    if (!refreshToken) {
        const url = new URL('/auth/login', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    // 3. Validate Access Token if it exists
    if (accessToken) {
        try {
            const user = decodeJWT<{ role: string; exp: number }>(accessToken);

            // Check Token Expiration
            const currentTime = Math.floor(Date.now() / 1000);
            if (user.exp < currentTime) {
                // Token Expired but Refresh Token exists (checked above).
                // Action: Redirect to same URL but delete access_token cookie.
                // This forces the browser to retry effectively as "Missing Access Token".
                // Result: AuthContext will see [No Access, Valid Refresh] -> Trigger Case 3 (Refresh Logic).
                const response = NextResponse.redirect(request.url);
                response.cookies.delete('accessToken');
                return response;
            }

            // Valid Token -> Check Role-based Access (RBAC)
            const matchedPath = Object.keys(rolePermissions).find(path => pathname.startsWith(path));
            if (matchedPath) {
                const allowedRoles = rolePermissions[matchedPath];
                const userRole = user.role as Role;

                if (!allowedRoles.includes(userRole)) {
                    // Unauthorized Access
                    // You might want to redirect to            // Invalid token -> redirect to login
                    return NextResponse.redirect(new URL('/auth/login', request.url)); // Ensure /unauthorized exists or use a generic error page
                }
            }

        } catch (error) {
            console.error("Token decoding failed:", error);
            // Invalid token structure -> Treat as expired/missing.
            // Force refresh flow by stripping the bad cookie.
            const response = NextResponse.redirect(request.url);
            response.cookies.delete('accessToken');
            return response;
        }
    }

    // Case 3: No Access Token (or stripped above), but has Refresh Token.
    // Allow request to proceed. 
    // Layout will receive [null, refreshToken].
    // AuthContext will trigger Case 3 logic to fetch new access token.
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
