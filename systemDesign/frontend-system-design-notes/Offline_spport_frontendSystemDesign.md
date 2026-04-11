


## Namaste Frontend System Design
## Offline Support
In-Depth Interview Guide  |  PWA  |  Service Workers  |  Workbox  |  Background Sync  |  Conflict
## Resolution

## Topic What It Covers Interview Weight
Overview Offline-first philosophy, network
states, progressive
enhancement, offline UX
patterns
## High
Progressive Web Apps Web App Manifest, installability,
app-shell model, PWA checklist,
Lighthouse PWA audit
## Very High
Service Workers Full lifecycle, caching strategies,
## Workbox, Background Sync,
Push, conflict resolution
## Very High
Interview Questions 15 deep-dive questions with
model answers covering real
system design scenarios
## Very High



Why Offline Support Matters in Senior Interviews
Offline support separates apps that are 'web pages' from apps that are 'software'. 50% of the world's internet
users are on 2G or 3G mobile connections. Even in cities with 4G/5G, users experience intermittent connectivity
in lifts, metros, tunnels, and crowded venues. An app that breaks when the network hiccups is a broken app.

Senior frontend engineers at Flipkart, Swiggy, Meesho, and Uber are expected to design systems that degrade
gracefully and recover automatically. Offline support is not just a PWA checkbox — it is a fundamental resilience
architecture decision that touches Service Workers, IndexedDB, the Cache API, Background Sync, and conflict
resolution strategy.

Interview question What the interviewer tests
How does a Service Worker differ from a Web
## Worker?
Lifecycle, network interception, registration model,
no DOM access
Design the offline experience for Swiggy. What
can users do without internet?
Scope decisions: what is cached, what is gracefully
degraded, what is blocked
A user submits an order while offline. Walk me
through the full flow.
IDB mutation queue + Background Sync +
idempotency + conflict resolution
What is the app-shell model? When would you
NOT use it?
Shell vs data separation, when server-side
rendering makes it inappropriate
How do you handle a SW update without
breaking active users?
skipWaiting, clients.claim, update notification,
versioned caches
What is Workbox and when do you use it over
raw SW code?
Workbox as abstraction, tradeoffs, production
readiness
How do you sync offline mutations with the
server when multiple users edit the same data?
CRDTs, last-write-wins, operational transforms,
conflict UI

## KEY INSIGHT
The offline support answer structure for any interview: (1) DETECT network state.
(2) CACHE the right things at the right time. (3) QUEUE mutations when offline. (4)
SYNC when online resumes. (5) RESOLVE conflicts if server state diverged. (6)
NOTIFY the user throughout. This six-step mental model handles every offline
scenario.


Topic 1   Overview — Offline-First Philosophy &
## Fundamentals

Offline-first is a design philosophy: assume the network is unreliable, build your app to work without it, and treat
network connectivity as an enhancement rather than a requirement. This is the opposite of 'online-first' — where
you assume connectivity and add a fallback as an afterthought.

## 1.1  The Network Reality — Why Offline Matters Now
Reality Statistic / Context Implication for Frontend
Mobile connectivity ~5 billion mobile internet users.
45% still on 3G or below
globally. India: >60% mobile
traffic.
Even 'fast' users experience
latency. Offline support =
performance for slow networks
too.
Intermittent connectivity Lifts, metro, tunnels, stadiums,
rural areas: frequent drops even
on 4G devices.
Apps must handle 0→100%
connectivity transitions gracefully
and automatically.
Lie-Fi Wi-Fi connected but no actual
internet (hotel Wi-Fi, office
firewall).
navigator.onLine = true, but
requests fail. Must test with
actual fetch, not just the
property.
User expectation Native apps (Instagram,
WhatsApp, Maps) all work
offline. Users now expect this
from web apps.
'Network required' screens are
unacceptable for senior-level
web app design.
Business impact Google: 53% of users abandon
mobile sites that take >3s to
load. Offline = instant load from
cache.
The fastest network request is
no network request.

