/**
 * A list of publicly accessible routes
 * These routes do not require authentication to access
 * @type {string[]}
 */
export const publicRoutes: string[] = ['/'];

/**
 * A list of routes used for authentication
 *
 * @type {string[]}
 */
export const authRoutes: string[] = ['/login', '/register'];

/**
 * Prefix for API auth routes
 * Routes that start with this prefix are used for auth purposes
 *
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth';

/**
 * Default redirect path after login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = '/dashboard';
