


## Namaste Frontend System Design
High Level Design  (HLD)
HLD Framework  •  Micro-frontends  •  6 Full Case Studies  •  Scalability Patterns  •  Interview Q&A

## Chapter What It Covers Weight
HLD Framework The universal 7-step approach to
any frontend HLD interview
question
## Very High
Scalability Patterns CDN, Edge rendering, sharding,
feature flags, A/B testing, BFF
pattern
## Very High
Micro-frontends Module Federation, iframe, Web
Components, independent
deploy, team topology
## Very High
## Case Study: Social Media
## Feed
## Design
Facebook/Twitter/LinkedIn feed
— real-time, ranking, pagination,
media
## Very High
Case Study: E-Commerce
## Platform
Design Flipkart/Amazon —
catalog, cart, checkout, search,
recommendations
## Very High
Case Study: Video Streaming Design Netflix/YouTube —
adaptive bitrate, thumbnail
loading, player states
## Very High
## Case Study: Collaborative
## Editor
## Design Google Docs —
OT/CRDT, real-time sync,
conflict resolution, presence
## Very High
Case Study: Ride-Hailing App Design Uber/Ola — live map,
driver tracking, ETA, surge
pricing UI
## High
Case Study: Live Commentary Design CricBuzz — real-time
score, push, scorecard, low-
latency updates
## High
Interview Q&A 10 senior-level HLD questions
with model answers
## Very High



Why HLD Is the Most Important Senior Interview
## Round
HLD — High Level Design — is the interview round where the hiring bar for senior engineers is set. It is not
enough to know how to code a component. The interviewer wants to know: can you architect an entire product?
Can you reason about tradeoffs across performance, scalability, developer experience, and user experience
simultaneously? Can you take a vague requirement ('design Swiggy') and produce a structured, comprehensive
architecture in 45 minutes?
Unlike LLD where you live-code a solution, HLD expects structured verbal + diagrammatic reasoning. You draw
boxes and arrows, describe data flows, justify every architectural decision, and proactively raise the concerns
that a naive candidate would never think to mention. This document gives you the framework, the vocabulary,
and the six case studies you need to answer any HLD question.

What separates senior candidates in HLD What it signals to the interviewer
Proactively asks clarifying questions before
designing
Knows that undefined requirements produce
unusable designs
Starts with requirements, not technology Architecture is driven by constraints, not by what
you know
Explicitly states and justifies every tradeoff Deep understanding — not just pattern-matching
Covers non-functional requirements without
being asked
Experience: NFRs are where systems actually fail
in production
Raises failure modes and recovery strategies Knows that distributed systems fail; designs for
resilience
Mentions performance impact of each decision Thinks about users on slow devices and networks
Discusses team/ownership boundaries for
large systems
Senior engineers design for teams, not just for
browsers


Section 1   The Universal HLD Framework — 7
## Steps

Every frontend HLD interview question — no matter the product — can be answered using the same 7-step
framework. Internalise this structure. Walk the interviewer through each step. The framework prevents you from
missing critical dimensions and shows that you have a systematic engineering mindset, not just a collection of
buzzwords.

Step 1 — Requirements Gathering (5 minutes)
Never start designing without asking clarifying questions. Vague requirements produce vague designs. Ask both
functional (what the product must do) and non-functional (how it must do it) questions.
Question Category Questions to Ask What You Learn
Functional scope What features are in scope for
this design? Who is the primary
user? What are the critical user
journeys?
Prevents over-engineering. Lets
you say 'out of scope' explicitly.
Scale How many DAU? Peak
concurrent users? Requests per
second?
Determines if you need CDN,
edge rendering, virtualization,
WebSockets.
Performance targets What are acceptable LCP,
FID/INP, CLS targets? What is
the acceptable latency for real-
time features?
Shapes caching strategy,
rendering approach, transport
protocol.
Device & network Desktop-first or mobile-first? 4G
India or developed market
broadband?
Shapes bundle size budget,
offline support, image
optimization.
Consistency requirements Does real-time accuracy matter
(live score, stock price) or can
data be stale (product
descriptions)?
Shapes polling vs WebSocket vs
SSE choice.
Team structure How many frontend teams?
Independent deploy needed?
Shapes monolith vs micro-
frontend decision.

Step 2 — Core Entities & Data Model (5 minutes)
Define the key data entities and their relationships. This forces you to think about what you are actually building
before you draw boxes. In a frontend HLD, the data model includes both what comes from the API and what
lives in client-side state.
## // Example: Social Feed
type User = { id, name, avatar, followerCount, isFollowing }
type Post = { id, authorId, content, mediaUrls[], createdAt, likeCount,
commentCount, shareCount, isLiked, isBookmarked }
type Feed = { posts: Post[], nextCursor: string, hasMore: boolean }

