#### Namaste Frontend System Design
Chapter 6: Database & Caching
In-Depth Interview Guide | 7 Topics | Code Examples | Trade-offs
Topic What It Covers Interview Weight
Local Storage Persistent key-value browser
storage, cross-tab sync, security
High
Session Storage Tab-scoped temporary storage,
form state, A/B testing
Medium
Cookie Storage HttpOnly, SameSite, CSRF, auth
token strategy
Very High
IndexedDB Structured client-side DB, async
API, offline-first patterns
Medium-High
Normalization Data shaping on client, denorm
trade-offs, state shape design
Medium
HTTP Caching Cache-Control, ETags, CDN,
cache-busting, stale-while-
revalidate
Very High
Service Worker Caching Offline strategies, Cache API,
background sync, PWA
High
Topic 1 Local Storage
localStorage is a synchronous, origin-scoped, persistent key-value store built into every modern browser. Data
survives browser restarts, tab closures, and OS reboots. It is the simplest persistence mechanism — and the
most frequently misused one in interviews.
1.1 Core API & Mechanics
// ── Basic CRUD ──────────────────────────────────────────────────
```
localStorage.setItem('theme', 'dark');
```
```
const theme = localStorage.getItem('theme'); // 'dark' | null
```
```
localStorage.removeItem('theme');
```
```
localStorage.clear(); // removes ALL keys
```
```
localStorage.length; // number of stored items
```
```
localStorage.key(0); // first key by index
```
// ── Strings only — must JSON.stringify objects ───────────────────
```
const user = { id: 1, name: 'Rushikesh', prefs: { lang: 'en' } };
```
```
localStorage.setItem('user', JSON.stringify(user));
```
```
const stored = JSON.parse(localStorage.getItem('user') || 'null');
```
```
// ── Robust helper (handles null + parse errors) ──────────────────
```
```
function getLS(key, fallback = null) {
```
```
try {
```
```
const raw = localStorage.getItem(key);
```
```
return raw !== null ? JSON.parse(raw) : fallback;
```
```
} catch { return fallback; } // corrupted data won't crash app
```
```
}
```
```
// ── Quota guard (~5MB per origin) ────────────────────────────────
```
```
try {
```
```
localStorage.setItem('big', veryLargeString);
```
```
} catch (e) {
```
```
if (e.name === 'QuotaExceededError') {
```
```
evictOldEntries(); // LRU eviction strategy
```
```
}
```
```
}
```
1.2 Cross-Tab Synchronisation — The Storage Event
The storage event fires in every OTHER tab of the same origin when localStorage changes. This gives you real-
time cross-tab sync without WebSockets or polling — it is free and built-in.
// Tab A makes a change
```
localStorage.setItem('theme', 'dark');
```
```
// → storage event fires in Tab B, Tab C (NOT in Tab A itself)
```
// Tab B listens
```
window.addEventListener('storage', (event) => {
```
```
// event.key — which key changed ('theme')
```
```
// event.oldValue — previous value ('light')
```
```
// event.newValue — new value ('dark') — null if removed
```
// event.url — URL of the tab that made the change
// event.storageArea — the localStorage object
```
if (event.key === 'theme') applyTheme(event.newValue);
```
```
if (event.key === 'auth' && event.newValue === null) {
```
// logout fired in another tab → redirect to login here too
```
window.location.href = '/login';
```
```
}
```
```
});
```
// Real-world cross-tab sync use cases:
// • Dark mode toggle → all tabs update instantly
// • Logout in one tab → all tabs redirect to /login
// • Cart update in one tab → badge count updates in all tabs
// • User changes language → all tabs switch immediately
1.3 Versioned localStorage Cache with TTL
```
Using localStorage as an API cache is a common pattern — but must be done with version keys (to handle
```
```
schema changes on deploy) and TTL (to prevent stale data).
```
```
const CACHE_V = 'v2'; // bump on schema change
```
```
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
```
```
const get = (key) => {
```
```
try {
```
```
const raw = localStorage.getItem(`${CACHE_V}:${key}`);
```
```
if (!raw) return null;
```
```
const { data, exp } = JSON.parse(raw);
```
```
if (Date.now() > exp) { localStorage.removeItem(`${CACHE_V}:${key}`); return null; }
```
```
return data;
```
```
} catch { return null; }
```
```
};
```
```
const set = (key, data, ttl = CACHE_TTL) => {
```
```
try {
```
```
localStorage.setItem(`${CACHE_V}:${key}`, JSON.stringify({
```
```
data, exp: Date.now() + ttl
```
```
}));
```
```
} catch (e) {
```
```
if (e.name === 'QuotaExceededError') clearOldVersionEntries();
```
```
}
```
```
};
```
```
async function getCategories() {
```
```
const cached = get('categories');
```
```
if (cached) return cached; // serve from LS instantly
```
```
const fresh = await api.getCategories(); // network only on miss
```
```
set('categories', fresh);
```
```
return fresh;
```
```
}
```
1.4 Security — What Belongs and What Does NOT
Data Type localStorage OK? Why / Alternative
Theme, language, layout prefs YES Low sensitivity. Persistent UX
benefit. Correct use.
JWT / Access Token NO Any JS on page reads it. XSS
attack steals it instantly. Use
HttpOnly cookie.
Refresh Token NO Same XSS risk, worse
```
consequence (long-lived). Use
```
HttpOnly cookie.
```
PII (email, phone) Avoid No encryption. Browser
```
DevTools readable. Server-side
preferred.
Credit card / passwords NEVER Inexcusable. Always server-side,
never client-persisted.
```
Large datasets (>200KB) Avoid Synchronous read blocks main
```
thread. Use IndexedDB instead.
Form state across sessions Conditional sessionStorage if tab-scoped.
localStorage if must persist
across restart.
```
AVOID NEVER store auth tokens (JWT, session ID) in localStorage. XSS is trivially
```
exploitable — malicious code runs document.cookie and localStorage without
restriction. Use HttpOnly cookies which JavaScript cannot read at all.
Interview Q A junior developer stores JWTs in localStorage for convenience. Walk me through
the exact XSS attack vector and what you change.
Interview Q Implement a 'remember me for 30 days' feature. Where does the token live? What
happens on browser restart?
Interview Q How would you sync dark mode across 5 open tabs of the same app without
WebSockets?
Topic 2 Session Storage
sessionStorage is identical to localStorage in its API but has a fundamentally different lifecycle and scope. Data
is scoped to the current browser TAB and the current SESSION — it is completely isolated from other tabs,
even on the same origin.
2.1 Key Differences From localStorage
Dimension localStorage sessionStorage
Lifetime Until explicitly cleared / evicted Until tab is closed or session
ends
Scope ALL tabs on same origin share
one store
Each tab has its OWN isolated
store
Cross-tab sync Yes — storage event fires in
other tabs
No — tabs are completely
isolated by design
```
Tab duplication Shared (new tab gets same
```
```
store)
```
```
One-time copy of original (then
```
```
diverges)
```
Browser restart Survives restart Cleared on restart
Available in SW No No
Quota ~5MB per origin ~5MB per tab
API Identical: get/set/remove/clear Identical: get/set/remove/clear
2.2 Ideal Use Cases with Code
// ── USE CASE 1: Multi-step form — persists across accidental refresh ─
// User fills Step 1 of a 3-step form, hits F5 accidentally → data preserved
```
const saveStep = (step, data) =>
```
```
sessionStorage.setItem(`wizard:step${step}`, JSON.stringify(data));
```
```
const loadStep = (step) => {
```
```
const raw = sessionStorage.getItem(`wizard:step${step}`);
```
```
return raw ? JSON.parse(raw) : null;
```
```
};
```
```
const clearWizard = () => {
```
```
sessionStorage.removeItem('wizard:step1');
```
```
sessionStorage.removeItem('wizard:step2');
```
```
sessionStorage.removeItem('wizard:step3');
```
```
};
```
// ── USE CASE 2: A/B test variant — consistent within session ──────
```
function getVariant() {
```
```
const cached = sessionStorage.getItem('ab:variant');
```
```
if (cached) return cached; // same variant all session
```
```
const variant = Math.random() < 0.5 ? 'A' : 'B';
```
```
sessionStorage.setItem('ab:variant', variant);
```
```
return variant;
```
```
}
```
// New tab = fresh assignment. Each tab gets independent experiment.
// ── USE CASE 3: Scroll position restoration within tab ───────────
```
window.addEventListener('beforeunload', () => {
```
```
sessionStorage.setItem('scroll', window.scrollY.toString());
```
```
});
```
```
const savedScroll = parseInt(sessionStorage.getItem('scroll') || '0', 10);
```
```
window.scrollTo(0, savedScroll);
```
```
// ── USE CASE 4: Tab-isolated draft (parallel editing in multiple tabs)
```
// Each tab gets its own draft — no conflict between tabs
```
sessionStorage.setItem('draft:email', JSON.stringify(emailDraft));
```
2.3 The Tab Duplication Gotcha
```
// When user duplicates tab (Ctrl+Shift+D or right-click → Duplicate Tab):
```
// BEFORE duplication:
```
// Original tab sessionStorage: { 'wizard:step1': '{...}', 'scroll': '450' }
```
// IMMEDIATELY AFTER duplication:
// New tab gets a ONE-TIME COPY of original tab's sessionStorage
```
// New tab: { 'wizard:step1': '{...}', 'scroll': '450' } ← copied
```
```
// Original tab: { 'wizard:step1': '{...}', 'scroll': '450' } ← unchanged
```
// AFTER user acts in either tab:
// Changes in new tab → do NOT affect original tab
// Changes in orig tab → do NOT affect new tab
// They are fully independent after the initial copy.
// WHY THIS MATTERS: If user duplicates your form tab to compare two
// options, both tabs start from the same state — good UX by default.
// If you expected both tabs to share state — you needed localStorage.
KEY INSIGHT The storage event does NOT fire in sessionStorage even across tabs of the same
origin. sessionStorage is intentionally isolated. There is no built-in cross-tab sync
mechanism for sessionStorage — that is its design goal.
Interview Q A user opens your e-commerce app in two tabs to compare two products. Should
cart state be in localStorage or sessionStorage? Justify.
Interview Q You're building a multi-step checkout. The user accidentally refreshes on step 3.
How do you preserve their progress? Why not just use URL state?
Interview Q Explain the tab duplication behaviour of sessionStorage. When is it a feature and
when is it a bug?
Topic 3 Cookie Storage
Cookies are the oldest client-side storage mechanism and the ONLY one where data is automatically sent with
every matching HTTP request. This makes them uniquely suited for server-side authentication. They are also
the most security-critical storage mechanism — every attribute matters.
3.1 Cookie Anatomy — Every Attribute Explained
```
// Full production auth cookie (set by server via Set-Cookie header)
```
```
Set-Cookie: session_id=eyJhb...;
```
```
Max-Age=86400;
```
```
Domain=.example.com;
```
```
Path=/;
```
```
Secure;
```
```
HttpOnly;
```
```
SameSite=Strict
```
// ── Expires / Max-Age ────────────────────────────────────────────
// No Max-Age or Expires → SESSION cookie. Cleared when browser closes.
// Max-Age=86400 → expires in 24 hours from now
// Max-Age takes precedence over Expires if both are set
// ── Domain ───────────────────────────────────────────────────────
```
// Domain=.example.com → sent to ALL subdomains (api., app., www.)
```
```
// No Domain attribute → scoped to exact host only (no subdomains)
```
// ── Path ─────────────────────────────────────────────────────────
// Path=/api → cookie only sent with requests to /api/* routes
// Path=/ → cookie sent with ALL requests to the domain
// ── Secure ───────────────────────────────────────────────────────
// Cookie transmitted ONLY over HTTPS. Never over HTTP.
// Required for any sensitive cookie. Mandatory in production.
// ── HttpOnly ← MOST IMPORTANT FOR SECURITY ──────────────────────
// Cookie is INVISIBLE to JavaScript: document.cookie cannot see it
// Completely prevents XSS token theft for this cookie
// The browser sends it automatically — your JS never handles it
// ── SameSite ─────────────────────────────────────────────────────
```
// Strict → cookie NEVER sent on cross-site requests (max security)
```
// Breaks: social login flows, OAuth redirects, payment redirects
```
// Lax → sent on top-level navigations (user clicks a link to your site)
```
// NOT sent on fetch, XHR, img, iframe cross-site
// Browser default since 2020. Best balance for most apps.
// None → sent on ALL cross-site requests. MUST have Secure attribute.
// Required for: third-party widgets, cross-origin iframes, federated SSO
3.2 localStorage vs HttpOnly Cookie for Auth Tokens
Security Criterion JWT in localStorage JWT in HttpOnly Cookie
XSS vulnerability CRITICAL — any JS reads it None — JS cannot access
HttpOnly
CSRF vulnerability None — not auto-sent by
browser
Exists — must mitigate with
SameSite
JavaScript access Yes — document.cookie /
localStorage
No — browser only, JS blind to it
Auto-sent with request No — must set Authorization
header
Yes — browser handles
automatically
Logout Delete from storage in JS Server sets expired cookie /
clears
Mobile native apps Easy — set header per request Needs cookie jar support
Recommended for web No Yes: HttpOnly + Secure +
```
SameSite=Lax
```
```
3.3 CSRF Attack & Defence (required when using cookies for auth)
```
// ── CSRF Attack Vector ───────────────────────────────────────────
```
// 1. User is logged into bank.com (auth cookie auto-sent by browser)
```
// 2. User visits evil.com which contains:
// <img src='https://bank.com/transfer?to=attacker&amt=50000'>
// 3. Browser sends GET to bank.com WITH auth cookie → transfer executes
// The attacker never touched the cookie — the browser did it automatically
```
// ── Defence 1: SameSite=Strict (simplest, strongest) ─────────────
```
```
Set-Cookie: session=token; SameSite=Strict; Secure; HttpOnly
```
// Cookie never sent on cross-site request → CSRF attack impossible
// Trade-off: login from Google/GitHub OAuth redirect won't work
// because the redirect IS a cross-site navigation
// ── Defence 2: SameSite=Lax + Double Submit Token ─────────────────
```
// Server sets CSRF token as a READABLE cookie (not HttpOnly)
```
```
Set-Cookie: csrf=abc123; SameSite=Lax; Secure // JS can read this
```
// Client reads it and sends as custom header
const csrf = document.cookie
```
.split('; ')
```
```
.find(c => c.startsWith('csrf='))
```
```
?.split('=')?.[1];
```
```
fetch('/api/transfer', {
```
```
method: 'POST',
```
```
credentials: 'include', // sends auth cookie
```
```
headers: { 'X-CSRF-Token': csrf }, // attacker CANNOT forge this header
```
```
body: JSON.stringify({ to:'alice', amount:50 })
```
```
});
```
// Server validates: header token === cookie token
// Cross-origin attacker can't read your cookie to forge the header
// ── Defence 3: Check Origin / Referer header ──────────────────────
```
// if (req.headers.origin !== 'https://myapp.com') return res.status(403)
```
```
3.4 JavaScript Cookie API (when needed for non-HttpOnly cookies)
```
```
// Reading cookies from JS (only non-HttpOnly ones are visible)
```
```
document.cookie; // 'theme=dark; lang=en; csrf=abc123'
```
// Parse a specific cookie value
```
const getCookie = (name) =>
```
```
document.cookie.split('; ')
```
```
.find(c => c.startsWith(name + '='))
```
```
?.split('=', 2)[1] ?? null;
```
```
// Set a cookie from JS (cannot set HttpOnly from JS — server must do it)
```
```
document.cookie = 'theme=dark; Path=/; Max-Age=2592000; SameSite=Lax';
```
```
// Delete a cookie (set Max-Age=0)
```
```
document.cookie = 'theme=; Path=/; Max-Age=0';
```
```
// Modern cookieStore API (Chrome 87+, async)
```
```
const theme = await cookieStore.get('theme');
```
```
await cookieStore.set({ name:'theme', value:'dark', maxAge:2592000 });
```
```
await cookieStore.delete('theme');
```
```
// cookieStore works in Service Workers too (document.cookie does NOT)
```
3.5 Third-Party Cookie Deprecation
Chrome deprecated third-party cookies in 2024. Safari and Firefox blocked them years earlier. This
fundamentally changed how cross-origin authentication and tracking works.
// First-party: cookie set by same domain as the page → still works
// Third-party: cookie set by a different domain → BLOCKED
// What breaks:
// • Cross-site tracking / retargeting ads
```
// • Old-style SSO (one login domain, cookies shared across subdomains)
```
```
// • Embedded widgets that store state (YouTube, Disqus)
```
// Modern replacements for SSO:
// 1. First-party data: consolidate auth on your own domain
// 2. Storage Access API: iframe explicitly requests access to its own cookies
```
// 3. Partitioned Cookies (CHIPS):
```
```
Set-Cookie: session=abc; Partitioned; Secure
```
// Cookie is scoped per top-level site. Different top-level sites
// each get their own cookie jar for this third-party domain.
// 4. OAuth 2.0 PKCE flow: token-based, no cross-site cookies needed
```
// 5. Privacy Sandbox APIs (Topics API) for ad relevance without tracking
```
Interview Q What is the difference between SameSite=Strict and SameSite=Lax? Give a real
scenario where Strict breaks a legitimate feature.
Interview Q 'HttpOnly prevents XSS and SameSite prevents CSRF.' A junior dev says you only
need one of them. Why are both required?
Interview Q Design the complete authentication flow using HttpOnly cookies, including login,
refresh, and logout. What happens when the access token expires?
Interview Q Third-party cookies are deprecated. How does this affect your SSO implementation
and what is the alternative?
Topic 4 IndexedDB
IndexedDB is a full transactional database engine built into the browser. Unlike localStorage's 5MB string store,
IndexedDB supports complex objects, binary data, indexes, cursor-based queries, and stores gigabytes of data.
It is the foundation of every serious offline-first web app.
4.1 Storage Comparison — Choosing the Right API
Criteria localStorage sessionStorage Cookies IndexedDB
```
Capacity ~5MB ~5MB ~4KB 50MB+ (quota-
```
```
managed)
```
Data types Strings only Strings only Strings only Any JS object,
Blob, File
Query Key only Key only Key only Indexes, range
queries, cursors
Transactions None None None ACID-compliant
Blocking? Yes — main
thread
Yes — main thread Yes No — fully async
```
(Promises)
```
```
Works in SW No No No (use
```
```
cookieStore)
```
Yes — primary
SW storage
Ideal for User prefs, small
flags
Form/tab state Auth tokens Offline DB, large
data
4.2 Core Concepts — Mental Model
// IndexedDB hierarchy:
IndexedDB
```
└── Database ('myApp-db' version: 2)
```
```
└── Object Store ('users') // like a SQL table
```
```
├── Record { id:1, name:'Alice', email:'a@x.com' }
```
```
└── Record { id:2, name:'Bob', email:'b@x.com' }
```
```
└── Object Store ('messages')
```
├── keyPath: 'id' autoIncrement: true
├── Index: 'by-sender' on field: senderId
└── Index: 'by-timestamp' on field: ts
// Key concepts:
// keyPath — the field used as primary key
// autoIncrement — auto-generate integer IDs
```
// Index — enables query by non-key field (like a DB index)
```
// Transaction — group of reads/writes that succeed or fail together
// Cursor — iterate records without loading all into memory
// Version — schema version. Increment when you change the schema.
```
4.3 Using idb Library (Recommended — Promises over callbacks)
```
```
import { openDB, IDBKeyRange } from 'idb';
```
```
// ── 1. Open/create database (runs upgrade when version changes) ───
```
```
const db = await openDB('myApp-db', 2, {
```
```
upgrade(db, oldVersion) {
```
```
if (oldVersion < 1) {
```
```
const msgStore = db.createObjectStore('messages', {
```
```
keyPath: 'id', autoIncrement: true
```
```
});
```
```
msgStore.createIndex('by-sender', 'senderId');
```
```
msgStore.createIndex('by-timestamp', 'ts');
```
```
}
```
```
if (oldVersion < 2) {
```
```
db.createObjectStore('drafts', { keyPath: 'id' });
```
```
}
```
```
}
```
```
});
```
// ── 2. Write ──────────────────────────────────────────────────────
```
const newId = await db.add('messages', {
```
```
senderId: 42, text: 'Hello!', ts: Date.now()
```
```
});
```
// ── 3. Read by primary key ────────────────────────────────────────
```
const msg = await db.get('messages', newId);
```
// ── 4. Query by index ─────────────────────────────────────────────
```
const fromAlice = await db.getAllFromIndex('messages', 'by-sender', 42);
```
// ── 5. Range query — messages from last hour ──────────────────────
```
const since = Date.now() - 3600000;
```
```
const recent = await db.getAllFromIndex(
```
```
'messages', 'by-timestamp', IDBKeyRange.lowerBound(since)
```
```
);
```
// ── 6. Atomic transaction — write to two stores together ──────────
```
const tx = db.transaction(['messages', 'drafts'], 'readwrite');
```
```
await tx.objectStore('messages').add(finalMessage);
```
```
await tx.objectStore('drafts').delete(draftId);
```
```
await tx.done; // both succeed or both roll back
```
// ── 7. Cursor — iterate without loading all into memory ───────────
```
let cursor = await db.transaction('messages')
```
```
.store.index('by-timestamp').openCursor();
```
```
while (cursor) {
```
```
processMessage(cursor.value);
```
```
cursor = await cursor.continue();
```
```
}
```
// ── 8. Count ─────────────────────────────────────────────────────
```
const total = await db.count('messages');
```
// ── 9. Delete ─────────────────────────────────────────────────────
```
await db.delete('messages', messageId);
```
4.4 Offline Mutation Queue — The Real Production Pattern
// When user submits a form while offline:
```
async function submitComment(comment) {
```
```
if (navigator.onLine) {
```
```
return api.post('/comments', comment);
```
```
}
```
// Store in IDB offline queue with idempotency key
```
await db.add('pendingOps', {
```
```
id: crypto.randomUUID(), // idempotency key
```
```
url: '/comments',
```
```
method: 'POST',
```
```
payload: comment,
```
```
createdAt: Date.now(),
```
```
retries: 0
```
```
});
```
// Register Background Sync — SW will flush when online
```
const reg = await navigator.serviceWorker.ready;
```
```
await reg.sync.register('flush-ops');
```
```
}
```
```
// In Service Worker (sw.js):
```
```
self.addEventListener('sync', (event) => {
```
```
if (event.tag === 'flush-ops') event.waitUntil(flush());
```
```
});
```
```
async function flush() {
```
```
const ops = await db.getAll('pendingOps');
```
```
for (const op of ops) {
```
```
try {
```
```
await fetch(op.url, {
```
```
method: op.method,
```
```
body: JSON.stringify(op.payload),
```
```
headers: {
```
'Content-Type': 'application/json',
'Idempotency-Key': op.id, // server de-dupes on reconnect
```
}
```
```
});
```
```
await db.delete('pendingOps', op.id);
```
```
} catch {
```
```
if (op.retries >= 5) await db.delete('pendingOps', op.id);
```
```
else await db.put('pendingOps', { ...op, retries: op.retries + 1 });
```
```
}
```
```
}
```
```
}
```
REAL WORLD Figma loads your entire document from IndexedDB on app open — zero network
latency. If your network drops mid-design session, you keep working. Changes
sync on reconnect. Linear, Notion, and Google Docs all use this same offline-first
IDB pattern.
Interview Q When would you use IndexedDB instead of localStorage? Give 3 concrete
scenarios.
Interview Q What is the difference between openCursor and getAll? When would using getAll
on 50,000 records be a problem?
Interview Q Design the offline data strategy for a note-taking app. Two users edit the same
note offline simultaneously. How do you handle the conflict on reconnect?
Interview Q Why is it important to use a transaction when writing to two different object stores
simultaneously?
Topic 5 Normalization
In the frontend context, normalization refers to structuring client-side state so that each piece of data has exactly
one authoritative location — no duplication, no inconsistency. It is borrowed from database theory but applied to
Redux stores, React Query caches, and any large client-side data structure.
5.1 The Problem — Denormalized State
```
// Denormalized (nested) — the naive shape coming from the API:
```
const posts = [
```
{
```
```
id: 1,
```
```
title: 'Hello World',
```
```
author: { id: 42, name: 'Alice', avatar: '/alice.png' },
```
```
comments: [
```
```
{ id: 101, text: 'Great!', author: { id: 42, name: 'Alice', avatar: '/alice.png' } },
```
```
{ id: 102, text: 'Thanks', author: { id: 7, name: 'Bob', avatar: '/bob.png' } },
```
]
```
},
```
```
{
```
```
id: 2,
```
```
title: 'React Hooks',
```
```
author: { id: 42, name: 'Alice', avatar: '/alice.png' }, // ← duplicate!
```
```
comments: [...]
```
```
}
```
```
];
```
// PROBLEMS with this shape:
// 1. Alice appears in 5 places. Change her avatar → must update ALL 5.
```
// Miss one → UI inconsistency (some posts show old avatar).
```
```
// 2. Finding a comment by ID = O(n * m) nested loop
```
// 3. Re-rendering: any change to any post re-renders everything connected
5.2 Normalized State Shape
// Normalized — flat lookup tables by ID:
```
const state = {
```
```
entities: {
```
```
users: {
```
```
42: { id:42, name:'Alice', avatar:'/alice.png' },
```
```
7: { id:7, name:'Bob', avatar:'/bob.png' }
```
```
},
```
```
posts: {
```
```
1: { id:1, title:'Hello World', authorId:42, commentIds:[101,102] },
```
```
2: { id:2, title:'React Hooks', authorId:42, commentIds:[...] }
```
```
},
```
```
comments: {
```
```
101: { id:101, text:'Great!', authorId:42 },
```
```
102: { id:102, text:'Thanks', authorId:7 }
```
```
}
```
```
},
```
```
ids: {
```
```
posts: [1, 2], // ordered list of post IDs
```
```
comments: [101, 102]
```
```
}
```
```
};
```
// BENEFITS:
// 1. Change Alice's avatar in ONE place → all references updated
```
// 2. Lookup user by ID: O(1) — state.entities.users[42]
```
// 3. Selective re-renders: only components reading user 42 re-render
// 4. No duplication → no inconsistency possible
5.3 Redux Toolkit's createEntityAdapter
```
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
```
// createEntityAdapter builds normalized state automatically
```
const usersAdapter = createEntityAdapter({
```
```
selectId: (user) => user.id, // which field is the ID
```
```
sortComparer: (a, b) => a.name.localeCompare(b.name), // optional sort
```
```
});
```
```
const usersSlice = createSlice({
```
```
name: 'users',
```
```
initialState: usersAdapter.getInitialState(),
```
```
// initialState = { ids: [], entities: {} }
```
```
reducers: {
```
```
userAdded: usersAdapter.addOne,
```
```
usersLoaded: usersAdapter.setAll,
```
```
userUpdated: usersAdapter.updateOne,
```
```
userRemoved: usersAdapter.removeOne,
```
```
}
```
```
});
```
// Auto-generated selectors
```
const selectors = usersAdapter.getSelectors((state) => state.users);
```
```
// selectors.selectAll(state) → array of all users (sorted)
```
```
// selectors.selectById(state, userId) → single user by ID (O(1))
```
```
// selectors.selectIds(state) → array of all IDs
```
```
// selectors.selectTotal(state) → count
```
// Usage in component
```
const alice = useSelector(s => selectors.selectById(s, 42));
```
// Re-renders ONLY when user 42 actually changes — not on any other user change
5.4 Normalization in React Query
// React Query caches responses by queryKey — not automatically normalized
// Two queries that return the same user will have separate cache entries
// Pattern: normalise inside queryFn before caching
```
const queryClient = new QueryClient();
```
```
const { data: posts } = useQuery({
```
```
queryKey: ['posts'],
```
```
queryFn: async () => {
```
```
const raw = await api.getPosts();
```
// Hoist embedded users into their own cache entries
```
raw.forEach(post => {
```
```
queryClient.setQueryData(['users', post.author.id], post.author);
```
```
});
```
```
return raw.map(p => ({ ...p, author: p.author.id })); // replace obj with ID
```
```
}
```
```
});
```
// Now user 42 lives in ['users', 42] cache
// Update user 42 once → all post components that read it see the change
// Normalizr library: automates this for complex nested schemas
// Useful when API returns deeply nested responses
5.5 Denormalization Trade-offs — When NOT to Normalize
Scenario Normalize? Why
```
Simple, small data (<50 items) No Overhead of normalization
```
outweighs benefit. Keep it flat
and simple.
Data has many cross-
```
references (users in posts,
```
```
comments, likes)
```
Yes Single source of truth prevents
inconsistency.
Read-heavy with no mutations No Denormalized is faster to render
— no join step needed.
Frequent updates to shared
entities
Yes One write to users[42] updates
everywhere instantly.
```
Server-driven UI (no client
```
```
mutations)
```
No Just display what the server
sends. No sync problem.
Offline-first with local
mutations
Yes Denormalized offline mutations
are nearly impossible to merge
correctly.
Interview Q Your Redux store has user objects nested inside every post and comment. You
update a user's profile picture — explain the bug this causes and how
normalization fixes it.
Interview Q What does createEntityAdapter give you that a plain object would not? When
would you use it vs React Query?
Interview Q When would you intentionally denormalize data on the client for performance? Give
a real example.
Topic 6 HTTP Caching
HTTP Caching is the browser's built-in mechanism to avoid re-fetching resources it already has. Controlled
entirely through HTTP response headers, it sits between your app and the network and can eliminate network
requests entirely for static assets — or ensure fresh data for dynamic content.
6.1 The Complete HTTP Cache Flow
1. Browser requests https://app.com/main.a3f2c1.js
2. Server responds with file + Cache-Control headers
3. Browser stores response in disk cache (keyed by URL + Vary headers)
4. Next request: browser checks cache. Is it fresh (within max-age)?
5. CACHE HIT: return from cache — zero network request, zero latency
6. STALE: send conditional GET with If-None-Match: <etag>
7. Server: 304 Not Modified (no body, saves bandwidth) OR 200 with new body
6.2 Cache-Control Directives — Every Value
```
// ── IMMUTABLE ASSETS (content-hashed filenames) ──────────────────
```
Cache-Control: public, max-age=31536000, immutable
```
// public → CDNs/proxies CAN cache this (not just the browser)
```
```
// max-age → cache is fresh for 1 year (31,536,000 seconds)
```
```
// immutable → browser NEVER revalidates, even on hard refresh (F5)
```
// Use for: main.[hash].js styles.[hash].css logo.[hash].webp
```
// ── HTML DOCUMENTS (must always reflect latest deploy) ────────────
```
Cache-Control: no-cache
// MISLEADING NAME: does NOT mean 'do not cache'
// Means: cache it, but always REVALIDATE before using
```
// Browser sends conditional GET. If 304: serve from cache (fast).
```
// If 200: download new version.
```
// Use for: index.html, app.html (the entry point)
```
// ── PRIVATE / USER-SPECIFIC PAGES ────────────────────────────────
Cache-Control: private, no-cache
// private → ONLY the browser caches. CDN MUST NOT cache.
// Use for: /dashboard, /profile, /orders
// ── NEVER CACHE ──────────────────────────────────────────────────
Cache-Control: no-store
// Nothing written to disk or memory. Zero caching.
// Use for: bank transactions, OTP pages, sensitive reports
```
// ── STALE-WHILE-REVALIDATE (the best API caching pattern) ─────────
```
Cache-Control: public, max-age=60, stale-while-revalidate=600
```
// 0-60s: fresh → serve from cache (zero latency)
```
// 60-600s: stale → serve from cache IMMEDIATELY + refetch in background
// user never sees a loading state
// >600s: must fetch fresh before serving
// Use for: news feeds, product listings, any 'eventually consistent' data
```
// ── STALE-IF-ERROR (resilience pattern) ───────────────────────────
```
Cache-Control: public, max-age=60, stale-if-error=86400
// If origin returns 5xx/network error → serve stale up to 24h
// Keeps site up during origin outages
6.3 ETag — Content Fingerprinting for Conditional Requests
// ── Initial response ─────────────────────────────────────────────
HTTP/1.1 200 OK
```
ETag: "a3f2c1d4" // hash of response body
```
```
Cache-Control: no-cache // always revalidate (but can use cache if 304)
```
Content-Type: application/json
```
// ── Subsequent request (browser sends ETag back) ──────────────────
```
GET /api/products HTTP/1.1
If-None-Match: "a3f2c1d4"
// Server response if unchanged:
HTTP/1.1 304 Not Modified
// NO body — saves full download bandwidth. Still costs 1 RTT.
// Server response if changed:
HTTP/1.1 200 OK
```
ETag: "b7e9f2a1" // new hash
```
// ...new body...
```
// Last-Modified alternative (weaker — avoid if possible)
```
Last-Modified: Wed, 11 Mar 2026 10:00:00 GMT
```
// Granularity: 1 second (ETag detects same-second changes)
```
// Problem: touching a file without changing content updates the timestamp
// Always prefer ETag over Last-Modified
6.4 Cache Busting — The Production Pattern
// THE PROBLEM:
// Cache-Control: max-age=31536000 → browsers cache for 1 year
// You deploy a critical bug fix → users still get the old file
```
// ❌ WRONG: query string busting (CDNs often strip query params)
```
/main.js?v=2.1.0
```
// ✅ CORRECT: content hash in filename (Webpack/Vite default)
```
/main.a3f2c1d4.js // URL changes iff content changes
/styles.7e2b9f1a.css
// Vite configuration:
// vite.config.js
```
export default defineConfig({
```
```
build: {
```
```
rollupOptions: {
```
```
output: {
```
```
entryFileNames: 'assets/[name].[hash].js',
```
```
chunkFileNames: 'assets/[name].[hash].js',
```
```
assetFileNames: 'assets/[name].[hash][extname]',
```
```
}
```
```
}
```
```
}
```
```
});
```
// Strategy: two-tier caching
```
// index.html → Cache-Control: no-cache (always revalidate)
```
// *.js, *.css → Cache-Control: public, max-age=31536000, immutable
```
// index.html is tiny (1KB). It is the only file users ever re-download.
```
// It contains links to hashed JS/CSS → they always get the latest versions.
6.5 CDN Caching & s-maxage
```
// s-maxage = cache TTL for shared caches (CDN) only
```
// max-age = cache TTL for browser only
// Allow CDN to cache for 5 minutes but browser to cache for 60 seconds
Cache-Control: public, max-age=60, s-maxage=300
// Prevent CDN caching but allow browser caching
Cache-Control: private, max-age=300
// Vary header: different cache entries per header value
```
Vary: Accept-Encoding // separate cache for gzip vs br vs raw
```
```
Vary: Accept-Language // separate cache per language
```
```
Vary: Cookie // DANGER: disables CDN caching entirely
```
// because every cookie value = separate entry
```
// CDN cache purge after deploy (Cloudflare example):
```
```
await fetch('https://api.cloudflare.com/client/v4/zones/{zone}/purge_cache', {
```
```
method: 'POST',
```
```
headers: { Authorization: `Bearer ${CF_TOKEN}` },
```
```
body: JSON.stringify({ files: ['https://app.com/index.html'] })
```
```
});
```
// For hashed assets: no purge needed — URL changes on deploy
```
// For index.html: purge on every deploy (it's the entry point)
```
Interview Q Explain the difference between no-cache and no-store. Give a production use case
for each.
Interview Q What is stale-while-revalidate? Design the HTTP caching strategy for a news site
where articles update every 30 minutes but breaking news must be instant.
Interview Q Your CDN is serving an old JS bundle 2 hours after a critical bug fix. How did this
happen and how do you prevent it permanently?
Interview Q ETag vs Last-Modified — when would you use each? What does a 304 response
actually save?
Topic 7 Service Worker Caching
```
A Service Worker (SW) is a JavaScript file that runs in a separate thread — outside the page. It acts as a
```
programmable network proxy, intercepting every fetch request from your page and deciding whether to respond
```
from cache, network, or both. It is the engine of Progressive Web Apps (PWAs) and offline-first experiences.
```
7.1 Service Worker Lifecycle
```
// ── Registration (in your app's main JS) ─────────────────────────
```
```
if ('serviceWorker' in navigator) {
```
```
const reg = await navigator.serviceWorker.register('/sw.js', {
```
```
scope: '/', // controls all pages under this path
```
```
updateViaCache: 'none' // always check for SW updates on navigation
```
```
});
```
```
console.log('SW registered, scope:', reg.scope);
```
```
}
```
// ── Service Worker Lifecycle ──────────────────────────────────────
// 1. install — SW downloads and installs. Pre-cache assets here.
// New SW waits here if old SW still controls the page.
// 2. activate — old SW gone, new SW takes control. Clean old caches here.
// 3. fetch — every network request passes through here.
// Intercept and respond with cache or network.
// ── Install: pre-cache the app shell ─────────────────────────────
```
const CACHE_NAME = 'app-shell-v3';
```
```
const APP_SHELL = ['/', '/index.html', '/main.js', '/styles.css', '/logo.svg'];
```
```
self.addEventListener('install', (event) => {
```
```
event.waitUntil(
```
```
caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
```
```
);
```
```
self.skipWaiting(); // activate immediately, don't wait for old SW
```
```
});
```
// ── Activate: clean old caches ────────────────────────────────────
```
self.addEventListener('activate', (event) => {
```
```
event.waitUntil(
```
```
caches.keys().then(keys =>
```
```
Promise.all(keys
```
```
.filter(k => k !== CACHE_NAME) // delete outdated caches
```
```
.map(k => caches.delete(k))
```
```
)
```
```
)
```
```
);
```
```
self.clients.claim(); // take control of all open pages immediately
```
```
});
```
7.2 The Five Caching Strategies
Strategy How It Works Best For Trade-off
```
Cache First (Offline
```
```
First)
```
Serve from cache. Only
fetch if cache miss.
App shell, fonts, icons,
static assets
May serve stale content
if cache not updated
Network First Fetch from network.
Fall back to cache if
network fails.
API data that must be
fresh
Slow on poor
connectivity — waits for
network timeout
Stale While Revalidate Serve from cache
immediately. Fetch in
background to update
cache.
Feeds, listings, content
that tolerates brief
staleness
User sees slightly stale
content for one request
cycle
Cache Only Only serve from cache.
Never go to network.
Static assets
guaranteed pre-cached
at install
Fails if asset not in
cache — use carefully
Network Only Always fetch. Never
use cache.
Real-time data: stock
prices, live scores,
payments
No offline support —
page fails without
connectivity
7.3 Implementing All Five Strategies in the Fetch Handler
```
self.addEventListener('fetch', (event) => {
```
```
const { request } = event;
```
```
const url = new URL(request.url);
```
// ── CACHE FIRST: app shell + static assets ──────────────────────
```
if (APP_SHELL.includes(url.pathname) || url.pathname.match(/\.(js|css|png|webp)$/)) {
```
```
event.respondWith(cacheFirst(request));
```
```
return;
```
```
}
```
// ── STALE WHILE REVALIDATE: API listings ─────────────────────────
```
if (url.pathname.startsWith('/api/products')) {
```
```
event.respondWith(staleWhileRevalidate(request));
```
```
return;
```
```
}
```
// ── NETWORK FIRST: user-specific API data ─────────────────────────
```
if (url.pathname.startsWith('/api/')) {
```
```
event.respondWith(networkFirst(request));
```
```
return;
```
```
}
```
```
});
```
// ── Strategy implementations ──────────────────────────────────────
```
async function cacheFirst(req) {
```
```
const cached = await caches.match(req);
```
```
if (cached) return cached;
```
```
const fresh = await fetch(req);
```
```
const cache = await caches.open(CACHE_NAME);
```
```
cache.put(req, fresh.clone()); // cache for next time
```
```
return fresh;
```
```
}
```
```
async function networkFirst(req, timeout = 3000) {
```
```
const timeoutPromise = new Promise((_, reject) =>
```
```
setTimeout(() => reject(new Error('timeout')), timeout)
```
```
);
```
```
try {
```
```
const fresh = await Promise.race([fetch(req), timeoutPromise]);
```
```
const cache = await caches.open(CACHE_NAME);
```
```
cache.put(req, fresh.clone());
```
```
return fresh;
```
```
} catch {
```
```
return caches.match(req) || new Response('Offline', { status: 503 });
```
```
}
```
```
}
```
```
async function staleWhileRevalidate(req) {
```
```
const cached = await caches.match(req);
```
```
const fetchPromise = fetch(req).then(fresh => {
```
```
caches.open(CACHE_NAME).then(c => c.put(req, fresh.clone()));
```
```
return fresh;
```
```
});
```
```
return cached ?? fetchPromise; // serve stale immediately if available
```
```
}
```
7.4 Cache API — Direct Programmatic Access
// Cache API works in both Service Workers AND in page JS
// Open a named cache
```
const cache = await caches.open('images-v1');
```
// Store a response
```
const response = await fetch('/hero.webp');
```
```
await cache.put('/hero.webp', response);
```
// Retrieve
```
const cached = await caches.match('/hero.webp');
```
```
if (cached) { /* serve directly */ }
```
// List all caches
```
const cacheNames = await caches.keys(); // ['app-shell-v3', 'images-v1']
```
// Delete a cache
```
await caches.delete('images-v1');
```
// Delete a specific entry within a cache
```
const c = await caches.open('app-shell-v3');
```
```
await c.delete('/old-route');
```
```
// Check cache size (for quota monitoring)
```
```
const estimate = await navigator.storage.estimate();
```
```
console.log('Used:', estimate.usage, 'Quota:', estimate.quota);
```
7.5 Background Sync — Offline Mutation Reliability
// Background Sync fires when connectivity is restored
// Guaranteed delivery even if the user closes the tab
// In page JS — register a sync when submitting form offline
```
const reg = await navigator.serviceWorker.ready;
```
```
await reg.sync.register('send-comment'); // tag identifies the sync
```
// In Service Worker — handle sync event
```
self.addEventListener('sync', (event) => {
```
```
if (event.tag === 'send-comment') {
```
```
event.waitUntil(sendPendingComments());
```
```
}
```
```
});
```
```
async function sendPendingComments() {
```
```
const pending = await idb.getAll('pendingComments');
```
```
for (const comment of pending) {
```
```
const res = await fetch('/api/comments', {
```
```
method: 'POST',
```
```
body: JSON.stringify(comment),
```
```
headers: { 'Idempotency-Key': comment.id }
```
```
});
```
```
if (res.ok) await idb.delete('pendingComments', comment.id);
```
```
}
```
```
}
```
// Periodic Background Sync — fetch fresh data while app is closed
```
const reg = await navigator.serviceWorker.ready;
```
```
await reg.periodicSync.register('update-feed', {
```
```
minInterval: 24 * 60 * 60 * 1000 // at most once per day
```
```
});
```
```
self.addEventListener('periodicsync', (event) => {
```
```
if (event.tag === 'update-feed') {
```
```
event.waitUntil(updateLocalFeedCache());
```
```
}
```
```
});
```
7.6 Push Notifications — Service Worker as Background Process
// Service Worker receives push events even when app is closed
// 1. Request permission in app
```
const permission = await Notification.requestPermission();
```
```
if (permission !== 'granted') return;
```
// 2. Subscribe to push server
```
const reg = await navigator.serviceWorker.ready;
```
```
const sub = await reg.pushManager.subscribe({
```
```
userVisibleOnly: true, // required: must show notification for every push
```
```
applicationServerKey: VAPID_PUBLIC_KEY
```
```
});
```
```
await api.saveSubscription(sub); // send endpoint to your server
```
// 3. In Service Worker — handle incoming push
```
self.addEventListener('push', (event) => {
```
```
const data = event.data?.json() ?? {};
```
```
event.waitUntil(
```
```
self.registration.showNotification(data.title, {
```
```
body: data.body,
```
```
icon: '/icon-192.png',
```
```
badge: '/badge-72.png',
```
```
data: { url: data.url }
```
```
})
```
```
);
```
```
});
```
// 4. Handle notification click
```
self.addEventListener('notificationclick', (event) => {
```
```
event.notification.close();
```
```
event.waitUntil(clients.openWindow(event.notification.data.url));
```
```
});
```
```
REAL WORLD Twitter Lite (now X Lite) was one of the first major PWAs. It used Cache First for
```
```
the app shell (instant load), Network First for tweets (always fresh), and
```
Background Sync for offline tweet queuing. Users could compose tweets offline
and they'd send automatically on reconnect.
```
Interview Q Explain the five Service Worker caching strategies. Which would you use for (a) a
```
```
news article page, (b) a product listing API, (c) your app's main.js bundle?
```
```
Interview Q What is the difference between Cache API and HTTP Cache (the browser's built-in
```
```
cache)? Are they independent?
```
Interview Q A user fills out a form and submits it while offline. Walk me through the complete
flow from submission to eventual server delivery using Service Worker and
Background Sync.
```
Interview Q What does skipWaiting() do in a Service Worker install event? What problem does
```
it solve and what side effect must you be careful of?
Master Cheat Sheet All 7 Topics at a Glance
When you need... Use Avoid Key Reason
Persist user
preferences across
restarts
localStorage sessionStorage sessionStorage clears
on tab close
Auth tokens — web
app
HttpOnly + Secure +
SameSite cookie
localStorage XSS cannot steal
HttpOnly cookie
Form state that
survives accidental
refresh
sessionStorage localStorage localStorage persists
too long — stale form
data risk
Cross-tab sync
```
(logout, theme)
```
localStorage + storage
event
WebSocket for this storage event is free &
built-in for cross-tab
Large structured data
offline
IndexedDB localStorage IDB: async, queryable,
50MB+. LS: sync, 5MB,
strings only
Offline form
submission queue
IndexedDB +
Background Sync
localStorage IDB works in Service
```
Workers; localStorage
```
does not
Avoid re-
downloading
unchanged static
assets
Cache-Control:
immutable + hash
No cache-busting Hash in URL = cache
```
forever safely; old URL
```
= old content
API data fresh within
session, zero loading
flash
stale-while-revalidate
header
no-cache only SWR serves stale
instantly while silently
refreshing
App loads offline first
visit
SW Cache First for app
shell
No Service Worker SW pre-caches shell at
install. Instant load,
works offline
```
Shared entity (user,
```
```
product) used in
```
many places
Normalized state
```
(entityAdapter)
```
Nested denormalized One update propagates
```
everywhere; no
```
inconsistency possible
Single source of truth
for server data
React Query / SWR Redux for API data React Query models
```
server state lifecycle;
```
Redux does not
The 3-Part Caching Answer Formula for Interviews
KEY INSIGHT For every system design question involving data, answer these three questions
```
explicitly: 1. WHERE does it live? (HTTP cache / React Query / localStorage /
```
```
IndexedDB / Cookie / SW Cache) 2. HOW LONG is it fresh? (max-age / staleTime
```
```
/ TTL / revalidation trigger) 3. HOW is it invalidated? (On write? On deploy? Time-
```
```
based TTL? WebSocket push? Cache purge API?)
```
Example senior answer for a product listing page: 'HTML: no-cache so every deploy gives users the latest links
to hashed assets. CSS/JS: immutable with content-hashed filenames — browser caches forever, URL changes
on deploy. Product data API: Cache-Control: public, max-age=60, stale-while-revalidate=600 for CDN and React
Query with staleTime=60s on client. On inventory change: server triggers CDN purge via API and React Query
invalidation via WebSocket event. App shell: Service Worker Cache First so the page loads offline.'
Master these 7 topics and you can answer any Database & Caching question at any senior
frontend interview.