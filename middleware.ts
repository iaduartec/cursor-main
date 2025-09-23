import { stackMiddleware } from '@stackframe/stack';
import { verifyAccess, middleware as flagsMiddleware } from 'flags/next';

export default stackMiddleware(async (req) => {
  // Add flags middleware
  await flagsMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
