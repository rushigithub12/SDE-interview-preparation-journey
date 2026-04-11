##### Namaste Frontend System Design
Chapter 7: Logging & Monitoring
In-Depth Interview Guide | 5 Topics | Production Code | Tools | Trade-offs
Topic What It Covers Interview Weight
```
Overview The three pillars (Logs, Metrics,
```
```
Traces), observability vs
```
monitoring
High
Telemetry Data collection pipelines,
sampling, batching, Web Vitals
reporting
Very High
Error Logging Global handlers, structured
errors, Sentry integration, source
maps
Very High
Alerting Threshold vs anomaly alerts,
SLOs/SLAs, PagerDuty,
runbooks
High
Debugging DevTools deep dive, remote
debug, RUM vs synthetic, replay
sessions
Medium-High
Why Logging & Monitoring Matters in Senior
Interviews
Shipping a feature is easy. Knowing it is working correctly in production for real users — across all browsers,
devices, and network conditions — is hard. Logging and Monitoring is the discipline that answers: 'Is the system
healthy? Is the user experience good? When something breaks, how fast do we know, and how fast can we fix
it?'
Senior engineers at Flipkart, Swiggy, CRED, and Microsoft are expected to own observability end-to-end. They
are expected to design the telemetry pipeline, choose what to log, set up alerting thresholds, and know how to
debug a production issue using the collected data. This chapter covers all five topics in that depth.
Question interviewers ask What they are testing
How do you know your feature is working in
production?
Understanding of observability vs deployment
confidence
A user reports a blank screen. How do you
debug it?
Error logging, source maps, RUM data,
reproduction strategy
Your p95 API latency doubled after a deploy.
Walk me through finding the cause.
Metrics, traces, correlation IDs, dashboards
How do you decide what to log vs what to
metric?
Data classification, storage cost vs insight value
Design the error monitoring system for a ride-
booking app.
```
Architecture: SDK, pipeline, aggregation, alerting,
```
on-call
What is the difference between monitoring and
observability?
Conceptual depth — known unknowns vs unknown
unknowns
KEY INSIGHT The best answer to any logging/monitoring question follows this structure:
COLLECT the right data → AGGREGATE and store it → VISUALISE with
dashboards → ALERT on anomalies → DEBUG with the collected context. Walk
through this pipeline for any design question and you will stand out immediately.
Topic 1 Overview — The Three Pillars of
Observability
Observability is the ability to understand the internal state of a system from its external outputs. In practice, it is
built on three pillars: Logs, Metrics, and Traces. Modern production systems need all three — each answers a
different class of question.
1.1 The Three Pillars
Pillar What It Is What It Answers Frontend Examples
Logs Time-stamped,
structured records of
events. Human-readable
narrative of what
happened.
WHAT happened and
in what order?
JS error + stack trace,
API call made/failed,
user clicked checkout,
feature flag evaluated
Metrics Numeric measurements
aggregated over time.
Counters, gauges,
histograms.
HOW MUCH and HOW
OFTEN? Is this
trending up or down?
Page load time
p50/p95/p99, JS error
rate %, API latency
histogram, bundle size
over deploys
Traces Distributed request flow
across services, tagged
with a shared correlation
ID.
WHERE is the
slowdown? Which
service in the chain is
causing the problem?
One user request
touching CDN → API
gateway → auth
service → DB →
response
1.2 Monitoring vs Observability — The Distinction
// MONITORING = watching known failure modes
// You define checks in advance: 'alert me if error rate > 1%'
// Good for: known unknowns. Systems you have seen fail before.
// Limitation: cannot detect failure modes you didn't anticipate.
// OBSERVABILITY = ability to ask arbitrary questions about the system
// The system emits enough structured data that you can debug any issue,
// even ones you have never seen before.
// Good for: unknown unknowns. Novel failure modes in complex systems.
// Analogy:
```
// Monitoring = smoke detector (tells you 'there is smoke')
```
// Observability = full CCTV + floor plan + air quality sensors
```
// (tells you WHERE the fire is, HOW big, and WHY it started)
```
// In practice for a senior frontend engineer:
// You need BOTH:
// - Monitoring: dashboards and alerts for the KPIs you know matter
// - Observability: structured logs and traces so you can debug novel issues
```
1.3 Real User Monitoring (RUM) vs Synthetic Monitoring
```
```
Dimension Real User Monitoring (RUM) Synthetic Monitoring
```
What it measures Actual user experiences across
all devices, locations, networks
Scripted tests run by bots on a
schedule from fixed locations
When it runs Continuously, driven by real
traffic
```
On a schedule (every 1-5 min),
```
even at zero traffic
Coverage Captures long-tail edge cases,
rare browsers, slow devices
Only tests the paths you script
```
Data volume High (every page load is a data
```
```
point)
```
```
Low (fixed test frequency)
```
Latency detection Reactive — you find out after
real users are affected
Proactive — alerts before users
```
are impacted (if the path is
```
```
scripted)
```
Best for Understanding true user
experience, identifying
device/network segments
Uptime checks, regression
detection after deploy, global
latency maps
Tools Datadog RUM, New Relic
Browser, Sentry Perf, web-
vitals.js
Pingdom, Checkly, Playwright-
based synthetics, Datadog
Synthetics
REAL WORLD Swiggy runs synthetic checks from Bangalore, Mumbai, and Delhi every 60
seconds. When checkout latency crosses 2s in any city, an alert fires before most
users experience it. Simultaneously, RUM data from actual users gives the full
distribution — the synthetic check only covers the happy path at ideal network
speed.
Interview Q What is the difference between monitoring and observability? Give an example
where monitoring alone would fail to catch an issue that observability would
surface.
Interview Q When would you use Real User Monitoring vs Synthetic Monitoring? If you could
only have one, which would you pick for a consumer e-commerce app and why?
Interview Q Design the observability architecture for a social media feed. What logs, metrics,
and traces would you instrument?
Topic 2 Telemetry — Collecting & Shipping
Observability Data
Telemetry is the automated process of collecting data from a running application and transmitting it to a
monitoring backend. Frontend telemetry is uniquely challenging: you are collecting data from millions of clients
```
(not controlled servers), with varying network conditions, and you must do it without impacting the user
```
experience.
2.1 What to Instrument — The Full Taxonomy
Category What to Collect Why It Matters
```
Core Web Vitals LCP (load), INP (interaction),
```
```
CLS (layout shift) — with
```
device/connection segments
Google ranking factor. Direct
user experience signal.
Custom Performance Component render time, route
transition duration, time-to-first-
data, API response time
Identifies bottlenecks invisible to
browser metrics
JavaScript Errors Unhandled exceptions, Promise
rejections, network failures —
with stack trace + context
Without this, you are blind to
what users actually experience
User Behaviour Page views, button clicks, funnel
step completions, rage clicks,
dead clicks
Product decisions: what is users
actually doing vs what you
expected
API Health Response time distribution, error
rate by endpoint, payload size
Correlates frontend experience
with backend degradation
Resource Timing Asset load times, cache hit/miss
rate, CDN vs origin latency
Identifies slow assets, missing
cache headers, third-party bloat
Session Context User ID, session ID, device type,
browser, OS, app version,
feature flags active
Without context, error data is
unactionable — you cannot
reproduce it
2.2 The Telemetry Pipeline — Architecture
// Complete frontend telemetry pipeline:
// ── STEP 1: INSTRUMENT ─────────────────────────────────────────────
// Collect data at the source — browser APIs, custom events, error handlers
// ── STEP 2: ENRICH ────────────────────────────────────────────────
// Add context: user ID, session ID, app version, feature flags, device info
// ── STEP 3: SAMPLE ────────────────────────────────────────────────
// High-traffic apps: don't send 100% of events — sample down
```
// Errors: always 100% (you never want to miss an error)
```
// Performance events: 10-20% sample is usually sufficient
// ── STEP 4: BATCH & BUFFER ────────────────────────────────────────
// Batch events locally → flush at intervals or on page unload
// Reduces network requests from potentially hundreds to a few per session
// ── STEP 5: SHIP ──────────────────────────────────────────────────
```
// Send to backend via sendBeacon (survives page unload) or fetch
```
// ── STEP 6: INGEST & STORE ────────────────────────────────────────
// Backend: Kafka → ClickHouse/BigQuery for metrics, Elasticsearch for logs
// ── STEP 7: QUERY & VISUALISE ─────────────────────────────────────
// Grafana, Datadog, New Relic dashboards pull from storage
// ── STEP 8: ALERT ─────────────────────────────────────────────────
// Threshold or anomaly-based alerts → PagerDuty / Slack / on-call rotation
2.3 Building a Telemetry SDK — Production Implementation
// telemetry.js — a production-grade telemetry module
```
class TelemetrySDK {
```
```
constructor({ endpoint, appVersion, userId, sessionId, sampleRate = 0.1 }) {
```
```
this.endpoint = endpoint;
```
```
this.queue = [];
```
```
this.flushTimer = null;
```
```
this.context = {
```
appVersion,
userId,
```
sessionId: sessionId || crypto.randomUUID(),
```
```
device: this.#getDeviceInfo(),
```
sampleRate,
```
};
```
```
this.#setupAutoFlush();
```
```
this.#setupPageUnloadFlush();
```
```
}
```
// ── Public API ───────────────────────────────────────────────────
```
track(eventType, data, opts = {}) {
```
```
const alwaysSend = opts.alwaysSend ?? false;
```
// Sampling: drop routine events to reduce volume
```
if (!alwaysSend && Math.random() > this.context.sampleRate) return;
```
```
this.queue.push({
```
```
type: eventType,
```
```
ts: Date.now(),
```
data,
...this.context,
```
url: location.href,
```
```
sessionMs: performance.now() | 0,
```
```
});
```
```
if (this.queue.length >= 20) this.#flush(); // flush when buffer full
```
```
}
```
```
trackError(error, additionalCtx = {}) {
```
```
this.track('js_error', {
```
```
message: error.message,
```
```
stack: error.stack,
```
```
name: error.name,
```
...additionalCtx,
```
}, { alwaysSend: true }); // errors always sent, never sampled away
```
```
}
```
```
trackPerf(name, durationMs, attrs = {}) {
```
```
this.track('perf', { name, durationMs, ...attrs });
```
```
}
```
// ── Flush mechanism ───────────────────────────────────────────────
```
async #flush() {
```
```
if (this.queue.length === 0) return;
```
```
const batch = this.queue.splice(0); // atomic drain
```
```
try {
```
// sendBeacon: works even during page unload, non-blocking
```
const ok = navigator.sendBeacon(
```
this.endpoint,
```
JSON.stringify({ events: batch })
```
```
);
```
// sendBeacon returns false if payload >64KB or browser rejects
```
if (!ok) await this.#flushViaFetch(batch);
```
```
} catch {
```
// Silent fail — telemetry must never break the app
// Consider: store in localStorage to retry next session
```
}
```
```
}
```
```
async #flushViaFetch(batch) {
```
```
await fetch(this.endpoint, {
```
```
method: 'POST',
```
```
body: JSON.stringify({ events: batch }),
```
```
headers: { 'Content-Type': 'application/json' },
```
```
keepalive: true, // survives page unload (like sendBeacon)
```
```
});
```
```
}
```
```
#setupAutoFlush() {
```
```
this.flushTimer = setInterval(() => this.#flush(), 5000); // every 5s
```
```
}
```
```
#setupPageUnloadFlush() {
```
// visibilitychange fires earlier than beforeunload — preferred
```
document.addEventListener('visibilitychange', () => {
```
```
if (document.visibilityState === 'hidden') this.#flush();
```
```
});
```
```
window.addEventListener('pagehide', () => this.#flush());
```
```
}
```
```
#getDeviceInfo() {
```
```
const ua = navigator.userAgent;
```
```
return {
```
```
browser: /Chrome/.test(ua) ? 'Chrome' : /Firefox/.test(ua) ? 'Firefox' : 'Other',
```
```
mobile: /Mobi|Android/i.test(ua),
```
```
connection: navigator.connection?.effectiveType ?? 'unknown',
```
```
memory: navigator.deviceMemory ?? 'unknown',
```
```
cores: navigator.hardwareConcurrency ?? 'unknown',
```
```
};
```
```
}
```
```
}
```
// Initialise once at app entry point
```
export const telemetry = new TelemetrySDK({
```
```
endpoint: 'https://ingest.myapp.com/events',
```
```
appVersion: import.meta.env.VITE_APP_VERSION,
```
```
userId: getCurrentUser()?.id,
```
```
sessionId: sessionStorage.getItem('sid') || undefined,
```
```
sampleRate: 0.15, // collect 15% of routine events
```
```
});
```
2.4 Web Vitals Telemetry — The Production Pattern
```
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';
```
// Report all Core Web Vitals to telemetry endpoint
```
function reportVital(metric) {
```
```
telemetry.track('web_vital', {
```
```
name: metric.name, // 'LCP', 'CLS', 'INP', etc.
```
```
value: metric.value, // raw value in ms or unitless
```
```
rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
```
```
delta: metric.delta, // change since last report
```
```
id: metric.id, // stable ID for this page load
```
```
navigationType: metric.navigationType, // 'navigate' | 'reload' | 'back_forward'
```
```
}, { alwaysSend: true }); // always send vitals — no sampling
```
```
}
```
```
onCLS(reportVital); // Cumulative Layout Shift — threshold: 0.1 good, 0.25 poor
```
```
onINP(reportVital); // Interaction to Next Paint — threshold: 200ms good, 500ms poor
```
```
onLCP(reportVital); // Largest Contentful Paint — threshold: 2.5s good, 4s poor
```
```
onFCP(reportVital); // First Contentful Paint
```
```
onTTFB(reportVital); // Time To First Byte
```
// Segment vitals by meaningful dimensions in your dashboard:
```
// • device type (mobile vs desktop)
```
```
// • connection type (4g vs 3g vs 2g)
```
```
// • page route ('/checkout' vs '/home')
```
```
// • app version (to detect regressions after a deploy)
```
```
// • geography (region-specific CDN or network issues)
```
// CRITICAL: Always report p75, not average.
// Average is skewed by fast users. p75 = 75% of users experience this or better.
// Google's Core Web Vitals thresholds apply at p75.
2.5 Sampling Strategies
Event Type Sampling Rate Why
```
JavaScript errors (unhandled) 100% — never sample You can never know which error
```
is critical before you see it
Core Web Vitals 100% for poor/needs-
improvement, 10% for 'good'
Prioritise analysis of bad
experiences. Good ones need
less detail.
```
API calls (success) 5-10% High volume, mostly boring.
```
Sample enough for latency
histograms.
```
API calls (error/slow >2s) 100% Every slow request and error is
```
actionable data
```
User interactions (clicks, nav) 10-20% High volume. Sampled data still
```
gives accurate product analytics.
Page views 100% Essential for DAU/MAU
counting. Low data size per
event.
Performance traces 5% Traces are large. 5% is sufficient
for latency profiling.
AVOID Never sample errors down. A 0.1% error rate on 10M daily users = 10,000 broken
user sessions every day. If you sample errors at 10%, your dashboard shows
0.01% and you declare success. Always collect 100% of error events.
Interview Q Why use sendBeacon instead of fetch for telemetry events? What problem does it
solve?
Interview Q Design the telemetry pipeline for a food delivery app from browser instrumentation
to dashboard. What does each stage do?
Interview Q How do you decide what sampling rate to use for different event types? What is the
risk of over-sampling? Under-sampling?
Interview Q What is the difference between p50, p75, p95, and p99 latency? Which percentile
should you alert on, and why?
Topic 3 Error Logging — Capturing &
Contextualising Frontend Errors
Error logging is the most critical observability primitive for a frontend engineer. Without it, you are completely
blind to what your users are experiencing. A blank screen in production is invisible to you unless you have
instrumented error logging correctly. This topic covers the full implementation: global handlers, structured error
schemas, source maps, contextual data, and third-party integration.
3.1 The Four Error Boundaries You Must Capture
// ── 1. Synchronous JavaScript errors ────────────────────────────────
```
window.addEventListener('error', (event) => {
```
```
telemetry.trackError(event.error, {
```
```
type: 'uncaught_exception',
```
```
filename: event.filename,
```
```
lineno: event.lineno,
```
```
colno: event.colno,
```
// Without source maps, filename/line will point to minified bundle.
// With source maps: error tracking tools map back to original source.
```
});
```
```
});
```
// ── 2. Unhandled Promise rejections ─────────────────────────────────
```
window.addEventListener('unhandledrejection', (event) => {
```
const error = event.reason instanceof Error
? event.reason
```
: new Error(String(event.reason));
```
```
telemetry.trackError(error, { type: 'unhandled_promise_rejection' });
```
```
// event.preventDefault(); // optionally suppress browser console warning
```
```
});
```
// ── 3. React Error Boundaries — catches render-phase errors ──────────
```
class ErrorBoundary extends React.Component {
```
```
state = { hasError: false, errorId: null };
```
```
static getDerivedStateFromError(error) {
```
```
return { hasError: true };
```
```
}
```
```
componentDidCatch(error, info) {
```
```
const errorId = crypto.randomUUID();
```
```
telemetry.trackError(error, {
```
```
type: 'react_render_error',
```
```
componentStack: info.componentStack, // which component tree failed
```
```
errorBoundary: this.constructor.name,
```
errorId, // show to user so they can report it
```
});
```
```
this.setState({ errorId });
```
```
}
```
```
render() {
```
```
if (!this.state.hasError) return this.props.children;
```
```
return (
```
<div>
<h2>Something went wrong.</h2>
```
<p>Error ID: {this.state.errorId}</p>
```
```
<button onClick={() => this.setState({ hasError:false })}>
```
Try Again
</button>
</div>
```
);
```
```
}
```
```
}
```
// ── 4. Network / API errors — explicit capture ─────────────────────
```
async function apiFetch(url, options = {}) {
```
```
const startTime = performance.now();
```
```
try {
```
```
const res = await fetch(url, options);
```
```
const duration = performance.now() - startTime;
```
```
telemetry.trackPerf('api_call', duration, { url, status: res.status });
```
```
if (!res.ok) {
```
```
telemetry.trackError(new Error(`HTTP ${res.status}`), {
```
```
type: 'api_error', url, status: res.status, duration,
```
```
});
```
```
}
```
```
return res;
```
```
} catch (err) {
```
```
telemetry.trackError(err, {
```
```
type: 'network_error', url,
```
```
duration: performance.now() - startTime
```
```
});
```
```
throw err;
```
```
}
```
```
}
```
3.2 Structured Error Schema — What Every Error Log Must Contain
Field Example Value Why Required
```
message Cannot read properties of undefined (reading 'id') The error — obviously
```
required
stack TypeError: ... at ProductCard.jsx:42 Without stack, you
cannot find the code
name TypeError / NetworkError / ChunkLoadError Grouping and alerting
on error type
type uncaught_exception / api_error /
react_render_error
Categorise for filtering
and routing
```
userId usr_48291 Can contact user; check
```
if systematic or one-off
sessionId sess_7fa2b1 Group errors from same
session to see
sequence of events
appVersion v2.4.1 / git-sha 3a7f2bc Critical: was this
introduced by recent
deploy?
url https://app.com/checkout Which page was the
user on?
timestamp 1741703600000 Correlate with deploy
times, traffic spikes
device mobile / Chrome 121 / Android / 4G Is this browser-specific?
Device-specific?
```
featureFlags { newCheckout: true, darkMode: false } Was a specific flag
```
active when this
occurred?
```
breadcrumbs [{type:'nav',...},{type:'click',...},{type:'api',...}] Sequence of events
```
BEFORE the error —
crucial for reproduction
3.3 Breadcrumbs — The Context Trail Before the Error
// Breadcrumbs: a circular buffer of recent events before the error.
// Like a flight recorder — you see the sequence that led to the crash.
```
class BreadcrumbTrail {
```
```
#crumbs = [];
```
```
#max = 50;
```
```
add(type, data) {
```
```
this.#crumbs.push({ type, ts: Date.now(), data });
```
```
if (this.#crumbs.length > this.#max)
```
```
this.#crumbs.shift(); // keep only the last 50
```
```
}
```
```
getAll() { return [...this.#crumbs]; }
```
```
}
```
```
const trail = new BreadcrumbTrail();
```
// Auto-capture navigation
```
window.addEventListener('popstate', () => {
```
```
trail.add('navigation', { to: location.href });
```
```
});
```
// Auto-capture API calls
```
const origFetch = window.fetch;
```
```
window.fetch = async (url, opts) => {
```
```
trail.add('api_request', { url, method: opts?.method ?? 'GET' });
```
```
const res = await origFetch(url, opts);
```
```
trail.add('api_response', { url, status: res.status });
```
```
return res;
```
```
};
```
// Auto-capture user interactions
```
document.addEventListener('click', (e) => {
```
```
const el = e.target.closest('button, a, [data-track]');
```
```
if (el) trail.add('user_click', {
```
```
tag: el.tagName,
```
```
text: el.textContent?.slice(0,50),
```
```
trackId: el.dataset.track
```
```
});
```
```
}, { capture: true, passive: true });
```
// Attach breadcrumbs to every error report
```
window.addEventListener('error', (event) => {
```
```
telemetry.trackError(event.error, {
```
```
breadcrumbs: trail.getAll(), // the full trail before the crash
```
```
});
```
```
});
```
3.4 Source Maps — Making Minified Errors Readable
// Without source maps, a production error looks like:
// TypeError: Cannot read property 'a' of undefined
```
// at t.default (main.3a7f2bc.js:1:48291)
```
```
// at r (main.3a7f2bc.js:1:49102)
```
// → USELESS. You cannot find the bug.
// With source maps, the error monitoring tool resolves to:
// TypeError: Cannot read property 'id' of undefined
```
// at ProductCard (src/components/ProductCard.jsx:42:15)
```
```
// at render (src/pages/ProductList.jsx:88:3)
```
// → IMMEDIATELY actionable.
// Vite source map configuration:
// vite.config.js
```
export default defineConfig({
```
```
build: {
```
```
sourcemap: true, // 'true': generate .map files
```
// Options: true | 'hidden' | 'inline'
```
// true — .map files next to bundles (public, can be fetched by anyone)
```
// 'hidden' — .map files generated but NOT referenced in bundle
// Upload to Sentry/Datadog, not publicly accessible
// BEST OPTION for production: devs get readable stacks,
// source is not exposed to the public
```
// 'inline' — embedded in bundle (very large files, not for production)
```
```
}
```
```
});
```
```
// Sentry source map upload (CI step after build):
```
// sentry-cli releases files $VERSION upload-sourcemaps ./dist
// --url-prefix '~/assets'
// --rewrite
// IMPORTANT: Delete .map files from CDN/server after upload to Sentry
// Or use sourcemap: 'hidden' — Sentry uploads but maps are not public
3.5 Sentry Integration — Production Setup
```
import * as Sentry from '@sentry/react';
```
```
import { browserTracingIntegration, replayIntegration } from '@sentry/react';
```
```
Sentry.init({
```
```
dsn: 'https://xxx@o0.ingest.sentry.io/yyy',
```
```
environment: import.meta.env.MODE, // 'production' | 'staging'
```
```
release: import.meta.env.VITE_APP_VERSION, // 'v2.4.1' for source map lookup
```
// Performance tracing — measures API calls, route changes, etc.
```
tracesSampleRate: 0.1, // 10% of transactions traced
```
// Session Replay — records screen on error
```
replaysSessionSampleRate: 0.05, // 5% of sessions recorded
```
```
replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors recorded
```
```
integrations: [
```
```
browserTracingIntegration(), // auto-instruments fetch, navigation
```
```
replayIntegration({
```
```
maskAllText: true, // GDPR: mask PII in replay
```
```
blockAllMedia: false,
```
```
}),
```
],
```
beforeSend(event) {
```
// Filter out noise before sending
```
if (event.exception?.values?.[0]?.type === 'ChunkLoadError') {
```
// ChunkLoadError = user on old deploy, code split chunk not found
```
// Handle with window.location.reload() instead of logging as error
```
```
window.location.reload();
```
```
return null; // don't send to Sentry
```
```
}
```
```
return event; // send everything else
```
```
},
```
```
});
```
// Identify the user for error reports
```
Sentry.setUser({ id: user.id, email: user.email });
```
// Add custom context
```
Sentry.setTag('feature_flag.new_checkout', isNewCheckoutEnabled);
```
```
Sentry.setContext('cart', { itemCount: cart.items.length });
```
// Manual error capture with context
```
try {
```
```
await processPayment(order);
```
```
} catch (error) {
```
```
Sentry.captureException(error, {
```
```
extra: { orderId: order.id, amount: order.total, gateway: 'razorpay' }
```
```
});
```
```
throw error;
```
```
}
```
// Wrap React app in Sentry error boundary
```
export default Sentry.withProfiler(App);
```
3.6 ChunkLoadError — The Most Common Production Error
// ChunkLoadError occurs when:
// 1. App is deployed with new hashed chunk filenames
```
// 2. A user already has the old HTML (with old chunk URLs) open in their browser
```
// 3. They navigate to a lazy-loaded route
// 4. Browser tries to fetch /assets/ProductDetail.old-hash.js
// 5. CDN returns 404 — chunk no longer exists
// 6. React throws ChunkLoadError
// The fix: detect ChunkLoadError and reload the page
```
async function lazyImport(importFn) {
```
```
try {
```
```
return await importFn();
```
```
} catch (err) {
```
```
if (err.name === 'ChunkLoadError' || /Loading chunk/.test(err.message)) {
```
// Don't log to Sentry — this is an expected deploy-time event
// Just reload to get the latest index.html + new chunk URLs
```
window.location.reload();
```
```
}
```
```
throw err;
```
```
}
```
```
}
```
// In React Router with Vite:
```
const ProductDetail = lazy(() =>
```
```
lazyImport(() => import('./pages/ProductDetail'))
```
```
);
```
Interview Q You deploy a new version of your app and error rates spike for 10 minutes then
return to normal. What caused this, and how would you prevent it next time?
Interview Q What are source maps? Why would you use sourcemap: 'hidden' instead of
```
sourcemap: true in production?
```
Interview Q A user reports they saw a blank screen. You have no reproduction steps. Walk me
through how you use your error logging system to debug this.
Interview Q What are breadcrumbs in error monitoring? Implement a breadcrumb trail that
captures navigation, API calls, and user clicks.
Topic 4 Alerting — Knowing Before Users Tell You
Alerting is the mechanism that converts observability data into actionable notifications. A good alerting system
wakes up the right person at the right time with enough context to act immediately. A bad alerting system either
```
misses real incidents (false negatives) or fires so often on noise that engineers ignore it (alert fatigue — the
```
```
most dangerous failure mode).
```
4.1 SLO, SLA, SLI — The Foundation of Alerting
Term Definition Example
```
SLI (Service Level Indicator) A quantitative measure of
```
service quality. The actual
metric.
Checkout page LCP measured
at p75 across real users
```
SLO (Service Level Objective) The target value for an SLI.
```
What you are committing to
internally.
Checkout page LCP p75 < 2.5s
for 99.5% of the time in any 30-
day window
```
SLA (Service Level
```
```
Agreement)
```
An external, contractual
commitment. Financial penalty if
breached.
Enterprise customers
guaranteed 99.9% uptime. <
99.9% → service credits
Error Budget Remaining tolerance before the
SLO is breached. SLO-defined
runway.
99.5% SLO → 0.5% allowed
failures. At 1M events/month =
5,000 allowed errors
4.2 Threshold vs Anomaly Alerting
// ── THRESHOLD ALERTING: simple, explicit, predictable ────────────────
// Alert when metric crosses a fixed value
// Examples:
// JS error rate > 0.5% → P2 alert
```
// JS error rate > 2% → P1 alert (wake up on-call)
```
// Checkout API p95 latency > 3s → P2 alert
```
// LCP p75 > 4s (Poor threshold) → P2 alert
```
// API 5xx error rate > 1% → P1 alert
```
// Bundle size increase > 20% → CI check failure (deploy blocker)
```
// DRAWBACK: you must know the 'normal' range in advance.
// A traffic spike of 10x may push metrics above threshold without a real bug.
// ── ANOMALY ALERTING: statistical, adaptive, catches unknowns ─────────
// Alert when metric deviates significantly from its own baseline
// How it works:
```
// 1. Compute rolling baseline (e.g., same hour last 7 days)
```
// 2. Alert if current value > baseline ± N standard deviations
```
// (typically 3σ for P1, 2σ for P2)
```
// Examples:
// Error rate is normally 0.05% on Sunday mornings.
// Today it is 0.15% — 3x normal — anomaly detected even though < 0.5% threshold.
```
// DRAWBACK: requires historical data. Can miss gradual degradation ('boiling frog').
```
// BEST PRACTICE: use BOTH.
// Threshold: for absolute limits that must never be exceeded regardless of baseline.
// Anomaly: for detecting unusual changes from normal patterns.
4.3 Alert Severity Levels & Response Expectations
Level Criteria Response Example
P0 — Critical Service down /
complete outage. 100%
failure rate.
Immediate wake-up. All
hands. <5 min
response.
Checkout API returning
500 for all users
P1 — High Major degradation.
>10% users affected.
Core flow broken.
Wake on-call. <15 min
response. Start
incident.
Login failure rate >5%.
Payment errors >2%.
P2 — Medium Significant degradation.
1-10% users affected.
Workaround exists.
Business hours
response. <2h. Slack
alert.
LCP p75 > 4s. Error
rate >0.5%. Specific
browser issue.
P3 — Low Minor issue. <1% users.
No immediate business
impact.
Next sprint or on-call
queue. Slack/Jira ticket.
Console warning in
Firefox. Flaky E2E test.
4.4 Alert Routing & On-Call Architecture
// Typical alerting stack for a product company:
// DATA SOURCES:
// Datadog / New Relic / Grafana ← aggregates metrics, fires alerts
// Sentry ← fires on error rate spikes
// Synthetic monitors ← fires on uptime/latency checks
// ROUTING:
// PagerDuty / OpsGenie ← receives alert, routes to on-call person
// Slack / Teams ← lower-severity notifications
// ESCALATION POLICY:
// P1 alert fires → notifies primary on-call via phone call + SMS
// If no acknowledgement in 5 min → escalate to secondary on-call
// If no ack in 10 min → escalate to engineering manager
```
// ON-CALL ROTATION (best practice):
```
// Weekly rotation across senior engineers
// Handover document updated every rotation
// Post-incident review after every P0/P1
```
// RUNBOOK (what an alert must link to):
```
// Every alert in Datadog/Sentry links to a runbook document containing:
// 1. What is this alert measuring?
// 2. What are likely causes?
```
// 3. Step-by-step diagnosis (which dashboard to open, which query to run)
```
```
// 4. Mitigation options (rollback? feature flag off? rate limit?)
```
// 5. Who to escalate to if you cannot resolve in 30 min
4.5 Practical Alert Configuration Examples
```
// Datadog monitor (YAML-style pseudocode):
```
monitor 'Frontend JS Error Rate':
```
query: 'sum(last_5m):sum:js.error.count{env:production} /
```
```
sum:js.pageview.count{env:production} > 0.005'
```
```
message: |
```
```
JS error rate is {{ value }}% (threshold 0.5%)
```
```
Runbook: https://wiki.company.com/runbooks/js-error-rate
```
```
Dashboard: https://app.datadoghq.com/dashboard/xxx
```
@pagerduty-frontend-oncall
```
priority: P1
```
```
evaluation_delay: 60s // avoid false alerts during deploy (errors spike briefly)
```
// ── GOOD ALERT CHECKLIST ─────────────────────────────────────────
// Every alert should answer:
```
// 1. Is it actionable? (can the on-call person actually DO something?)
```
```
// 2. Is it time-sensitive? (does it need to wake someone at 3am?)
```
// 3. Does it have a runbook link?
```
// 4. Is the threshold calibrated? (not firing in staging, not too loose in prod)
```
```
// 5. Is there an owner team? (ambiguous ownership = nobody responds)
```
// ── ALERT FATIGUE — the main failure mode ────────────────────────
// Alert fatigue: too many noisy alerts → engineers mute or ignore all alerts
// → a real P0 fires → nobody notices
// Prevention:
// - Audit alerts weekly. If alert fires > 5x/week without action → fix or delete.
```
// - Add minimum duration (alert must persist 5 min, not 30 sec spike).
```
// - Use 5-minute rolling windows, not per-minute samples.
// - Set evaluation_delay of 2-3 minutes after deploy to absorb transient spikes.
Interview Q What is the difference between an SLO and an SLA? What is an error budget and
how do you use it to make deployment decisions?
Interview Q Your on-call team is ignoring alerts because they fire constantly with no real
incidents. How do you fix this?
Interview Q Design the alerting strategy for a payment checkout flow. What metrics do you alert
on, at what thresholds, and at what severity?
Interview Q What should every alert runbook contain? Why is a runbook more important than
the alert itself?
Topic 5 Debugging — Finding Root Cause Fast
Debugging is the process of finding the root cause of an observed problem and verifying the fix. In production
frontend systems, debugging is different from local debugging — you cannot set breakpoints on users'
```
machines. You must use the observability data you collected (logs, traces, RUM) to reconstruct what happened.
```
5.1 The Production Debugging Framework
1. DETECT — How did you find out? Alert, user report, monitoring dashboard?
2. SCOPE — Is it all users or some? All pages or specific route? All browsers or one? After which deploy?
3. HYPOTHESIZE — What changed? New deploy? Third-party outage? Traffic spike? Data edge case?
4. CORRELATE — Match the error timeline with: deploys, traffic, infrastructure events, A/B test rollouts
5. ISOLATE — Reproduce in staging. Find the minimal reproducible case. Use session replay if available.
6. FIX & VERIFY — Deploy fix. Monitor error rate. Confirm in production. Check for regressions.
7. POST-MORTEM — Document the incident. What happened, what was the impact, what changes
prevent recurrence?
5.2 Chrome DevTools — The Essential Toolkit
DevTools Panel Key Features for Debugging Interview Scenario
```
Network Filter by type (XHR, Fetch, JS).
```
Inspect request/response. Check
timing waterfall. Simulate slow 3G.
Block requests.
API returning 200 with error in
body? Check Network tab for
response payload.
Performance Record and profile rendering. See
```
Long Tasks (>50ms). Identify layout
```
thrashing. Main thread flame chart.
Page feels janky. Profile and
find the Long Task blocking
the main thread.
Memory Heap snapshots. Allocation timeline.
Retainer trees for memory leak
detection.
Tab memory grows over time
without user action → memory
leak. Use heap snapshot diff.
Console Error grouping. Custom formatters.
Performance marks.
console.time/timeEnd.
console.error with structured
data sends context alongside
the error message.
Sources Set breakpoints. Conditional
breakpoints. Watch expressions.
Call stack inspection.
Cannot reproduce in prod?
Enable source maps in staging
and debug with breakpoints.
Application Inspect localStorage,
sessionStorage, cookies,
IndexedDB, Cache API, Service
Workers.
Cookie not being set? Check
Application > Cookies for
domain, path, SameSite
values.
Lighthouse Automated audit for Core Web
Vitals, accessibility, SEO, best
practices.
Product manager says page is
slow. Run Lighthouse, share
the report, prioritise the
findings.
5.3 Memory Leak Detection — Step by Step
// Memory leak pattern: event listeners not removed on component unmount
// React component that leaks:
```
function BadComponent() {
```
```
useEffect(() => {
```
// This adds a listener every time component mounts
```
window.addEventListener('resize', handleResize);
```
// ❌ No cleanup — listener persists after component unmounts
```
}, []);
```
```
}
```
// Fixed:
```
function GoodComponent() {
```
```
useEffect(() => {
```
```
window.addEventListener('resize', handleResize);
```
```
return () => window.removeEventListener('resize', handleResize); // cleanup
```
```
}, []);
```
```
}
```
// ── HOW TO FIND THE LEAK WITH DEVTOOLS ─────────────────────────────
// Step 1: Open DevTools → Memory tab
```
// Step 2: Take Heap Snapshot 1 (baseline)
```
```
// Step 3: Perform the user action that might leak (navigate away + back, 5x)
```
```
// Step 4: Click 'Collect garbage' (trash icon)
```
// Step 5: Take Heap Snapshot 2
// Step 6: Select Snapshot 2, set filter to 'Objects allocated between Snapshot 1 and 2'
// Step 7: Look for Component instances, EventListener, Detached DOM nodes
// Common leak sources in React apps:
// 1. setInterval / setTimeout not cleared on unmount
// 2. window.addEventListener not removed on unmount
```
// 3. Subscription (WebSocket, EventEmitter) not unsubscribed
```
// 4. Closure holding reference to large object
// 5. Global Map/Set that grows without bound
// Automated leak detection:
```
const startMemory = performance.memory?.usedJSHeapSize;
```
// ... perform actions ...
```
const endMemory = performance.memory?.usedJSHeapSize;
```
```
if (endMemory - startMemory > 5_000_000) { // 5MB growth
```
```
console.warn('Possible memory leak detected');
```
```
}
```
5.4 Session Replay — Watching What the User Actually Did
// Session replay: records DOM mutations, network requests, console events,
// and user interactions. When an error occurs, you can watch exactly
// what the user did before the crash — like a DVR for your app.
// Tools: Sentry Session Replay, LogRocket, FullStory, Microsoft Clarity
// Sentry replay is triggered automatically on error:
// replaysOnErrorSampleRate: 1.0 → 100% of error sessions get a replay
// What you see in the replay:
```
// • Every click, scroll, keyboard input (masked if PII)
```
// • Every fetch request and its status
```
// • DOM state at time of error (which elements were visible)
```
// • Console errors and warnings in order
```
// • The exact moment the UI broke (freeze, blank screen, wrong data)
```
// GDPR considerations:
// maskAllText: true → masks all text content in replay
// blockAllMedia: true → blocks image rendering in replay
// mask: ['.credit-card-field', '[data-pii]'] → selective masking
// When to use:
// • User reports they saw a bug but you cannot reproduce it
// • Error in Sentry has unusual breadcrumb pattern
// • QA found a flaky test — use replay to see what path triggered it
5.5 Remote Debugging Production Issues
// ── APPROACH 1: Feature-flag a debug mode ──────────────────────────
// Ship extra logging behind a flag. Enable for specific users.
```
if (featureFlags.debugMode) {
```
```
console.log('[DEBUG]', { component: 'Checkout', state, props });
```
```
}
```
// ── APPROACH 2: User-triggered debug dump ──────────────────────────
// Allow support team to trigger a state dump for a specific user
```
window.__debugDump = () => {
```
```
return {
```
```
reduxState: store.getState(),
```
```
queryCache: queryClient.getQueryCache().getAll(),
```
```
localStorage: { ...localStorage },
```
```
performance: performance.getEntriesByType('navigation'),
```
```
userAgent: navigator.userAgent,
```
```
};
```
```
};
```
```
// Support: 'Can you open the browser console and type __debugDump()?'
```
// ── APPROACH 3: Correlation IDs for distributed debugging ───────────
// Every API request carries a trace ID
// User reports: 'My order #ORD-48291 didn't go through at 14:32'
// You query logs by orderId=ORD-48291 → get the correlation ID
// → trace that ID through: frontend log → API gateway → payment service
```
const requestId = crypto.randomUUID();
```
```
fetch('/api/checkout', {
```
```
headers: { 'X-Request-ID': requestId }, // echoed back in response + server logs
```
```
});
```
// Log the requestId in telemetry too → correlate frontend event with server logs
// ── APPROACH 4: A/B test debugging ──────────────────────────────────
// Is the bug in variant A or B? Check feature flags in error context.
// Sentry: filter errors by tag feature_flag.new_checkout = true
// If error rate is 10x higher in variant B → flag is the cause
5.6 Performance Debugging — Finding the Slow Thing
// ── USER TIMING API — mark and measure your own code ────────────────
```
performance.mark('checkout-start');
```
```
await processCheckout(order);
```
```
performance.mark('checkout-end');
```
```
const measure = performance.measure('checkout', 'checkout-start', 'checkout-end');
```
```
telemetry.trackPerf('checkout', measure.duration);
```
// Shows up in DevTools Performance panel as a labeled block
// ── LONG TASKS API — find what blocks the main thread ───────────────
```
const observer = new PerformanceObserver((list) => {
```
```
for (const entry of list.getEntries()) {
```
```
if (entry.duration > 50) { // Long Task threshold
```
```
telemetry.track('long_task', {
```
```
duration: entry.duration,
```
```
startTime: entry.startTime,
```
```
attribution: entry.attribution?.[0]?.name,
```
```
});
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
```
observer.observe({ type: 'longtask', buffered: true });
```
// ── RESOURCE TIMING — find slow assets ──────────────────────────────
```
const slowResources = performance.getEntriesByType('resource')
```
```
.filter(r => r.duration > 500)
```
```
.map(r => ({ url: r.name, duration: r.duration, size: r.transferSize }));
```
// ── FINDING LAYOUT THRASHING ────────────────────────────────────────
// Layout thrashing: alternating reads and writes to DOM dimensions
// Causes forced synchronous layouts — very expensive
```
// ❌ Thrashing pattern (reads and writes interleaved):
```
```
elements.forEach(el => {
```
```
const width = el.offsetWidth; // READ — forces layout
```
```
el.style.width = width + 'px'; // WRITE
```
```
});
```
```
// ✅ Batched pattern (all reads first, then all writes):
```
```
const widths = elements.map(el => el.offsetWidth); // all READS
```
```
elements.forEach((el, i) => el.style.width = widths[i] + 'px'); // all WRITES
```
// Or: use requestAnimationFrame to batch writes to next paint
```
requestAnimationFrame(() => {
```
```
elements.forEach(el => el.classList.add('active'));
```
```
});
```
Interview Q How would you debug a memory leak in a React single-page application? Walk me
through the exact steps using DevTools.
Interview Q A user says the checkout button sometimes doesn't respond when they click it.
You cannot reproduce it. How do you debug this using your production
observability stack?
Interview Q What is layout thrashing? Give a code example of it happening and how to fix it.
Interview Q You notice in your RUM data that p95 LCP is 6 seconds for mobile users on 3G but
only 1.8 seconds on desktop. Walk me through your debugging and optimisation
strategy.
Master Cheat Sheet All 5 Topics at a Glance
Complete Logging & Monitoring Decision Reference
When you need to... Use this Key detail
Understand WHAT
happened
Structured logs with
breadcrumbs, request IDs
Log levels:
DEBUG→INFO→WARN→ERROR→FATAL.
Always structured JSON in prod.
Understand HOW MUCH
/ HOW OFTEN
```
Metrics (counters, gauges,
```
```
histograms)
```
Always report p75/p95/p99, never just
average. Segment by device, browser,
region.
Understand WHERE it's
slow
Distributed traces with
correlation IDs
Trace ID flows: browser → API gateway →
microservice → DB. One ID links the chain.
Catch JS errors before
users report
Global error +
unhandledrejection
handlers
Always 100% sample rate for errors. Never
sample them down.
Make minified stacks
readable
Source maps — use
'hidden' mode in production
Upload to Sentry, delete from CDN. Without
source maps, stacks are useless.
See the user's journey
before a crash
```
Breadcrumbs (circular
```
```
buffer of last 50 events)
```
```
Captures: navigation, API calls, clicks.
```
Attached to every error report.
Wake up on-call when
KPIs breach
Threshold + anomaly
alerting
Threshold for absolute limits. Anomaly for
deviations from baseline. Use BOTH.
Prevent alert fatigue Alert audit +
evaluation_delay + min
duration
If alert fires > 5x/week without action → fix
threshold or delete the alert.
Watch what user did
before a crash
```
Session replay (Sentry
```
```
Replay, LogRocket)
```
mask PII: maskAllText:true. 100% capture
on error sessions.
Find a memory leak DevTools Memory tab —
heap snapshot diff
Snapshot before and after. Look for
detached DOM, component instances,
EventListeners.
Find what blocks the
main thread
Long Tasks API +
DevTools Performance tab
Long Task = anything > 50ms. Flag and
break up large synchronous operations.
Debug by user report
```
('order X failed')
```
```
Correlation ID (X-Request-
```
```
ID) in logs
```
Same ID in browser logs + API logs +
service logs → trace full request chain.
Test experience before
real users
Synthetic monitoring
```
(Checkly, Playwright)
```
Run every 1-5 min from multiple regions.
Catches outages before user reports.
Know true user
experience
RUM + Core Web Vitals
```
(web-vitals.js)
```
```
Segments: mobile vs desktop, 4G vs 3G,
```
geo region. p75 is the target percentile.
Core Web Vitals Thresholds — The Numbers Every Senior Must Know
Metric Good Needs
Improvement
Poor What It Measures
LCP — Largest
Contentful Paint
< 2.5s 2.5s – 4s > 4s Time until main
content is visible
```
(hero image, H1)
```
INP — Interaction
to Next Paint
< 200ms 200ms – 500ms > 500ms Responsiveness to
user clicks, taps,
keystrokes
CLS —
Cumulative
Layout Shift
< 0.1 0.1 – 0.25 > 0.25 Visual stability —
how much content
jumps around
FCP — First
Contentful Paint
< 1.8s 1.8s – 3s > 3s Time to first pixel of
page content
TTFB — Time To
First Byte
< 800ms 800ms – 1800ms > 1800ms Server response
time for first byte
```
KEY INSIGHT In a system design interview, the Logging & Monitoring answer structure is: (1)
```
```
WHAT you collect — logs + metrics + traces with explicit examples. (2) HOW you
```
```
ship it — telemetry SDK, batching, sendBeacon, sampling strategy. (3) WHERE it
```
```
goes — Sentry for errors, Datadog/Grafana for metrics, distributed tracing. (4)
```
```
HOW you alert — SLOs, threshold + anomaly, PagerDuty, runbooks, on-call. (5)
```
HOW you debug — correlation IDs, source maps, session replay, DevTools. This
five-part answer covers the full lifecycle and signals senior-level system thinking.
Master these 5 topics and you can design, build, and operate frontend observability for any
production system at any scale.