1.2  Online vs Offline-First Design Philosophy
// ── ONLINE-FIRST (the naive approach) ────────────────────────────
async function loadProducts() {
try {
const data = await fetch('/api/products').then(r => r.json());
renderProducts(data);
} catch {
showError('No internet connection. Please try again.');
// User is blocked. Cannot view products. Cannot do anything.
## }
## }
// RESULT: Network failure = blank screen or error page.

// ── OFFLINE-FIRST (the correct approach) ─────────────────────────
async function loadProducts() {
// 1. Show cached data IMMEDIATELY — zero latency first render
const cached = await idb.get('products');
if (cached) renderProducts(cached.data);

// 2. Try network in background
try {
const fresh = await fetch('/api/products').then(r => r.json());

await idb.set('products', { data: fresh, ts: Date.now() });
renderProducts(fresh); // update UI if data changed
} catch {
if (!cached) {
// Only show error if we have NOTHING to show
showOfflineBanner('Showing last saved data.');
## }
// If we have cached data: user sees content. No error.
## }
## }
// RESULT: User sees content instantly. Network failure is silent.
// Only users with NO cached data ever see an error state.

## 1.3  Network State Detection — The Correct Pattern
// ── navigator.onLine — DO NOT trust this alone ─────────────────────
// navigator.onLine = true means 'connected to a network'
// It does NOT mean 'has internet access'
// Lie-Fi: router connected, no upstream internet → onLine = true, fetch fails

// ── The correct pattern: test with an actual fetch ─────────────────
async function isOnline() {
try {
// Fetch a tiny, uncached resource — your own server or a known reliable endpoint
const response = await fetch('/health-check', {
method: 'HEAD',              // no body — minimal bandwidth
cache:  'no-store',          // must not come from browser cache
signal: AbortSignal.timeout(3000), // fail fast after 3s
## });
return response.ok;
} catch {
return false;
## }
## }

// ── React hook for online status ───────────────────────────────────
function useOnlineStatus() {
const [online, setOnline] = useState(navigator.onLine);

useEffect(() => {
const setTrue  = () => setOnline(true);
const setFalse = () => setOnline(false);

window.addEventListener('online',  setTrue);
window.addEventListener('offline', setFalse);

// Verify connectivity periodically (catches lie-fi)
const interval = setInterval(async () => {
const connected = await isOnline();
setOnline(connected);
}, 30_000); // check every 30 seconds

return () => {
window.removeEventListener('online',  setTrue);
window.removeEventListener('offline', setFalse);
clearInterval(interval);
## };
## }, []);

return online;
## }

// ── Network Information API (where supported) ──────────────────────
const connection = navigator.connection || navigator.mozConnection;

if (connection) {
console.log('Effective type:', connection.effectiveType); // '4g','3g','2g','slow-2g'
console.log('Downlink:', connection.downlink, 'Mbps');
console.log('RTT:', connection.rtt, 'ms');

// Adapt behaviour based on connection quality
connection.addEventListener('change', () => {
if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
disableAutoplay();
loadLowResImages();
skipNonCriticalPrefetching();
## }
## });
## }

1.4  Offline UX Patterns — What to Show Users
Pattern When to Use Implementation User Experience
Optimistic UI Write operations (like,
follow, add to cart)
Update UI immediately,
queue API call, roll
back on failure
Instant response. No
waiting. Failure is silent
rollback.
Stale content with
banner
Read-heavy apps
(news, feeds, product
listings)
Show cached data,
display 'Last updated: 5
min ago' banner
User sees content.
Knows it may be slightly
old.
Offline fallback page Navigation to uncached
routes
SW intercepts and
returns /offline.html
Better than browser
error. Branded. Offers
links to cached pages.
Pending state
indicator
Multi-step forms and
transactions
'Saving...' / 'Will sync
when online' messaging
User knows their work
is queued, not lost.
Conflict resolution UI Concurrent edits by
multiple users
Diff view or 'Which
version do you want to
keep?' modal
User is empowered to
resolve. No silent data
loss.
Progressive load Content-heavy pages
(article, product detail)
Shell from cache →
data from network when
available
App appears instantly.
Content fills in
progressively.

## Interview Q
What is the difference between navigator.onLine and actual internet connectivity?
How do you reliably detect connectivity?
## Interview Q
Explain offline-first design philosophy. How is it different from adding an offline
fallback?
## Interview Q
A user opens your app in an aeroplane mode. What should they see, and what
should they be able to do? Design the full UX.

## References
- web.dev — Offline and network connectivity
- MDN — Making PWAs work offline with Service Workers
- Network Information API — MDN


Topic 2   Progressive Web Apps (PWAs)

A Progressive Web App is a web application that uses modern browser APIs to deliver an app-like experience:
installable on the home screen, works offline, receives push notifications, loads instantly, and feels native.
PWAs bridge the gap between web and native apps — one codebase, all platforms.

2.1  The Three Pillars of PWA
## Pillar What It Means Key Requirement
Capable Uses modern web APIs to match
what native apps can do: offline,
push notifications, camera,
geolocation, file system,
payment.
Service Worker registered.
HTTPS served. IndexedDB for
storage.
Reliable Loads instantly regardless of
network condition. Never shows
a browser error page. Handles
intermittent connectivity
gracefully.
App shell cached at install.
Offline fallback page served by
## SW.
Installable Can be added to the home
screen. Runs in standalone
mode (no browser chrome). Has
an app icon and splash screen.
Valid Web App Manifest. SW
registered. Served over HTTPS.
Passes installability criteria.

## 2.2  Web App Manifest — The Complete Reference
// public/manifest.json — or manifest.webmanifest
## {
"name":             "Swiggy Food Delivery",   // full app name (install screen)
"short_name":       "Swiggy",                 // home screen label (max ~12 chars)
"description":      "Order food from restaurants near you",
"start_url":        "/?source=pwa",           // URL opened on launch
"scope":            "/",                      // which URLs are 'in' the PWA
"display":          "standalone",             // 'standalone' | 'fullscreen' | 'minimal-
ui' | 'browser'
// standalone: no browser bar. Looks like native app.
// fullscreen: no OS chrome at all (games).
// minimal-ui: address bar + back/refresh only.
// browser:    regular browser tab (not a PWA).
## "orientation":      "portrait",
"background_color": "#FFFFFF",               // splash screen background
"theme_color":      "#FC8019",               // Swiggy orange — status bar colour on
## Android
"lang":             "en-IN",
## "dir":              "ltr",
## "categories":       ["food", "shopping"],
## "icons": [
{ "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose":
## "any" },
{ "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose":
## "any" },
{ "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png",
## "purpose": "maskable" }
// maskable: icon designed to be cropped to circle/squircle on Android
// Without maskable: white square around your icon on some launchers
## ],

## "screenshots": [
## { "src": "/screenshots/home.png", "sizes": "390x844",
"type": "image/png", "form_factor": "narrow", "label": "Home screen" },
## { "src": "/screenshots/order.png", "sizes": "390x844",
"type": "image/png", "form_factor": "narrow", "label": "Order tracking" }
// screenshots: shown in browser's install UI (Chrome 119+)
## ],
## "share_target": {
## "action": "/share-handler",
"method": "POST",
## "params": { "title": "title", "text": "text", "url": "url" }
// Allows your app to appear in the OS 'share to...' sheet
## },
## "protocol_handlers": [
## { "protocol": "web+food", "url": "/search?q=%s" }
// Register custom protocol: web+food://pizza → opens in your app
## ],
## "file_handlers": [
## { "action": "/open-file", "accept": { "text/csv": [".csv"] } }
// App appears as option when user opens a CSV file
## ]
## }

// Link in HTML <head>:
<link rel='manifest' href='/manifest.json'>
<meta name='theme-color' content='#FC8019'>
<meta name='apple-mobile-web-app-capable' content='yes'>
<meta name='apple-mobile-web-app-status-bar-style' content='default'>
// iOS Safari does not support manifest for status bar colour — must set separately

2.3  The App Shell Model — Architecture for Instant Load
The app shell is the minimal HTML, CSS, and JavaScript that powers the user interface skeleton — the
navigation, headers, loading states — without any content. It is cached by the Service Worker at install time and
served from cache on every subsequent visit, making the app appear instantly even on slow networks.
## // APP SHELL ARCHITECTURE:

// ── SHELL (cached at SW install) ──────────────────────────────────
// /index.html              — the entry point with shell structure
// /main.[hash].js          — React app bundle
// /styles.[hash].css       — global styles
// /icons/                  — app icons
// /fonts/                  — critical fonts
// /offline.html            — offline fallback page

// ── DATA (fetched from network, cached at runtime) ─────────────────
// /api/restaurants         — content (network first, IDB backup)
// /api/user/profile        — user data (network first, session cache)
// /api/orders              — user's orders (network first, IDB backup)

## // ── WHEN TO USE APP SHELL ─────────────────────────────────────────
// Good for: SPAs, dashboard apps, social feeds, e-commerce
// The shell loads from cache in <100ms. Content loads from network.

## // ── WHEN NOT TO USE APP SHELL ─────────────────────────────────────
// Server-side rendered apps: HTML IS the content. Shell doesn't make sense.
// Blog / news sites with unique URLs per article: shell is tiny vs content.
// For these: use 'content-first' caching (cache individual pages).

## // ── React + App Shell ─────────────────────────────────────────────
// The shell is the outer layout. React Suspense shows skeleton while data loads.
function App() {
return (
<div className='app-shell'>

<Header />              {/* from cache — instant */}
<Navigation />          {/* from cache — instant */}
## <main>
<Suspense fallback={<PageSkeleton />}>
<Routes>            {/* data loaded from network */}
<Route path='/' element={<Home />} />
<Route path='/orders' element={<Orders />} />
</Routes>
</Suspense>
## </main>
## </div>
## );
## }

2.4  PWA Installability — The beforeinstallprompt Pattern
// The browser shows an 'Add to Home Screen' banner automatically if:
// 1. Site served over HTTPS
// 2. Valid Web App Manifest with icons and start_url
// 3. Service Worker registered
// 4. Has not been installed before

// BEST PRACTICE: capture the event, show your OWN install UI at the right moment

let deferredPrompt = null;

// Capture the browser's install prompt
window.addEventListener('beforeinstallprompt', (e) => {
e.preventDefault();          // stop the browser's automatic mini-infobar
deferredPrompt = e;          // save for later
showInstallButton();         // show your custom install UI
## });

// Trigger when user clicks YOUR install button
async function handleInstallClick() {
if (!deferredPrompt) return;
deferredPrompt.prompt();     // show the browser's native install dialog
const { outcome } = await deferredPrompt.userChoice;
// outcome: 'accepted' | 'dismissed'
if (outcome === 'accepted') {
telemetry.track('pwa_installed');
hideInstallButton();
## }
deferredPrompt = null;
## }

// Detect if already running as installed PWA
function isInstalledPWA() {
return (
window.matchMedia('(display-mode: standalone)').matches ||
window.navigator.standalone === true // iOS Safari
## );
## }

// Detect when installation completes
window.addEventListener('appinstalled', () => {
deferredPrompt = null;
hideInstallButton();
telemetry.track('pwa_install_confirmed');
## });

// iOS Safari: no beforeinstallprompt. Must show manual instructions.
// Detect iOS and show 'Tap Share → Add to Home Screen' prompt.
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

const isInStandaloneMode = window.navigator.standalone;
if (isIOS && !isInStandaloneMode) {
showIOSInstallInstructions(); // 'Tap ⎙ then Add to Home Screen'
## }

2.5  PWA Checklist — What Makes a Production-Ready PWA
Category Requirement How to Verify
HTTPS Entire site served over HTTPS
(localhost exempt for dev)
Check address bar / devtools
Security panel
Manifest Valid manifest: name,
short_name, start_url, display,
icons (192+512px), theme_color
Chrome DevTools → Application
## → Manifest
Service Worker SW registered and active,
controlling the page
DevTools → Application →
## Service Workers
Offline page App renders something useful
when offline (not browser error)
DevTools → Network → Offline
checkbox → Refresh
Fast load Initial load <3s on 3G. Core Web
Vitals: LCP <2.5s, INP <200ms,
## CLS <0.1
Lighthouse audit → PWA +
## Performance
Responsive Works on all screen sizes:
mobile, tablet, desktop
Chrome DevTools → device
toolbar
iOS Safari apple-mobile-web-app-capable
meta tag. App icons specified via
apple-touch-icon.
Test on real Safari iOS
Update flow New SW detected and user
notified to update
Manual test: deploy new SW,
reload, check for update prompt
Install prompt Custom install prompt shown at
appropriate moment (not on first
visit)
beforeinstallprompt handler
implemented
Maskable icon 512x512 maskable icon for
adaptive icon on Android
maskable.app to verify safe zone

## REAL WORLD
Flipkart's Flipkart Lite PWA reduced data usage by 3x and increased time-on-site
by 3x. Users who added it to their home screen converted 70% higher than mobile
web users. This is why Flipkart invested heavily in PWA before native apps had the
same reach in Tier-2 and Tier-3 Indian cities with slow networks.

## Interview Q
What are the three technical requirements for a website to be installable as a
## PWA?
## Interview Q
Explain the app-shell model. What goes in the shell vs what is loaded as data?
## Interview Q
iOS Safari doesn't support beforeinstallprompt. How do you handle the install flow
on iOS?
## Interview Q
What is the difference between the 'any' and 'maskable' icon purposes in the Web
## App Manifest?

## References
- web.dev — Learn PWA

- MDN — Progressive Web Apps
- web.dev — Add a web app manifest
- maskable.app — Test maskable icons
- web.dev — Making PWAs installable


Topic 3   Service Workers — The Engine of Offline
## Support

A Service Worker is a JavaScript file that runs in a background thread, completely separate from the web page.
It acts as a programmable network proxy, intercepting every fetch request from your page and deciding the
response — from cache, network, or both. It is the single most important API for offline support and is required
for every production PWA.

3.1  Service Worker vs Web Worker — The Critical Distinction
## Dimension Service Worker Web Worker
Purpose Network proxy + offline caching + push
notifications + background sync
CPU-intensive computation
off the main thread (heavy
algorithms, data
processing)
DOM access None — runs in separate context entirely None — runs in separate
context entirely
Network access Yes — INTERCEPTS all fetch requests
from the page
Yes — can fetch, but does
NOT intercept page
requests
Lifecycle Persistent — survives page close, starts on
demand by browser
Tied to page — destroyed
when page closes or
worker.terminate() called
Registration navigator.serviceWorker.register('/sw.js') new Worker('/worker.js')
Scope Registered once per origin/scope, controls
all matching pages
One instance per page that
creates it
Use cases Caching, offline, push, background sync Image processing, crypto,
compression, physics
simulation
HTTPS required? YES — except localhost No

## 3.2  Service Worker Lifecycle — In Depth
// ── REGISTRATION (in your app's main JS — runs once) ──────────────
async function registerSW() {
if (!('serviceWorker' in navigator)) return; // check support

try {
const registration = await navigator.serviceWorker.register('/sw.js', {
scope: '/',              // controls all pages under '/'
updateViaCache: 'none',  // ALWAYS check server for new SW (ignore HTTP cache)
## });

// Listen for SW updates
registration.addEventListener('updatefound', () => {
const newSW = registration.installing;
newSW.addEventListener('statechange', () => {
if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
// A NEW SW is installed but waiting — old SW still active
showUpdateBanner(); // 'New version available. Click to update.'

## }
## });
## });

// Tell waiting SW to activate immediately when user clicks 'Update'
document.getElementById('update-btn').addEventListener('click', () => {
registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
## });

} catch (err) {
console.error('SW registration failed:', err);
## }
## }
registerSW();

// Reload page when new SW takes control
navigator.serviceWorker.addEventListener('controllerchange', () => {
window.location.reload();
## });

// ── IN sw.js — INSTALL EVENT ──────────────────────────────────────
// Fires when SW is downloading and installing
// This is the ONLY place to reliably pre-cache the app shell
const CACHE_NAME = 'app-shell-v4';
const APP_SHELL  = ['/', '/offline.html', '/main.abc123.js',
## '/styles.xyz789.css', '/icons/icon-192.png'];

self.addEventListener('install', (event) => {
event.waitUntil(                       // keeps SW installing until promise resolves
caches.open(CACHE_NAME)
.then(cache => cache.addAll(APP_SHELL))  // pre-cache app shell
## .then(() => {
// self.skipWaiting() — activate immediately, don't wait for old SW to die
// USE WITH CAUTION: if page has old SW and new SW at same time,
// you can have code version mismatch in the same session.
// SAFER: wait for user to close all tabs OR show update notification.
// self.skipWaiting();
## })
## );
## });

// Handle skipWaiting message from page
self.addEventListener('message', (event) => {
if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
## });

## // ── ACTIVATE EVENT ────────────────────────────────────────────────
// Fires when SW becomes the active controller
// Clean up old caches here
self.addEventListener('activate', (event) => {
event.waitUntil(
caches.keys().then(cacheNames =>
## Promise.all(
cacheNames
.filter(name => name !== CACHE_NAME)  // delete old versions
.map(name => caches.delete(name))
## )
).then(() => self.clients.claim())   // take control of all open pages NOW
// clients.claim() means pages already open are controlled by this SW
// Without it: existing open pages use old SW until they reload
## );
## });

## 3.3  The Five Caching Strategies — With Full Code

// ── STRATEGY 1: CACHE FIRST (offline-first) ──────────────────────
// Serve from cache. Fetch from network only on cache miss.
// Best for: app shell, static assets, fonts, icons
async function cacheFirst(request, cacheName = CACHE_NAME) {
const cached = await caches.match(request);
if (cached) return cached;

const fresh = await fetch(request);
if (fresh.ok) {
const cache = await caches.open(cacheName);
cache.put(request, fresh.clone());
## }
return fresh;
## }

## // ── STRATEGY 2: NETWORK FIRST ─────────────────────────────────────
// Always try network. Fall back to cache on failure.
// Best for: API data that should be fresh but needs offline fallback
async function networkFirst(request, cacheName = CACHE_NAME, timeoutMs = 4000) {
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), timeoutMs);

try {
const fresh = await fetch(request, { signal: controller.signal });
clearTimeout(timeout);
if (fresh.ok) {
const cache = await caches.open(cacheName);
cache.put(request, fresh.clone());
## }
return fresh;
} catch {
clearTimeout(timeout);
const cached = await caches.match(request);
if (cached) return cached;
// Return custom offline JSON response for API calls
return new Response(JSON.stringify({ offline: true, data: [] }), {
headers: { 'Content-Type': 'application/json' }
## });
## }
## }

## // ── STRATEGY 3: STALE-WHILE-REVALIDATE ────────────────────────────
// Serve from cache immediately. Fetch in background to update cache.
// Best for: listings, feeds, content that can be slightly stale
async function staleWhileRevalidate(request, cacheName = CACHE_NAME) {
const cached      = await caches.match(request);
const networkFetch = fetch(request).then(async fresh => {
if (fresh.ok) {
const cache = await caches.open(cacheName);
await cache.put(request, fresh.clone());
## }
return fresh;
}).catch(() => null);

// Serve stale immediately if available, fresh when network responds
return cached ?? networkFetch;
## }

## // ── STRATEGY 4: CACHE ONLY ────────────────────────────────────────
// Only serve from cache. Network never consulted.
// Best for: pre-cached assets at install time
async function cacheOnly(request) {
const cached = await caches.match(request);
if (!cached) throw new Error('Not in cache: ' + request.url);
return cached;
## }


## // ── STRATEGY 5: NETWORK ONLY ──────────────────────────────────────
// Always fetch from network. Cache not used.
// Best for: real-time data, payments, analytics events
async function networkOnly(request) {
return fetch(request); // no cache involvement at all
## }

// ── FETCH HANDLER — routing to the right strategy ─────────────────
self.addEventListener('fetch', (event) => {
const { request } = event;
const url = new URL(request.url);

// Skip non-GET requests from caching (POST, PUT, DELETE)
if (request.method !== 'GET') return;

// Skip cross-origin requests unless explicitly handling them
if (url.origin !== self.location.origin) return;

// App shell assets → cache first
if (APP_SHELL.includes(url.pathname) ||
## /\.(js|css|png|webp|woff2|svg)$/.test(url.pathname)) {
event.respondWith(cacheFirst(request));
return;
## }

// Product listings API → stale-while-revalidate
if (url.pathname.startsWith('/api/products') ||
url.pathname.startsWith('/api/restaurants')) {
event.respondWith(staleWhileRevalidate(request, 'api-content'));
return;
## }

// User-specific API data → network first
if (url.pathname.startsWith('/api/')) {
event.respondWith(networkFirst(request, 'api-data'));
return;
## }

// Page navigations → network first with offline fallback
if (request.mode === 'navigate') {
event.respondWith(
networkFirst(request).catch(() => caches.match('/offline.html'))
## );
return;
## }
## });

3.4  Workbox — Production-Grade Service Workers
Workbox is Google's library for Service Worker development. It provides tested, production-ready
implementations of all caching strategies, precaching, expiration plugins, and Background Sync. For any
production PWA, Workbox is the right abstraction over raw Service Worker code.
## // ── Install ──────────────────────────────────────────────────────
// npm install workbox-cli workbox-precaching workbox-routing
// npm install workbox-strategies workbox-expiration
// npm install workbox-background-sync

// ── sw.js with Workbox ───────────────────────────────────────────
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute }          from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate, NetworkOnly }
from 'workbox-strategies';

import { ExpirationPlugin }                        from 'workbox-expiration';
import { CacheableResponsePlugin }                 from 'workbox-cacheable-response';
import { BackgroundSyncPlugin }                    from 'workbox-background-sync';

## // ── 1. PRECACHE APP SHELL ────────────────────────────────────────
// __WB_MANIFEST is injected by workbox-webpack-plugin / vite-plugin-pwa
// It contains the list of all build assets with revision hashes
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches(); // delete caches from previous SW versions

// ── 2. RUNTIME CACHING — static assets ───────────────────────────
registerRoute(
({ request }) => request.destination === 'image' ||
request.destination === 'font',
new CacheFirst({
cacheName: 'static-assets',
plugins: [
new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30*24*60*60 }),
new CacheableResponsePlugin({ statuses: [0, 200] }),
## ]
## })
## );

// ── 3. RUNTIME CACHING — API listings ────────────────────────────
registerRoute(
({ url }) => url.pathname.startsWith('/api/restaurants') ||
url.pathname.startsWith('/api/menu'),
new StaleWhileRevalidate({
cacheName: 'api-listings',
plugins: [
new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 5*60 }),
new CacheableResponsePlugin({ statuses: [200] }),
## ]
## })
## );

// ── 4. RUNTIME CACHING — user API data ───────────────────────────
registerRoute(
({ url }) => url.pathname.startsWith('/api/user') ||
url.pathname.startsWith('/api/orders'),
new NetworkFirst({
cacheName: 'api-user-data',
networkTimeoutSeconds: 4,
plugins: [
new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 24*60*60 }),
new CacheableResponsePlugin({ statuses: [200] }),
## ]
## })
## );

// ── 5. BACKGROUND SYNC for offline mutations ──────────────────────
const bgSyncPlugin = new BackgroundSyncPlugin('offline-mutations', {
maxRetentionTime: 24 * 60, // retry for up to 24 hours (in minutes)
## });

registerRoute(
({ url, request }) =>
url.pathname.startsWith('/api/') && request.method !== 'GET',
new NetworkOnly({ plugins: [bgSyncPlugin] })
## );
// When a POST/PUT/DELETE fails (offline), Workbox queues it in IDB
// and replays it automatically when connectivity returns.

## // ── 6. NAVIGATION FALLBACK ────────────────────────────────────────
registerRoute(
new NavigationRoute(async () => {

try {
return await fetch(event.request);
} catch {
return caches.match('/offline.html');
## }
## })
## );

3.5  Workbox + Vite/Next.js — Real Project Setup
// ── Vite + vite-plugin-pwa (the recommended setup) ──────────────
// npm install -D vite-plugin-pwa

// vite.config.ts
import { defineConfig } from 'vite';
import { VitePWA }      from 'vite-plugin-pwa';

export default defineConfig({
plugins: [
VitePWA({
registerType: 'prompt',   // 'autoUpdate' | 'prompt' | 'autoUpdate'
// 'prompt': shows your custom update notification
// 'autoUpdate': auto-updates silently (risk: breaks active sessions)

workbox: {
globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
runtimeCaching: [
## {
urlPattern: /^\/api\/restaurants/,
handler: 'StaleWhileRevalidate',
options: {
cacheName: 'api-listings',
expiration: { maxEntries: 50, maxAgeSeconds: 300 },
## }
## },
## {
urlPattern: /^\/api\//,
handler: 'NetworkFirst',
options: { cacheName: 'api-data', networkTimeoutSeconds: 4 }
## }
## ]
## },

manifest: {
name: 'Swiggy Food Delivery',
short_name: 'Swiggy',
theme_color: '#FC8019',
icons: [
{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png',
purpose: 'any maskable' }
## ]
## }
## })
## ]
## });

// ── In your React app: show update prompt ──────────────────────────
import { useRegisterSW } from 'virtual:pwa-register/react';

function UpdatePrompt() {
const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
onRegistered(r) { console.log('SW registered:', r); },
onRegisterError(e) { console.error('SW error:', e); },

## });

if (!needRefresh) return null;
return (
<div className='update-toast'>
<span>New version available!</span>
<button onClick={() => updateServiceWorker(true)}>Update</button>
## </div>
## );
## }

## 3.6  Background Sync — Reliable Offline Mutations
Background Sync fires when connectivity is restored, even if the user has closed your app. It guarantees
delivery of queued mutations. Combined with idempotency keys, it ensures mutations are applied exactly once
even if the device reconnects multiple times.
## // ── COMPLETE OFFLINE MUTATION FLOW ────────────────────────────────

// Step 1: In the app — attempt the mutation
async function placeOrder(order) {
const idemKey = crypto.randomUUID(); // idempotency key — prevents duplicates

// Store in IDB queue BEFORE trying network
// (ensures we never lose the order even if app crashes mid-request)
await idb.add('pendingOrders', {
id:         idemKey,
order,
createdAt:  Date.now(),
retries:    0,
## });

// Update UI optimistically
showOrderConfirmation(order);

if (navigator.onLine) {
await sendOrderToServer(idemKey, order);
} else {
// Register background sync for when connectivity returns
const reg = await navigator.serviceWorker.ready;
await reg.sync.register('sync-orders');
showBanner('Order saved. Will submit when online.');
## }
## }

async function sendOrderToServer(idemKey, order) {
const res = await fetch('/api/orders', {
method:  'POST',
headers: {
'Content-Type':    'application/json',
'Idempotency-Key': idemKey, // server deduplicates on this key
## },
body: JSON.stringify(order),
## });
if (res.ok) await idb.delete('pendingOrders', idemKey); // remove from queue
return res;
## }

// Step 2: In sw.js — handle sync event
self.addEventListener('sync', (event) => {
if (event.tag === 'sync-orders') {
event.waitUntil(flushPendingOrders());
## }
## });


async function flushPendingOrders() {
const pending = await idb.getAll('pendingOrders');

for (const item of pending) {
try {
await sendOrderToServer(item.id, item.order);
// sendOrderToServer deletes from IDB on success
} catch (err) {
const maxRetries = 5;
if (item.retries >= maxRetries) {
// Give up — notify user
await idb.delete('pendingOrders', item.id);
self.registration.showNotification('Order failed', {
body: 'We could not submit your order. Please try again.',
icon: '/icons/icon-192.png',
## });
} else {
await idb.put('pendingOrders', { ...item, retries: item.retries + 1 });
// event.lastChance: if true, browser won't retry — handle gracefully
if (event.lastChance) {
throw err; // let the SW framework handle retry scheduling
## }
## }
## }
## }
## }

## 3.7  Conflict Resolution — When Offline Meets Concurrent Edits
The hardest problem in offline support: two users edit the same data while one is offline. When the offline user
reconnects, their version conflicts with the server's version. There is no perfect solution — you must choose a
strategy that fits your domain.
## Strategy How It Works Best For Worst For
## Last Write Wins
## (LWW)
Server accepts the
most recent timestamp.
Earlier write is silently
discarded.
Low-stakes data:
preferences, settings,
view counts.
## Collaborative
documents: silent data
loss is unacceptable.
Server Wins Server state always
takes precedence.
Client changes are
rejected if server has
newer version.
Financial data,
inventory, authoritative
records.
User-facing editors:
'Your changes were
discarded' is terrible
## UX.
Client Wins Client always
overwrites server.
Server is just a sync
target.
Single-user apps where
the device IS the
source of truth.
Multi-device or multi-
user apps: data
conflicts destroy
consistency.
## Merge / Three-way
merge
Diff the client version,
server version, and last-
known-common-
ancestor. Auto-merge
non-conflicting fields.
Flag real conflicts for
user.
Structured data: form
fields, task items,
document sections.
Unstructured text or
data without clear field
boundaries.
CRDTs (Conflict-free
## Replicated Data
## Types)
Mathematical data
structures that always
converge to the same
Real-time collaborative
apps: shared
whiteboards, code
editors, shared docs.
Simple apps: massive
complexity overhead for
little gain.

state regardless of
merge order.
## Operational
Transform (OT)
Transform operations
so they can be applied
in any order and still
converge. Each change
is an operation, not a
snapshot.
## Google Docs-style
character-by-character
collaborative text
editing.
Non-text domains: OT
is designed for text.

// ── Three-Way Merge — practical implementation for form data ──────
async function syncFormData(local, localBase, server) {
// local:     what the offline user has now
// localBase: what local was when they went offline (last-known-server-state)
// server:    what server has now (another user may have edited it)

const merged = {};
const conflicts = [];

for (const key of Object.keys({ ...local, ...server })) {
const localChanged  = local[key]  !== localBase[key];
const serverChanged = server[key] !== localBase[key];

if (!localChanged && !serverChanged) {
merged[key] = server[key];  // unchanged — use either
} else if (localChanged && !serverChanged) {
merged[key] = local[key];   // only local changed — use local
} else if (!localChanged && serverChanged) {
merged[key] = server[key];  // only server changed — use server
} else if (local[key] === server[key]) {
merged[key] = local[key];   // both changed to same value — fine
} else {
// REAL CONFLICT: both changed to different values
conflicts.push({ key, localValue: local[key], serverValue: server[key] });
## }
## }

if (conflicts.length > 0) {
// Show conflict resolution UI to user
const resolved = await showConflictModal(conflicts);
resolved.forEach(({ key, value }) => { merged[key] = value; });
## }

return merged;
## }

// ── Version vectors / ETags for detecting conflicts ──────────────
// Server returns ETag (version fingerprint) with every response
// Client stores ETag alongside local data
// On sync: send ETag in If-Match header
const res = await fetch('/api/document/1', {
method: 'PUT',
headers: {
'Content-Type': 'application/json',
'If-Match': storedETag, // '"v7"' — server rejects if version changed
## },
body: JSON.stringify(localData),
## });

if (res.status === 412) {
// 412 Precondition Failed: server version changed since we last fetched
// Fetch server version, run three-way merge, show conflict UI if needed
const serverData = await fetch('/api/document/1').then(r => r.json());
const resolved = await syncFormData(localData, localBase, serverData);

await submitResolved(resolved);
## }

## 3.8  Push Notifications — The Re-engagement Loop
// Push notifications require a Service Worker to receive them
// even when the app is closed.

// ── Step 1: Request permission ────────────────────────────────────
async function requestPushPermission() {
// BEST PRACTICE: only ask after a meaningful user action
// (not on first page load — that kills opt-in rates)
const permission = await Notification.requestPermission();
if (permission !== 'granted') return null;

const reg = await navigator.serviceWorker.ready;
const subscription = await reg.pushManager.subscribe({
userVisibleOnly: true,  // required: every push must show a notification
applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
## });

// Send subscription to server (endpoint + keys)
await fetch('/api/push/subscribe', {
method: 'POST',
body:   JSON.stringify(subscription),
headers: { 'Content-Type': 'application/json' },
## });

return subscription;
## }

// ── Step 2: In sw.js — receive and show notification ─────────────
self.addEventListener('push', (event) => {
const data = event.data?.json() ?? {};
event.waitUntil(
self.registration.showNotification(data.title || 'New notification', {
body:    data.body,
icon:    '/icons/icon-192.png',
badge:   '/icons/badge-72.png',
image:   data.image,              // large image above notification body
tag:     data.tag,                // replaces existing notification with same tag
renotify: true,                   // vibrate even if replacing (tag set)
actions: [                        // action buttons
{ action: 'view',    title: 'View Order' },
{ action: 'dismiss', title: 'Dismiss' },
## ],
data: { url: data.url, orderId: data.orderId }
## })
## );
## });

// ── Step 3: Handle notification click ─────────────────────────────
self.addEventListener('notificationclick', (event) => {
event.notification.close();

if (event.action === 'dismiss') return;

// Open or focus the app
event.waitUntil(
clients.matchAll({ type: 'window' }).then(windowClients => {
const targetUrl = event.notification.data.url;
// If app already open in a tab, focus it
const existing = windowClients.find(c => c.url === targetUrl);
if (existing) return existing.focus();

// Otherwise open a new window
return clients.openWindow(targetUrl);
## })
## );
## });

3.9  Periodic Background Sync — Keep Data Fresh While App is Closed
// Periodic Background Sync: browser wakes up your SW on a schedule
// Even when user has app closed. Requires permission grant.

// Register in the app:
async function registerPeriodicSync() {
const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
if (status.state !== 'granted') return;

const reg = await navigator.serviceWorker.ready;
await reg.periodicSync.register('refresh-feed', {
minInterval: 24 * 60 * 60 * 1000, // at most once per 24 hours
## });
## }

// In sw.js — handle the periodic sync
self.addEventListener('periodicsync', (event) => {
if (event.tag === 'refresh-feed') {
event.waitUntil(refreshLocalFeedCache());
## }
## });

async function refreshLocalFeedCache() {
try {
const data = await fetch('/api/feed').then(r => r.json());
await idb.set('feed', { data, ts: Date.now() });
// Optionally send a push notification: 'Your feed has been updated'
} catch {
// Silent fail — will retry next scheduled interval
## }
## }

// Use cases:
// - News app: prefetch articles overnight so they are ready in the morning
// - Email: pre-download headers so inbox is instant on open
// - Weather: pre-fetch tomorrow's forecast

## Interview Q
Explain the Service Worker lifecycle: install, activate, fetch. What happens when
you deploy a new SW version and users already have the old one active?
## Interview Q
What does skipWaiting() do? Why is it risky to call it automatically?
## Interview Q
What is Workbox? Give three concrete advantages over writing raw Service
Worker code.
## Interview Q
A user places an order while offline. Walk me through the complete journey from
user tap to server confirmation, including failure handling and retry.
## Interview Q
Two users edit the same document simultaneously while one is offline. When the
offline user reconnects, how do you handle the conflict? Name two algorithms.
## Interview Q
What is the difference between Background Sync and Periodic Background Sync?
Give a use case for each.

## References

## • Workbox — Official Documentation
- vite-plugin-pwa — Vite integration
- MDN — Using Service Workers
- web.dev — Service Workers: an introduction
- web.dev — Background Sync
## • Jake Archibald — Offline Cookbook
- CRDT resources — crdt.tech


Topic 4   Interview Questions — Model Answers for
## Offline Support

These 15 questions are drawn from real senior frontend interviews at Flipkart, Microsoft, Adobe, CRED, Swiggy,
and Uber. Each answer demonstrates the depth of thinking expected at senior level — not just what, but why
and what are the trade-offs.

Q1: What is a Service Worker? How is it different from a regular JavaScript
file?
A Service Worker is a JavaScript file that runs in a background thread, separate from both the main page thread
and Web Workers. Its defining capability is that it acts as a network proxy — it can intercept every HTTP request
from the page and decide the response: serve from cache, fetch from network, return a custom response, or
queue the request for later.
Key differences from regular JS: it runs even when the page is closed (persistent lifecycle), it cannot access the
DOM, it must be served over HTTPS, it has an explicit lifecycle (install → activate → fetch), and it is registered
against a scope — all pages under that scope are under its control. A regular JS file is destroyed when the tab
closes. A SW is not.

Q2: Walk me through what happens the first time a user visits a PWA.
-  Browser downloads and parses HTML, CSS, and JavaScript.
-  Main JS calls navigator.serviceWorker.register('/sw.js').
-  Browser downloads sw.js. The SW enters the 'installing' state.
-  The install event fires in sw.js. Typically: open a cache and call cache.addAll(APP_SHELL).
event.waitUntil() holds the SW in 'installing' until the cache is populated.
-  If cache.addAll succeeds: SW moves to 'installed' (waiting) state. On first visit: no old SW exists, so it
immediately moves to 'activated'.
-  The activate event fires. Clean up old caches. Call self.clients.claim() to take control of the current page.
-  From this point: all fetch events from the page are intercepted by the SW.
-  Second visit (or refresh): app shell served from cache in under 100ms. Network request sent for data.
User sees the app instantly.

Q3: What is the difference between cache.addAll() in install and runtime
caching in fetch?
cache.addAll() at install time is PRECACHING — you define an explicit list of files to download and cache before
the SW is active. If any file fails to download, the entire install fails and the SW is abandoned. This guarantees
the listed files are always available offline but requires knowing their URLs at build time (solved by Workbox
injecting the manifest).
Runtime caching in the fetch handler is dynamic — you cache responses as the user naturally navigates. You
cannot guarantee these assets are available for the first offline use, but you also do not need to enumerate them
at build time. Workbox strategies like CacheFirst and StaleWhileRevalidate implement runtime caching with
expiration and size limits.
Production apps use BOTH: precache the app shell, runtime-cache API responses and additional assets.

Q4: How do you handle a Service Worker update without breaking users in
mid-session?

This is the skipWaiting dilemma. When a new SW is installed, it waits in 'installed' state because the old SW is
still controlling open tabs. If you call skipWaiting() automatically, the new SW takes over immediately — but if
the page has loaded assets from the old SW's cache and now tries to load more from a different version, you
get a mixed-version page which can break JavaScript module loading.
The correct pattern: let the new SW wait. Detect it via the updatefound event and show a banner: 'New version
available. Click to update.' When the user clicks, postMessage SKIP_WAITING to the waiting SW. The SW calls
skipWaiting(), takes control, and you reload the page — the user now runs the new version cleanly from the
start.
// Detect waiting SW
registration.addEventListener('updatefound', () => {
registration.installing.addEventListener('statechange', () => {
if (registration.waiting) showUpdateBanner();
## });
## });

// User clicks update
registration.waiting.postMessage({ type: 'SKIP_WAITING' });

// SW activates, page reloads
navigator.serviceWorker.addEventListener('controllerchange', () => {
window.location.reload();
## });

Q5: Design the offline strategy for a food delivery app like Swiggy.
The question is: what should a user be able to do without internet on Swiggy? The answer depends on use
cases:
## Feature Offline Strategy Cache Source Degradation
Browse restaurant list Stale-while-revalidate SW runtime cache (5
min TTL)
User sees last-seen list.
'Showing cached
results' banner.
View menu Cache First SW runtime cache (30
min TTL)
User sees last-cached
menu. Cannot order
## (mutation).
Place order Optimistic + IDB queue
## + Background Sync
IndexedDB pending
queue
'Order saved, will
confirm when online'
toast.
Track delivery Network only No cache 'Tracking unavailable
offline' with last known
location.
Order history Network First + IDB
fallback
IndexedDB User sees cached order
history. Badge shows
'may be outdated'.
Search Network Only No cache Search input disabled
with 'Connect to internet
to search'.
App shell (header,
nav, skeleton)
## Cache First —
precached at install
SW precache Instant load. Zero
latency.

Q6: What is an idempotency key and why is it critical for offline mutations?
When a user submits a form while offline, the SW queues the mutation. When connectivity returns, Background
Sync fires and replays it. But what if the first attempt reaches the server, the server processes it successfully,

but the response never makes it back to the client (network drops between response sending and client
receiving)? Background Sync will retry — and you'll place the order twice.
An idempotency key is a unique ID (UUID) generated by the client for each mutation. It is sent as a header
(Idempotency-Key: <uuid>). The server stores 'I have already processed mutation with this key' and returns the
same response for any repeat. Even if the mutation is replayed 5 times, it is applied exactly once. This is the
only correct solution to the at-least-once delivery problem.

Q7: What is the app-shell model? When would you NOT use it?
The app-shell model separates the UI skeleton (shell) from content (data). The shell — HTML, CSS, and JS for
the nav, headers, and layout — is precached at SW install and served instantly from cache on every visit.
Content is loaded from the network and injected into the shell.
When NOT to use it: server-side rendered applications where the HTML IS the content. A Next.js page that
renders a full article with text, images, and metadata as the initial HTML cannot use an app shell because there
is no 'shell' separate from 'content'. For SSR apps: cache individual rendered pages at the CDN edge and use a
stale-while-revalidate strategy at the CDN layer instead.

Q8: How do you build an offline fallback page?
// 1. Create /public/offline.html — a branded, helpful page
// Should include: your logo, message explaining the situation,
// links to cached pages the user might have already visited,
// a 'Try again' button that does location.reload()

// 2. Precache it at SW install
const APP_SHELL = ['/', '/offline.html', ...otherAssets];
self.addEventListener('install', e =>
e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL))))

// 3. Serve it for failed navigation requests
self.addEventListener('fetch', (event) => {
if (event.request.mode === 'navigate') {
event.respondWith(
fetch(event.request)
.catch(() => caches.match('/offline.html'))
## );
## }
## });

// 4. Enhanced: list cached pages the user can still access
// offline.html can query Cache API and show available pages:
const cacheNames = await caches.keys();
for (const name of cacheNames) {
const cache = await caches.open(name);
const keys  = await cache.keys();
const pageUrls = keys
.map(r => r.url)
.filter(url => url.includes(location.origin) && !url.endsWith('.js'));
renderCachedPageLinks(pageUrls);
## }

Q9: What is the Cache API vs HTTP Cache (browser cache)?
The browser's built-in HTTP cache is controlled by server-set headers (Cache-Control, ETag, Expires). It is
transparent to your code — the browser manages it automatically. You cannot programmatically read, write, or
delete from it. Its keys are URLs, and it respects HTTP semantics.
The Cache API is a programmatic key-value store controlled entirely by your Service Worker code. You explicitly
open named caches, put responses in, match requests, and delete entries. It is persistent across sessions

(unlike sessionStorage), has no size limits enforced by cache headers, and is accessible from both the SW and
main page thread. The Cache API sits ALONGSIDE the HTTP cache — both exist independently. A request
intercepted by a SW and served from the Cache API bypasses the HTTP cache entirely.

Q10: How do you measure the effectiveness of your offline support?
- Cache hit rate: what percentage of fetch events are served from cache vs network? (Log in SW fetch
handler)
- Time-to-interactive when offline: measure how quickly the app shell appears using performance.mark()
in the SW.
- Offline sessions: track sessions where navigator.onLine was false for > 30 seconds. What did users do?
Did they succeed or see errors?
- Background sync success rate: did queued mutations successfully flush? Track in the sync event
handler.
- SW registration errors: monitor navigator.serviceWorker.register() failures (HTTPS issues, browser
restrictions).
- Update adoption: how long until > 95% of users are on the latest SW version? Long adoption =
skipWaiting strategy is too conservative.

Q11: What is a CRDT and when would you use it for offline conflict
resolution?
A CRDT (Conflict-free Replicated Data Type) is a data structure designed so that any two replicas can be
merged automatically without conflicts, regardless of the order in which operations were applied. Common
CRDTs include G-Counter (grow-only counter), LWW-Register (last-write-wins register), OR-Set (observed-
remove set), and the Yjs library implements a sequence CRDT for collaborative text.
You would use CRDTs when: multiple users or devices edit the same data simultaneously and offline, you need
automatic merge without user intervention, and the data type maps to an available CRDT (text, sets, counters,
maps). You would NOT use CRDTs for: simple apps (massive complexity overhead), financial transactions
(require strict consistency), or data types that do not map cleanly to existing CRDT semantics.
Real examples: Figma uses a custom CRDT for design documents. Linear uses CRDTs for collaborative issues.
Notion uses OT (a related technique) for block-level collaborative editing.

Q12: How does Periodic Background Sync differ from Background Sync?
## Dimension Background Sync Periodic Background Sync
Trigger Fires when connectivity is
restored after being offline
Fires on a schedule (e.g., once per
day) regardless of connectivity loss
Use case Retry failed mutations: orders,
messages, form submissions
Pre-fetch fresh content while app is
closed: news articles, email headers,
weather
Permission No explicit permission needed Requires 'periodic-background-sync'
permission grant (Chrome 80+)
API reg.sync.register('tag') reg.periodicSync.register('tag', {
minInterval })
SW event 'sync' event 'periodicsync' event
Guaranteed timing Fires next time online At most as often as minInterval.
Browser may delay further.


Q13: How would you test offline functionality in your CI/CD pipeline?
// Playwright has built-in network emulation for offline testing
import { test, expect } from '@playwright/test';

test.describe('Offline behaviour', () => {

test('shows cached restaurants when offline', async ({ page, context }) => {
// 1. Load page online first (populate SW cache)
await page.goto('https://app.swiggy.com/');
await page.waitForSelector('[data-testid="restaurant-card"]');

// 2. Go offline
await context.setOffline(true);

// 3. Reload — should serve from SW cache
await page.reload();

// 4. Verify app shell and cached content loads
await expect(page.locator('[data-testid="restaurant-card"]')).toBeVisible();
await expect(page.locator('[data-testid="offline-banner"]')).toBeVisible();
## });

test('shows offline fallback for uncached routes', async ({ page, context }) => {
await page.goto('https://app.swiggy.com/');
await context.setOffline(true);

// Navigate to a page not in cache
await page.goto('https://app.swiggy.com/new-route-never-visited');

// Should see offline.html, not a browser error
await expect(page.locator('text=You are offline')).toBeVisible();
await expect(page.locator('[data-testid="try-again-btn"]')).toBeVisible();
## });

test('queues order submission while offline', async ({ page, context }) => {
await page.goto('https://app.swiggy.com/cart');
await context.setOffline(true);

await page.click('[data-testid="place-order-btn"]');

// Should show 'order queued' message, not an error
await expect(page.locator('[data-testid="order-queued-msg"]')).toBeVisible();

// Go back online — queued order should submit
await context.setOffline(false);
await expect(page.locator('[data-testid="order-confirmed-msg"]')).toBeVisible();
## });
## });

Q14: What cache size limits should you design for?
The Cache API and IndexedDB share an origin's storage quota. The quota is determined by available disk
space — typically 60% of available disk, with a per-origin limit. Chrome allows origins to use up to 60% of disk
space (or 1GB minimum per origin in modern versions). Firefox and Safari have similar limits.
Storage that is NOT marked as persistent can be evicted by the browser under disk pressure (least-recently-
used first). Call navigator.storage.persist() to request persistent storage — the browser will not evict it without
user action. Call navigator.storage.estimate() to monitor usage. In your SW caching strategy: use
ExpirationPlugin to limit cache size (maxEntries and maxAgeSeconds) to prevent unbounded growth. A news
app that caches every article forever will eventually fill the disk.


Q15: A colleague says 'just add a Service Worker and your app is offline-
capable'. Why is this an oversimplification?
A Service Worker alone only handles network request interception. Offline capability requires all of these
working together:
- Cache strategy design: what do you cache (shell vs data), for how long, with what invalidation trigger?
Wrong choices = stale data or cache misses.
- Mutation handling: read-only offline is easy. Write operations require an IDB queue, Background Sync
registration, idempotency keys, and retry logic.
- Conflict resolution: if another device or user changed the same data while you were offline, you need a
merge or conflict-detection strategy.
- UX design: users must be told what they can and cannot do offline. Optimistic updates must be visually
distinct. Sync status must be communicated.
- Testing: offline scenarios require deliberate testing with network throttling, Playwright offline mode, and
manual device airplane mode tests.
- Storage limits: unbounded caching fills user's disk. Must implement eviction policies.
- iOS Safari limitations: no beforeinstallprompt, limited SW capabilities, no Background Sync support (as
of 2025 — partial only).
A well-designed offline experience is a system, not a feature toggle.


Master Cheat Sheet   Offline Support at a Glance

## Cache Strategy Selection Guide
Content Type Strategy TTL / Limits Fallback
App shell (index.html,
main.js, styles.css)
## Cache First —
precached at install
Versioned: invalidated
on new deploy
None needed —
always in cache
Static assets (images,
fonts, icons)
Cache First — runtime maxAgeSeconds: 30
days, maxEntries: 100
Placeholder image /
system font
API listings
## (restaurants,
products, feed)
Stale-While-Revalidate maxAgeSeconds: 5 min,
maxEntries: 50
Show cached with
staleness banner
User-specific API data
(profile, orders)
## Network First (4s
timeout)
maxAgeSeconds: 24h,
maxEntries: 30
Show cached with 'may
be outdated' note
Real-time data (live
tracking, stock prices)
Network Only No caching 'Unavailable offline'
message
## POST / PUT / DELETE
mutations
## Network Only +
## Background Sync
## Plugin
IDB queue: 24h
retention, 5 retries
Optimistic UI + 'queued'
indicator
Page navigations
## (HTML)
## Network First →
/offline.html fallback
Short TTL or no cache Branded offline.html
with cached links

The Six-Step Offline Answer Framework
-  DETECT — Use online/offline events + periodic fetch test. Never trust navigator.onLine alone.
- CACHE — App shell precached at SW install. API data cached at runtime with appropriate strategy per
content type.
- QUEUE — All write operations stored in IndexedDB with idempotency key before attempting network.
- SYNC — Background Sync fires when connectivity returns. Flush IDB queue with retry and failure
handling.
- RESOLVE — If server state diverged: LWW / server-wins / three-way merge / CRDT depending on data
type and domain.
- NOTIFY — Users always know: 'Showing cached data', 'Order queued', 'Sync complete', 'Conflict
detected'.

API Purpose Key Method
Cache API Programmatic
request/response cache
controlled by SW
caches.open(), cache.put(),
caches.match()
IndexedDB Structured data for offline
queues, large datasets, local
## DB
idb.add(), idb.get(), idb.getAll(),
idb.delete()
Background Sync Replay queued mutations
when connectivity returns
reg.sync.register('tag'), SW: 'sync'
event
Periodic Background Sync Pre-fetch data on a schedule
while app is closed
reg.periodicSync.register('tag',
{minInterval})

Push API Server-to-client notifications
even when app is closed
pushManager.subscribe(), SW: 'push'
event
navigator.storage Check quota, request
persistent storage
storage.estimate(), storage.persist()
Network Information API Connection type and speed
for adaptive loading
navigator.connection.effectiveType
Web App Manifest Installability, icons, splash
screen, display mode
<link rel='manifest'
href='/manifest.json'>

## KEY INSIGHT
The offline support interview answer at senior level demonstrates: (1) you know the
tradeoffs of each caching strategy, (2) you have solved the mutation problem with
IDB + Background Sync + idempotency, (3) you understand conflict resolution
options beyond 'last write wins', (4) you can design the UX for each network state,
and (5) you know how to test and measure offline behaviour in CI. That is the
complete picture.

An app that works offline is not a feature — it is a promise to your users that you respect
their time and connection.