// Client-side state (separate from server data)
type FeedState = {
posts:         Map<string, Post>  // normalized by ID
feedOrder:     string[]           // list of post IDs in display order
pagination:    { cursor, hasMore, isLoading }
optimisticIds: Set<string>        // pending local actions

## }

Step 3 — API Contract (5 minutes)
Define the API contract between frontend and backend. In a frontend interview, this shows you understand the
full stack, not just the UI layer.
## Endpoint Method Request Response Notes
Feed GET /feed cursor?, limit=20 { posts[],
nextCursor,
hasMore }
## Cursor-based.
No page drift.
Like POST /posts/:id/like {} { likeCount, isLiked } Idempotent.
Optimistic UI.
Comment POST
## /posts/:id/comments
{ text } Comment object Returns new
comment for
optimistic add.
Real-time WS /feed/live — { type:
## 'new_post'|'update',
payload }
WebSocket for
live new posts.

Step 4 — High Level Architecture (10 minutes)
Draw the architecture diagram. In a verbal interview, describe each box and arrow as you draw it. The standard
frontend architecture has these layers:
## Layer What It Contains Key Design Decisions
Client (Browser/App) React/Next.js app, state
management, SW for offline
Rendering strategy
(CSR/SSR/SSG/ISR), state tool,
bundle splitting
CDN / Edge Static assets, edge-cached
HTML, A/B testing at edge
Cache-Control headers, CDN
provider, Edge Functions
(Cloudflare/Vercel)
API Gateway / BFF Backend-for-frontend:
aggregates multiple
microservices into one client-
optimised response
Reduces round trips, tailors
response shape to client needs
Backend Services Auth, feed service, media
service, notification service,
analytics
Not the frontend's concern in
detail — but reference them
Real-time Layer WebSocket server / SSE
endpoint for push events
Pub/Sub backing (Redis),
reconnection strategy
Storage / CDN for Media Image/video CDN, transcoding
pipeline
Adaptive bitrate, lazy loading,
thumbnail generation

Step 5 — Component Architecture (5 minutes)
Describe the top-level component tree. Name the main components, which ones own state, and which are
presentational. For a social feed: <App> → <FeedPage> → [<FeedHeader>, <FeedList> → <PostCard> →
[<PostMedia>, <PostActions>, <CommentPreview>], <NewPostModal>]. State management: React Query for
server state, Zustand for optimistic updates, URL for filters.


Step 6 — Non-Functional Requirements (5 minutes)
NFR Target How You Achieve It
Initial Load Performance LCP < 2.5s on 4G SSR/SSG for above-fold. Lazy-
load below-fold. Image CDN with
WebP. Critical CSS inlined.
Runtime Performance 60fps scroll, INP < 200ms Virtualized list for feed.
Debounced interactions. Memo
on heavy components.
Availability 99.9% uptime SW offline fallback. Graceful
degradation when API fails. Error
boundaries.
Scalability 10M DAU, 100k concurrent Edge caching of static assets.
CDN for media. BFF to reduce
fan-out requests.
Accessibility WCAG 2.1 AA Semantic HTML. Keyboard nav.
Screen reader tested. Color
contrast checked.
Security OWASP Top 10 Content Security Policy.
HttpOnly cookies. XSS-safe
rendering. CSRF tokens.
Observability < 5 min MTTR RUM (Core Web Vitals). Error
tracking (Sentry). Session
replay. Alerting on SLOs.

Step 7 — Edge Cases, Failure Modes & Optimizations (5 minutes)
- What happens when the feed API is down? Show cached posts from IndexedDB. Show error banner
with retry.
- What happens when the WebSocket disconnects? Show 'Reconnecting...' indicator. Exponential
backoff. Re-fetch missed events on reconnect using last-seen event ID.
- What happens when media fails to load? Show placeholder. Retry with exponential backoff. Log error to
monitoring.
- What if a user has 50,000 unread notifications? Virtual list. Mark-all-read API. Paginated notification
panel.
- What about users with slow connections (2G India)? Adaptive loading: skip video autoplay, serve low-
res images, disable non-critical prefetching if effectiveType === '2g'.

## KEY INSIGHT
The 7-step HLD framework maps perfectly to 45 minutes: 5 min clarify + 5 min data
model + 5 min API + 10 min architecture + 5 min components + 5 min NFRs + 10
min edge cases + tradeoffs discussion. Walk the interviewer through every step by
name. It signals structure, not guesswork.


## Section 2   Frontend Scalability Patterns

## 2.1  Rendering Strategy Decision Tree
Strategy How It Works When to Use Trade-offs
CSR (SPA) Browser downloads JS
bundle, renders entirely
client-side
Admin dashboards,
authenticated apps,
highly interactive tools
Slow initial load (TTFB
+ JS parse + render).
Bad for SEO.
SSR Server renders HTML
per request, sends to
browser
E-commerce PDPs,
news articles, SEO-
critical pages with
dynamic data
Server load scales with
traffic. TTFB slower
than CDN-cached SSG.
SSG Pages pre-rendered at
build time to static
## HTML
Marketing pages, docs,
blog posts, mostly-static
content
Stale data until next
build. Long build times
for large catalogs.
ISR (Next.js) SSG pages
regenerated in
background after stale-
while-revalidate TTL
Product pages, user
profiles, any SSG
content with periodic
updates
Best of SSG + SSR.
Occasional stale
responses until
regeneration.
Streaming SSR Server streams HTML
chunks as they are
ready; shell arrives first,
data slots fill in
Dashboards where
some data is fast and
some is slow
## Complex
implementation.
## Requires React 18 +
Suspense boundaries.
Edge SSR SSR runs at CDN edge
(Vercel Edge,
## Cloudflare Workers),
not a central data-
center
Global apps needing
fast TTFB everywhere
Cold starts. Limited
runtime APIs (no
Node.js fs, no native
modules).

2.2  CDN Strategy — Caching the Right Things at the Right TTL
Asset Type Cache-Control CDN TTL Invalidation Strategy
JS/CSS bundles
## (content-hashed)
public, max-
age=31536000,
immutable
1 year Hash changes on
deploy — auto-
invalidated by new URL
Product images public, max-age=86400,
s-maxage=604800
7 days Purge by URL when
image updated. Use
versioned URL.
SSG HTML pages public, s-maxage=3600,
stale-while-
revalidate=600
1 hour CDN purge on
publish/deploy. Tag-
based invalidation.
API responses
## (listings)
public, s-maxage=60,
stale-while-
revalidate=30
60 seconds TTL expiry + explicit
purge on update
User-specific API data private, no-store Never cached at CDN Must hit origin every
request

Fonts public, max-
age=31536000,
immutable
1 year Content-hashed
filename. Same as
bundles.

2.3  Backend-for-Frontend (BFF) Pattern
The BFF is a server-side API layer owned by the frontend team, purpose-built for the frontend client. Instead of
calling 5 microservices separately (user, posts, likes, media, ads) and doing heavy client-side composition, the
client calls one BFF endpoint and gets back exactly what the UI needs — no more, no less.
Without BFF With BFF
5 separate API calls on page load → 5 network
round trips
1 BFF call → BFF fans out to 5 services in parallel
Client receives raw microservice data,
transforms it
BFF returns UI-optimised data shape — client
renders directly
Frontend team blocked on backend API
changes
Frontend team owns the BFF — can evolve
response shape independently
Mobile and desktop get identical data
(inefficient for mobile)
BFF can serve different response shapes to mobile
vs desktop
Business logic leaks into the browser Aggregation logic stays server-side — faster,
hidden from users
// BFF endpoint for feed page — one call instead of five
// GET /bff/feed?cursor=abc&limit=20
// BFF internally calls: postsService + userService + mediaService + adsService
## // Returns:
## {
user: { id, name, avatar, unreadNotifications: 3 },  // from userService
posts: [{ ...post, author: { ...user }, media: { ...media } }], // joined
ads: [{ ...adUnit }],   // from adsService
nextCursor: 'xyz',
hasMore: true
## }
// Client renders this directly — zero client-side data joining

2.4  Feature Flags & A/B Testing at Scale
Feature flags decouple deployment from release. You deploy code to production but keep it behind a flag that
only 1% of users see. This enables: dark launches, gradual rollouts, A/B experiments, kill switches for broken
features, and environment-specific behaviour.
// Feature flags evaluated at the edge (fastest — no extra round trip)
// Cloudflare Workers / Vercel Edge Middleware evaluates flags before serving page

// Edge Middleware (Next.js)
export function middleware(request) {
const userId = request.cookies.get('userId')?.value;
const bucket = hashUserId(userId) % 100; // consistent bucketing

// New checkout flow for 20% of users
if (bucket < 20) {
const url = request.nextUrl.clone();
url.pathname = '/checkout-v2' + request.nextUrl.pathname;
return NextResponse.rewrite(url);
## }
## }

// Client-side feature flag hook
function useFlag(flagName) {

return useFlags()[flagName] ?? false;
// useFlags() fetches from LaunchDarkly/Unleash on mount, caches in context
## }

function CheckoutPage() {
const newCheckout = useFlag('checkout_v2');
return newCheckout ? <CheckoutV2 /> : <CheckoutV1 />;
## }

## Interview Q
What is a Backend-for-Frontend (BFF) pattern? Why is it important for large
frontend teams?
## Interview Q
What are the tradeoffs between SSR, SSG, and ISR? When would you pick each
for a product listing page?
## Interview Q
How do feature flags enable safe deploys? What is gradual rollout and why does it
matter?


## Section 3   Micro-frontends

A micro-frontend architecture decomposes a frontend application into smaller, independently-deployable
applications owned by different teams. Each team builds, tests, and deploys its slice of the UI independently —
just as backend microservices allow independent service deployment. This is the architecture that enables large
organisations like Flipkart, IKEA, Zalando, and DAZN to scale their frontend development across dozens of
teams.

3.1  When to Use Micro-frontends
Use Micro-frontends When Do NOT Use When
Multiple teams (5+) own different product areas Single team — monolith is simpler, faster, and
easier to maintain
Independent deployment cadences: checkout
team deploys daily, catalog team deploys
weekly
Small app — micro-frontend overhead (shared
deps, integration testing, routing) exceeds benefit
Teams use different tech stacks (React team +
Angular team in same app)
Performance is a top priority — multiple bundles =
more network requests
Gradual migration: wrap legacy app sections
and replace one at a time
Team culture favours simplicity — micro-frontends
require significant DevOps investment

## 3.2  Integration Approaches — Comparison
## Approach How It Works Pros Cons Best For
## Build-time
integration
npm packages:
shell imports MFE
as a library
Simple, type-safe,
single bundle
Re-deploy shell to
update MFE —
not independent
## Component
libraries, shared
utilities
Runtime via
iframes
Shell embeds
MFEs in iframes
Perfect isolation,
any stack, CSP
safe
Terrible UX:
separate scroll,
history, focus,
clipboard
Legacy app
embedding,
sandboxed third-
party widgets
## Module
## Federation
(Webpack 5)
Shell lazy-loads
MFE JS from
MFE's own URL at
runtime
True runtime
independence,
shared
dependencies,
separate deploys
## Complex
Webpack config,
version
mismatches,
shared lib
negotiation
The industry
standard for React
teams
## Web
## Components
MFEs expose
## Custom Elements;
shell uses them
like HTML
elements
## Framework-
agnostic, native
browser isolation
SSR is hard,
styling leaks,
performance
overhead
## Cross-framework
teams, design
systems
## Server-side
composition
## Edge/server
assembles HTML
fragments from
multiple services
Best performance
(single HTML
response), SSR-
friendly
Complex infra,
teams need HTTP
contract discipline
News sites, e-
commerce with
heavy SSR


## 3.3  Module Federation — The Production Pattern
// ── SHELL (host) webpack.config.js ─────────────────────────────
new ModuleFederationPlugin({
name: 'shell',
remotes: {
// Key: import alias. Value: remoteName@url/remoteEntry.js
catalogMFE:  'catalog@https://catalog.myapp.com/remoteEntry.js',
checkoutMFE: 'checkout@https://checkout.myapp.com/remoteEntry.js',
accountMFE:  'account@https://account.myapp.com/remoteEntry.js',
## },
shared: {
react:     { singleton:true, requiredVersion:'^18.0.0' },
'react-dom':{ singleton:true, requiredVersion:'^18.0.0' },
// singleton:true = only one React instance across all MFEs
// Without this: multiple React instances → hook rules violated → crash
## },
## })

// ── REMOTE (MFE) webpack.config.js ─────────────────────────────
new ModuleFederationPlugin({
name: 'catalog',
filename: 'remoteEntry.js',   // entry manifest file loaded by shell
exposes: {
'./CatalogApp':   './src/CatalogApp',      // full page
'./ProductCard':  './src/ProductCard',     // shared component
'./SearchWidget': './src/SearchWidget',    // widget for shell header
## },
shared: {
react:     { singleton:true, requiredVersion:'^18.0.0' },
'react-dom':{ singleton:true, requiredVersion:'^18.0.0' },
## },
## })

// ── Shell routing — lazy load MFE pages ───────────────────────
const CatalogApp  = lazy(() => import('catalogMFE/CatalogApp'));
const CheckoutApp = lazy(() => import('checkoutMFE/CheckoutApp'));

function App() {
return (
<BrowserRouter>
<Shell>   {/* header, nav, footer owned by shell */}
<Suspense fallback={<PageSkeleton />}>
<Routes>
<Route path='/products/*' element={<CatalogApp />} />
<Route path='/checkout/*' element={<CheckoutApp />} />
</Routes>
</Suspense>
</Shell>
</BrowserRouter>
## );
## }

3.4  Cross-MFE Communication
// MFEs must not import from each other — that creates coupling.
// They must communicate through the shell or through a shared bus.

// ── Option 1: Custom Events (DOM-level, framework agnostic) ──────
// MFE A (Catalog): user adds to cart
window.dispatchEvent(new CustomEvent('cart:item-added', {
detail: { productId: 'abc', quantity: 1 },
bubbles: true,
## }));


// Shell or Cart MFE listens
window.addEventListener('cart:item-added', (e) => {
cartStore.add(e.detail);
showToast('Added to cart!');
## });

// ── Option 2: Shared state via Shell-provided Context ─────────────
// Shell creates the store and passes it to each MFE as a prop
const sharedStore = createGlobalStore();

<CatalogApp sharedStore={sharedStore} />
<CartMFE    sharedStore={sharedStore} />

// ── Option 3: URL as shared state (best for navigation) ───────────
// MFEs communicate via URL params — decoupled and shareable
// Catalog: navigate('/checkout?items=abc,def&source=catalog')
// Checkout reads URL params — no direct coupling to Catalog

// ── What to AVOID ────────────────────────────────────────────────
// import { cartStore } from 'cartMFE/store'  // direct coupling — NEVER
// window.myApp.cartStore.add(...)             // global namespace — fragile

3.5  Micro-frontend Pitfalls and Mitigations
## Pitfall Symptom Mitigation
Multiple React instances Hooks throw errors, context
doesn't work across MFE
boundaries
shared: { react: { singleton: true }
} in Module Federation config
CSS leakage One MFE's styles override
another's
CSS Modules, Shadow DOM,
CSS-in-JS, or namespaced class
prefixes
Bundle duplication React loaded 4 times = 600KB
extra JS
Shared dependencies in Module
Federation. Version alignment
across teams.
Slow initial load 6 separate JS files downloaded
for one page
Eager pre-loading remoteEntry.js
files in shell HTML. Edge
caching.
Version drift MFE uses React 18.2, shell uses
## React 18.0
Strict version ranges in shared
config + CI enforcement
Auth token sharing Each MFE needs to know if user
is logged in
Shell passes auth token/user as
prop OR shared auth service via
## Custom Event
Independent deploy breaks
shell
MFE exposes API that shell
uses; MFE changes it; shell
breaks
Contract testing (Pact).
Versioned expose paths.
Semantic versioning.

## Interview Q
What is Module Federation? How does it differ from simply using npm packages for
sharing code between teams?
## Interview Q
How do micro-frontends share state? What are the options and what are the
tradeoffs of each?
## Interview Q
What are the main challenges of micro-frontends and how would you solve the
CSS isolation problem?


Case Study 1   Design a Social Media Feed
(Facebook / Twitter / LinkedIn)

Design the frontend for a social media news feed. Users can view posts from people they follow, like and
comment on posts, share content, and see real-time notifications. The feed must work at massive scale (1B+
users on Facebook, 400M on Twitter/X).

## Clarifying Questions & Scope Decisions
## Question Scope Decision
Is this a public feed (Twitter) or social graph
feed (Facebook)?
Social graph feed — posts from followed users +
ranked by engagement algorithm
Real-time or polling for new posts? Real-time: WebSocket for live post notifications +
SSE for typing indicators
Infinite scroll or pagination? Infinite scroll with virtual list — feed can have
thousands of posts
Media types? Images (lazy loaded WebP) + Videos (autoplay
muted on viewport enter, lazy loaded)
Mobile-first? Yes — 80% of social media traffic is mobile. Touch
gestures, network adaptation.

## Data Model
type Post = {
id: string
author:    { id, name, avatar, isVerified, followerCount }
content:   string                  // max 2000 chars
mediaUrls: { type:'image'|'video', url, thumbnail, aspectRatio }[]
createdAt: string                  // ISO 8601
likeCount: number; commentCount: number; shareCount: number
isLiked: boolean; isBookmarked: boolean; isFollowingAuthor: boolean
engagementScore: number            // server-computed ranking signal
## }

type FeedResponse = {
posts: Post[]
nextCursor: string | null    // null = end of feed
freshPostCount: number       // 'N new posts' banner trigger
## }

## Architecture
## Layer Technology Choice Reasoning
Rendering Next.js SSR for initial feed page SEO for public posts. Fast TTFB.
Shell from cache, data from
server.
Feed state React Query (server state) +
Zustand (optimistic updates)
React Query handles
caching/pagination. Zustand

handles like/unlike before server
confirms.
Real-time new posts WebSocket connection to
notification service
New post IDs pushed; client
shows 'N new posts' banner.
User clicks to load.
Feed pagination Cursor-based infinite scroll
(Intersection Observer)
No page drift when new posts
arrive. useInfiniteQuery for
cursor management.
Media loading Intersection Observer for lazy
load + Native lazy attribute
Images/videos load only when
entering viewport. Saves
bandwidth on mobile.
Feed list rendering react-window FixedSizeList
## (virtualized)
User's feed may contain
thousands of posts — full DOM
render causes memory bloat.
CDN Cloudflare — static assets +
cached API responses
s-maxage=60 for feed API.
Image CDN with WebP
conversion + resize.

## Feed Ranking — Frontend Considerations
The ranking algorithm runs server-side (the frontend never does feed ranking). However, the frontend must
handle: (1) Feed refresh — when the user pulls to refresh or clicks 'New posts', merge new posts at the top
without disrupting current scroll position. (2) Sponsored posts — render AdUnit components at fixed intervals
(e.g., every 5 organic posts) determined by the feed API. (3) 'Why am I seeing this?' — tooltip driven by
engagementScore and relationship metadata returned by API.
// ── Real-time new posts banner ───────────────────────────────────
function useFeedUpdates(onNewPosts) {
const wsRef = useRef(null);

useEffect(() => {
const ws = new WebSocket('wss://feed.myapp.com/live');
wsRef.current = ws;

ws.onmessage = (e) => {
const { type, count } = JSON.parse(e.data);
if (type === 'new_posts') onNewPosts(count);
## };

return () => ws.close();
}, [onNewPosts]);
## }

function FeedPage() {
const [newPostCount, setNewPostCount] = useState(0);
const queryClient = useQueryClient();

useFeedUpdates((count) => setNewPostCount(c => c + count));

async function loadNewPosts() {
await queryClient.invalidateQueries({ queryKey: ['feed'] });
setNewPostCount(0);
// Scroll to top
window.scrollTo({ top: 0, behavior: 'smooth' });
## }

return (
## <>
{newPostCount > 0 && (

<button onClick={loadNewPosts} className='new-posts-banner'
aria-live='polite'>
{newPostCount} new post{newPostCount > 1 ? 's' : ''} — Click to see
## </button>
## )}
<VirtualFeed />
## </>
## );
## }

## REAL WORLD
Facebook's news feed used to re-render the entire feed on every update. They
moved to a virtualized feed with React in ~2013 and then to their own virtual list
implementation. The key insight: for 1B users, the average feed has hundreds of
posts — rendering them all in the DOM causes 500ms+ scroll jank on mid-range
Android devices. Virtualization reduces active DOM nodes from 300+ to ~20.

## Interview Q
Design the frontend for a social media news feed. Cover: data model, rendering
strategy, real-time updates, infinite scroll, and media loading.


Case Study 2   Design an E-Commerce Platform
(Flipkart / Amazon)

Design the frontend for a large e-commerce platform. Core journeys: product discovery (search + browse),
product detail page, shopping cart, checkout, and order tracking. Scale: Flipkart handles 8M+ orders/day on sale
days.

Architecture Decision: Monolith vs Micro-frontend
An e-commerce platform at Flipkart/Amazon scale is the canonical micro-frontend use case. Different teams
own: Homepage (editorial), Search & Browse (recommendations + filters), Product Detail Page (catalog +
inventory + price + reviews), Cart & Checkout (high security, independent deploy cadence), and Account/Orders
(user data). Each team deploys independently. A bug in the Checkout service should never require a Homepage
re-deploy.
Page Rendering Strategy Cache TTL Why
Homepage ISR (revalidate: 300s) 5 min at CDN Mostly editorial.
Personalisation injected
client-side after shell.
Search Results SSR 30s CDN (Vary: query) Highly dynamic. SEO
important for discovery.
Facet data changes
frequently.
## Product Detail Page
## (PDP)
ISR (revalidate: 60s) 1 min CDN Product info changes
rarely. Price/inventory
fetched client-side for
freshness.
Cart CSR (client only) No CDN User-specific. Private.
Optimistic updates
critical for UX.
Checkout SSR + strict CSP No CDN Security-critical. Fresh
data every time. PCI-
DSS compliance.
Order Confirmation SSR No CDN Unique per user. No
caching.

## Product Detail Page — Deep Dive
// PDP has the most complex data requirements of any e-commerce page

// ── Data fetching strategy ───────────────────────────────────────
// Static (ISR cached): product name, description, specs, images
// Dynamic (client-fetched, always fresh): price, stock, offers, EMI options
// Lazy-loaded: reviews, Q&A, similar products, brand store

function ProductDetailPage({ staticProduct }) {
// Static shell from ISR — instant
const { data: liveData } = useQuery({
queryKey:  ['product-live', staticProduct.id],
queryFn:   () => api.getProductLiveData(staticProduct.id),
staleTime: 30_000,   // price can change — refresh every 30s
refetchInterval: 60_000,

## });

// Reviews loaded lazily (below fold)
const { ref: reviewRef, inView } = useInView({ triggerOnce: true });
const { data: reviews } = useQuery({
queryKey: ['reviews', staticProduct.id],
queryFn:  () => api.getReviews(staticProduct.id),
enabled:  inView,  // only fetch when user scrolls to reviews
## });

return (
## <main>
<ProductImageGallery images={staticProduct.images} />
<ProductInfo product={staticProduct} liveData={liveData} />
<AddToCartSection product={staticProduct} liveData={liveData} />
{/* Reviews section — lazy loaded */}
<section ref={reviewRef}>
{inView && <ReviewList reviews={reviews} />}
## </section>
## </main>
## );
## }

Cart & Checkout — Optimistic Updates and Security
// ── Cart: optimistic add to cart ────────────────────────────────
function useCartMutation() {
const queryClient = useQueryClient();

return useMutation({
mutationFn: (item) => api.post('/cart/items', item),

onMutate: async (item) => {
await queryClient.cancelQueries({ queryKey: ['cart'] });
const prev = queryClient.getQueryData(['cart']);
// Optimistically add item to cart
queryClient.setQueryData(['cart'], old => ({
## ...old,
items: [...old.items, { ...item, id: 'temp-' + Date.now() }],
## }));
return { prev };
## },

onError: (err, item, ctx) => {
queryClient.setQueryData(['cart'], ctx.prev);
toast.error('Failed to add to cart. Please try again.');
## },

onSettled: () => {
// Refetch to get server-assigned item ID and fresh cart total
queryClient.invalidateQueries({ queryKey: ['cart'] });
## },
## });
## }

// ── Checkout: security requirements ────────────────────────────
// 1. Strict Content Security Policy — no third-party scripts in checkout
// 2. All forms use CSRF tokens
// 3. Card details NEVER touch your server — use Stripe/Razorpay SDK
//    (card input is in an iframe from the payment provider's domain)
// 4. Amount displayed client-side is for UX only — server validates
// 5. Idempotency key on order submission — prevent double orders
const orderId = crypto.randomUUID(); // generated client-side
await api.post('/orders', { ...orderData, idempotencyKey: orderId });


## REAL WORLD
Flipkart's Big Billion Day sale frontend is architected to handle 8M+ orders in a
single day — roughly 100 orders per second at peak. The key frontend decisions:
product pages served from CDN edge (< 50ms globally), price/inventory fetched
separately at runtime to avoid stale ISR data, cart operations heavily optimistic so
even slow network feels instant, and checkout isolated with dedicated servers and
no micro-frontend complexity.

## Interview Q
Design the frontend architecture for an e-commerce platform like Flipkart. What
rendering strategy would you use for the Product Detail Page and why?


Case Study 3   Design a Video Streaming Platform
(Netflix / YouTube)

Design the frontend for a video streaming service. Core features: content discovery (homepage, categories,
search), video playback with quality adaptation, watchlist, continue watching, and personalized
recommendations. Scale: Netflix streams to 270M subscribers across every device imaginable.

Video Delivery Architecture — Adaptive Bitrate (ABR)
The most technically complex part of a video streaming frontend is adaptive bitrate streaming. The player
continuously adjusts video quality based on network bandwidth and buffer health.
## Concept Explanation Frontend Implementation
HLS / DASH Video encoded at multiple
bitrates (360p, 720p, 1080p, 4K).
Manifest file lists all segments
and qualities.
Use hls.js (HLS) or dash.js
(DASH) libraries. Native HLS on
Safari iOS.
ABR Algorithm Player monitors buffer level +
download speed. If buffer < 10s:
step down quality. If buffer > 30s
and bandwidth allows: step up.
hls.js has built-in ABR. For
custom: override with
AbrController class.
Pre-buffer Start buffering the next episode's
first 30s before current episode
ends.
Intersection Observer on end-of-
episode marker. Preload next
segment.
Thumbnail preview Scrubbing the progress bar
shows video thumbnail previews.
Sprite sheet: one image with
100s of thumbnails. CSS
background-position to select
frame.
DRM Widevine (Chrome/Android),
FairPlay (Safari/iOS), PlayReady
(Edge/Windows).
## Encrypted Media Extensions
(EME) API. DRM handled by
CDN (e.g., AWS MediaConvert +
CloudFront).

## Video Player Component Design
// ── Player state machine ─────────────────────────────────────────
// States: idle → loading → buffering → playing → paused → error → ended
// Transitions triggered by: user actions + HLS events + network events

const playerStates = {
idle:      { on: { LOAD: 'loading' } },
loading:   { on: { LOADED: 'playing', ERROR: 'error' } },
buffering: { on: { BUFFERED: 'playing', ERROR: 'error' } },
playing:   { on: { PAUSE: 'paused', STALL: 'buffering', END: 'ended' } },
paused:    { on: { PLAY: 'playing', SEEK: 'buffering' } },
ended:     { on: { REPLAY: 'loading', NEXT: 'loading' } },
error:     { on: { RETRY: 'loading' } },
## };

// ── Keyboard controls ────────────────────────────────────────────
// WCAG 2.1 requires video player to be fully keyboard operable
document.addEventListener('keydown', (e) => {
if (!playerFocused) return;

switch(e.key) {
case ' ':         togglePlay();              break;  // Space: play/pause
case 'ArrowLeft': seek(currentTime - 10);    break;  // 10s back
case 'ArrowRight':seek(currentTime + 10);    break;  // 10s forward
case 'ArrowUp':   setVolume(Math.min(1, v+0.1)); break;
case 'ArrowDown': setVolume(Math.max(0, v-0.1)); break;
case 'f':         toggleFullscreen();        break;
case 'm':         toggleMute();              break;
case 'c':         toggleCaptions();          break;
## }
## });

// ── Auto-play next episode ───────────────────────────────────────
function useAutoplayNext({ currentEpisode, onPlayNext }) {
const [countdown, setCountdown] = useState(null);

useEffect(() => {
if (!currentEpisode.isNearEnd) return; // fired when 90% watched
setCountdown(10);
const interval = setInterval(() => {
setCountdown(c => {
if (c <= 1) { clearInterval(interval); onPlayNext(); return null; }
return c - 1;
## });
## }, 1000);
return () => clearInterval(interval);
}, [currentEpisode.isNearEnd]);

return { countdown };
## }

## Homepage — Horizontal Scroll Carousels
Netflix's homepage is built from horizontal-scroll rows of content, each row owned by a recommendation
algorithm ('Continue Watching', 'Top 10 in India', 'Because you watched Scam 1992'). The frontend challenge is
performance: 20 rows × 20 thumbnails = 400 images on one page.
// Performance strategy for Netflix-style homepage:

// 1. Lazy load rows below the fold (Intersection Observer)
// 2. Lazy load images within rows (loading='lazy' + IO)
// 3. Pre-load first 3 rows at LCP priority (fetchpriority='high')
// 4. On hover: expand card + load trailer preview (300ms debounce)
// 5. On trailer hover: play muted video (IntersectionObserver + autoplay)

function ContentRow({ rowId, title, fetchFn }) {
const { ref, inView } = useInView({ triggerOnce:true, rootMargin:'200px' });
const { data: items } = useQuery({
queryKey: ['row', rowId],
queryFn:   fetchFn,
enabled:   inView,  // don't fetch until row is near viewport
## });

return (
<section ref={ref} className='content-row'>
## <h2>{title}</h2>
<div className='scroll-track' role='list'>
{items?.map(item => <ContentCard key={item.id} item={item} />)}
{!items && inView && <RowSkeleton />}
## </div>
## </section>
## );
## }


function ContentCard({ item }) {
const [hovered, setHovered] = useState(false);
const debouncedHover = useDebouncedValue(hovered, 300);

return (
## <div
role='listitem'
onMouseEnter={() => setHovered(true)}
onMouseLeave={() => setHovered(false)}
className={`card ${debouncedHover ? 'card--expanded' : ''}`}
## >
<img src={item.thumbnail} loading='lazy' alt={item.title} />
{debouncedHover && (
<TrailerPreview videoId={item.trailerId} autoplay muted />
## )}
## </div>
## );
## }

## Interview Q
Design the video player component architecture. What states does it need? How
do you handle buffering and quality adaptation?
## Interview Q
How do you optimise the Netflix-style homepage for performance? 400 thumbnail
images on one page — how do you handle this?


Case Study 4   Design a Collaborative Document
Editor  (Google Docs)

Design the frontend for a real-time collaborative document editor. Multiple users can edit the same document
simultaneously. Changes from one user must appear on all other users' screens within 100ms. Conflicts must
be resolved automatically. Users see each other's cursor positions and selections.

The Core Problem: Operational Transformation vs CRDT
## Approach How It Works Pros Cons Used By
## Operational
## Transformation
## (OT)
Each change is an
## 'operation' (insert
char at pos N, delete
char at pos N).
Server transforms
concurrent
operations so they
converge when
applied.
## Well-understood.
Works for text. Low
bandwidth.
Requires a central
server to coordinate
transforms. Complex
algorithm.
## Google Docs,
## Etherpad
CRDT (Conflict-free
## Replicated Data
## Types)
Data structure
mathematically
guarantees
convergence. No
server coordination
needed. Operations
can be merged in
any order.
## Peer-to-peer
possible. No server
bottleneck. Simpler
client logic.
Higher memory
usage. More
complex data
structures. Less
intuitive for text.
## Figma, Linear,
Notion-style apps
(custom CRDT)
Yjs (CRDT library) Production-ready
## CRDT
implementation.
Supports text, rich
text (Quill/TipTap),
maps, arrays.
## Battle-tested.
Provider ecosystem
(WebSocket,
WebRTC,
IndexedDB
persistence).
Yjs-specific API.
Lock-in to Yjs
document model.
Excalidraw, many
open-source editors

Full Architecture with Yjs
import * as Y    from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { QuillBinding }       from 'y-quill'
import { IndexeddbPersistence } from 'y-indexeddb'

function CollaborativeEditor({ documentId }) {
const ydoc    = useMemo(() => new Y.Doc(), []);
const ytext   = useMemo(() => ydoc.getText('content'), [ydoc]);

// ── Persistence: IndexedDB for offline support ─────────────
useEffect(() => {
const idbProvider = new IndexeddbPersistence(documentId, ydoc);
idbProvider.on('synced', () => console.log('Loaded from IndexedDB'));
return () => idbProvider.destroy();
}, [documentId, ydoc]);

// ── Real-time sync: WebSocket to collaboration server ──────
useEffect(() => {

const wsProvider = new WebsocketProvider(
'wss://collab.myapp.com', documentId, ydoc
## );
wsProvider.on('status', e => console.log('WS status:', e.status));
return () => wsProvider.destroy();
}, [documentId, ydoc]);

// ── Awareness: cursor positions and user presence ───────────
const awareness = useMemo(() => wsProvider?.awareness, [wsProvider]);

useEffect(() => {
if (!awareness) return;
// Broadcast our cursor position to all connected users
awareness.setLocalStateField('user', {
name:  currentUser.name,
color: currentUser.color,
## });
awareness.setLocalStateField('cursor', { anchor: null, head: null });
## }, [awareness]);

// ── Render collaborative cursors ────────────────────────────
const [remoteCursors, setRemoteCursors] = useState(new Map());
useEffect(() => {
if (!awareness) return;
const handler = () => {
const cursors = new Map();
awareness.getStates().forEach((state, clientId) => {
if (clientId !== ydoc.clientID && state.user) {
cursors.set(clientId, state);
## }
## });
setRemoteCursors(cursors);
## };
awareness.on('change', handler);
return () => awareness.off('change', handler);
}, [awareness, ydoc.clientID]);

return (
<div className='editor-container'>
<CollaboratorsBar cursors={remoteCursors} />
<QuillEditor ytext={ytext} awareness={awareness} />
{/* Cursor overlays rendered as absolutely-positioned divs */}
{[...remoteCursors.entries()].map(([id, state]) => (
<RemoteCursor key={id} user={state.user} cursor={state.cursor} />
## ))}
## </div>
## );
## }

## Comment Threads & Suggestions Mode
Google Docs-style comments are anchored to text ranges. When the document text changes (other users edit),
comment anchors must update their positions. This is another CRDT problem: the comment's position is relative
to a Y.Text position, which Yjs manages automatically — positions are stable even as surrounding text changes.
Suggestions mode (tracked changes): every edit creates a 'suggestion' object { author, originalText,
suggestedText, range } rather than directly modifying the document. The document owner accepts or rejects
suggestions. Client-side: a toggle switches between 'Show suggestions' (render tracked changes highlighted)
and 'Preview accepted' (render final version).

## Interview Q
How does real-time collaborative editing work at a high level? What is the
difference between OT and CRDT?

## Interview Q
How do you show other users' cursor positions in a collaborative editor? What data
does the awareness protocol track?


Case Study 5   Design a Ride-Hailing App  (Uber /
## Ola)

Design the frontend for a ride-hailing application. Core user journeys: book a ride, see nearby drivers on a live
map, track driver en-route, view ETA and fare, end trip and rate driver. The defining technical challenge is the
live map — driver positions must update every 2-4 seconds smoothly without jank.

## Key Architecture Decisions
## Decision Choice Reasoning
Map library Mapbox GL JS (WebGL-based) 60fps smooth animations. Driver
markers move smoothly vs
Leaflet's pixel-jump. GPU-
accelerated.
Driver position transport WebSocket (not polling) Positions update every 2-4s.
HTTP polling would create
N×(1/4s) = 900 requests/hour
per user. WS = 1 persistent
connection.
Driver marker animation CSS transition + interpolation
between GPS coordinates
GPS positions arrive discretely.
Interpolate between last and
current position for smooth
movement.
Map rendering strategy Canvas/WebGL (Mapbox), not
## SVG
SVG struggles with 100+
animated markers. WebGL
maintains 60fps with thousands
of markers.
ETA updates SSE (server-sent events) ETA is server-computed, one-
directional push. SSE simpler
than WS for this use case.
Offline/poor signal Show last known driver position.
'Signal lost' indicator.
Driver tracking in
tunnels/basements — degrade
gracefully.

## Driver Tracking — Live Map Implementation
function useDriverTracking(rideId) {
const [driverPos, setDriverPos] = useState(null);
const [prevPos,   setPrevPos]   = useState(null);
const wsRef = useRef(null);

useEffect(() => {
if (!rideId) return;
const ws = new WebSocket(`wss://tracking.uber.com/ride/${rideId}`);
wsRef.current = ws;

ws.onmessage = (e) => {
const { lat, lng, heading, speed } = JSON.parse(e.data);
setDriverPos(prev => {
setPrevPos(prev);          // store previous position for interpolation
return { lat, lng, heading, speed, ts: Date.now() };
## });

## };

return () => ws.close();
}, [rideId]);

return { driverPos, prevPos };
## }

function DriverMarker({ map, driverPos, prevPos }) {
const markerRef = useRef(null);
const animRef   = useRef(null);

useEffect(() => {
if (!driverPos || !prevPos) return;

// Interpolate from prevPos to driverPos over 2 seconds (update interval)
const start    = performance.now();
const duration = 2000; // ms — matches WS update interval

function animate(now) {
const t = Math.min((now - start) / duration, 1);
// Ease: smooth interpolation (ease-in-out cubic)
const ease = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;

const lat = prevPos.lat + (driverPos.lat - prevPos.lat) * ease;
const lng = prevPos.lng + (driverPos.lng - prevPos.lng) * ease;

markerRef.current?.setLngLat([lng, lat]);

if (t < 1) animRef.current = requestAnimationFrame(animate);
## }

animRef.current = requestAnimationFrame(animate);
return () => cancelAnimationFrame(animRef.current);
}, [driverPos, prevPos]);

// Rotate marker to match driver heading
useEffect(() => {
if (!driverPos?.heading) return;
markerRef.current?.getElement().style.setProperty(
'transform', `rotate(${driverPos.heading}deg)`
## );
}, [driverPos?.heading]);

return null; // Mapbox marker is imperative, not React-rendered
## }

## Interview Q
Design the live driver tracking map for a ride-hailing app. How do you make driver
markers move smoothly when GPS updates arrive every 3 seconds?
## Interview Q
Why use WebSocket instead of HTTP polling for driver position updates? When
would SSE be better?


Case Study 6   Design a Live Sports Commentary
App  (CricBuzz / ESPNcricinfo)

Design the frontend for a live cricket commentary application. During a live match, the score updates ball-by-ball
(every 30-90 seconds). Users see: live score, over-by-over commentary, scorecard, partnerships, and match
situations. The challenge: serve live data to millions of concurrent users during a World Cup final.

## Scale Challenge
During an India vs Pakistan World Cup match, CricBuzz sees 50M+ concurrent users. Sending WebSocket
updates to 50M connections simultaneously is not feasible — that requires 50M maintained server connections.
The correct architecture uses a fan-out CDN/pub-sub approach.
## Transport Option Concurrent Users
## Supported
## Latency Infrastructure Cost Decision
WebSocket (direct) ~100K per server. 50M
= 500 servers
< 100ms Very high: 500
dedicated WS servers
Too expensive for
read-heavy broadcast
Server-Sent Events
## (SSE)
~10K per server. 50M
= 5000 servers
< 200ms Extreme Not viable at this scale
Long Polling ~1K per server. 50M =
50,000 servers
## 500ms-2s Prohibitive Eliminated
CDN-Edge SSE
(Fastly/Cloudflare)
Edge nodes absorb
load. Origin sends 1
update; CDN fans out
to millions
< 500ms Low origin cost; CDN
handles fan-out
Best for broadcast use
case
## Short Polling (5s
interval)
CDN absorbs most
requests with 5s TTL
5s stale max Very low — CDN
serves 95%+ from
cache
Pragmatic choice for
ball-by-ball (updates
every 30-90s)

Recommended Architecture: Smart Polling + CDN
// Ball-by-ball updates happen every 30-90 seconds.
// A 5-second poll interval means max 5s staleness — acceptable for cricket.
// CDN caches the score response for 5 seconds.
// 50M users × 1 req/5s = 10M req/min. CDN hit rate ~99% → ~100K/min to origin.

function useLiveScore(matchId) {
const { data: score } = useQuery({
queryKey:       ['live-score', matchId],
queryFn:        () => fetch(`/api/matches/${matchId}/live`).then(r=>r.json()),
refetchInterval: 5_000,    // poll every 5 seconds
staleTime:       4_000,    // consider fresh for 4s (just under poll interval)
// CDN has Cache-Control: public, s-maxage=5 on this endpoint
## });

return score;
## }

// ── Commentary feed: new ball events ─────────────────────────
// Commentary entries append — never change. Use cursor pagination.
function useCommentaryFeed(matchId) {
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
queryKey: ['commentary', matchId],

queryFn:  ({ pageParam }) => fetchCommentary(matchId, pageParam),
initialPageParam: 'latest',
getNextPageParam: page => page.olderCursor,
// 'latest' always returns newest. Subsequent calls load older commentary.
// New balls: refetch 'latest' every 5s same as score.
refetchInterval: 5_000,
refetchIntervalInBackground: false, // save battery when tab hidden
## });

return {
commentary: data?.pages.flatMap(p => p.entries) ?? [],
loadOlder:  fetchNextPage,
hasOlder:   hasNextPage,
## };
## }

// ── Page Visibility API: pause polling when tab is hidden ─────
useEffect(() => {
function onVisibilityChange() {
if (document.hidden) {
queryClient.setDefaultOptions({ queries: { refetchInterval: false } });
} else {
queryClient.setDefaultOptions({ queries: { refetchInterval: 5_000 } });
queryClient.invalidateQueries({ queryKey: ['live-score', matchId] });
## }
## }
document.addEventListener('visibilitychange', onVisibilityChange);
return () => document.removeEventListener('visibilitychange', onVisibilityChange);
}, [matchId, queryClient]);

Score Animation — Wickets and Boundaries
// Animate when score changes: boundary = flash green, wicket = flash red
function useScorecardAnimation(score) {
const [event, setEvent] = useState(null);
const prevRef = useRef(score);

useEffect(() => {
if (!prevRef.current || !score) return;
const wicketFell = score.wickets > prevRef.current.wickets;
const boundary4  = score.runs - prevRef.current.runs === 4;
const boundary6  = score.runs - prevRef.current.runs === 6;

if (wicketFell)   setEvent('wicket');
else if (boundary6) setEvent('six');
else if (boundary4) setEvent('four');

// Clear animation after 2s
setTimeout(() => setEvent(null), 2000);
prevRef.current = score;
## }, [score]);

return event;
## }

function Scoreboard({ matchId }) {
const score  = useLiveScore(matchId);
const event  = useScorecardAnimation(score);

return (
<div className={`scoreboard ${event ? `scoreboard--${event}` : ''}`}
aria-live='polite' aria-atomic='true'>
<span aria-label='Runs'>{score?.runs}</span>/
<span aria-label='Wickets'>{score?.wickets}</span>

<span aria-label='Overs'>({score?.overs})</span>
## </div>
## );
## }

## Interview Q
How do you design a live score app that serves 50 million concurrent users? Why
is WebSocket not the right choice here?
## Interview Q
How does the Page Visibility API help reduce server load for a live polling
application?


Section 7   Interview Questions — 10 Senior HLD
## Model Answers

Q1: How would you approach a frontend system design interview question
you've never seen before?
Start with the 7-step framework. Step 1: ask clarifying questions about scope and scale before touching the
design. Step 2: define core entities and data model. Step 3: sketch the API contract. Step 4: describe the high-
level architecture with the rendering strategy at the centre (CSR/SSR/SSG/ISR/Streaming). Step 5: component
tree. Step 6: non-functional requirements — performance, a11y, security, offline, observability. Step 7: failure
modes and edge cases.
The framework works for every product. In the first 10 minutes you are asking questions and defining data —
this builds rapport and ensures your design matches the problem. The interviewer wants to see structured
thinking, not a memorised answer.

Q2: When would you choose micro-frontends over a monolith? What
problems do they solve?
Micro-frontends solve a team scaling problem, not a technical problem. When a single codebase is owned by
10+ teams, every team must coordinate deployments, avoid breaking each other's code, and wait for a
monolithic CI/CD pipeline. Micro-frontends allow each team to deploy independently, use their preferred
technology, and own their part of the UI end-to-end.
The problems they create: increased initial load time (multiple bundles), CSS isolation challenges, shared
dependency version management (React must be singleton), complex integration testing, and operational
overhead. The pragmatic answer: use a monolith until team size forces you to micro-frontends. Then adopt
Module Federation as the most mature approach.

Q3: How do you design a frontend for high scalability — 100M daily users?
- Static assets (JS, CSS, fonts, images): served from CDN with immutable cache headers. Zero origin
load.
- HTML pages: SSG/ISR wherever possible. CDN-cached at the edge. Only truly dynamic pages hit origin
## SSR.
- API responses: CDN-cacheable with short TTLs (30-60s) for public data. s-maxage separates CDN
cache from browser cache.
- Real-time features: WebSocket only for features that truly need < 1s latency. Everything else: polling
with CDN absorption.
- Media: dedicated image/video CDN with adaptive formats (WebP, AVIF) and responsive sizes. Never
serve 4K images to mobile.
- JavaScript bundle: aggressive code splitting. Initial bundle < 100KB compressed. Route-level lazy
loading. Third-party scripts loaded asynchronously.
- Monitoring: RUM (Real User Monitoring) on Core Web Vitals. Alert on LCP > 3s, INP > 400ms, error rate
## > 0.5%.

Q4: Design the frontend architecture for a real-time dashboard (like Google
## Analytics).
Requirements: metrics update every 5-30 seconds, user configures date range and filters, charts render large
datasets, multiple users can view simultaneously. Architecture: SSR for initial page load (SEO + fast first paint).

React Query for data fetching with refetchInterval matching the desired update cadence. For true real-time (<
5s), use WebSocket or SSE.
Chart performance: for datasets > 10K points, don't use SVG (DOM thrash). Use Canvas-based charting
(Chart.js, D3 with canvas renderer) or WebGL (deck.gl for geo data). Aggregate heavy computation in a Web
Worker to keep the main thread free. Virtual list for any tabular data > 200 rows. URL-driven filters so
dashboards are shareable.

Q5: What is the BFF pattern and when should a frontend team invest in
building one?
BFF (Backend-for-Frontend) is a server-side API layer that sits between the frontend and the backend
microservices. It is owned and deployed by the frontend team. It aggregates calls to multiple backend services
and returns a single, UI-optimised response — the exact shape the frontend needs, nothing more.
Invest in a BFF when: (1) your page requires data from 3+ microservices and the waterfall of sequential calls is
hurting LCP. (2) Different clients (mobile app, web, TV app) need different response shapes from the same
backend. (3) The frontend team is blocked waiting for backend teams to create exactly the right API. (4) You
need to add authentication, caching, or request transformation that doesn't belong in the browser. At Flipkart,
each product surface (homepage, PDP, search) has its own BFF that the frontend team controls.

Q6: How would you design the frontend for a notification system?
Notification system has three parts: (1) Delivery mechanism — how new notifications arrive. (2) Notification
center UI — the bell icon + dropdown panel + unread count badge. (3) Persistence — user can see notifications
from days ago.
Delivery: WebSocket for in-app real-time. Push API (Service Worker) for notifications when app is closed. Fall
back to polling (30s) if WebSocket fails. Real-time badge count update via WebSocket message { type:
'unread_count', count: 7 }. Notification center: virtualized list (could have thousands). Mark-as-read with
optimistic update. 'Mark all read' API. Grouped notifications ('John and 3 others liked your post'). Infinite scroll
for older notifications with cursor pagination. Persistence: IndexedDB for last 7 days of notifications for instant
open (show from cache while fetching fresh).

Q7: How do you make a frontend application globally available with low
latency?
- Static assets: deploy to CDN with edge nodes globally (CloudFront, Fastly, Cloudflare). Assets served
from the nearest PoP — < 20ms anywhere in the world.
- Edge SSR: run SSR at CDN edge (Vercel Edge Functions, Cloudflare Workers). HTML generated at the
nearest data center to the user — 50ms TTFB vs 200ms from a single region origin.
- API: multi-region deployment with latency-based routing (Route53 / Cloudflare Load Balancer). API
requests route to nearest healthy region.
- Media: separate media CDN (Cloudinary, Imgix) with automatic format conversion (WebP/AVIF),
resizing, and edge caching.
- Database reads: read replicas in each region. Writes go to primary (consistency trade-off). Or eventual
consistency for social features.
- Localisation: serve locale-specific HTML at edge using Accept-Language header. No client-side redirect
for locale detection.

Q8: What is the Critical Rendering Path and how do you optimise it?
The Critical Rendering Path is the sequence of steps the browser takes to render the first pixel: DNS lookup →
TCP connection → TLS handshake → HTTP request → HTML parse → DOM construction → CSSOM

construction → Render Tree → Layout → Paint → Composite. Blocking resources (parser-blocking scripts,
render-blocking CSS) interrupt this path.
## Optimisation How It Helps Implementation
Inline critical CSS Eliminates render-blocking
CSS request for above-fold
styles
Extract with Critters (Vite/webpack).
Inline in <head>.
defer / async scripts Eliminates parser-blocking JS <script defer src='...'>  or async for
scripts with no dependencies.
Preload key resources Browsers discover fonts/hero
images late. Preload tells
browser early.
<link rel='preload' href='hero.webp'
as='image' fetchpriority='high'>
Preconnect to origins Eliminates DNS + TCP + TLS
overhead for third-party origins.
<link rel='preconnect'
href='https://api.myapp.com'>
Reduce main thread work Long tasks (> 50ms) block
rendering. Yield to browser with
scheduler.
yield to main with scheduler.yield()
or setTimeout(fn, 0). Web Workers
for heavy compute.

Q9: How do you handle internationalisation (i18n) in a large frontend
application?
i18n has four dimensions: (1) Translation — text strings. (2) Locale formatting — dates, numbers, currencies,
pluralisation. (3) RTL (right-to-left) layouts — Arabic, Hebrew, Urdu. (4) Content localisation — different images
or features per market.
Architecture: use react-i18next or next-intl. Translation files per locale (en.json, hi.json, ar.json) loaded lazily
(only the active locale bundle is downloaded). Dates and numbers formatted with Intl.DateTimeFormat and
Intl.NumberFormat — never with manual string templates. RTL: CSS logical properties (margin-inline-start
instead of margin-left) + dir='rtl' on html element. Test RTL by setting lang='ar' in DevTools. Locale stored in
URL (/en/ /hi/ /ar/) for SEO and shareability — not in localStorage.

Q10: Compare SSE vs WebSocket. When do you use each?
Dimension Server-Sent Events (SSE) WebSocket
Direction Server → Client only
## (unidirectional)
Full duplex (bidirectional)
Protocol HTTP/1.1 (or HTTP/2
multiplexed)
WS (upgrade from HTTP)
Browser reconnect Automatic built-in reconnection Must implement manually
Load balancer compatibility Works naturally with HTTP LBs Requires sticky sessions or WS-
aware LB
Use cases Live scores, news feeds,
notification counts, progress bars
Chat, collaborative editing, live
cursor, game state, trading
Max connections Limited by browser HTTP/1.1
connection pool (6/domain). Use
HTTP/2 to multiplex unlimited
SSE connections.
No browser limit
Auth Standard HTTP headers /
cookies
Must pass token in URL query
param or first message (no
custom headers on WS
handshake)

When to use When server pushes, client only
reads
When client also sends data at
high frequency


Master Cheat Sheet   HLD at a Glance

The 7-Step HLD Framework (45-minute interview)
## Step Duration Output
- Requirements 5 min Functional + non-functional.
Scale numbers. Device/network
constraints.
- Data Model 5 min Core entity types. Client-side
state shape.
- API Contract 5 min Key endpoints: method, request,
response, protocol
## (REST/WS/SSE).
- Architecture 10 min Rendering strategy + CDN +
BFF + real-time layer. Draw
boxes.
- Components 5 min Top-level component tree. State
ownership. Data flow.
- NFRs 5 min Performance, a11y, security,
offline, observability targets.
- Edge cases 10 min Failure modes, recovery,
optimisations. Show senior
thinking.

## Rendering Strategy Quick Reference
## Product / Page Strategy Key Reason
Marketing page, blog, docs SSG Static. Fast. Free CDN-cached.
Product detail page, article ISR (60-300s) Mostly static, occasionally
updated.
Search results, personalised
feed
SSR Dynamic. SEO. Can't pre-render.
Dashboard, admin panel, SaaS CSR (SPA) Authenticated. No SEO needed.
Highly interactive.
Global app needing fast TTFB
everywhere
Edge SSR SSR runs at CDN PoP near
user.
Mixed (shell fast, data slow) Streaming SSR + Suspense Shell arrives immediately, data
slots stream in.

## Transport Protocol Quick Reference
## Use Case Protocol Reason
Chat, collaborative editing,
live game state
WebSocket Bidirectional. Both sides send
frequently.

Live score, stock price,
notification count
SSE Server pushes. Client reads.
## Auto-reconnect.
REST CRUD, search,
mutations
HTTP/REST Standard. CDN-cacheable for
## GET.
Complex queries with partial
data
GraphQL over HTTP Client declares shape. Avoids
over/under-fetching.
Live sports with 50M+
concurrent users
HTTP polling (5s) + CDN CDN absorbs load. Ball-by-ball =
5s staleness OK.
File uploads, infrequent large
payloads
HTTP multipart or presigned S3
## URL
Not a persistent connection use
case.

## KEY INSIGHT
The HLD interview differentiator: candidates who mention NFRs proactively
(performance targets, a11y, security, observability) without being asked are rated
'strong hire'. Candidates who wait to be asked about these are rated 'hire'.
Candidates who only describe the happy path are 'no hire'. Always raise the non-
functional dimensions — they show production experience.

High Level Design is the art of making the right architectural tradeoffs — not the art of
knowing every technology. Every decision you make should be justified by a constraint,
not by a preference.