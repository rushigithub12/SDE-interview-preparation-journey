##### Namaste Frontend System Design
```
Low Level Design (LLD)
```
Design Patterns • Component Design • State Management • Routing • SOLID • 6 Machine Coding
Problems • Interview Questions
Topic What It Covers Weight
Design Patterns Observer, Pub/Sub, Singleton,
Factory, Strategy, Proxy,
Decorator, Facade
Very High
Component Design Atomic Design, compound
components, render props,
HOC, controlled vs uncontrolled
Very High
State Management Local vs global, Context, Redux,
Zustand, React Query, state
machines
Very High
Routing Client-side routing, code
splitting, nested routes, guards,
scroll restoration
High
SOLID Principles SRP, OCP, LSP, ISP, DIP
applied to React — every
principle with code
Very High
LLD — Infinite Scroll Intersection Observer, virtual
DOM windowing, pagination vs
cursor
Very High
LLD — Nested Comments Recursive tree, flatten/unflatten,
collapse, lazy-load children
High
LLD — Pagination Page-based, cursor-based,
offset vs keyset, URL state
High
LLD — Image Carousel Touch gestures, lazy load, auto-
play, a11y, preload adjacent
Very High
LLD — Chat UI WebSocket, message queue,
optimistic send, reactions, typing
indicator
Very High
LLD — Autocomplete Debounce, cancel in-flight, trie
vs server search, keyboard nav,
caching
Very High
Interview Questions 10 deep-dive model answers Very High
Why Low Level Design Matters in Senior Interviews
```
High Level Design (HLD) answers 'what boxes do we draw on the whiteboard?' Low Level Design answers 'how
```
do we actually build each box?' LLD is where senior frontend engineers are separated from mid-level engineers.
Anyone can say 'use Redux for state' — a senior explains when NOT to use Redux, why they chose Zustand,
and how the store is structured to prevent re-renders.
LLD machine-coding rounds — where you live-code a working component in 45-60 minutes — are used by
Flipkart, CRED, Razorpay, Meesho, Swiggy, and most product-based companies. The evaluators are not just
checking if it works. They are checking: is the code readable? Is it extensible? Does it handle edge cases? Is it
accessible? Is it performant?
What interviewers look for in LLD What they are testing
Separation of concerns — data logic vs UI Do you know how to architect components
cleanly?
Correct data structure choice Did you pick the right structure or the naive one?
Edge cases handled without being told Experience — you have been bitten by these
before
Performance considerations mentioned
proactively
Do you think about rendering cost without
prompting?
Accessibility — focus management, ARIA,
keyboard nav
Senior-level completeness
Extensibility — can the design evolve? Will this still work when requirements change?
Error and loading states Completeness — not just the happy path
```
KEY INSIGHT The LLD interview structure: (1) Clarify requirements — 5 minutes. Ask about
```
```
scope, supported browsers, data source, performance targets, accessibility. (2)
```
```
Design the data model and API contract — 5 minutes. (3) Design the component
```
```
tree — 5 minutes. (4) Code — 35 minutes. (5) Edge cases and optimizations — 10
```
minutes. Follow this structure and you will never run out of things to say.
Section 1 Important Design Patterns
Design patterns are reusable solutions to recurring architectural problems. In frontend, they govern how
components communicate, how state flows, and how UI logic is separated from business logic. Understanding
the right pattern to apply — and why — is a hallmark of senior engineering.
1.1 Observer Pattern
```
The Observer pattern defines a one-to-many dependency: when one object (Subject) changes state, all its
```
```
dependents (Observers) are notified automatically. This is the foundation of reactive programming, event
```
systems, and state management.
```
class EventEmitter {
```
```
#listeners = new Map();
```
```
on(event, fn) {
```
```
if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
```
```
this.#listeners.get(event).add(fn);
```
```
return () => this.off(event, fn); // return unsubscribe function
```
```
}
```
```
off(event, fn) { this.#listeners.get(event)?.delete(fn); }
```
```
emit(event, ...args) {
```
```
this.#listeners.get(event)?.forEach(fn => fn(...args));
```
```
}
```
```
once(event, fn) {
```
```
const wrapper = (...args) => { fn(...args); this.off(event, wrapper); };
```
```
return this.on(event, wrapper);
```
```
}
```
```
}
```
// Usage — cross-component communication without prop drilling
```
const bus = new EventEmitter();
```
// Component A — emits
```
function CartButton({ product }) {
```
```
return <button onClick={() => bus.emit('cart:add', product)}>Add</button>;
```
```
}
```
```
// Component B — listens (separate subtree, no common parent)
```
```
function CartCount() {
```
```
const [count, setCount] = useState(0);
```
```
useEffect(() => bus.on('cart:add', () => setCount(c => c + 1)), []);
```
```
return <span>{count}</span>;
```
```
}
```
1.2 Pub/Sub Pattern vs Observer
```
Pub/Sub adds an event bus (broker) between publishers and subscribers. Publishers and subscribers do not
```
know about each other — they only know about the bus. Observer: Subject holds references to Observers.
Pub/Sub: complete decoupling via broker.
// Pub/Sub — publisher and subscriber are completely decoupled
```
class PubSub {
```
```
#channels = {};
```
```
subscribe(channel, fn) {
```
```
(this.#channels[channel] ??= []).push(fn);
```
```
return { unsubscribe: () => {
```
```
this.#channels[channel] = this.#channels[channel].filter(f => f !== fn);
```
```
}};
```
```
}
```
```
publish(channel, data) {
```
```
(this.#channels[channel] ?? []).forEach(fn => {
```
```
try { fn(data); }
```
```
catch(e) { console.error(`[PubSub] Error in ${channel}:`, e); }
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
// Real use: analytics without coupling to business logic
```
pubsub.subscribe('user:action', ({ type, payload }) => {
```
```
analytics.track(type, payload);
```
```
});
```
// Business logic has no idea analytics exists
```
pubsub.publish('user:action', { type: 'checkout', payload: { orderId: '123' } });
```
1.3 Singleton Pattern
// Singleton: ensure only one instance exists, shared across the app
// Use for: logger, config, analytics, network client, toast manager
```
class ToastManager {
```
```
static #instance = null;
```
```
#queue = [];
```
```
#listeners = new Set();
```
```
static getInstance() {
```
```
if (!ToastManager.#instance) ToastManager.#instance = new ToastManager();
```
```
return ToastManager.#instance;
```
```
}
```
```
show(message, type = 'info', duration = 3000) {
```
```
const toast = { id: crypto.randomUUID(), message, type, duration };
```
```
this.#queue.push(toast);
```
```
this.#listeners.forEach(fn => fn([...this.#queue]));
```
```
setTimeout(() => this.dismiss(toast.id), duration);
```
```
}
```
```
dismiss(id) {
```
```
this.#queue = this.#queue.filter(t => t.id !== id);
```
```
this.#listeners.forEach(fn => fn([...this.#queue]));
```
```
}
```
```
subscribe(fn) {
```
```
this.#listeners.add(fn);
```
```
return () => this.#listeners.delete(fn);
```
```
}
```
```
}
```
```
export const toast = ToastManager.getInstance();
```
```
// toast.show('Order placed!', 'success'); — from anywhere, same instance
```
1.4 Factory Pattern
// Factory: creates objects without specifying the exact class
// Use for: creating different variants of a component or service
// ── Component Factory ─────────────────────────────────────────────
```
function createInput(type, props) {
```
```
const components = {
```
```
text: TextInput,
```
```
password: PasswordInput,
```
```
otp: OTPInput,
```
```
phone: PhoneInput,
```
```
date: DatePicker,
```
```
};
```
```
const Component = components[type] ?? TextInput;
```
```
return <Component {...props} />;
```
```
}
```
// ── Logger Factory — different environments ─────────────────────
```
function createLogger(env) {
```
```
if (env === 'production') return new RemoteLogger({ endpoint: '/logs' });
```
```
if (env === 'test') return new NoOpLogger();
```
```
return new ConsoleLogger({ verbose: true });
```
```
}
```
```
export const logger = createLogger(process.env.NODE_ENV);
```
1.5 Strategy Pattern
// Strategy: define a family of algorithms, encapsulate each one,
// make them interchangeable. Lets the algorithm vary independently
// from clients that use it.
// ── Sorting strategy for a product list ─────────────────────────
```
const sortStrategies = {
```
```
priceAsc: (a, b) => a.price - b.price,
```
```
priceDesc: (a, b) => b.price - a.price,
```
```
ratingDesc: (a, b) => b.rating - a.rating,
```
```
nameAsc: (a, b) => a.name.localeCompare(b.name),
```
```
newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
```
```
};
```
```
function ProductList({ products, sortBy }) {
```
```
const sorted = [...products].sort(sortStrategies[sortBy] ?? (() => 0));
```
```
return <ul>{sorted.map(p => <ProductCard key={p.id} {...p} />)}</ul>;
```
```
}
```
// ── Validation strategy ──────────────────────────────────────────
```
const validators = {
```
```
required: v => v?.trim() ? null : 'This field is required',
```
```
email: v => /^[^@]+@[^@]+\.[^@]+$/.test(v) ? null : 'Invalid email',
```
```
minLen: n => v => v.length >= n ? null : `Min ${n} characters`,
```
```
maxLen: n => v => v.length <= n ? null : `Max ${n} characters`,
```
```
phone: v => /^[6-9]\d{9}$/.test(v) ? null : 'Invalid phone number',
```
```
};
```
```
function validate(value, rules) {
```
```
for (const rule of rules) {
```
```
const error = rule(value);
```
```
if (error) return error;
```
```
}
```
```
return null;
```
```
}
```
// Usage:
```
validate(email, [validators.required, validators.email]);
```
1.6 Proxy Pattern
// Proxy: intercept operations on an object
// Frontend uses: caching proxy, validation proxy, observable state
// ── Caching proxy for API calls ──────────────────────────────────
```
function createCachedFetcher(ttlMs = 60_000) {
```
```
const cache = new Map();
```
```
return new Proxy({}, {
```
```
get(_, url) {
```
```
return async (options) => {
```
```
const key = url + JSON.stringify(options ?? {});
```
```
const hit = cache.get(key);
```
```
if (hit && Date.now() - hit.ts < ttlMs) return hit.data;
```
```
const data = await fetch(url, options).then(r => r.json());
```
```
cache.set(key, { data, ts: Date.now() });
```
```
return data;
```
```
};
```
```
}
```
```
});
```
```
}
```
// ── Observable state with ES Proxy ──────────────────────────────
```
function observable(target, onChange) {
```
```
return new Proxy(target, {
```
```
set(obj, key, value) {
```
```
const old = obj[key];
```
```
obj[key] = value;
```
```
if (old !== value) onChange(key, value, old);
```
```
return true;
```
```
}
```
```
});
```
```
}
```
```
const state = observable({ count: 0, name: 'Alice' }, (key, val) => {
```
```
console.log(`${key} changed to`, val);
```
```
render(); // trigger re-render
```
```
});
```
1.7 Decorator Pattern
// Decorator: add behaviour to an object dynamically
// In React: HOC is a decorator for components
// ── withAuth HOC ─────────────────────────────────────────────────
```
function withAuth(Component) {
```
```
return function AuthGuard(props) {
```
```
const { user, isLoading } = useAuth();
```
```
if (isLoading) return <Spinner />;
```
```
if (!user) return <Navigate to='/login' replace />;
```
```
return <Component {...props} />;
```
```
};
```
```
}
```
// ── withLogger HOC ────────────────────────────────────────────────
```
function withLogger(Component) {
```
```
return function Logged(props) {
```
```
useEffect(() => {
```
```
telemetry.track('component_mount', { name: Component.displayName });
```
```
return () => telemetry.track('component_unmount', { name: Component.displayName });
```
```
}, []);
```
```
return <Component {...props} />;
```
```
};
```
```
}
```
// ── Function decorator — memoize ──────────────────────────────────
```
function memoize(fn) {
```
```
const cache = new Map();
```
```
return function(...args) {
```
```
const key = JSON.stringify(args);
```
```
if (cache.has(key)) return cache.get(key);
```
```
const result = fn.apply(this, args);
```
```
cache.set(key, result);
```
```
return result;
```
```
};
```
```
}
```
1.8 Facade Pattern
// Facade: simplified interface to a complex subsystem
// Use for: wrapping third-party libraries, complex APIs
// ── Analytics Facade — wraps multiple providers ───────────────────
```
class Analytics {
```
```
track(event, props = {}) {
```
// Internal: call multiple providers with different APIs
```
window.gtag?.('event', event, props);
```
```
window.mixpanel?.track(event, props);
```
```
window.amplitude?.getInstance().logEvent(event, props);
```
```
// Rest of app only calls analytics.track() — never knows about providers
```
```
}
```
```
identify(userId, traits = {}) {
```
```
window.mixpanel?.identify(userId);
```
```
window.mixpanel?.people.set(traits);
```
```
window.amplitude?.getInstance().setUserId(userId);
```
```
}
```
```
}
```
```
export const analytics = new Analytics();
```
```
// Consumer: analytics.track('purchase', { amount: 999 })
```
// Switching providers? Change Analytics class only.
Pattern Problem It Solves Frontend Use Case
Observer One-to-many notification without
tight coupling
React state updates, custom
hooks, DOM events
Pub/Sub Complete decoupling between
producers and consumers
Analytics, cross-tab
communication, micro-frontends
Singleton Single shared instance across
the entire app
Toast manager, analytics, config,
auth store
Factory Create objects without specifying
exact class
Component registries, logger per
environment
Strategy Interchangeable algorithms at
runtime
Sort strategies, validators,
payment providers
Proxy Intercept and control access to
an object
Caching, validation, reactive
state without framework
Decorator Add behaviour to objects without
inheritance
HOC, middleware, function
memoization
Facade Simplified interface to complex
subsystem
Analytics SDKs, storage
abstraction, API clients
Interview Q What is the difference between Observer and Pub/Sub? Give a React use case for
each.
Interview Q When would you use the Strategy pattern in a frontend component? Write an
example.
Section 2 Component Design
Component design is the art of structuring UI into reusable, composable, and maintainable units. Senior
engineers are expected to know multiple composition patterns, when each one applies, and the tradeoffs.
2.1 Atomic Design System
Level What It Is Examples
Atoms Smallest, indivisible UI units. No
internal state.
Button, Input, Badge, Avatar, Icon,
Spinner
Molecules Groups of atoms forming a
simple functional unit.
```
SearchBar (Input + Button),
```
```
FormField (Label + Input +
```
```
ErrorMsg)
```
Organisms Complex UI sections composed
of molecules/atoms.
```
Header (Logo + Nav + SearchBar),
```
```
ProductCard (Image + Title + Price
```
- Button)
Templates Page-level layout without real
content — slot-based
wireframes.
DashboardLayout,
CheckoutLayout, ArticleLayout
Pages Templates with real data filled in.
What the user sees.
HomePage, CheckoutPage,
ProductDetailPage
2.2 Compound Component Pattern
```
Compound components share implicit state through React context. The parent manages state; children are
```
'slots' that can access that state without props. Used by React libraries like Radix UI, Headless UI, and reach-
router.
// ── Compound Accordion ────────────────────────────────────────────
```
const AccordionContext = createContext(null);
```
```
function Accordion({ children, defaultOpen = null }) {
```
```
const [open, setOpen] = useState(defaultOpen);
```
```
return (
```
```
<AccordionContext.Provider value={{ open, setOpen }}>
```
```
<div className='accordion'>{children}</div>
```
</AccordionContext.Provider>
```
);
```
```
}
```
```
function AccordionItem({ id, children }) {
```
```
return <div className='accordion-item'>{children}</div>;
```
```
}
```
```
function AccordionHeader({ id, children }) {
```
```
const { open, setOpen } = useContext(AccordionContext);
```
```
const isOpen = open === id;
```
```
return (
```
<button
```
aria-expanded={isOpen}
```
```
aria-controls={`panel-${id}`}
```
```
onClick={() => setOpen(isOpen ? null : id)}
```
>
```
{children}
```
```
<span aria-hidden='true'>{isOpen ? '-' : '+'}</span>
```
</button>
```
);
```
```
}
```
```
function AccordionPanel({ id, children }) {
```
```
const { open } = useContext(AccordionContext);
```
```
return (
```
```
<div id={`panel-${id}`} role='region'
```
```
aria-labelledby={`header-${id}`}
```
```
hidden={open !== id}>
```
```
{children}
```
</div>
```
);
```
```
}
```
```
// Attach as static properties (Radix UI style)
```
```
Accordion.Item = AccordionItem;
```
```
Accordion.Header = AccordionHeader;
```
```
Accordion.Panel = AccordionPanel;
```
// Usage — expressive, no prop drilling
<Accordion defaultOpen='shipping'>
<Accordion.Item id='shipping'>
<Accordion.Header id='shipping'>Shipping</Accordion.Header>
<Accordion.Panel id='shipping'>Free on orders above 499</Accordion.Panel>
</Accordion.Item>
</Accordion>
2.3 Render Props Pattern
// Render Props: share stateful logic by passing a render function as a prop
// Children-as-function or a 'render' prop
```
function MouseTracker({ children }) {
```
```
const [pos, setPos] = useState({ x: 0, y: 0 });
```
```
return (
```
```
<div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}
```
```
style={{ height: '100vh' }}>
```
```
{children(pos)}
```
</div>
```
);
```
```
}
```
// Usage
<MouseTracker>
```
{({ x, y }) => <div>Mouse is at {x}, {y}</div>}
```
</MouseTracker>
```
// Modern equivalent: custom hook (preferred in React 16.8+)
```
```
function useMousePosition() {
```
```
const [pos, setPos] = useState({ x: 0, y: 0 });
```
```
useEffect(() => {
```
```
const h = e => setPos({ x: e.clientX, y: e.clientY });
```
```
window.addEventListener('mousemove', h);
```
```
return () => window.removeEventListener('mousemove', h);
```
```
}, []);
```
```
return pos;
```
```
}
```
// Note: Render Props are still valid for component-level isolation
```
// (e.g., when the consumer needs to control JSX structure)
```
2.4 Controlled vs Uncontrolled Components
Dimension Controlled Uncontrolled
```
State owner React state (parent controls
```
```
value + onChange)
```
```
DOM owns state (ref to read
```
```
value on demand)
```
When to use Form validation, real-time
preview, conditional logic
Simple forms, integrating third-
party DOM libraries
Pros Predictable, easy to validate,
testable
Simple code, no re-render on
every keystroke
Cons Re-render on every keystroke
```
(mitigated with useTransition)
```
Harder to validate in real time,
less React-idiomatic
```
Example <input value={state}
```
```
onChange={setState} />
```
```
<input ref={inputRef}
```
```
defaultValue='initial' />
```
Interview Q What is the compound component pattern? Implement an Accordion using it.
Interview Q When would you choose a custom hook over a render prop? Are render props
obsolete?
Interview Q Explain the difference between controlled and uncontrolled components. When is
uncontrolled preferable?
Section 3 State Management
3.1 State Classification — Choosing the Right Tool
State Type Definition Best Tool Never Use
Local UI state Belongs to one
component. No other
component needs it.
useState / useReducer Redux — massive
overkill
Shared UI state Two+ sibling or cousin
components need the
same state.
Lift to common parent
or useContext
Redux for simple
sharing
Server state Data fetched from an
API. Has loading, error,
stale, fresh states.
```
React Query / SWR useState+useEffect (no
```
```
cache invalidation)
```
Global app state Auth, theme, user prefs,
feature flags — truly
global, rarely changes.
Zustand / Redux Toolkit
/ Context
useState scattered
across app
URL state State that should be
shareable via URL
```
(filters, search, page).
```
URL params +
useSearchParams
```
useState (breaks back
```
```
button, sharing)
```
Form state Form fields, validation,
submission status.
React Hook Form /
Formik
```
Redux (forms are
```
```
temporary, not global)
```
3.2 When to Reach for Redux Toolkit
// Use Redux Toolkit when:
// 1. Multiple unrelated components need the same state
```
// 2. State transitions are complex (many actions, many reducers)
```
```
// 3. You need time-travel debugging (Redux DevTools)
```
// 4. Team > 5 engineers — enforced patterns prevent chaos
// ── Redux Toolkit slice ────────────────────────────────────────
```
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
```
```
export const fetchCart = createAsyncThunk('cart/fetch',
```
```
async (userId) => {
```
```
const res = await fetch(`/api/cart/${userId}`);
```
```
return res.json();
```
```
}
```
```
);
```
```
const cartSlice = createSlice({
```
```
name: 'cart',
```
```
initialState: { items: [], status: 'idle', error: null },
```
```
reducers: {
```
```
addItem: (state, action) => { state.items.push(action.payload); },
```
```
removeItem: (state, action) => {
```
```
state.items = state.items.filter(i => i.id !== action.payload);
```
```
},
```
```
clearCart: (state) => { state.items = []; },
```
```
},
```
```
extraReducers: builder => builder
```
```
.addCase(fetchCart.pending, s => { s.status = 'loading'; })
```
```
.addCase(fetchCart.fulfilled, (s, a) => { s.status='idle'; s.items=a.payload; })
```
```
.addCase(fetchCart.rejected, (s, a) => { s.status='failed'; s.error=a.error.message;
```
```
}),
```
```
});
```
```
export const { addItem, removeItem, clearCart } = cartSlice.actions;
```
3.3 Zustand — Lightweight Global State
// Use Zustand when: you need global state, Redux is too heavy,
// you want minimal boilerplate, team is small.
```
import { create } from 'zustand';
```
```
import { persist } from 'zustand/middleware';
```
```
const useAuthStore = create(
```
```
persist(
```
```
(set, get) => ({
```
```
user: null,
```
```
token: null,
```
```
isLoading: false,
```
```
login: async (credentials) => {
```
```
set({ isLoading: true });
```
```
try {
```
```
const { user, token } = await authApi.login(credentials);
```
```
set({ user, token, isLoading: false });
```
```
} catch (err) {
```
```
set({ isLoading: false });
```
```
throw err;
```
```
}
```
```
},
```
```
logout: () => set({ user: null, token: null }),
```
```
isAuthenticated: () => !!get().token,
```
```
}),
```
```
{ name: 'auth-storage', partialize: s => ({ token: s.token }) }
```
// Only persist token to localStorage, not the full user object
```
)
```
```
);
```
// Subscribe to ONLY the slice you need — prevents unnecessary re-renders
```
const user = useAuthStore(state => state.user); // re-renders when user changes
```
```
const login = useAuthStore(state => state.login); // stable reference — no re-renders
```
3.4 React Query — Server State Done Right
// React Query manages: fetching, caching, background refetching,
// pagination, mutations with optimistic updates.
// ── Query ─────────────────────────────────────────────────────
```
function ProductDetail({ id }) {
```
```
const { data, isLoading, error, refetch } = useQuery({
```
```
queryKey: ['product', id], // cache key — change id, refetch
```
```
queryFn: () => fetchProduct(id),
```
```
staleTime: 5 * 60 * 1000, // 5 min — don't refetch if fresh
```
```
gcTime: 30 * 60 * 1000, // keep in cache 30 min after unmount
```
```
retry: 2, // retry failed requests twice
```
```
enabled: !!id, // don't run if id is falsy
```
```
});
```
```
if (isLoading) return <Skeleton />;
```
```
if (error) return <ErrorBanner onRetry={refetch} />;
```
```
return <Product data={data} />;
```
```
}
```
// ── Mutation with optimistic update ────────────────────────────
```
function LikeButton({ postId, liked }) {
```
```
const queryClient = useQueryClient();
```
```
const { mutate } = useMutation({
```
```
mutationFn: () => api.toggleLike(postId),
```
```
onMutate: async () => {
```
```
await queryClient.cancelQueries({ queryKey: ['post', postId] });
```
```
const prev = queryClient.getQueryData(['post', postId]);
```
// Optimistically toggle liked state
```
queryClient.setQueryData(['post', postId], old => ({
```
...old, liked: !old.liked,
```
likeCount: old.liked ? old.likeCount - 1 : old.likeCount + 1
```
```
}));
```
```
return { prev };
```
```
},
```
```
onError: (err, _, ctx) => {
```
```
queryClient.setQueryData(['post', postId], ctx.prev); // rollback
```
```
},
```
```
onSettled: () => {
```
```
queryClient.invalidateQueries({ queryKey: ['post', postId] });
```
```
}
```
```
});
```
```
return <button onClick={() => mutate()}>{liked ? 'Unlike' : 'Like'}</button>;
```
```
}
```
Interview Q What is the difference between server state and client state? Why does mixing
them in Redux cause problems?
```
Interview Q How does React Query's staleTime differ from gcTime (cacheTime)? How would
```
you set these for a product listing page?
Interview Q Implement an optimistic update for adding a comment to a post using React Query.
Section 4 Routing
4.1 Client-Side Routing Internals
```
// How React Router (and all SPA routers) work:
```
```
// 1. Browser URL changes (pushState / replaceState)
```
```
history.pushState({}, '', '/products/42');
```
// Does NOT cause a server request — just updates the URL bar
```
// 2. Router listens to popstate events (back/forward button)
```
```
window.addEventListener('popstate', () => updateActiveRoute(location.pathname));
```
// 3. Router matches URL to route config, renders matching component
// Pattern matching is usually done with path-to-regexp
// ── React Router v6 — nested routes ─────────────────────────────
```
const router = createBrowserRouter([
```
```
{
```
```
path: '/',
```
```
element: <AppLayout />,
```
```
errorElement: <ErrorPage />,
```
```
children: [
```
```
{ index: true, element: <Home /> },
```
```
{
```
```
path: 'products',
```
```
element: <ProductsLayout />,
```
```
loader: productsLoader, // data loading before render
```
```
children: [
```
```
{ index: true, element: <ProductList /> },
```
```
{ path: ':id', element: <ProductDetail />,
```
```
loader: ({ params }) => fetchProduct(params.id) },
```
]
```
},
```
```
{ path: 'account', element: <AuthGuard><Account /></AuthGuard> },
```
]
```
}
```
```
]);
```
4.2 Code Splitting with React.lazy and Suspense
// Code splitting: load route JS only when that route is first visited.
// Reduces initial bundle. Critical for LCP.
```
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
```
```
const Checkout = lazy(() => import('./pages/Checkout'));
```
```
const Account = lazy(() => import('./pages/Account'));
```
```
function AppRoutes() {
```
```
return (
```
```
<Suspense fallback={<PageSkeleton />}>
```
<Routes>
```
<Route path='/' element={<Home />} />
```
```
<Route path='/products/:id' element={<ProductDetail />} />
```
```
<Route path='/checkout' element={<Checkout />} />
```
```
<Route path='/account' element={<Account />} />
```
</Routes>
</Suspense>
```
);
```
```
}
```
```
// Handle ChunkLoadError (deploy → old chunk URLs broken)
```
```
const ProductDetail = lazy(() =>
```
```
import('./pages/ProductDetail').catch(err => {
```
```
if (err.name === 'ChunkLoadError') window.location.reload();
```
```
throw err;
```
```
})
```
```
);
```
4.3 Route Guards — Authentication and Authorization
// ── AuthGuard — redirect unauthenticated users ────────────────
```
function AuthGuard({ children, redirectTo = '/login' }) {
```
```
const { user, isLoading } = useAuthStore();
```
```
const location = useLocation();
```
```
if (isLoading) return <FullPageSpinner />;
```
```
if (!user) {
```
// Save intended destination for post-login redirect
```
return <Navigate to={redirectTo} state={{ from: location }} replace />;
```
```
}
```
```
return children;
```
```
}
```
// ── RoleGuard — role-based access control ─────────────────────
```
function RoleGuard({ children, roles, fallback = <Forbidden /> }) {
```
```
const user = useAuthStore(s => s.user);
```
```
const hasRole = roles.some(r => user?.roles?.includes(r));
```
```
return hasRole ? children : fallback;
```
```
}
```
// Usage
<AuthGuard>
```
<RoleGuard roles={['admin', 'manager']}>
```
<AdminDashboard />
</RoleGuard>
</AuthGuard>
// ── Post-login redirect ───────────────────────────────────────
```
function Login() {
```
```
const location = useLocation();
```
```
const navigate = useNavigate();
```
```
async function handleLogin(credentials) {
```
```
await authStore.login(credentials);
```
```
const destination = location.state?.from?.pathname ?? '/';
```
```
navigate(destination, { replace: true });
```
```
}
```
```
}
```
Interview Q How does client-side routing differ from server-side routing? What happens when a
user refreshes the page on a React SPA?
Interview Q How do you implement a route guard that redirects unauthenticated users to login
and then back to the originally-requested page after login?
Section 5 SOLID Principles in React
SOLID is a set of five design principles for object-oriented software. They apply directly to React component
architecture — senior engineers are expected to name, explain, and demonstrate each with React code.
5.1 S — Single Responsibility Principle
A component should have one, and only one, reason to change. If your component fetches data, transforms it,
renders it, AND handles user interactions — it has four reasons to change. Split it.
// ❌ VIOLATES SRP — one component does everything
```
function UserProfile() {
```
```
const [user, setUser] = useState(null);
```
```
const [editing, setEditing] = useState(false);
```
```
useEffect(() => fetch('/api/user').then(r=>r.json()).then(setUser), []);
```
```
function handleSave(data) { /* PUT to API + update state + show toast */ }
```
```
const fullName = `${user?.firstName} ${user?.lastName}`.trim();
```
```
const avatar = user?.avatar ?? generateAvatar(user?.name);
```
```
return ( /* render form or view mode */ );
```
```
}
```
// ✅ RESPECTS SRP — each piece has one job
```
function useUserProfile() { // data fetching + server sync
```
```
const { data: user, mutate } = useSWR('/api/user', fetcher);
```
```
const save = async (data) => { await api.put('/api/user', data); mutate(); };
```
```
return { user, save };
```
```
}
```
```
function formatUserDisplay(user) { // pure transformation — testable
```
```
return {
```
```
fullName: `${user.firstName} ${user.lastName}`.trim(),
```
```
avatar: user.avatar ?? generateAvatar(user.name),
```
```
};
```
```
}
```
```
function UserProfileView({ user }) { /* rendering only */ }
```
```
function UserProfileForm({ user, onSave }) { /* edit form only */ }
```
```
function UserProfile() { // orchestration only
```
```
const { user, save } = useUserProfile();
```
```
const [editing, setEditing] = useState(false);
```
```
const display = user ? formatUserDisplay(user) : null;
```
return editing
```
? <UserProfileForm user={user} onSave={async d => { await save(d); setEditing(false); }}
```
/>
```
: <UserProfileView user={display} onEdit={() => setEditing(true)} />;
```
```
}
```
5.2 O — Open/Closed Principle
Components should be open for extension but closed for modification. Add functionality through composition,
not by modifying existing components.
// ❌ VIOLATES OCP — modify Button for every new variant
```
function Button({ children, variant }) {
```
```
if (variant === 'primary') return <button className='btn-primary'>{children}</button>;
```
```
if (variant === 'danger') return <button className='btn-danger'>{children}</button>;
```
```
if (variant === 'icon') return <button className='btn-icon'>{children}</button>;
```
// Every new variant requires modifying this file
```
}
```
// ✅ RESPECTS OCP — extend without modifying
```
function Button({ children, className = '', ...props }) {
```
```
return <button className={`btn ${className}`} {...props}>{children}</button>;
```
```
}
```
// Extensions — new files, no modification to Button
```
const PrimaryButton = (props) => <Button className='btn-primary' {...props} />;
```
```
const DangerButton = (props) => <Button className='btn-danger' {...props} />;
```
```
const IconButton = ({ icon, label, ...props }) => (
```
```
<Button className='btn-icon' aria-label={label} {...props}>
```
```
<span aria-hidden='true'>{icon}</span>
```
</Button>
```
);
```
5.3 L — Liskov Substitution Principle
Derived components should be substitutable for their base components without breaking the application. A
component that accepts button props must pass all those props to the underlying button — not swallow them.
// ❌ VIOLATES LSP — doesn't pass through standard button props
```
function StyledButton({ children, onClick }) {
```
```
return <button className='btn' onClick={onClick}>{children}</button>;
```
// Can't set disabled, type, aria-*, data-*, name, etc.
```
}
```
// ✅ RESPECTS LSP — spreads all button props through
```
function StyledButton({ children, className = '', ...props }) {
```
```
return (
```
```
<button className={`btn ${className}`} {...props}>
```
```
{children}
```
</button>
```
);
```
```
}
```
// Now: <StyledButton disabled> works
// <StyledButton type='submit'> works
// <StyledButton aria-label='Close'> works
// It substitutes for a native <button> without breaking callers.
5.4 I — Interface Segregation Principle
Clients should not be forced to depend on interfaces they do not use. In React: don't pass props a component
doesn't need. Split large interfaces into focused ones.
// ❌ VIOLATES ISP — ProductCard receives the entire product object
// but only uses 3 fields. Changes to product schema can break the component.
```
function ProductCard({ product }) {
```
```
return (
```
<div>
```
<img src={product.image} alt={product.name} />
```
```
<h3>{product.name}</h3>
```
```
<span>{product.price}</span>
```
// product.inventory, product.sellerId, product.warehouse... not used
</div>
```
);
```
```
}
```
// ✅ RESPECTS ISP — explicit, minimal props interface
```
function ProductCard({ name, image, price, onAddToCart }) {
```
```
return (
```
<div>
```
<img src={image} alt={name} />
```
```
<h3>{name}</h3>
```
```
<span>{price}</span>
```
```
<button onClick={onAddToCart}>Add to Cart</button>
```
</div>
```
);
```
```
}
```
// Parent extracts only what the component needs
<ProductCard
```
name={product.name}
```
```
image={product.image}
```
```
price={formatPrice(product.price, product.currency)}
```
```
onAddToCart={() => cartStore.add(product.id)}
```
/>
5.5 D — Dependency Inversion Principle
High-level modules should not depend on low-level modules. Both should depend on abstractions. In React:
```
depend on interfaces (props, callbacks), not concrete implementations.
```
// ❌ VIOLATES DIP — tightly coupled to fetch and a specific endpoint
```
function UserList() {
```
```
const [users, setUsers] = useState([]);
```
```
useEffect(() => {
```
```
fetch('/api/users').then(r => r.json()).then(setUsers);
```
```
}, []);
```
```
return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
```
```
}
```
// Cannot test without a real server.
// Cannot reuse with different data sources.
```
// ✅ RESPECTS DIP — depends on abstraction (prop), not implementation
```
```
function UserList({ users, isLoading, onRefresh }) {
```
```
if (isLoading) return <Skeleton />;
```
```
return (
```
<ul>
```
{users.map(u => <li key={u.id}>{u.name}</li>)}
```
```
<button onClick={onRefresh}>Refresh</button>
```
</ul>
```
);
```
```
}
```
```
// The data-fetching concern is in the custom hook (low-level module)
```
```
function useUsers() {
```
```
const { data: users=[], isLoading, refetch } = useQuery({
```
```
queryKey: ['users'], queryFn: fetchUsers
```
```
});
```
```
return { users, isLoading, refetch };
```
```
}
```
```
// The page composes them (high-level module)
```
```
function UsersPage() {
```
```
const { users, isLoading, refetch } = useUsers();
```
```
return <UserList users={users} isLoading={isLoading} onRefresh={refetch} />;
```
```
}
```
// Testing: inject mock data directly — no fetch mocking needed
```
render(<UserList users={mockUsers} isLoading={false} onRefresh={jest.fn()} />);
```
Interview Q Explain the SOLID principles as they apply to React. Give a code example for
each.
Interview Q How does the Dependency Inversion Principle improve testability of React
components?
LLD 1 Infinite Scroll
Infinite scroll is a UI pattern where content loads automatically as the user approaches the bottom of the list. The
production implementation involves three components: a mechanism to detect when to load more, an API that
supports cursor/offset pagination, and virtual DOM windowing to prevent memory growth from holding
thousands of DOM nodes.
Clarifying Questions to Ask First
• Cursor-based or offset-based pagination from the API?
```
• Expected list size — hundreds (simple IO) or tens of thousands (needs virtualization)?
```
• Should scroll position be preserved on browser back?
• Mobile support — touch scroll, pull-to-refresh?
• Accessibility — how do screen reader users navigate to end of list?
Complete Implementation — Intersection Observer + Cursor Pagination
// ── useInfiniteScroll hook ────────────────────────────────────────
```
function useInfiniteScroll({ queryKey, queryFn, pageSize = 20 }) {
```
```
const {
```
data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error
```
} = useInfiniteQuery({
```
queryKey,
```
queryFn: ({ pageParam }) => queryFn({ cursor: pageParam, limit: pageSize }),
```
```
initialPageParam: null,
```
```
getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
```
// undefined = no more pages
```
});
```
// Flatten pages to a single array
```
const items = useMemo(
```
```
() => data?.pages.flatMap(p => p.items) ?? [],
```
[data]
```
);
```
// Intersection Observer — fires when sentinel enters viewport
```
const sentinelRef = useRef(null);
```
```
useEffect(() => {
```
```
const el = sentinelRef.current;
```
```
if (!el) return;
```
```
const observer = new IntersectionObserver(
```
```
([entry]) => { if (entry.isIntersecting && hasNextPage) fetchNextPage(); },
```
```
{ rootMargin: '200px' } // start loading 200px before bottom
```
```
);
```
```
observer.observe(el);
```
```
return () => observer.disconnect();
```
```
}, [hasNextPage, fetchNextPage]);
```
```
return { items, sentinelRef, isFetchingNextPage, isLoading, error, hasNextPage };
```
```
}
```
// ── ProductFeed component ─────────────────────────────────────────
```
function ProductFeed() {
```
```
const { items, sentinelRef, isFetchingNextPage, isLoading, error, hasNextPage }
```
```
= useInfiniteScroll({
```
```
queryKey: ['products'],
```
```
queryFn: ({ cursor, limit }) => api.getProducts({ cursor, limit }),
```
```
pageSize: 20,
```
```
});
```
```
if (isLoading) return <ProductGridSkeleton count={8} />;
```
```
if (error) return <ErrorBanner message={error.message} />;
```
```
return (
```
<>
<ul className='product-grid' aria-label='Products'>
```
{items.map(p => <ProductCard key={p.id} product={p} />)}
```
</ul>
```
{/* Sentinel: IO watches this element */}
```
```
<div ref={sentinelRef} aria-hidden='true' />
```
```
{isFetchingNextPage && <ProductGridSkeleton count={4} />}
```
```
{!hasNextPage && items.length > 0 && (
```
<p className='end-message' role='status'>
```
All {items.length} products loaded
```
</p>
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
Virtualization — react-window for Large Lists
// When list has 10,000+ items, render only visible rows in the DOM
```
import { FixedSizeList } from 'react-window';
```
```
import AutoSizer from 'react-virtualized-auto-sizer';
```
```
function VirtualProductList({ items, onLoadMore }) {
```
```
const ITEM_HEIGHT = 120; // px
```
```
function Row({ index, style }) {
```
```
const item = items[index];
```
// Trigger load more when near end
```
if (index === items.length - 5 && onLoadMore) onLoadMore();
```
```
return (
```
```
<div style={style}> {/* style from react-window is position:absolute */}
```
```
<ProductCard product={item} />
```
</div>
```
);
```
```
}
```
```
return (
```
<AutoSizer>
```
{({ height, width }) => (
```
<FixedSizeList
```
height={height}
```
```
width={width}
```
```
itemCount={items.length}
```
```
itemSize={ITEM_HEIGHT}
```
```
overscanCount={5} // render 5 extra rows beyond viewport
```
>
```
{Row}
```
</FixedSizeList>
```
)}
```
</AutoSizer>
```
);
```
```
}
```
AVOID Never use scroll event listeners for infinite scroll detection in production. They fire
hundreds of times per second and force layout recalculation. Intersection Observer
is non-blocking and fires only when the element crosses the viewport threshold.
Interview Q Implement infinite scroll without using any library. Explain why Intersection
Observer is better than a scroll event listener.
Interview Q When would you add virtualization to an infinite scroll list? What library would you
use and how does it work?
LLD 2 Nested Comments
Nested comments are a tree data structure problem. The API typically returns a flat array. You must: build the
tree client-side, render it recursively, support collapse/expand, handle threading depth limits, and lazy-load deep
replies.
Data Model and Tree Construction
// API returns flat array — comments with parentId references
```
// [{ id: '1', parentId: null, text: '...' },
```
```
// { id: '2', parentId: '1', text: '...' },
```
```
// { id: '3', parentId: '1', text: '...' },
```
```
// { id: '4', parentId: '2', text: '...' }]
```
```
// ── O(n) tree construction ────────────────────────────────────────
```
```
function buildCommentTree(comments) {
```
```
const map = new Map(); // id → node
```
```
const roots = []; // top-level comments
```
// First pass: create all nodes
```
for (const c of comments) {
```
```
map.set(c.id, { ...c, children: [] });
```
```
}
```
// Second pass: link children to parents
```
for (const c of comments) {
```
```
const node = map.get(c.id);
```
```
if (c.parentId && map.has(c.parentId)) {
```
```
map.get(c.parentId).children.push(node);
```
```
} else {
```
```
roots.push(node);
```
```
}
```
```
}
```
```
return roots;
```
```
}
```
```
// ── Flatten tree back to array (for API submission) ────────────────
```
```
function flattenTree(nodes, result = []) {
```
```
for (const node of nodes) {
```
```
result.push(node);
```
```
if (node.children?.length) flattenTree(node.children, result);
```
```
}
```
```
return result;
```
```
}
```
Recursive Comment Component
```
const MAX_DEPTH = 5; // Cap visual nesting to prevent horizontal overflow
```
```
function Comment({ comment, depth = 0, onReply, onVote }) {
```
```
const [collapsed, setCollapsed] = useState(false);
```
```
const [showReplyForm, setShowReplyForm] = useState(false);
```
```
const indentPx = Math.min(depth, MAX_DEPTH) * 24;
```
```
return (
```
<article
```
style={{ marginLeft: indentPx }}
```
```
aria-label={`Comment by ${comment.author}`}
```
>
<header className='comment-header'>
```
<strong>{comment.author}</strong>
```
```
<time dateTime={comment.createdAt}>
```
```
{formatRelativeTime(comment.createdAt)}
```
</time>
```
{comment.children?.length > 0 && (
```
<button
```
onClick={() => setCollapsed(c => !c)}
```
```
aria-expanded={!collapsed}
```
```
aria-controls={`replies-${comment.id}`}
```
>
```
{collapsed
```
```
? `Show ${comment.children.length} replies`
```
```
: 'Collapse'}
```
</button>
```
)}
```
</header>
```
<p>{comment.text}</p>
```
<div className='comment-actions'>
```
<button onClick={() => onVote(comment.id, 'up')}>
```
```
{comment.upvotes} upvotes
```
</button>
```
<button onClick={() => setShowReplyForm(r => !r)}>Reply</button>
```
</div>
```
{showReplyForm && (
```
<ReplyForm
```
onSubmit={(text) => {
```
```
onReply(comment.id, text);
```
```
setShowReplyForm(false);
```
```
}}
```
```
onCancel={() => setShowReplyForm(false)}
```
/>
```
)}
```
```
{/* Recursive children */}
```
```
{!collapsed && comment.children?.length > 0 && (
```
```
<div id={`replies-${comment.id}`} role='list'>
```
```
{comment.children.map(child => (
```
<Comment
```
key={child.id}
```
```
comment={child}
```
```
depth={depth + 1}
```
```
onReply={onReply}
```
```
onVote={onVote}
```
/>
```
))}
```
</div>
```
)}
```
</article>
```
);
```
```
}
```
Interview Q How do you convert a flat array of comments with parentId into a tree structure?
What is the time complexity?
Interview Q A comment thread has 100,000 comments. How do you handle performance?
What is the lazy-load strategy?
LLD 3 Pagination
Offset vs Cursor Pagination
Dimension Offset / Page-based Cursor-based
API query GET /items?page=3&limit=20 GET /items?cursor=abc123&limit=20
```
User experience Can jump to page N directly Sequential only (next/prev)
```
Stability New inserts shift page
```
boundaries (page drift)
```
Stable — cursor anchors to a specific
item
Performance OFFSET N scans and
discards N rows in DB
```
Cursor uses indexed seek — O(1)
```
lookup
Use case Static datasets, admin tables,
search results
Feeds, real-time content, large
datasets
Complete Accessible Pagination Component
```
// ── URL-driven pagination (shareable, bookmark-able) ─────────────
```
```
function usePaginationUrl() {
```
```
const [searchParams, setSearchParams] = useSearchParams();
```
```
const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
```
```
const goTo = useCallback((p) => {
```
```
setSearchParams(prev => { prev.set('page', String(p)); return prev; },
```
```
{ replace: false }); // pushState — back button works
```
```
}, [setSearchParams]);
```
```
return { page, goTo };
```
```
}
```
// ── Pagination UI component ────────────────────────────────────
```
function Pagination({ currentPage, totalPages, onPageChange }) {
```
```
// Show: [1] ... [4] [5] [6] ... [20] (window of 5 around current)
```
```
const pages = useMemo(() => {
```
```
const delta = 2; // pages on each side of current
```
```
const range = [];
```
```
for (let i = Math.max(1, currentPage - delta);
```
```
i <= Math.min(totalPages, currentPage + delta); i++) {
```
```
range.push(i);
```
```
}
```
```
if (range[0] > 2) range.unshift('...');
```
```
if (range[0] > 1) range.unshift(1);
```
```
if (range[range.length-1] < totalPages - 1) range.push('...');
```
```
if (range[range.length-1] < totalPages) range.push(totalPages);
```
```
return range;
```
```
}, [currentPage, totalPages]);
```
```
return (
```
<nav aria-label='Pagination'>
<button
```
onClick={() => onPageChange(currentPage - 1)}
```
```
disabled={currentPage === 1}
```
aria-label='Previous page'
>
Previous
</button>
```
{pages.map((p, i) =>
```
```
p === '...'
```
```
? <span key={`ellipsis-${i}`} aria-hidden='true'>...</span>
```
: <button
```
key={p}
```
```
onClick={() => onPageChange(p)}
```
```
aria-current={p === currentPage ? 'page' : undefined}
```
```
aria-label={`Page ${p}`}
```
>
```
{p}
```
</button>
```
)}
```
<button
```
onClick={() => onPageChange(currentPage + 1)}
```
```
disabled={currentPage === totalPages}
```
aria-label='Next page'
>
Next
</button>
</nav>
```
);
```
```
}
```
Interview Q What is cursor-based pagination? Why is it more performant than offset pagination
for large datasets?
Interview Q How do you make pagination state shareable via URL? What WCAG requirements
apply to a pagination component?
LLD 4 Image Carousel
Complete Production Carousel
```
function Carousel({ images, autoPlayInterval = 4000 }) {
```
```
const [current, setCurrent] = useState(0);
```
```
const [paused, setPaused] = useState(false);
```
```
const [isReducedMotion] = useMediaQuery('(prefers-reduced-motion: reduce)');
```
```
const timerRef = useRef(null);
```
```
const trackRef = useRef(null);
```
```
const touchStartX = useRef(null);
```
```
const total = images.length;
```
```
const go = useCallback((index) => {
```
```
setCurrent((index + total) % total);
```
```
}, [total]);
```
// ── Auto-play ─────────────────────────────────────────────────
```
useEffect(() => {
```
```
if (paused || isReducedMotion || total <= 1) return;
```
```
timerRef.current = setInterval(() => go(current + 1), autoPlayInterval);
```
```
return () => clearInterval(timerRef.current);
```
```
}, [current, paused, isReducedMotion, go, autoPlayInterval, total]);
```
// ── Keyboard navigation ───────────────────────────────────────
```
function handleKeyDown(e) {
```
```
if (e.key === 'ArrowLeft') { go(current - 1); }
```
```
if (e.key === 'ArrowRight') { go(current + 1); }
```
```
if (e.key === 'Home') { go(0); }
```
```
if (e.key === 'End') { go(total - 1); }
```
```
}
```
// ── Touch / swipe ────────────────────────────────────────────
```
function onTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
```
```
function onTouchEnd(e) {
```
```
const delta = touchStartX.current - e.changedTouches[0].clientX;
```
```
if (Math.abs(delta) > 50) go(current + (delta > 0 ? 1 : -1));
```
```
touchStartX.current = null;
```
```
}
```
```
return (
```
<section
aria-label='Product images'
aria-roledescription='carousel'
```
onMouseEnter={() => setPaused(true)}
```
```
onMouseLeave={() => setPaused(false)}
```
```
onFocus={() => setPaused(true)}
```
```
onBlur={() => setPaused(false)}
```
>
<div
```
ref={trackRef}
```
```
onKeyDown={handleKeyDown}
```
```
onTouchStart={onTouchStart}
```
```
onTouchEnd={onTouchEnd}
```
```
tabIndex={0}
```
```
aria-label={`Image ${current + 1} of ${total}: ${images[current].alt}`}
```
>
```
{images.map((img, i) => (
```
<img
```
key={img.id}
```
```
src={img.src}
```
```
alt={img.alt}
```
```
loading={i === 0 ? 'eager' : 'lazy'} // only first image eager
```
```
aria-hidden={i !== current}
```
```
style={{ display: i === current ? 'block' : 'none' }}
```
/>
```
))}
```
</div>
```
{/* Dot indicators — roving tabindex */}
```
<div role='tablist' aria-label='Select slide'>
```
{images.map((_, i) => (
```
<button
```
key={i}
```
```
role='tab'
```
```
aria-selected={i === current}
```
```
aria-label={`Slide ${i + 1}`}
```
```
tabIndex={i === current ? 0 : -1}
```
```
onClick={() => go(i)}
```
/>
```
))}
```
</div>
```
<button onClick={() => go(current - 1)} aria-label='Previous image'>Prev</button>
```
```
<button onClick={() => go(current + 1)} aria-label='Next image'>Next</button>
```
</section>
```
);
```
```
}
```
Interview Q Design a production-ready image carousel. What WCAG requirements apply? How
do you handle auto-play accessibly?
Interview Q How do you implement swipe gestures on a carousel without a library? What touch
events do you use?
LLD 5 Live Streaming Chat UI
```
A live chat component for a streaming platform (YouTube Live, Twitch-style) must handle: high-velocity
```
```
message streams (hundreds per second during popular streams), WebSocket reconnection, message
```
virtualization, pinned messages, reactions/emotes, and moderation actions.
Architecture Decisions
Decision Choice Why
```
Transport WebSocket (native or Socket.io) True bidirectional push. SSE is
```
unidirectional. Polling too slow
for chat.
```
Message rendering Virtualized list (react-window) Hundreds of messages visible
```
```
simultaneously; full DOM render
```
→ jank
Message buffer Client-side queue with rate
limiting
Prevent DOM thrash from 50
messages/second. Batch
updates.
Scroll behaviour Auto-scroll to bottom, pause on
scroll up
Like YouTube Live — user can
```
scroll up to read history;
```
resumes when at bottom
```
Reconnection Exponential backoff (1s, 2s, 4s,
```
```
8s, max 30s)
```
```
Handles intermittent network;
```
don't hammer server on
disconnect
Complete Chat Component
```
function LiveChat({ streamId }) {
```
```
const [messages, setMessages] = useState([]);
```
```
const [inputText, setInputText] = useState('');
```
```
const [isConnected, setIsConnected] = useState(false);
```
```
const [atBottom, setAtBottom] = useState(true);
```
```
const wsRef = useRef(null);
```
```
const messageBuffer = useRef([]);
```
```
const listRef = useRef(null);
```
```
const MAX_MESSAGES = 500; // cap DOM nodes
```
// ── WebSocket connection with exponential backoff ─────────────
```
useEffect(() => {
```
```
let retryDelay = 1000;
```
```
let timeoutId;
```
```
function connect() {
```
```
const ws = new WebSocket(`wss://chat.myapp.com/stream/${streamId}`);
```
```
wsRef.current = ws;
```
```
ws.onopen = () => { setIsConnected(true); retryDelay = 1000; };
```
```
ws.onclose = () => {
```
```
setIsConnected(false);
```
```
timeoutId = setTimeout(() => {
```
```
retryDelay = Math.min(retryDelay * 2, 30_000);
```
```
connect();
```
```
}, retryDelay);
```
```
};
```
```
ws.onmessage = (e) => {
```
```
const msg = JSON.parse(e.data);
```
```
messageBuffer.current.push(msg);
```
```
};
```
```
ws.onerror = (err) => console.error('[Chat WS]', err);
```
```
}
```
```
connect();
```
```
return () => { clearTimeout(timeoutId); wsRef.current?.close(); };
```
```
}, [streamId]);
```
// ── Batch flush — drain buffer at 30fps ───────────────────────
```
useEffect(() => {
```
```
const id = setInterval(() => {
```
```
if (messageBuffer.current.length === 0) return;
```
```
const batch = messageBuffer.current.splice(0);
```
```
setMessages(prev => {
```
```
const next = [...prev, ...batch];
```
return next.length > MAX_MESSAGES
```
? next.slice(next.length - MAX_MESSAGES)
```
```
: next;
```
```
});
```
```
}, 33); // ~30fps
```
```
return () => clearInterval(id);
```
```
}, []);
```
// ── Auto-scroll to bottom ─────────────────────────────────────
```
useEffect(() => {
```
```
if (atBottom && listRef.current) {
```
```
listRef.current.scrollToItem(messages.length - 1, 'end');
```
```
}
```
```
}, [messages, atBottom]);
```
```
function handleScroll({ scrollOffset, scrollUpdateWasRequested }) {
```
```
if (!scrollUpdateWasRequested) { // user initiated scroll
```
// Check if near bottom
```
const el = listRef.current?._outerRef;
```
```
if (el) {
```
```
const atEnd = el.scrollHeight - scrollOffset - el.clientHeight < 100;
```
```
setAtBottom(atEnd);
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
// ── Send message ──────────────────────────────────────────────
```
function sendMessage(e) {
```
```
e.preventDefault();
```
```
if (!inputText.trim() || !isConnected) return;
```
```
wsRef.current.send(JSON.stringify({ type: 'message', text: inputText.trim() }));
```
```
setInputText('');
```
```
}
```
```
return (
```
<section aria-label='Live chat'>
```
{!isConnected && (
```
<div role='status'>Reconnecting...</div>
```
)}
```
<FixedSizeList
```
ref={listRef}
```
```
height={500}
```
```
width='100%'
```
```
itemCount={messages.length}
```
```
itemSize={56}
```
```
onScroll={handleScroll}
```
>
```
{({ index, style }) => (
```
```
<ChatMessage style={style} message={messages[index]} />
```
```
)}
```
</FixedSizeList>
```
{!atBottom && (
```
```
<button onClick={() => { setAtBottom(true); }}
```
aria-live='polite'>
New messages below
</button>
```
)}
```
```
<form onSubmit={sendMessage}>
```
<input
```
value={inputText}
```
```
onChange={e => setInputText(e.target.value)}
```
```
placeholder='Send a message...'
```
```
maxLength={200}
```
aria-label='Chat message'
```
disabled={!isConnected}
```
/>
```
<button type='submit' disabled={!isConnected || !inputText.trim()}>
```
Send
</button>
</form>
</section>
```
);
```
```
}
```
Interview Q Design a live chat component for a streaming platform that receives 200
messages/second. How do you prevent the UI from freezing?
Interview Q How do you implement WebSocket reconnection with exponential backoff? Why
not just reconnect immediately?
LLD 6 Autocomplete / Search Bar
Autocomplete is the most common LLD machine-coding question at senior frontend interviews. It seems simple
but has many edge cases: debouncing, request cancellation, keyboard navigation, caching, accessibility, and
deciding when to use local trie vs server search.
Requirements Clarification
```
• Data source — local (static list) or server (API)?
```
• Result count — show top 5 or 10?
• Caching — same query should not re-hit network
• Keyboard navigation — arrow keys, Enter to select, Escape to close
• Accessibility — combobox ARIA pattern
• Minimum characters before searching?
• Debounce duration — typically 300ms
Complete Autocomplete Implementation
```
function useAutocomplete({ queryFn, minChars = 2, debounceMs = 300 }) {
```
```
const [query, setQuery] = useState('');
```
```
const [results, setResults] = useState([]);
```
```
const [isLoading, setLoading] = useState(false);
```
```
const [isOpen, setOpen] = useState(false);
```
```
const [activeIndex, setActive] = useState(-1);
```
```
const cache = useRef(new Map()); // query → results cache
```
```
const abortRef = useRef(null); // for cancelling in-flight requests
```
// ── Debounced search ────────────────────────────────────────
```
useEffect(() => {
```
```
if (query.length < minChars) { setResults([]); setOpen(false); return; }
```
// Cache hit
```
if (cache.current.has(query)) {
```
```
setResults(cache.current.get(query));
```
```
setOpen(true);
```
```
return;
```
```
}
```
```
setLoading(true);
```
```
const timerId = setTimeout(async () => {
```
// Cancel previous in-flight request
```
abortRef.current?.abort();
```
```
abortRef.current = new AbortController();
```
```
try {
```
```
const data = await queryFn(query, abortRef.current.signal);
```
```
cache.current.set(query, data);
```
```
setResults(data);
```
```
setOpen(data.length > 0);
```
```
setActive(-1);
```
```
} catch (err) {
```
```
if (err.name !== 'AbortError') { // ignore cancelled requests
```
```
console.error('[Autocomplete]', err);
```
```
setResults([]);
```
```
}
```
```
} finally {
```
```
setLoading(false);
```
```
}
```
```
}, debounceMs);
```
```
return () => { clearTimeout(timerId); abortRef.current?.abort(); };
```
```
}, [query, minChars, debounceMs, queryFn]);
```
// ── Keyboard navigation ─────────────────────────────────────
```
function handleKeyDown(e) {
```
```
if (!isOpen) return;
```
```
if (e.key === 'ArrowDown') {
```
```
e.preventDefault();
```
```
setActive(i => Math.min(i + 1, results.length - 1));
```
```
} else if (e.key === 'ArrowUp') {
```
```
e.preventDefault();
```
```
setActive(i => Math.max(i - 1, -1));
```
```
} else if (e.key === 'Escape') {
```
```
setOpen(false); setActive(-1);
```
```
}
```
```
}
```
```
function handleSelect(result) {
```
```
setQuery(result.label);
```
```
setOpen(false);
```
```
setActive(-1);
```
```
}
```
```
return { query, setQuery, results, isLoading, isOpen, activeIndex,
```
```
handleKeyDown, handleSelect, setOpen };
```
```
}
```
// ── Accessible Combobox UI ───────────────────────────────────────
```
function Autocomplete({ placeholder = 'Search...' }) {
```
```
const listId = useId();
```
```
const inputRef = useRef(null);
```
```
const {
```
query, setQuery, results, isLoading, isOpen, activeIndex,
handleKeyDown, handleSelect, setOpen
```
} = useAutocomplete({
```
```
queryFn: async (q, signal) => {
```
```
const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`,
```
```
{ signal });
```
```
return res.json();
```
```
}
```
```
});
```
```
return (
```
```
<div style={{ position: 'relative' }}>
```
<input
```
ref={inputRef}
```
```
role='combobox'
```
```
aria-expanded={isOpen}
```
```
aria-controls={listId}
```
aria-autocomplete='list'
```
aria-activedescendant={
```
```
activeIndex >= 0 ? `option-${results[activeIndex]?.id}` : undefined
```
```
}
```
```
value={query}
```
```
onChange={e => setQuery(e.target.value)}
```
```
onKeyDown={handleKeyDown}
```
```
onBlur={() => setTimeout(() => setOpen(false), 150)}
```
// 150ms delay: allows click on option to register before blur fires
```
placeholder={placeholder}
```
aria-label='Search products'
/>
```
{isLoading && <Spinner size='sm' aria-label='Loading...' />}
```
```
{/* Live region announces result count to screen readers */}
```
<div aria-live='polite' className='sr-only'>
```
{isOpen ? `${results.length} results available` : ''}
```
</div>
```
{isOpen && (
```
<ul
```
id={listId}
```
```
role='listbox'
```
aria-label='Search suggestions'
>
```
{results.map((result, i) => (
```
<li
```
key={result.id}
```
```
id={`option-${result.id}`}
```
```
role='option'
```
```
aria-selected={i === activeIndex}
```
```
onMouseDown={() => handleSelect(result)}
```
// onMouseDown fires before onBlur — allows selection
```
style={{ background: i === activeIndex ? '#EFF6FF' : '' }}
```
>
```
<Highlight text={result.label} query={query} />
```
</li>
```
))}
```
</ul>
```
)}
```
</div>
```
);
```
```
}
```
// ── Highlight matching characters ────────────────────────────────
```
function Highlight({ text, query }) {
```
```
const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
```
```
const parts = text.split(regex);
```
```
return (
```
<span>
```
{parts.map((part, i) =>
```
```
regex.test(part)
```
```
? <mark key={i}>{part}</mark>
```
```
: <span key={i}>{part}</span>
```
```
)}
```
</span>
```
);
```
```
}
```
```
function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
```
Interview Q How do you cancel in-flight API requests in an autocomplete when the user types
again?
Interview Q Why use onMouseDown instead of onClick for selecting autocomplete options?
Interview Q Implement the ARIA combobox pattern for an autocomplete. What attributes are
required?
Interview Q When would you use a client-side trie for autocomplete vs a server-side search
API?
Section 8 Interview Questions — Model Answers
```
Q1: You have 45 minutes to build an autocomplete. Walk me through your
```
approach.
1. Clarify (5 min): data source (API or local), debounce, min chars, max results, accessibility requirements,
mobile support?
2. Design data model (3 min): result shape { id, label, meta }, cache as Map<query, Result[]>, abort
controller ref.
3. Design component tree (2 min): <Autocomplete> → useAutocomplete hook → <SearchInput> +
<ResultsList> + <ResultItem>.
4. Code the hook (15 min): useState for query/results/loading/open/activeIndex, useEffect for debounced
fetch with AbortController, keyboard handler.
5. Code the UI (12 min): combobox ARIA, aria-expanded, aria-controls, aria-activedescendant,
onMouseDown for selection.
6. Edge cases (8 min): empty results message, loading state, error state, Escape clears, click outside
closes, match highlight.
```
Q2: Design a reusable data table component for an admin dashboard.
```
```
Start with the prop interface: <Table columns={[{key, header, render, sortable, width}]} data={rows} onSort
```
```
pageSize selectable onSelect>. Separate concerns: useTableSort (sort state), useTableSelect (selection state),
```
```
useTablePagination (page state). The Table itself only renders — all logic in hooks. Make it generic with
```
```
TypeScript generics: Table<T extends {id: string}>.
```
```
Accessibility: role='grid', aria-sort on sortable column headers, aria-rowcount, aria-colcount, keyboard navigation
```
```
(arrow keys, Tab to header/body/footer). Performance: memo on rows and columns, virtualize if more than 200
```
rows.
```
Q3: Implement a useDebounce hook from scratch.
```
```
function useDebounce(value, delayMs) {
```
```
const [debounced, setDebounced] = useState(value);
```
```
useEffect(() => {
```
```
const timer = setTimeout(() => setDebounced(value), delayMs);
```
```
return () => clearTimeout(timer); // cleanup on every value change
```
```
}, [value, delayMs]);
```
```
return debounced;
```
```
}
```
```
// And useThrottle (allow at most once per period):
```
```
function useThrottle(value, limitMs) {
```
```
const [throttled, setThrottled] = useState(value);
```
```
const lastUpdated = useRef(Date.now());
```
```
useEffect(() => {
```
```
const now = Date.now();
```
```
if (now >= lastUpdated.current + limitMs) {
```
```
lastUpdated.current = now;
```
```
setThrottled(value);
```
```
} else {
```
```
const timer = setTimeout(() => {
```
```
lastUpdated.current = Date.now();
```
```
setThrottled(value);
```
```
}, limitMs - (now - lastUpdated.current));
```
```
return () => clearTimeout(timer);
```
```
}
```
```
}, [value, limitMs]);
```
```
return throttled;
```
```
}
```
// Debounce = delay execution, reset timer on each new input
// Throttle = allow at most once per period, execute immediately then wait
// Use debounce for: search, resize handler, form validation
// Use throttle for: scroll event, mouse move, rate-limited API calls
```
Q4: How do you manage complex form state in React? Compare useState vs
```
React Hook Form.
Dimension useState per field React Hook Form
Re-renders Every keystroke triggers re-
render of entire form
Uncontrolled by default — nearly
zero re-renders
Validation Manual: validate on change/blur,
maintain errors state
```
Schema-based (Zod/Yup) or
```
rules, automatic error messages
Submission Manually prevent default, gather
values, handle loading
```
handleSubmit() wraps your
```
submit function, provides
formState.isSubmitting
DX Simple for 3-5 fields Excellent for complex forms:
arrays, nested fields, conditional
fields
When to use Simple 2-3 field forms Any form with validation, arrays
of fields, or complex conditional
logic
```
Q5: What are the common performance pitfalls in React and how do you fix
```
each?
Pitfall Symptom Fix
Unnecessary re-renders Component re-renders when
parent renders even though
props haven't changed
React.memo, useMemo for
derived values, useCallback for
callback props
Context re-render cascade Every consumer re-renders
when any part of context value
changes
Split context: AuthContext +
ThemeContext. Or use Zustand
selectors.
Expensive computation on
every render
UI lags on user interaction useMemo with correct
dependency array
Function recreation on every
render
Child memo is broken because
callback prop is new on every
parent render
useCallback on handler
functions passed as props
Unvirtualized long lists Scrolling feels laggy, high
memory usage
react-window FixedSizeList /
VariableSizeList
```
Large initial bundle High TTI (time to interactive) Code splitting: lazy() + Suspense
```
per route. Tree-shake unused
library code.
Waterfall data loading Component renders blank,
fetches data, shows content,
triggers child fetch
React Query with prefetching, or
React Router v6 loaders
```
Q6: Implement useLocalStorage — a React hook that syncs state to
```
localStorage.
```
function useLocalStorage(key, initialValue) {
```
```
const [value, setValue] = useState(() => {
```
```
try {
```
```
const stored = localStorage.getItem(key);
```
```
return stored ? JSON.parse(stored) : initialValue;
```
```
} catch { return initialValue; }
```
```
});
```
```
const set = useCallback((newValue) => {
```
```
setValue(prev => {
```
```
const next = typeof newValue === 'function' ? newValue(prev) : newValue;
```
```
try { localStorage.setItem(key, JSON.stringify(next)); }
```
```
catch (e) { console.warn('[useLocalStorage] Failed to set:', e); }
```
```
return next;
```
```
});
```
```
}, [key]);
```
```
const remove = useCallback(() => {
```
```
localStorage.removeItem(key);
```
```
setValue(initialValue);
```
```
}, [key, initialValue]);
```
// Sync across tabs
```
useEffect(() => {
```
```
function handleStorage(e) {
```
```
if (e.key === key && e.newValue !== null) {
```
```
try { setValue(JSON.parse(e.newValue)); }
```
```
catch {}
```
```
}
```
```
}
```
```
window.addEventListener('storage', handleStorage);
```
```
return () => window.removeEventListener('storage', handleStorage);
```
```
}, [key]);
```
```
return [value, set, remove];
```
```
}
```
```
Q7: How do you handle errors in React apps at scale?
```
```
• Error Boundaries at multiple levels: one at the app root (last resort), one per major section (sidebar,
```
```
main content, chat widget) so one section crashing doesn't kill the entire app.
```
• React Query: use the onError callback and QueryCache error handler globally. Each query shows its
own error state without affecting other queries.
• Global window.onerror + unhandledrejection handlers: catch JS errors outside React's tree and report to
Sentry.
```
• Error ID in the boundary: generate a UUID, show it to the user ('Error ID: abc123'), use it in Sentry to
```
look up the session replay.
```
• Retry buttons: error boundaries should offer a retry action that calls this.setState({ hasError: false }) to
```
attempt remounting.
```
• Graceful degradation: if a widget fails (recommendations, chat), show nothing rather than a broken
```
widget. Don't let non-critical failures block the core flow.
```
Q8: Explain useCallback and useMemo. When should you NOT use them?
```
```
useCallback(fn, deps) returns a memoized function reference that only changes when deps change.
```
```
useMemo(fn, deps) returns a memoized computed value. Both prevent unnecessary work — but they have a
```
```
cost: the memoization itself (storing the previous value, comparing deps on every render).
```
```
Do NOT use them when: the computation is cheap (string concatenation, simple arithmetic), the component
```
rarely re-renders, or the function is not passed to a memoized child. Premature memoization adds complexity
and can mask real problems. Profile first — add memo only where you have measured a real performance
problem.
```
DO use them when: a computed value is expensive (filtering/sorting large arrays, building complex data
```
```
structures), a function is passed as a prop to React.memo'd children, or a function is a dependency of another
```
hook's dep array.
```
Q9: Design the component architecture for a product filter panel (like
```
```
Amazon's sidebar).
```
```
Data model: { category: string[], brand: string[], price: [min, max], rating: number, inStock: boolean }. State lives
```
```
in the URL (useSearchParams) so filters are shareable and the back button works. Component tree:
```
```
<FilterPanel> → <FilterGroup> (compound) → <FilterCheckbox | FilterRange | FilterRating>.
```
```
Key architectural decisions: controlled inputs driven by URL state, a single applyFilters() action that updates
```
```
URL in one pushState (not one per filter), optimistic UI (update filter state, then fetch), clear all filters button that
```
resets URL params. The actual filtering happens server-side — the API receives filter params, returns filtered
results. Client-side filtering only for static datasets.
```
Q10: What is the difference between useMemo and React.memo?
```
React.memo is a Higher-Order Component that wraps a component and prevents it from re-rendering if its props
```
have not changed (shallow equality check). It memoizes the component's rendered output. useMemo is a hook
```
that memoizes a computed value inside a component. They solve different levels of the same problem:
```
React.memo prevents the component function from running; useMemo prevents an expensive computation
```
inside the component from re-running.
Common misunderstanding: React.memo alone does not help if the parent passes new function/object
```
references on every render (because shallow equality fails). You need React.memo + useCallback on function
```
props + useMemo on object props. The full pattern: React.memo wraps the child, useCallback wraps the
handler in the parent, useMemo wraps any computed object passed as prop.
Master Cheat Sheet LLD at a Glance
LLD Machine-Coding Interview Framework
Phase Duration What to Do
Clarify 5 min Ask: data source, scale,
supported features, a11y
required, mobile, edge cases
Data model 5 min Define TypeScript types /
interfaces for the core data
structures
Component tree 5 min Sketch the hierarchy: which
component owns state, which
are presentational
Code core logic 25 min Build the hook first, then the UI.
Happy path + loading + error
states.
Edge cases 10 min Empty state, network error,
debounce, cancellation,
accessibility, keyboard nav
When to Use Each Design Pattern
If you need to... Use pattern Avoid
React to changes across
unrelated components
Observer / Pub/Sub Prop drilling 5 levels deep
Ensure one shared instance
```
(logger, toast, config)
```
Singleton Instantiating in every module
Create different variants of a
class/component
Factory Giant if/switch in one component
Swap algorithms at runtime
```
(sort, validation)
```
Strategy Hardcoded algorithm with no
extension point
Intercept and cache
function/object calls
Proxy Wrapper functions scattered
everywhere
Add cross-cutting concerns
```
(logging, auth)
```
Decorator / HOC Mixing concerns into every
component
Hide third-party library
complexity
Facade Direct library API calls spread
across the app
State Management Decision Tree
Question Yes → Use No → Continue
Is the state only used in ONE
component?
useState / useReducer ↓
Is it data fetched from a server
API?
React Query / SWR ↓
```
Is it form state (fields,
```
```
validation)?
```
React Hook Form ↓
Should it be in the URL
```
(shareable)?
```
useSearchParams ↓
Do 2-3 nearby components
share it?
Lift to parent + Context ↓
Is it truly global and changes
rarely?
```
Zustand (small) / Redux Toolkit
```
```
(large)
```
↓
KEY INSIGHT The LLD interview differentiator: most candidates code the happy path. Senior
```
engineers proactively mention: (1) error state, (2) loading skeleton, (3) empty state,
```
```
(4) accessibility (keyboard nav + ARIA), (5) performance (debounce /
```
```
virtualization), (6) extensibility. Cover all six and you are in the top 10% of
```
candidates.
LLD is not about writing the most code — it is about making the right decisions quickly
and explaining your reasoning clearly.