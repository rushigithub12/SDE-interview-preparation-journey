##### Namaste Frontend System Design
System Design [ Bonus ]
Real DOM • Virtual DOM • Shadow DOM • Browser Rendering Pipeline • SPA vs MPA • Bundlers & Tree
Shaking • Monorepo • Design Systems • Interview Strategy • Bonus Case Studies
Bonus Topic What It Covers Why It Matters
Real DOM vs Virtual DOM DOM internals, reconciliation,
diffing algorithm, Fiber
architecture
Very frequently asked in senior
interviews — 'How does React
work under the hood?'
Shadow DOM Web Components,
encapsulation, slot projection,
styling isolation
Asked when discussing design
systems and browser-native
components
SPA vs MPA Architecture tradeoffs, routing,
SSR, hybrid approaches
Foundational design decision for
every new project
Browser Rendering Pipeline Critical path, reflow vs repaint,
compositing, layout thrashing
Performance interview staple —
'Why is this animation janky?'
Minification & Bundlers Webpack/Vite/esbuild, tree
shaking, code splitting, module
graph
Bundle optimisation is a core
senior frontend skill
Monorepo Architecture Nx, Turborepo, workspaces,
shared packages, CI/CD at scale
Staff/principal engineer territory
— large org codebase design
Design Systems Tokens, component library,
Storybook, versioning, adoption
Asked at every company that
has a product suite
Interview Strategy Time management, common
LLD mistakes, what interviewers
actually grade
How to use all this knowledge to
get the offer
```
Bonus: Kanban Board HLD Full HLD case study — board,
```
columns, drag-and-drop, real-
time
Commonly asked machine-
coding + HLD hybrid question
```
Bonus: Browser Internals V8, event loop, call stack, task
```
queue, microtasks, rendering
loop
Deep JS runtime knowledge
expected at staff level
Bonus 1 Real DOM vs Virtual DOM
1.1 What Is the Real DOM?
```
The Document Object Model (DOM) is the browser's live, in-memory tree representation of an HTML document.
```
Every HTML element becomes a DOM node — an object in a language-agnostic tree structure. The DOM is the
API through which JavaScript reads and mutates the document. The browser re-renders portions of the page
whenever the DOM changes.
```
The core problem: DOM operations are expensive. Changing a DOM node can trigger layout (reflow) — where
```
the browser recalculates every element's position and size — and paint — where it redraws pixels. These are
synchronous, main-thread operations. Change 100 DOM nodes in a loop and the browser runs 100 style
calculations and potentially 100 reflows, causing visible jank.
// Real DOM — every direct manipulation may trigger layout + paint
```
const list = document.getElementById('list');
```
// ❌ BAD — 1000 DOM mutations → 1000 reflows
```
for (let i = 0; i < 1000; i++) {
```
```
const li = document.createElement('li');
```
```
li.textContent = `Item ${i}`;
```
```
list.appendChild(li); // triggers reflow on every iteration
```
```
}
```
```
// ✅ BETTER — batch mutations with DocumentFragment (1 reflow)
```
```
const fragment = document.createDocumentFragment();
```
```
for (let i = 0; i < 1000; i++) {
```
```
const li = document.createElement('li');
```
```
li.textContent = `Item ${i}`;
```
```
fragment.appendChild(li); // off-screen, no reflow
```
```
}
```
```
list.appendChild(fragment); // ONE DOM insertion → ONE reflow
```
// ✅ BEST — requestAnimationFrame for visual updates
```
requestAnimationFrame(() => {
```
```
list.appendChild(fragment); // synced with browser's repaint cycle
```
```
});
```
1.2 What Is the Virtual DOM?
The Virtual DOM is a lightweight JavaScript object tree that mirrors the structure of the real DOM. React keeps a
vDOM tree in memory. When state changes, React creates a NEW vDOM tree, diffs it against the PREVIOUS
```
vDOM tree (reconciliation), determines the minimum set of real DOM changes needed, and applies only those
```
changes in a single batch. The result: many fewer real DOM mutations, fewer reflows, better performance.
// Virtual DOM is just a plain JavaScript object:
// <div class='card'><h2>Hello</h2><p>World</p></div>
// becomes:
```
const vNode = {
```
```
type: 'div',
```
```
props: { className: 'card' },
```
```
children: [
```
```
{ type: 'h2', props: {}, children: ['Hello'] },
```
```
{ type: 'p', props: {}, children: ['World'] },
```
]
```
};
```
```
// React.createElement() produces exactly this structure:
```
```
React.createElement('div', { className: 'card' },
```
```
React.createElement('h2', null, 'Hello'),
```
```
React.createElement('p', null, 'World'),
```
```
);
```
// JSX is syntactic sugar that Babel/SWC transforms into createElement calls.
// <div className='card'><h2>Hello</h2></div>
```
// → React.createElement('div', { className:'card' },
```
```
// React.createElement('h2', null, 'Hello'))
```
1.3 The Diffing Algorithm — How Reconciliation Works
React's reconciliation algorithm compares the new vDOM tree with the previous one to find the minimal diff. The
```
naive tree-diff algorithm is O(n³) — too slow for real apps. React uses heuristics that reduce it to O(n):
```
Heuristic Rule Implication for Developers
Different element types If the root element type changes
```
(div → span), React unmounts
```
the old tree and mounts a brand
new one.
Never change a component's
root element type on state
change — causes full remount
```
(expensive, loses child state).
```
Same element type If element type is the same,
React updates only the changed
attributes and recurses into
children.
Update props in-place —
preserves DOM nodes. Far
cheaper than remounting.
key prop on lists React uses the key to match list
items across renders. Same key
= update. Missing/changed key =
unmount + remount.
Always use stable, unique keys
on list items. NEVER use array
index as key when the list can
reorder.
Component identity If a component renders at the
same position in the tree, React
reuses its instance. Move it to a
different position → unmount +
remount.
Conditional rendering: use
```
{condition && <Comp>} not
```
position-shift tricks.
// ── The key prop mistake ──────────────────────────────────────────
// ❌ WRONG — index key: when list reorders, React can't match items
```
// Old: [A(key=0), B(key=1), C(key=2)]
```
```
// New: [B(key=0), A(key=1), C(key=2)] (B moved to front)
```
// React thinks: key=0 is now B → update A→B. key=1 is now A → update B→A.
// Result: 2 DOM updates + potential state loss in the items.
```
items.map((item, i) => <TodoItem key={i} item={item} />)
```
// ✅ CORRECT — stable unique ID as key
```
// Old: [A(key='a'), B(key='b'), C(key='c')]
```
```
// New: [B(key='b'), A(key='a'), C(key='c')]
```
// React sees: key='b' moved, key='a' moved. Moves DOM nodes. 0 DOM updates.
```
items.map(item => <TodoItem key={item.id} item={item} />)
```
1.4 React Fiber — The Modern Reconciliation Engine
```
React Fiber (React 16+) is a complete rewrite of React's reconciliation algorithm that enables concurrent
```
rendering. Before Fiber, reconciliation was synchronous — once React started diffing, it couldn't pause. A large
tree diff would block the main thread for hundreds of milliseconds, causing visible frame drops.
Concept Explanation User-Facing Benefit
Fiber node Each React element has a
corresponding Fiber node — a
unit of work. The Fiber tree
mirrors the component tree.
Enables React to pause work
between Fiber nodes and
resume later.
Work loop React processes Fiber nodes in
a work loop. It checks if the
browser needs the main thread
```
(e.g., user input) and yields if so.
```
```
High-priority updates (user
```
```
typing) can interrupt low-priority
```
```
work (background data
```
```
rendering).
```
```
Lanes (priorities) Every update has a priority lane:
```
```
SyncLane (urgent),
```
```
InputContinuousLane (user
```
```
input), DefaultLane, IdleLane.
```
React processes urgent updates
first. Background updates don't
block interaction.
Concurrent Mode React can render multiple
versions of the UI concurrently.
```
startTransition() marks an
```
update as non-urgent.
Typing in a search box stays
responsive even while React
renders 10,000 search results.
Time slicing React slices reconciliation into
5ms chunks. Yields to browser
between chunks.
Eliminates long tasks. Maintains
60fps even with large re-renders.
// Concurrent Mode APIs:
// 1. startTransition — mark non-urgent state updates
```
import { startTransition, useTransition } from 'react';
```
```
function SearchPage() {
```
```
const [query, setQuery] = useState('');
```
```
const [results, setResults] = useState([]);
```
```
const [isPending, startTrans] = useTransition();
```
```
function handleInput(e) {
```
```
setQuery(e.target.value); // URGENT — instant input update
```
```
startTrans(() => {
```
```
setResults(search(e.target.value)); // NON-URGENT — can be interrupted
```
```
});
```
```
}
```
```
return (
```
<>
```
<input value={query} onChange={handleInput} />
```
```
{isPending && <Spinner />}
```
```
<ResultsList results={results} />
```
</>
```
);
```
```
}
```
// 2. useDeferredValue — defer re-renders of expensive subtrees
```
function App({ query }) {
```
```
const deferredQuery = useDeferredValue(query);
```
// deferredQuery lags behind query.
```
// The expensive list uses the deferred (stale) value until React has bandwidth.
```
```
return <ExpensiveList query={deferredQuery} />;
```
```
}
```
Interview Q What is the Virtual DOM? Why did React introduce it? How does it improve
performance over direct DOM manipulation?
Interview Q Explain React's reconciliation algorithm. What are the two heuristics that make it
```
O(n) instead of O(n³)?
```
Interview Q What is React Fiber? What problem does concurrent rendering solve?
Interview Q Why should you never use array index as a key in a React list?
Bonus 2 Shadow DOM — Web Components &
Style Encapsulation
2.1 What Is the Shadow DOM?
The Shadow DOM is a browser-native API that attaches an isolated, encapsulated DOM subtree to any HTML
```
element. This 'shadow tree' is separate from the main document (Light DOM). CSS from the main document
```
cannot penetrate the shadow boundary, and CSS defined inside the shadow cannot leak out. It is the foundation
of Web Components.
You have been using Shadow DOM without knowing it: the browser's built-in <input type='range'>, <video
controls>, and <details> elements all render their internal UI using Shadow DOM. That is why you cannot style
the range slider thumb with ordinary CSS — it lives in a Shadow DOM you cannot access.
// ── Shadow DOM API ────────────────────────────────────────────────
```
const host = document.getElementById('my-widget');
```
// Attach a shadow root to the host element
```
const shadow = host.attachShadow({ mode: 'open' });
```
// mode: 'open' → shadow root accessible via element.shadowRoot
```
// mode: 'closed' → shadow root inaccessible from outside (element.shadowRoot = null)
```
// Add content to the shadow tree — completely isolated from main document
shadow.innerHTML = `
<style>
/* This CSS ONLY applies inside this shadow root */
```
button { background: coral; color: white; border-radius: 8px; }
```
/* Main document's button styles do NOT affect this button */
</style>
<button>Click me</button>
```
`;
```
```
// Main document CSS: button { background: blue; }
```
// → This does NOT affect the shadow's button. Complete isolation.
```
// ── Custom Element (Web Component) using Shadow DOM ───────────────
```
```
class UserAvatar extends HTMLElement {
```
```
static observedAttributes = ['src', 'name', 'size'];
```
```
constructor() {
```
```
super();
```
```
this.shadow = this.attachShadow({ mode: 'open' });
```
```
}
```
```
connectedCallback() { this.render(); }
```
```
attributeChangedCallback() { this.render(); }
```
```
render() {
```
```
const src = this.getAttribute('src') ?? '';
```
```
const name = this.getAttribute('name') ?? 'User';
```
```
const size = this.getAttribute('size') ?? '40';
```
this.shadow.innerHTML = `
<style>
```
:host { display: inline-block; }
```
```
img { width: ${size}px; height: ${size}px;
```
```
border-radius: 50%; object-fit: cover; }
```
```
span { font-size: 12px; color: #666; display: block; text-align: center; }
```
</style>
```
<img src='${src}' alt='${name}'>
```
```
<span>${name}</span>
```
```
`;
```
```
}
```
```
}
```
```
customElements.define('user-avatar', UserAvatar);
```
```
// Usage in HTML (or React JSX):
```
// <user-avatar src='/avatar.jpg' name='Rushikesh' size='48'></user-avatar>
2.2 Shadow DOM vs Real DOM vs Virtual DOM — The Three DOMs
Dimension Real DOM Virtual DOM Shadow DOM
What it is Browser's live in-memory
document tree
In-memory JS object
```
tree (React's working
```
```
copy)
```
Encapsulated DOM
subtree attached to a
host element
Who creates it Browser parses HTML,
builds DOM
React's reconciler
creates + maintains it
Developer calls
```
attachShadow().
```
Browser renders it.
CSS scope Global — all styles affect all
elements
No CSS of its own
```
(React components
```
use CSS Modules /
```
Tailwind)
```
Isolated — external
CSS cannot penetrate.
Internal CSS cannot
leak.
JS access Full access via
document.getElementById,
querySelector etc.
Only accessible
through React
```
(setState, refs)
```
Open mode:
element.shadowRoot.
Closed mode:
inaccessible.
Use case The actual rendered page Performance
optimisation layer in
React/Vue etc.
Web Components,
native browser UI,
design system
components
Framework? Native browser API — no
framework
React, Vue, Preact,
Solid — all use virtual
DOM concept
Native browser API —
framework-agnostic
2.3 Slots — Composing Content Into Shadow DOM
```
// Slots allow external (Light DOM) content to be projected into Shadow DOM
```
// Like 'children' in React, but browser-native
```
class CardComponent extends HTMLElement {
```
```
constructor() {
```
```
super();
```
```
this.attachShadow({ mode: 'open' }).innerHTML = `
```
<style>
```
.card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; }
```
```
.card-header { font-weight: bold; margin-bottom: 8px; }
```
</style>
<div class='card'>
<div class='card-header'>
<slot name='title'>Default Title</slot> <!-- named slot -->
</div>
<slot></slot> <!-- default slot -->
</div>
```
`;
```
```
}
```
```
}
```
```
customElements.define('my-card', CardComponent);
```
// Usage — Light DOM content is projected into shadow slots
<my-card>
<h2 slot='title'>My Product</h2> <!-- projected into [name=title] slot -->
<p>This is the card body content.</p> <!-- projected into default slot -->
</my-card>
// ── Using Web Components in React ────────────────────────────────
// React 19 has full Web Components support.
// React 18: wrap in a React component for event handling
```
function Avatar({ src, name, size }) {
```
```
return <user-avatar src={src} name={name} size={size} />;
```
```
// React passes primitive props as attributes (string conversion)
```
```
}
```
Interview Q What is the difference between Real DOM, Virtual DOM, and Shadow DOM?
When would you use each?
Interview Q Why can't you style a Shadow DOM element from the main document's CSS? How
do you style Web Components from the outside?
```
REAL WORLD Design systems at large companies (GitHub's Primer, Adobe's Spectrum,
```
```
Salesforce's Lightning) use Web Components / Shadow DOM specifically because
```
they are framework-agnostic — the same component works in React, Angular,
Vue, or plain HTML. When you have 50 engineering teams using different
frameworks, Web Components are the only truly universal component format.
Bonus 3 SPA vs MPA — Architecture Decision
```
3.1 Single Page Application (SPA)
```
An SPA loads one HTML document and dynamically updates the DOM using JavaScript as the user navigates.
```
There is no full page reload between routes — the browser history API (pushState) simulates navigation. React,
```
Vue, and Angular apps are typically SPAs.
// SPA navigation: no server round-trip
// User clicks a link:
```
// 1. React Router intercepts the click (e.preventDefault())
```
```
// 2. Calls window.history.pushState({}, '', '/products/42')
```
// 3. URL bar updates. No HTTP request.
// 4. React Router renders <ProductDetail id='42' />
// 5. JavaScript fetches /api/products/42 and renders the data
// First load: browser downloads a single index.html + main.js bundle
// ALL subsequent navigation: JavaScript renders new views — zero server HTML
```
3.2 Multi-Page Application (MPA)
```
An MPA makes a full HTTP request for every page navigation. The server responds with a complete HTML
```
document. The browser parses it and renders a fresh page. Traditional server-rendered apps (PHP, Django,
```
```
Ruby on Rails) are MPAs. Next.js in SSR mode produces MPA-like behaviour.
```
// MPA navigation: full server round-trip
// User clicks a link:
// 1. Browser sends GET /products/42 to server
// 2. Server runs template engine, produces full HTML
// 3. Browser receives HTML, parses it, renders page
```
// 4. All JS, CSS re-evaluated (unless cached)
```
// Result: full page 'white flash' between navigations
3.3 SPA vs MPA — Full Comparison
Dimension SPA MPA
Initial load Slow — downloads entire JS
bundle upfront
Fast — server sends minimal
HTML for the requested page
only
Subsequent navigation Instant — JavaScript renders in-
memory, no network
Slow — full HTTP round-trip for
every page
SEO Poor without SSR — crawlers
may not run JS
Excellent — each page has
unique, indexable HTML
Core Web Vitals Poor LCP on first load. Excellent
FID/INP after.
Good LCP. FID/INP depends on
JS hydration overhead.
State persistence Easy — state lives in JS memory
across routes
Hard — must re-fetch or use
localStorage/cookies on each
page
Development model Frontend-only team. API-first
backend.
Coupled frontend-backend
```
(templates). Or decoupled with
```
SSR.
Mobile performance Heavy JS bundle hurts slow
devices
Lighter pages — browser
handles rendering, not JS engine
Examples Gmail, Figma, Notion, Trello,
admin dashboards
```
Amazon (SSR), BBC News,
```
Wikipedia, government sites,
blogs
3.4 The Hybrid: SPA + SSR = Modern Next.js
```
Modern frameworks blur the SPA/MPA line. Next.js gives you SSR for first load (fast LCP, SEO, no JS-required
```
```
rendering) and SPA-style client-side navigation after hydration (instant route transitions). This is the best of both
```
worlds and is why Next.js dominates production React development.
Phase Behaviour Result
First request Server renders complete HTML
```
(SSR/SSG/ISR)
```
Fast LCP, SEO-indexable, no
blank page on first load
Hydration React 'attaches' to the server
HTML — makes it interactive
Interactive without re-rendering
```
(fast TTI)
```
Client navigation React Router intercepts link clicks
— SPA-style fetch + render
Instant navigation, no full page
reload
Background refetch React Query refetches data in
background without navigation
Fresh data without user-visible
loading
Interview Q What is the difference between a Single Page Application and a Multi Page
Application? Give a real-world product that exemplifies each.
Interview Q How does Next.js combine the benefits of both SPA and MPA? Explain the
hydration step.
Bonus 4 Browser Rendering Pipeline — Reflow,
Repaint & Compositing
Understanding how browsers turn HTML+CSS+JS into pixels on the screen is essential for diagnosing and
fixing performance problems. Every animation jank, every scroll freeze, every missed frame can be traced back
to a step in the rendering pipeline.
4.1 The Full Rendering Pipeline
Step What Happens Triggered By Cost
1. Parse HTML Browser parses
HTML into the
DOM tree. Parallel
CSS parsing builds
CSSOM tree.
Initial page load. Dynamic
innerHTML changes.
Medium —
proportional to
HTML size
2. Style Browser combines
DOM + CSSOM
into a Render Tree.
Computes every
element's
computed styles.
CSS changes, class
additions/removals, media queries.
Medium — style
recalculation
3. Layout (Reflow) Browser calculates
exact position and
size of every
element in the
render tree.
Width/height/margin/padding/top/left
changes. DOM insertions. Font
changes.
```
HIGH — O(n) in
```
DOM size. Causes
entire layout
recalculation.
4. Paint Browser fills in
pixels for each
element — colours,
borders, shadows,
text.
Background-color, color, box-
shadow, visibility changes.
Medium — repaints
only affected layer
5. Composite GPU combines
layers and renders
them to screen.
Handles opacity +
transform on
separate layers.
```
opacity, transform changes (on
```
```
compositor thread).
```
LOW — GPU-
accelerated, no
main thread
required
4.2 Reflow vs Repaint — The Critical Distinction
```
Reflow (layout) is the most expensive step. Any property that affects an element's size or position — width,
```
height, margin, padding, font-size, border, top, left — triggers a full layout recalculation for the element and all its
descendants. Repaint is cheaper — colour, background, shadow changes only affect pixel-filling, not layout.
Compositing is cheapest — opacity and transform changes happen entirely on the GPU.
Property Changed Pipeline Steps Triggered Relative Cost
width, height, margin,
padding, font-size
Layout → Paint → Composite Most expensive
```
top, left (position:
```
```
absolute/fixed)
```
Layout → Paint → Composite Expensive
background-color, color, box-
shadow
Paint → Composite Medium
opacity, transform:
translate/scale/rotate
```
Composite only (GPU) Cheapest — target for
```
animations
```
visibility Paint → Composite Medium (element still in layout)
```
```
display: none / block Layout → Paint → Composite Expensive (adds/removes from
```
```
layout)
```
4.3 Layout Thrashing — The Performance Anti-Pattern
// Layout thrashing: alternating between reading and writing layout properties
// forces the browser to perform synchronous reflows
// ❌ WRONG — layout thrashing: 1000 synchronous reflows
```
const boxes = document.querySelectorAll('.box');
```
```
boxes.forEach(box => {
```
```
const width = box.offsetWidth; // READ → browser must flush pending styles →
```
REFLOW
```
box.style.width = (width * 2) + 'px'; // WRITE → invalidates layout
```
// Next iteration: READ again → another forced reflow
```
});
```
// 1000 elements = 1000 reflows = hundreds of milliseconds of jank
// ✅ CORRECT — batch reads then batch writes
```
const boxes = document.querySelectorAll('.box');
```
```
const widths = Array.from(boxes).map(b => b.offsetWidth); // all READS first
```
```
boxes.forEach((box, i) => {
```
```
box.style.width = (widths[i] * 2) + 'px'; // all WRITES after
```
```
});
```
```
// ONE reflow (reading) + ONE repaint (writing). 2 operations, not 1000.
```
// ✅ EVEN BETTER — use requestAnimationFrame
```
requestAnimationFrame(() => {
```
// Reads
```
const widths = Array.from(boxes).map(b => b.offsetWidth);
```
```
// Writes (in next frame — guarantees no layout thrash across animation frames)
```
```
requestAnimationFrame(() => {
```
```
boxes.forEach((box, i) => box.style.width = (widths[i]*2)+'px');
```
```
});
```
```
});
```
```
// Layout-triggering properties (force synchronous layout when read after write):
```
// offsetWidth, offsetHeight, offsetTop, offsetLeft
// clientWidth, clientHeight, clientTop, clientLeft
// scrollWidth, scrollHeight, scrollTop, scrollLeft
```
// getBoundingClientRect(), getComputedStyle()
```
```
// scrollIntoView(), focus()
```
4.4 The Compositor Thread — GPU-Accelerated Animations
Modern browsers run rendering on multiple threads. The main thread handles JS, style, and layout. The
compositor thread handles compositing — combining pre-rasterized layers into the final frame using the GPU. If
your animation only changes opacity or transform, it runs entirely on the compositor thread — the main thread is
```
not involved. This means even if your JavaScript is busy (long task), the animation keeps running at 60fps.
```
// ❌ WRONG — triggers layout + paint on every frame
// Animating 'left' forces the layout pipeline every frame
```
element.style.left = currentX + 'px';
```
// ✅ CORRECT — compositor-only: only transform changes
```
element.style.transform = `translateX(${currentX}px)`;
```
// Runs on GPU. 60fps even with heavy JS on main thread.
// ✅ CSS animation — browser optimises automatically
```
@keyframes slide-in {
```
```
from { transform: translateX(-100%); }
```
```
to { transform: translateX(0); }
```
```
}
```
```
.modal { animation: slide-in 300ms ease-out; }
```
// will-change: hint to browser to promote element to its own compositor layer
// Use sparingly — each layer costs GPU memory
```
.animated-card {
```
```
will-change: transform; // browser pre-promotes this element
```
```
}
```
// ✅ Web Animations API — JavaScript + compositor
```
element.animate([
```
```
{ transform: 'translateX(-100%)' },
```
```
{ transform: 'translateX(0)' }
```
```
], {
```
```
duration: 300,
```
```
easing: 'ease-out',
```
```
fill: 'forwards',
```
```
});
```
// Hands animation to compositor — main thread doesn't need to drive each frame
Interview Q What is the difference between reflow and repaint? Which CSS properties trigger
each?
Interview Q What is layout thrashing? How do you fix it? Write the corrected code.
Interview Q Why is animating transform/opacity better than animating width/height or left/top?
Interview Q What is the compositor thread? How does it enable 60fps animations even when
JavaScript is busy?
Bonus 5 Bundlers, Tree Shaking & Code Splitting
5.1 What Do Bundlers Do?
A bundler takes your application's module graph — hundreds or thousands of JavaScript, TypeScript, CSS, and
asset files — and outputs optimised bundles: fewer files, smaller size, correct execution order. Bundlers: resolve
```
module imports, transform code (TypeScript → JS, JSX → JS, modern ES → compatible ES), optimise (minify,
```
```
tree-shake, split), and output hashed filenames for cache busting.
```
Bundler Speed Config Ecosystem Best For
```
Webpack 5 Slow (JS-based) Very complex Largest — Module
```
Federation, every
loader/plugin
Large enterprise apps.
Micro-frontends
```
(Module Federation).
```
```
Vite Very fast (esbuild dev,
```
```
Rollup prod)
```
Simple Growing rapidly. Vite
plugins.
New projects. React,
Vue, Svelte. Fast DX.
```
esbuild Blazing (Go-based, 10-
```
100x faster than
```
Webpack)
```
Minimal Limited plugin
ecosystem
```
Build tools (used inside
```
```
Vite). Ultra-fast CI
```
builds.
```
Turbopack Very fast (Rust-based,
```
```
Next.js default)
```
```
Zero config Next.js only (currently) Next.js 13+ projects.
```
Rollup Medium Moderate Library bundling Publishing npm
packages. ESM output.
5.2 Tree Shaking — Eliminating Dead Code
Tree shaking is the process of removing code that is imported but never actually used. Modern bundlers
```
(Vite/Rollup/webpack) statically analyse your ES module import/export graph, find code paths that are never
```
reached, and exclude them from the output bundle.
```
// ── Tree shaking works with ES modules (static imports) ──────────
```
// utils.js — exports 3 functions
```
export function add(a, b) { return a + b; }
```
```
export function subtract(a, b) { return a - b; }
```
```
export function multiply(a, b) { return a * b; }
```
// app.js — only imports 'add'
```
import { add } from './utils';
```
```
console.log(add(1, 2));
```
// After tree shaking: subtract and multiply are REMOVED from the bundle.
```
// Bundle only contains add().
```
```
// ── Tree shaking FAILS with CommonJS (require) ─────────────────
```
```
// const { add } = require('./utils');
```
```
// require() is dynamic — bundler can't statically analyse what is used.
```
// ALL exports are included. No tree shaking.
// ── Mark your library as side-effect-free ───────────────────────
// package.json
```
{ "sideEffects": false }
```
```
// Tells bundler: no file in this package has side effects (e.g. global mutation).
```
// Enables aggressive tree shaking of unused imports.
// ── Common mistake: importing the whole library ──────────────────
```
import _ from 'lodash'; // ❌ imports ALL of lodash (~72KB gzipped)
```
```
import { debounce } from 'lodash'; // ❌ still imports all (CommonJS)
```
```
import debounce from 'lodash/debounce'; // ✅ direct module import (~2KB)
```
```
import { debounce } from 'lodash-es'; // ✅ ESM lodash, tree-shakeable
```
5.3 Code Splitting — Load Only What You Need
Code splitting divides the bundle into multiple smaller chunks that are loaded on demand. Instead of
downloading 5MB of JavaScript on the first visit, the user downloads only the code needed for the current page
```
(~50-100KB), and additional chunks load lazily as the user navigates.
```
```
// ── Route-based splitting (most important) ───────────────────────
```
```
const Home = lazy(() => import('./pages/Home'));
```
```
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
```
```
const Checkout = lazy(() => import('./pages/Checkout'));
```
// Each page is its own chunk. Only the current page's code is loaded.
// ── Component-based splitting ─────────────────────────────────────
```
const HeavyChart = lazy(() => import('./components/HeavyChart'));
```
```
function Dashboard() {
```
```
const [showChart, setShowChart] = useState(false);
```
```
return (
```
<>
```
<button onClick={() => setShowChart(true)}>Show Analytics</button>
```
```
{showChart && (
```
```
<Suspense fallback={<ChartSkeleton />}>
```
```
<HeavyChart /> {/* loads chart.js only when user clicks */}
```
</Suspense>
```
)}
```
</>
```
);
```
```
}
```
// ── Preloading: hint browser to load chunk before user clicks ─────
```
function NavItem({ to, label }) {
```
```
const handleMouseEnter = () => {
```
// User is hovering — likely to click. Start loading the chunk now.
```
import('./pages/ProductDetail'); // triggers chunk download
```
```
};
```
```
return <Link to={to} onMouseEnter={handleMouseEnter}>{label}</Link>;
```
```
}
```
// ── webpack magic comments for chunk naming + preloading ──────────
```
const ProductDetail = lazy(() =>
```
```
import(/* webpackChunkName: 'product-detail' */
```
/* webpackPrefetch: true */
```
'./pages/ProductDetail')
```
```
);
```
```
// webpackPrefetch: browser loads chunk during idle time (low priority)
```
```
// webpackPreload: browser loads chunk with current page (high priority)
```
```
Interview Q What is tree shaking? Why does it not work with CommonJS modules (require)?
```
```
Interview Q Explain code splitting. How does lazy() + Suspense implement it in React?
```
Interview Q What is the difference between webpack's webpackPrefetch and webpackPreload?
Bonus 6 Monorepo Architecture
A monorepo is a single Git repository that contains multiple packages, applications, and libraries. It is not a
```
monolith — the code is modular, but everything lives in one repo. Companies like Google (the entire Google
```
```
codebase), Facebook, Twitter, Airbnb, and Vercel use monorepos for their frontend codebases.
```
6.1 Monorepo vs Polyrepo
```
Dimension Monorepo Polyrepo (multiple repos)
```
Code sharing Trivial — import across
packages, no publishing to npm
Requires publishing/versioning
to npm or a private registry
Atomic changes One PR can span multiple
packages
Cross-package changes require
coordinated PRs across repos
Dependency management Single node_modules at root.
Deduplication automatic.
Each repo has its own
node_modules. Version drift
common.
CI/CD Complex — must build only
affected packages
Simple per-repo CI, but no
cross-repo impact analysis
Discoverability Everything visible in one place Scattered — hard to find the
right repo
```
Scale Requires tooling (Nx/Turborepo)
```
to stay fast
Simple for small teams, chaotic
for large orgs
6.2 Turborepo — The Modern Monorepo Tool
// ── Monorepo structure ────────────────────────────────────────────
my-org/
├── apps/
│ ├── web/ # Next.js customer-facing app
│ ├── admin/ # Vite admin dashboard
│ └── mobile/ # React Native
├── packages/
│ ├── ui/ # Shared component library
│ ├── config/ # Shared ESLint, TypeScript, Tailwind configs
│ ├── utils/ # Shared utility functions
```
│ └── api-client/ # Shared API client (typed)
```
├── package.json # Root: workspaces config
└── turbo.json # Turborepo pipeline
```
// ── package.json (root) ───────────────────────────────────────────
```
```
{
```
"name": "my-org",
"private": true,
"workspaces": ["apps/*", "packages/*"],
```
"devDependencies": { "turbo": "latest" }
```
```
}
```
// ── turbo.json — define the task pipeline ─────────────────────────
```
{
```
"$schema": "https://turbo.build/schema.json",
```
"tasks": {
```
```
"build": {
```
"dependsOn": ["^build"], // build dependencies first
"outputs": [".next/**", "dist/**"] // cache these outputs
```
},
```
```
"lint": { "dependsOn": [] }, // can run in parallel
```
```
"test": { "dependsOn": ["build"] }
```
```
}
```
```
}
```
// ── Key Turborepo features ────────────────────────────────────────
```
// 1. Remote caching: build outputs cached in cloud (Vercel).
```
// If nothing changed, skip the build entirely. CI: 30s → 3s.
// 2. Affected packages: only rebuild/test packages touched by a PR.
// PR changes packages/ui → only apps that import ui are rebuilt.
// 3. Parallel execution: tasks run in parallel where possible.
```
// 4. Task graph: tasks declare dependencies (^build = 'build deps first').
```
// ── Sharing packages across apps ──────────────────────────────────
// packages/ui/package.json
```
{ "name": "@my-org/ui", "main": "./src/index.ts" }
```
// apps/web/package.json
```
{ "dependencies": { "@my-org/ui": "workspace:*" } }
```
// apps/web/src/page.tsx
```
import { Button, Card } from "@my-org/ui";
```
// TypeScript types, tree shaking — all works across workspace packages.
```
Interview Q What is a monorepo? What are the advantages over a polyrepo (multiple repos)?
```
Interview Q What does Turborepo's remote caching do? How does it speed up CI pipelines?
Bonus 7 Design Systems
A design system is a collection of reusable components, design tokens, patterns, and documentation that
defines the visual and interaction language of an organisation's products. It is the single source of truth that
bridges design and engineering. Shopify's Polaris, GitHub's Primer, Atlassian's Atlaskit, and Google's Material
Design are well-known examples.
7.1 Anatomy of a Design System
Layer What It Contains Examples
Design Tokens The atomic values: colours,
spacing, typography, shadow,
border-radius. Defined once,
consumed everywhere.
```
--color-primary: #2E75B6; --
```
```
spacing-4: 16px; --font-size-lg:
```
1.125rem
Foundation Components Primitive UI building blocks. No
business logic. Fully accessible.
Button, Input, Select, Checkbox,
Badge, Avatar, Spinner, Icon
Composite Components Combinations of foundation
components with coordinated
behaviour.
Modal, Dropdown, DatePicker,
Toast, Tabs, DataTable,
ComboBox
Patterns Common UI solutions with
implementation guidance.
Form layout, empty states,
loading states, error states,
confirmation dialogs
Documentation & Storybook Interactive showcase of every
component in every state with
prop tables.
```
Storybook: stories for every
```
variant, state, and edge case
Design Token Sync Figma variables sync to code
tokens via Style Dictionary or
Token Studio.
Designers change Figma
variables → code tokens auto-
update via CI
7.2 Design Tokens — The Foundation
// ── Token taxonomy: Global → Semantic → Component ─────────────────
// 1. GLOBAL TOKENS — raw values. Never use directly in components.
```
const globalTokens = {
```
'color-blue-500': '#2E75B6',
'color-blue-600': '#1F4E79',
'color-red-500': '#9F1239',
'spacing-4': '16px',
'spacing-6': '24px',
'font-size-base': '1rem',
'border-radius-md':'8px',
```
};
```
// 2. SEMANTIC TOKENS — meaning. Reference global tokens. Used in components.
```
const semanticTokens = {
```
```
'color-brand-primary': 'var(--color-blue-500)',
```
```
'color-brand-dark': 'var(--color-blue-600)',
```
```
'color-danger': 'var(--color-red-500)',
```
```
'color-text-default': 'var(--color-slate-900)',
```
```
'color-bg-surface': 'var(--color-white)',
```
```
'space-component-gap': 'var(--spacing-4)',
```
```
};
```
// 3. COMPONENT TOKENS — specific to one component.
```
const buttonTokens = {
```
```
'button-bg-primary': 'var(--color-brand-primary)',
```
```
'button-bg-hover': 'var(--color-brand-dark)',
```
```
'button-border-radius': 'var(--border-radius-md)',
```
```
'button-padding-x': 'var(--spacing-4)',
```
```
};
```
```
// ── CSS custom properties (the production format) ─────────────────
```
```
:root {
```
```
--color-primary: #2E75B6;
```
```
--color-danger: #9F1239;
```
```
--spacing-4: 16px;
```
```
--border-radius: 8px;
```
```
}
```
// Dark mode: override semantic tokens
```
@media (prefers-color-scheme: dark) {
```
```
:root {
```
```
--color-bg-surface: #1E293B;
```
```
--color-text-default: #F8FAFC;
```
```
}
```
```
}
```
// ── Style Dictionary — transform tokens to any format ─────────────
```
// Input: tokens.json (design tool export)
```
// Output: CSS custom properties, Tailwind theme, iOS Swift, Android XML
// Used by: Shopify, Adobe, Salesforce, GitHub
7.3 Component Versioning — Preventing Breaking Changes
A design system is an API. Breaking changes must be communicated, versioned, and migrated carefully — just
```
like a backend API. Approach: semantic versioning (major.minor.patch). Major version = breaking prop
```
renames, removed variants, accessibility API changes. Minor = new variants, new props with defaults. Patch =
bug fixes, style tweaks.
// ── Changelog-driven communication ───────────────────────────────
// CHANGELOG.md for each package
// ## [2.0.0] - 2025-01-15
// ### BREAKING
// - Button: `kind` prop renamed to `variant`
// - Button: `isLoading` prop removed — use `loading` instead
// ### Added
// - Button: new `ghost` variant
// ### Migration
// Run: npx @my-org/ui-codemod@2.0.0 --src=./src
// ── Codemod for automated migration ──────────────────────────────
// packages/codemods/v2-button-props.js
// Uses jscodeshift to find and replace prop usage across the codebase
```
module.exports = function transformer(file, api) {
```
```
const j = api.jscodeshift;
```
```
return j(file.source)
```
```
.findJSXElements('Button')
```
```
.forEach(path => {
```
// Rename 'kind' → 'variant'
```
path.node.openingElement.attributes.forEach(attr => {
```
```
if (attr.name?.name === 'kind') attr.name.name = 'variant';
```
```
if (attr.name?.name === 'isLoading') attr.name.name = 'loading';
```
```
});
```
```
})
```
```
.toSource();
```
```
};
```
// Run: npx jscodeshift --transform=v2-button-props.js ./apps/web/src
Interview Q What are design tokens? What is the difference between global, semantic, and
component tokens?
Interview Q How do you publish and version a component library? What is a codemod and
when would you use one?
Bonus 8 Interview Strategy — Time Management &
Common Mistakes
8.1 Time Management in System Design Interviews
Phase Duration What to Do Common Mistake
Clarify requirements 5 min Ask 3-5 targeted
questions. Write scope
decisions on whiteboard.
Skipping this and
designing the wrong
system
Data model + API 5 min Write TypeScript types.
Name the 3-4 key
endpoints.
Going to architecture
before knowing what data
flows
High-level architecture 10 min Draw boxes + arrows.
Name each layer. State
rendering strategy.
Drawing too many boxes
— complexity signals
confusion
Component deep-dive 10 min Pick the hardest
component. Show state +
props + events.
Staying too high-level —
senior interviews expect
code
NFRs + edge cases 10 min Performance, a11y, offline,
security, observability.
Only discussing the happy
path — shows
inexperience
Wrap-up + tradeoffs 5 min Summarise decisions.
State explicitly what was
out of scope. Ask for
feedback.
Trailing off. Not owning the
design clearly.
8.2 Common LLD Mistakes to Avoid
Mistake What Interviewers Think What to Do Instead
Only coding the happy path 'Has never built production
software'
Always add: loading state, error
state, empty state, and retry
mechanism
No accessibility 'Doesn't build for real users' Always mention keyboard nav,
aria-*, focus management,
screen reader testing
Props explosion: 15+ props on
one component
'Cannot design abstractions' Identify which props cluster
together → break into sub-
components or use compound
pattern
No state management
justification
'Uses the first thing they knew,
not the right thing'
Explicitly justify: 'I chose Zustand
because this is global UI state
with < 5 writes/s — Redux
overhead is unnecessary'
Not asking clarifying
questions
'Will build the wrong thing
confidently'
First 5 minutes: ask about scale,
mobile vs desktop, real-time
requirements, accessibility
Using console.log for
debugging
'Junior mindset' Mention: error boundaries,
Sentry, React DevTools Profiler,
source maps
No mention of performance 'Hasn't optimised anything' Every component: mention
virtualization, memo, code
splitting, lazy loading where
relevant
Making things up about APIs 'Unreliable' If unsure: 'I'd verify the exact
API, but my approach would
be...'
8.3 What Interviewers Actually Grade
Most companies use a structured rubric. Understanding the rubric lets you know what to emphasise. The typical
rubric for senior frontend system design:
Criterion Weight What Earns Full Marks
Problem scoping 15% Asks clarifying questions. Defines
explicit scope. States assumptions.
Data model & API design 15% Clean entity types. Appropriate API
contract. Considers pagination and
real-time transport.
Architecture correctness 25% Correct rendering strategy for the
use case. Right state management
tool. Justifies choices.
Technical depth 20% Goes beyond surface level: explains
how reconciliation works, why cursor
pagination, how WS reconnects.
Non-functional concerns 15% Proactively covers: performance
targets, accessibility, security, offline,
monitoring.
Communication 10% Thinks out loud. Explains tradeoffs.
Responds well to pushback. Asks for
feedback.
8.4 The Tradeoff Language — Phrases That Signal Seniority
Senior engineers never say 'we should use X'. They say 'I would use X because of Y, with the tradeoff that Z. If
Z becomes a problem at scale N, we'd migrate to W'. Use this language consistently:
• 'I'd start with useState here because the state is local to this component. If requirement X changes and
two components need to share it, I'd lift it to context or Zustand.'
• 'I'd choose cursor-based pagination over offset because at scale, offset scans N rows in the database on
every request. The tradeoff is that users can't jump to page N directly, but for a feed that's acceptable.'
• 'I'd use SSR for this page rather than CSR because SEO and LCP are critical. The tradeoff is server
cost — but we'd aggressively edge-cache the output with a 60-second TTL so the origin only sees
cache-miss traffic.'
• 'I'd use WebSocket here rather than polling because we need sub-second latency. If we get to 10M
concurrent users, we'd evaluate whether SSE with CDN fan-out is more cost-effective for this read-only
broadcast pattern.'
• 'I'd use React Query for this because it gives us server state caching, background refetching, and
loading/error states for free. The tradeoff is the learning curve and bundle size, but for this data-heavy
product it's worth it.'
```
Bonus Case Study Design a Kanban Board (Trello
```
```
/ Linear / Jira)
```
The Kanban Board is the most common bonus LLD/HLD hybrid question in frontend interviews. It tests: data
modelling for ordered lists, drag-and-drop implementation, optimistic updates, real-time collaboration, and
performance with large boards. It is asked at companies including Microsoft, Atlassian, Linear, and product-
based startups.
Requirements Clarification
Question Decision
Single board or multi-board? Single board for this design. Multi-board is a
straightforward extension.
```
Real-time collaboration (multiple users editing
```
```
same board)?
```
Yes — changes must reflect for all users in < 1s.
Drag across columns? Drag to reorder within
column?
Both — cross-column and within-column
reordering.
How many cards per column? Performance
threshold?
Up to 1,000 cards per column — need virtual list.
Attachments, comments, sub-tasks on cards? Out of scope for this design — mention as
extensions.
Mobile drag support? Mention Pointer Events API as the approach —
don't implement in detail.
Data Model
```
type Board = {
```
```
id: string
```
```
title: string
```
```
columnIds: string[] // ordered array of column IDs
```
```
}
```
```
type Column = {
```
```
id: string
```
```
boardId: string
```
```
title: string
```
```
cardIds: string[] // ordered array of card IDs — order IS the data
```
```
}
```
```
type Card = {
```
```
id: string
```
```
columnId: string
```
```
title: string
```
```
description: string
```
```
assigneeId: string | null
```
```
labels: string[]
```
```
priority: 'low' | 'medium' | 'high' | 'urgent'
```
```
createdAt: string
```
```
updatedAt: string
```
```
}
```
```
// Client-side normalised state (Redux/Zustand):
```
```
type BoardState = {
```
```
boards: Record<string, Board>
```
```
columns: Record<string, Column>
```
```
cards: Record<string, Card>
```
```
}
```
// KEY INSIGHT: Order is stored in the parent's ID array, not in the child.
// Moving a card = update source column's cardIds and target column's cardIds.
// This is the cleanest model for ordered lists.
Drag and Drop Architecture
// ── Library choice ────────────────────────────────────────────────
```
// @dnd-kit/core — the modern React DnD library (used by Vercel, Linear)
```
```
// Advantages over react-beautiful-dnd (now unmaintained):
```
// - Smaller bundle, React 18 compatible, accessible by default
```
// - Supports touch (Pointer Events), keyboard, and mouse
```
// - Does not mutate DOM — uses React state + CSS transforms
```
import {
```
DndContext, DragOverlay, PointerSensor, KeyboardSensor,
useSensor, useSensors, closestCenter
```
} from '@dnd-kit/core';
```
```
import {
```
SortableContext, useSortable, verticalListSortingStrategy
```
} from '@dnd-kit/sortable';
```
```
function Board({ boardId }) {
```
```
const board = useBoard(boardId);
```
```
const columns = useColumns(board.columnIds);
```
```
const dispatch = useKanbanDispatch();
```
```
const [activeCard, setActiveCard] = useState(null);
```
```
const sensors = useSensors(
```
```
useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
```
// distance:8 — prevents accidental drags on click
```
useSensor(KeyboardSensor) // keyboard drag for accessibility
```
```
);
```
```
function handleDragStart({ active }) {
```
```
setActiveCard(active.id);
```
```
}
```
```
function handleDragEnd({ active, over }) {
```
```
setActiveCard(null);
```
```
if (!over || active.id === over.id) return;
```
```
const sourceCol = findColumnOfCard(columns, active.id);
```
```
const destCol = findColumnOfCard(columns, over.id) ?? over.id;
```
```
// over.id is either a card ID (drop on card) or column ID (drop on empty col)
```
```
if (sourceCol === destCol) {
```
// Reorder within column
```
dispatch(reorderCard({ columnId: sourceCol, activeId: active.id, overId: over.id }));
```
```
} else {
```
// Move to different column
```
dispatch(moveCard({
```
```
cardId: active.id,
```
sourceCol,
destCol,
```
overId: over.id,
```
```
}));
```
```
}
```
```
// Sync to server (optimistic — board already updated locally)
```
```
api.moveCard({ cardId: active.id, destCol, position: getPosition(destCol) });
```
```
}
```
```
return (
```
<DndContext
```
sensors={sensors}
```
```
collisionDetection={closestCenter}
```
```
onDragStart={handleDragStart}
```
```
onDragEnd={handleDragEnd}
```
>
<div className='board'>
```
{columns.map(col => (
```
```
<KanbanColumn key={col.id} column={col} />
```
```
))}
```
</div>
```
{/* Drag preview — rendered in a portal, outside normal flow */}
```
<DragOverlay>
```
{activeCard && <CardPreview cardId={activeCard} />}
```
</DragOverlay>
</DndContext>
```
);
```
```
}
```
// ── Sortable card ─────────────────────────────────────────────────
```
function KanbanCard({ cardId }) {
```
```
const card = useCard(cardId);
```
```
const {
```
attributes, listeners, setNodeRef,
transform, transition, isDragging
```
} = useSortable({ id: cardId });
```
```
const style = {
```
```
transform: CSS.Transform.toString(transform),
```
transition,
```
opacity: isDragging ? 0.4 : 1, // ghost effect for dragged card
```
```
};
```
```
return (
```
<article
```
ref={setNodeRef}
```
```
style={style}
```
```
{...attributes} // aria-roledescription, aria-describedby
```
```
{...listeners} // pointerdown, keydown
```
```
aria-label={`Card: ${card.title}. Press space to drag.`}
```
>
```
<h3>{card.title}</h3>
```
<div className='card-meta'>
```
<PriorityBadge priority={card.priority} />
```
```
{card.assigneeId && <Avatar userId={card.assigneeId} size={24} />}
```
</div>
</article>
```
);
```
```
}
```
Real-Time Collaboration — Multi-User Kanban
// When User A drags a card, User B must see the card move in < 1s.
// ── WebSocket event model ─────────────────────────────────────────
// Server broadcasts to all board members:
type BoardEvent =
```
| { type: 'CARD_MOVED', payload: { cardId, destColId, position } }
```
```
| { type: 'CARD_CREATED', payload: Card }
```
```
| { type: 'CARD_UPDATED', payload: Partial<Card> & { id: string } }
```
```
| { type: 'CARD_DELETED', payload: { cardId: string } }
```
```
| { type: 'COLUMN_ADDED', payload: Column }
```
```
| { type: 'COLUMN_DELETED',payload: { columnId: string } }
```
// ── Client WS handler ─────────────────────────────────────────────
```
function useBoardWebSocket(boardId, dispatch) {
```
```
useEffect(() => {
```
```
const ws = new WebSocket(`wss://app.linear.app/boards/${boardId}/live`);
```
```
ws.onmessage = (e) => {
```
```
const event = JSON.parse(e.data);
```
// Server events update local state directly
```
switch(event.type) {
```
```
case 'CARD_MOVED': dispatch(cardMoved(event.payload)); break;
```
```
case 'CARD_CREATED': dispatch(cardCreated(event.payload)); break;
```
```
case 'CARD_UPDATED': dispatch(cardUpdated(event.payload)); break;
```
```
case 'CARD_DELETED': dispatch(cardDeleted(event.payload)); break;
```
```
}
```
```
};
```
```
return () => ws.close();
```
```
}, [boardId, dispatch]);
```
```
}
```
// ── Conflict resolution ────────────────────────────────────────────
// Two users drag the same card simultaneously:
// Strategy: Last-write-wins on the server.
// Server has the authoritative card position. Client shows optimistic update,
// then reconciles with server's broadcast event.
```
// For most Kanban boards, LWW is acceptable (cards don't get 'lost').
```
Performance — Large Boards
// 1,000 cards in a column → virtualise the column
```
import { FixedSizeList } from 'react-window';
```
```
function VirtualColumn({ column }) {
```
```
return (
```
<div className='column'>
```
<ColumnHeader column={column} />
```
<FixedSizeList
```
height={600}
```
```
itemCount={column.cardIds.length}
```
```
itemSize={100} // px per card
```
```
width='100%'
```
```
itemData={column.cardIds}
```
>
```
{({ index, style, data }) => (
```
```
<div style={style}>
```
```
<KanbanCard cardId={data[index]} />
```
</div>
```
)}
```
</FixedSizeList>
</div>
```
);
```
```
}
```
// Note: react-window virtualisation is NOT compatible with @dnd-kit
// out of the box — @dnd-kit needs to measure ALL items for sorting.
// For 1,000 cards: use @dnd-kit/sortable's custom sensors
```
// + @tanstack/virtual (which integrates with DnD).
```
// OR: simplify by not allowing DnD within a 1,000-card column
```
// (search + filter before drag). This is what Linear does.
```
Interview Q Design a Kanban board with drag-and-drop, real-time collaboration, and support
for 1,000 cards per column. Walk through your data model, DnD approach, and
conflict resolution strategy.
Interview Q How do you represent ordered lists in a data model for a Kanban board? How does
reordering work at the data layer?
Bonus 9 Browser Internals — V8, Event Loop &
Rendering Loop
9.1 JavaScript Execution — The Event Loop
The JavaScript event loop is the mechanism that enables asynchronous programming in a single-threaded
language. Understanding it is required to answer questions about performance, animation, and concurrency at
senior level.
Concept What It Is Priority
Call Stack Where synchronous function calls
execute. One at a time. LIFO.
Highest — must empty before
event loop can process queues
```
Microtask Queue Promise callbacks (.then(),
```
```
.catch()), queueMicrotask(),
```
MutationObserver callbacks.
Very high — entire queue drained
after each task, before rendering
```
Macrotask Queue (Task Queue) setTimeout, setInterval, I/O, UI
```
```
events (click, keydown).
```
Lower — one task per event loop
iteration
Rendering requestAnimationFrame callbacks,
style recalc, layout, paint.
After microtasks, before next
macrotask. Once per frame
```
(~16.7ms at 60fps)
```
requestIdleCallback Fires during browser idle time — no
rendering or tasks pending.
Lowest — only when browser has
nothing else to do
// ── Event loop execution order demonstration ──────────────────────
```
console.log('1 — synchronous');
```
```
setTimeout(() => console.log('4 — macrotask (setTimeout)'), 0);
```
```
Promise.resolve()
```
```
.then(() => console.log('3 — microtask (Promise.then)'));
```
```
console.log('2 — synchronous');
```
// Output: 1 → 2 → 3 → 4
// Reason:
// Call stack runs synchronous code: '1', registers setTimeout, registers Promise, '2'
// Call stack empty → drain microtask queue → '3'
// Microtask queue empty → run one macrotask → '4'
// ── Long task blocks rendering ────────────────────────────────────
// A task > 50ms is a 'Long Task' — blocks rendering, causes jank
```
function heavyComputation() {
```
// Takes 200ms → blocks rendering for 200ms → user sees frozen UI
```
for (let i = 0; i < 1_000_000_000; i++) {}
```
```
}
```
```
// Fix 1: Web Worker (move off main thread)
```
```
const worker = new Worker('/heavy-worker.js');
```
```
worker.postMessage({ data });
```
```
worker.onmessage = ({ data: result }) => { updateUI(result); };
```
```
// Fix 2: Chunk with scheduler.yield() (stay on main thread but yield frames)
```
```
async function heavyButYielding(items) {
```
```
for (const item of items) {
```
```
processItem(item);
```
```
if (isTimeToYield()) await scheduler.yield(); // yield to browser
```
```
}
```
```
}
```
// ── requestAnimationFrame vs setTimeout for animations ────────────
```
// setTimeout(fn, 16): fires after ~16ms — but may drift, may run mid-frame
```
```
// rAF(fn): fires exactly before the NEXT browser render — perfectly synced
```
```
function animate(timestamp) {
```
```
const elapsed = timestamp - startTime;
```
```
element.style.transform = `translateX(${elapsed * 0.1}px)`;
```
```
if (elapsed < 1000) requestAnimationFrame(animate); // run every frame
```
```
}
```
```
requestAnimationFrame(animate);
```
9.2 V8 — JavaScript Engine Optimisation
V8 is Google's open-source JavaScript engine used in Chrome and Node.js. Understanding how V8 optimises
code helps you write JavaScript that runs faster.
V8 Concept Explanation Implication for Developers
```
Ignition (interpreter) V8 first compiles JS to bytecode
```
and interprets it. Fast startup but
slow execution.
First call to a function is always
slower — JIT hasn't kicked in.
```
TurboFan (JIT compiler) V8 profiles hot functions (called
```
```
frequently). Compiles them to
```
optimised machine code.
Functions called many times
become as fast as native code
automatically.
Hidden classes V8 creates a 'hidden class' for
each object shape. Objects with
the same shape share the class.
Don't add properties to objects
after creation — breaks hidden
class sharing, de-optimises.
Inline caches V8 caches the result of property
lookups. Same hidden class =
cached lookup.
Objects changing shape
```
(property added/removed)
```
invalidate caches — slow
property access.
Monomorphic dispatch Functions called with the same
argument types every time are
fully optimised.
TypeScript helps: consistent
types → consistent hidden
classes → faster V8 execution.
// ── Hidden class pitfall ──────────────────────────────────────────
// ❌ Different shapes → different hidden classes → no optimisation
```
function createPoint(x, y) {
```
```
const p = {};
```
```
p.x = x; // hidden class A
```
```
p.y = y; // hidden class B (new property added)
```
```
return p;
```
```
}
```
// ✅ Same shape → same hidden class → V8 optimises
```
function createPoint(x, y) {
```
```
return { x, y }; // both properties initialised at once → one hidden class
```
```
}
```
// ── Don't delete properties ─────────────────────────────────────
// ❌ delete forces sparse array mode or new hidden class
```
delete user.temporaryProp;
```
// ✅ Set to null/undefined instead
```
user.temporaryProp = null;
```
Interview Q Explain the JavaScript event loop. What is the difference between the microtask
```
queue and the macrotask queue? Give the execution order for: setTimeout(0),
```
```
Promise.resolve().then(), synchronous code.
```
Interview Q What is a Long Task? How does it affect user experience and what are two ways
to break it up?
Interview Q What is requestAnimationFrame and why is it better than setTimeout for
animations?
Master Cheat Sheet Bonus Topics at a Glance
Three DOMs Quick Reference
Real DOM Virtual DOM Shadow DOM
```
Creator Browser (HTML parse) React/Vue reconciler Developer
```
```
(attachShadow)
```
Purpose Live rendered page Performance diffing
layer
Style/DOM isolation
CSS scope Global Depends on CSS
approach
Fully isolated boundary
When to care Direct DOM
```
manipulation (vanilla
```
```
JS)
```
React rendering / keys /
memo
Web Components /
design systems
Rendering Pipeline Cost Ladder
Action Pipeline Steps Relative Cost Safe for 60fps?
Change transform /
opacity
Composite only Lowest YES — use for animations
Change color /
background
Paint + Composite Low YES — repaint is cheap
Change width /
padding / margin
Layout + Paint +
Composite
High NO — avoid in animation
loops
Add / remove DOM
nodes
Layout + Paint +
Composite
Very High NO — batch with
DocumentFragment
Read offsetWidth after
write
Forced sync layout
```
(thrashing)
```
Extreme NEVER in animation loop
Event Loop Order
Order Queue/Step Examples Notes
```
1 Synchronous (call
```
```
stack)
```
All sync code runs first Must complete
before anything
async
2 Microtasks Promise.then, queueMicrotask,
MutationObserver
Entire queue
drained after
each task
```
3 Rendering (rAF) requestAnimationFrame,
```
style/layout/paint
Once per frame.
~16.7ms at
60fps
4 Macrotasks setTimeout, setInterval, I/O events, UI
events
One task per
event loop
iteration
5 Idle requestIdleCallback Only when
browser has
nothing else to
do
Bundler Comparison Quick Reference
Webpack 5 Vite esbuild Turbopack
Speed Slow Fast Blazing Very Fast
Config Complex Simple Minimal Zero
Best for Enterprise/MFE New projects Build pipelines Next.js
Module Federation YES Plugin NO Planned
KEY INSIGHT The Bonus chapter ties the entire Namaste FSD course together. Every topic here
— DOM internals, browser rendering, bundlers, monorepo, design systems — is a
depth signal in senior interviews. Candidates who understand WHY React's
reconciler uses keys, WHY CSS transform animations are compositor-only, and
WHY tree shaking requires ESM are the ones who get 'Strong Hire' ratings.
The best engineers are not those who know the most tools — they are the ones who
understand the fundamentals deeply enough to evaluate any tool correctly.