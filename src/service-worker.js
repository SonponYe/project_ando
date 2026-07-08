/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

// Precache the app shell (JS/CSS/HTML build output) injected by CRA at build time
precacheAndRoute(self.__WB_MANIFEST);

// Serve index.html for any navigation request that isn't a static file,
// so client-side routes work when opened directly/offline.
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }) => {
    if (request.mode !== 'navigate') return false;
    if (url.pathname.startsWith('/_')) return false;
    if (url.pathname.match(fileExtensionRegexp)) return false;
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Cache app icons/logo assets
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  new StaleWhileRevalidate({
    cacheName: 'ando-images',
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  })
);

// Cache Jamendo album art / track metadata responses (not audio streams —
// those are large and better left to the network/browser's own caching)
registerRoute(
  ({ url }) => url.origin === 'https://api.jamendo.com',
  new StaleWhileRevalidate({
    cacheName: 'ando-jamendo-api',
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 })],
  })
);
registerRoute(
  ({ url }) => url.hostname.endsWith('jamendo.com') && url.pathname.includes('album'),
  new StaleWhileRevalidate({
    cacheName: 'ando-jamendo-art',
    plugins: [new ExpirationPlugin({ maxEntries: 100 })],
  })
);

// Let the page trigger an immediate activation of a waiting new version
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
