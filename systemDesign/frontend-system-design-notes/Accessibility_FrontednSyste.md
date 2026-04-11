##### Namaste Frontend System Design
```
Chapter 8: Accessibility (A11y)
```
In-Depth Interview Guide | 5 Topics | Code Examples | WCAG Rules | ARIA Patterns
Topic What It Covers Interview Weight
Overview WCAG, POUR principles, A11y
law, semantic HTML, the
accessibility tree
High
Keyboard Accessibility Tab order, focus management,
focus trap, skip links, custom
widget keyboard patterns
Very High
Screen Reader How screen readers work, ARIA
roles/states/properties, live
regions, announcements
Very High
Color Contrast WCAG contrast ratios, tools,
non-colour cues, dark mode,
motion accessibility
High
Testing / Tools axe DevTools, Lighthouse,
manual audit, automated CI
checks, screen reader testing
High
Why Accessibility Matters in Senior Frontend
Interviews
```
Accessibility (A11y) is no longer an optional nice-to-have. It is a legal requirement in many jurisdictions, a
```
product quality signal, and a core competency expected of senior frontend engineers at companies like
Microsoft, Adobe, Google, and any company with a global user base. Over 1.3 billion people globally live with
some form of disability — that is 16% of the world's population, and your users.
Why it comes up in interviews What the interviewer is testing
'Make this modal accessible' Focus trap, ARIA roles, keyboard navigation,
screen reader announcement
'What is WCAG and what level do you target?' Knowledge of the standard, AA vs AAA, legal
context
'How do you ensure keyboard users can use
your dropdown?'
Tab/arrow key conventions, roving tabindex,
Escape key behaviour
'How does a screen reader know what your
custom button does?'
```
ARIA: role, aria-label, aria-expanded, aria-
```
haspopup
'Design the accessibility strategy for a design
system'
Component-level contracts, testing strategy,
documentation
'How would you audit an existing app for
accessibility issues?'
axe, Lighthouse, manual keyboard test, screen
reader test flow
KEY INSIGHT Accessibility is not about building a separate 'accessible version'. It is about
building ONE version that works for everyone. Semantic HTML, keyboard
operability, and sufficient colour contrast are the foundation — they benefit all
users, not just those with disabilities. Frame this in every interview answer.
Topic 1 Overview — WCAG, POUR & the
Accessibility Foundation
Accessibility means building digital products that people with visual, auditory, motor, and cognitive disabilities
```
can perceive, understand, navigate, and interact with. It is governed by international standards (WCAG), legal
```
frameworks, and practical engineering patterns. This topic establishes the conceptual foundation everything else
builds on.
1.1 WCAG — Web Content Accessibility Guidelines
```
WCAG (Web Content Accessibility Guidelines) is published by the W3C and is the international standard for
```
web accessibility. It is organised around four principles — POUR — and three conformance levels: A, AA, and
AAA.
WCAG Level What It Means Who Targets It
Level A Minimum accessibility.
Removing the most critical
barriers.
Absolute baseline. Non-
compliance means the site is
unusable for many users.
Level AA Standard accessibility. Covers
the most common and impactful
barriers.
The legal and industry standard.
```
EN 301 549 (EU), ADA (US),
```
```
AODA (Canada) all require AA.
```
Level AAA Enhanced accessibility. The
highest standard — not always
achievable for all content.
```
Specialist services (government,
```
```
healthcare). Generally
```
aspirational, not mandated.
```
1.2 POUR — The Four Principles (The Interview Framework)
```
Principle What It Means Fail Example Pass Example
Perceivable All information and UI
components must be
presentable to users in
ways they can perceive
— not just visually.
Image with no alt text.
Video with no
captions. Colour as
the only error
indicator.
```
alt='Product photo:
```
red Nike Air Max'.
Captions on all video.
Error shown with icon
- text + colour.
Operable All UI components and
navigation must be
operable by keyboard
and other assistive
technologies.
Dropdown only opens
on hover. Modal traps
focus and no way to
close with keyboard.
No skip link.
Dropdown opens on
Enter/Space. Escape
closes modal and
returns focus. Skip to
main content link.
Understandable Information and UI
operation must be
understandable — clear
language, predictable
behaviour, helpful error
messages.
Form error: 'Invalid
input'. Page language
not declared.
Navigation changes
when you focus a link.
Form error: 'Email
must contain @
symbol'. lang='en' on
html. Navigation only
changes on user
action.
Robust Content must be robust
enough to be interpreted
reliably by a wide variety
of user agents, including
assistive technologies.
Custom button built
with div, no role, no
keyboard handler.
ARIA used
incorrectly.
Use native <button>.
When custom widget
```
needed: correct role +
```
keyboard support +
ARIA states.
1.3 The Accessibility Tree — How Browsers Expose Semantics
```
The browser builds two parallel trees from HTML: the DOM tree (for rendering) and the Accessibility Tree (for
```
```
assistive technologies). Screen readers, voice control software, and other AT read the Accessibility Tree — NOT
```
the visual CSS layout. This is why semantic HTML is so powerful: it populates the Accessibility Tree correctly for
free.
// What the browser exposes to assistive technology:
// DOM: Accessibility Tree:
// <button> → Role: button
```
// <nav> → Role: navigation (landmark)
```
// <h2>Product List</h2> → Role: heading, level 2, name: 'Product List'
// <input type='checkbox'> → Role: checkbox, checked: false
// <img alt='Red Nike shoe'> → Role: image, name: 'Red Nike shoe'
```
// <img alt=''> → HIDDEN from accessibility tree (decorative)
```
// div, span → NO role in the accessibility tree
// When you build UI with divs, AT users get NO semantic information
// Inspect the accessibility tree in Chrome:
```
// DevTools → Elements tab → Accessibility panel (right side)
```
// Or: DevTools → More tools → Accessibility
// Shows: computed role, computed name, description, states, properties
1.4 Semantic HTML — The Foundation of Free Accessibility
Semantic HTML elements come with built-in accessibility behaviours: correct ARIA roles, keyboard operability,
and AT announcements — without any extra code. Using a <button> instead of a <div> gives you all of this for
free.
Semantic Element What AT Gets Automatically Common Mistake to
Replace With
<button> Role=button. Focusable. Activated by
Enter and Space. Included in tab
order.
<div onclick> — no role, not
focusable, Enter/Space do
nothing
<a href> Role=link. Focusable. Activated by
Enter. Included in tab order.
<div onclick> — no role, not
focusable, not a link in AT
<nav> Role=navigation landmark. AT can
jump directly to navigation.
<div class='nav'> — invisible
to AT as navigation
<main> Role=main landmark. AT can skip
directly to main content.
<div id='main'> — invisible as
main content landmark
```
<header> Role=banner landmark (when at top
```
```
level).
```
<div class='header'>
```
<footer> Role=contentinfo landmark (when at
```
```
top level).
```
<div class='footer'>
<h1>-<h6> Heading landmarks. AT users
navigate by heading. Document
outline.
<div class='title'> styled to
look like heading — no
heading in AT
<label for='x'> Associates label text with input. AT
reads label when input is focused.
<div> next to input — AT
reads input with no label
<fieldset> + <legend> Groups related form controls. AT
reads legend before each control.
<div> grouping — no group
name announced
<table> Table role. <th> =
columnheader/rowheader. AT
announces 'Column 2 of 5: Price'.
CSS grid styled as table — AT
reads as flat text, no
column/row context
1.5 Legal Context — Why Companies Must Care
Jurisdiction Law / Standard What It Requires Penalty
United States Americans with
```
Disabilities Act (ADA)
```
Public websites of
businesses must be
accessible. Court-
interpreted to require
WCAG AA.
Lawsuits — over 4,000
ADA web accessibility
lawsuits in 2023 alone
European Union EN 301 549 / European
```
Accessibility Act (EAA
```
```
2025)
```
All digital products sold
in EU must meet
WCAG 2.1 AA from
2025.
Fines up to €15M or 3%
of global turnover
```
(similar to GDPR)
```
```
Canada AODA (Ontario) / ACA WCAG 2.0 Level AA
```
required for
public/private sector
websites.
Fines up to $100,000
CAD per day
India RPWD Act 2016 /
GIGW guidelines
Government websites
must be WCAG 2.0 AA
compliant.
Regulatory non-
compliance for public
sector
UK Equality Act 2010 /
PSBAR 2018
Public sector: WCAG
2.1 AA mandatory.
```
Private: Equality Act
```
applies.
Legal action under
Equality Act
Interview Q What is WCAG and what conformance level do you target in production? Why AA
and not AAA?
Interview Q Explain the four POUR principles. Give a concrete example of a violation for each.
Interview Q Why does using a <div> for a button break accessibility? List every specific thing
that breaks.
Interview Q What is the accessibility tree? How does it differ from the DOM tree?
References
• WCAG 2.2 — Official W3C Standard
• WebAIM — WCAG 2 Checklist
• MDN — Accessibility
• Deque — Introduction to Web Accessibility
Topic 2 Keyboard Accessibility — Operable
Without a Mouse
Keyboard accessibility means every feature of your application is reachable and operable using only a
keyboard. This matters for: users with motor disabilities who cannot use a mouse, power users who prefer
```
keyboard navigation, users on devices without a pointer, and screen reader users (who primarily navigate via
```
```
keyboard).
```
2.1 The Tab Order — Focus Management Fundamentals
// NATURAL TAB ORDER: follows DOM source order for focusable elements
// Natively focusable: <a href>, <button>, <input>, <select>, <textarea>
// <details>, <audio controls>, <video controls>
// tabindex values — the three important cases:
// tabindex='0' — add element to natural tab order
<div role='button' tabindex='0' onclick='...' onkeydown='...'>Custom</div>
// Now focusable. But use <button> instead whenever possible.
```
// tabindex='-1' — focusable ONLY via JavaScript (not in tab order)
```
<div id='modal-heading' tabindex='-1'>Confirm Delete</div>
```
// Used to programmatically focus elements (like dialog headings) without
```
// adding them to the tab flow for regular keyboard navigation.
```
document.getElementById('modal-heading').focus();
```
// tabindex='1+' — NEVER USE POSITIVE VALUES
// tabindex='5' jumps this element to position 5 in tab order
// Breaks the natural flow. Extremely confusing for keyboard users.
// WCAG 2.4.3 — Focus Order must be logical and meaningful.
// RULE: Never use tabindex > 0. Fix DOM order instead of overriding with tabindex.
// CHECKING TAB ORDER:
// Tab through your page manually. Ask:
// 1. Can you reach every interactive element?
```
// 2. Is the order logical (matches visual reading order)?
```
// 3. Is focus visible at all times?
// 4. Does focus ever disappear into a component and not come out?
2.2 Focus Visibility — You Must Always See Where You Are
```
// WCAG 2.4.7 (AA): Focus indicator must be visible.
```
```
// WCAG 2.4.11 (AA, WCAG 2.2): Focus appearance — minimum size and contrast.
```
```
// ❌ WRONG — removing focus ring without replacement (extremely common mistake)
```
- { outline: none; } /* removes focus for ALL elements */
```
button:focus { outline: 0; } /* removes focus for buttons */
```
// ✅ CORRECT — custom focus style that meets WCAG 2.4.11
/* WCAG 2.4.11 requires: 2px minimum outline, 3:1 contrast with adjacent colour */
```
:focus-visible {
```
```
outline: 3px solid #0066CC; /* 3px > 2px minimum */
```
```
outline-offset: 2px; /* slight gap from element edge */
```
```
border-radius: 2px; /* optional: matches element's border-radius */
```
```
}
```
/* :focus-visible vs :focus */
```
/* :focus — fires on click AND keyboard focus (ring appears on click = ugly) */
```
```
/* :focus-visible — fires only on keyboard focus (smart detection) */
```
/* Use :focus-visible for mouse users who don't need the ring */
```
/* Use :focus for all users where you always want the indicator (e.g., form inputs) */
```
/* Design system example — global focus tokens */
```
:root {
```
```
--focus-ring-color: #0066CC; /* 4.5:1 contrast on white background */
```
```
--focus-ring-width: 3px;
```
```
--focus-ring-offset: 2px;
```
```
}
```
```
:focus-visible {
```
```
outline: var(--focus-ring-width) solid var(--focus-ring-color);
```
```
outline-offset: var(--focus-ring-offset);
```
```
}
```
2.3 Skip Links — Bypass Repeated Navigation
A skip link is a visually hidden link that appears when focused, allowing keyboard users to bypass repetitive
```
navigation (header, nav bar) and jump straight to the main content. WCAG 2.4.1 (Level A) requires a
```
mechanism to skip blocks of repeated content.
<!-- HTML — place as the FIRST element in <body> -->
<a href='#main-content' class='skip-link'>Skip to main content</a>
<!-- The target -->
<main id='main-content' tabindex='-1'> <!-- tabindex='-1' so it can receive focus -->
<h1>Product Listing</h1>
<!-- page content -->
</main>
/* CSS — visually hidden but visible when focused */
```
.skip-link {
```
```
position: absolute;
```
```
top: -100%; /* off-screen when not focused */
```
```
left: 16px;
```
```
z-index: 9999;
```
```
padding: 8px 16px;
```
```
background: #0066CC;
```
```
color: white;
```
```
font-weight: bold;
```
```
text-decoration: none;
```
```
border-radius: 0 0 4px 4px;
```
```
transition: top 0.1s;
```
```
}
```
```
.skip-link:focus {
```
```
top: 0; /* slides into view when focused */
```
```
}
```
// Multiple skip links for complex pages:
// 'Skip to main content' → #main
// 'Skip to navigation' → #nav
// 'Skip to search' → #search
2.4 Keyboard Patterns for Custom Widgets
Native HTML elements have keyboard behaviour built in. Custom interactive components — dropdowns, tabs,
accordions, carousels, date pickers — require you to implement keyboard interaction manually. The ARIA
```
Authoring Practices Guide (APG) defines the standard patterns. Use them — keyboard users have learned
```
these conventions.
Widget Key Action Why
```
Button (custom) Enter / Space Activate the button Matches native
```
<button> behaviour.
Both must work.
```
Link (custom) Enter Follow the link Matches native <a
```
href>. Space should
NOT activate links.
Dropdown / Listbox Enter or Space Open the menu Opens without
selecting. Esc closes
and returns focus to
trigger.
Dropdown / Listbox Arrow Up / Down Move between options Moves focus within the
menu. Home/End to
jump to first/last.
Dropdown / Listbox Enter Select highlighted
option
Closes menu, selects
option, returns focus to
trigger.
Dropdown / Listbox Escape Close without selecting Returns focus to the
trigger element.
Tab List Arrow Left / Right Move between tabs Tab switches the
selected tab. Tab key
moves to panel content.
Accordion Enter / Space Toggle panel Expand or collapse the
panel. Focus stays on
header button.
Modal Dialog Tab Cycle through
focusable elements
Focus must not leave
the modal while it is
```
open (focus trap).
```
Modal Dialog Escape Close modal Returns focus to the
element that triggered
the modal.
Radio Group Arrow Up / Down Move between radio
buttons
Arrow keys navigate
within group. Tab
moves out of the group.
Combobox Type characters Filter options Type-ahead filtering.
Arrow keys navigate
matching results.
2.5 Focus Trap — The Modal Pattern
When a modal dialog is open, keyboard focus must be trapped inside it. If Tab reaches the last focusable
element and continues, it should wrap to the first. If Shift+Tab reaches the first and continues, it should wrap to
the last. When the modal closes, focus must return to the element that triggered it.
```
function createFocusTrap(containerEl) {
```
const FOCUSABLE = [
```
'a[href]', 'button:not([disabled])', 'input:not([disabled])',
```
```
'select:not([disabled])', 'textarea:not([disabled])',
```
```
'[tabindex]:not([tabindex="-1"])',
```
```
].join(', ');
```
```
function getFocusableElements() {
```
```
return [...containerEl.querySelectorAll(FOCUSABLE)];
```
```
}
```
```
function handleKeyDown(e) {
```
```
if (e.key !== 'Tab') return;
```
```
const focusable = getFocusableElements();
```
```
if (focusable.length === 0) { e.preventDefault(); return; }
```
```
const first = focusable[0];
```
```
const last = focusable[focusable.length - 1];
```
```
if (e.shiftKey) {
```
// Shift+Tab: if on first element, wrap to last
```
if (document.activeElement === first) {
```
```
e.preventDefault();
```
```
last.focus();
```
```
}
```
```
} else {
```
// Tab: if on last element, wrap to first
```
if (document.activeElement === last) {
```
```
e.preventDefault();
```
```
first.focus();
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
return {
```
```
activate() {
```
```
containerEl.addEventListener('keydown', handleKeyDown);
```
```
// Focus the first focusable element (or the dialog heading if nothing else)
```
```
const first = getFocusableElements()[0];
```
```
if (first) first.focus();
```
```
},
```
```
deactivate() {
```
```
containerEl.removeEventListener('keydown', handleKeyDown);
```
```
}
```
```
};
```
```
}
```
// Usage in a React modal:
```
function Modal({ isOpen, onClose, triggerRef, children }) {
```
```
const dialogRef = useRef(null);
```
```
const trapRef = useRef(null);
```
```
useEffect(() => {
```
```
if (isOpen) {
```
```
trapRef.current = createFocusTrap(dialogRef.current);
```
```
trapRef.current.activate();
```
// Prevent background from scrolling
```
document.body.style.overflow = 'hidden';
```
```
} else {
```
```
trapRef.current?.deactivate();
```
```
document.body.style.overflow = '';
```
// Return focus to the trigger element
```
triggerRef.current?.focus();
```
```
}
```
```
}, [isOpen]);
```
```
if (!isOpen) return null;
```
```
return (
```
<div
```
ref={dialogRef}
```
```
role='dialog'
```
aria-modal='true'
aria-labelledby='dialog-title'
>
<h2 id='dialog-title'>Confirm Delete</h2>
```
{children}
```
```
<button onClick={onClose}>Cancel</button>
```
```
<button onClick={handleConfirm}>Delete</button>
```
</div>
```
);
```
```
}
```
// Production note: use the focus-trap library or Headless UI / Radix UI
// which implement this pattern correctly and handle edge cases.
2.6 Roving tabindex — Managing Focus in Composite Widgets
For widget groups like tab lists, radio groups, toolbars, and menus — only ONE element should be in the tab
order at a time. Arrow keys move between elements within the group. This pattern is called 'roving tabindex'.
// ROVING TABINDEX — only the selected/active item has tabindex='0'
// All others have tabindex='-1'. Arrow keys update which one is 0.
```
function TabList({ tabs }) {
```
```
const [activeIndex, setActiveIndex] = useState(0);
```
```
const tabRefs = useRef([]);
```
```
function handleKeyDown(e, index) {
```
```
let newIndex = index;
```
```
if (e.key === 'ArrowRight') newIndex = (index + 1) % tabs.length;
```
```
if (e.key === 'ArrowLeft') newIndex = (index - 1 + tabs.length) % tabs.length;
```
```
if (e.key === 'Home') newIndex = 0;
```
```
if (e.key === 'End') newIndex = tabs.length - 1;
```
```
if (newIndex === index) return;
```
```
e.preventDefault();
```
```
setActiveIndex(newIndex);
```
```
tabRefs.current[newIndex]?.focus(); // move physical focus
```
```
}
```
```
return (
```
<div role='tablist' aria-label='Product sections'>
```
{tabs.map((tab, i) => (
```
<button
```
key={tab.id}
```
```
ref={el => (tabRefs.current[i] = el)}
```
```
role='tab'
```
```
aria-selected={i === activeIndex}
```
```
aria-controls={`panel-${tab.id}`}
```
```
id={`tab-${tab.id}`}
```
```
tabIndex={i === activeIndex ? 0 : -1} // ← roving tabindex
```
```
onClick={() => setActiveIndex(i)}
```
```
onKeyDown={(e) => handleKeyDown(e, i)}
```
>
```
{tab.label}
```
</button>
```
))}
```
</div>
```
);
```
```
}
```
Interview Q What is a focus trap? Implement one for a modal dialog. What happens to focus
when the modal closes?
Interview Q What is roving tabindex? When would you use it instead of giving every element
```
tabindex=0?
```
Interview Q A dropdown menu opens on click. Walk me through the complete keyboard
interaction pattern a screen reader user expects.
Interview Q Why should you never use outline: none without a replacement? What does
WCAG 2.4.11 require for focus indicators?
References
• ARIA APG — Keyboard Interface Patterns
```
• ARIA APG — Dialog (Modal) Pattern
```
• ARIA APG — Tabs Pattern
• focus-trap — NPM library
• WebAIM — Keyboard Accessibility
Topic 3 Screen Reader — Communicating
Semantics to Assistive Technology
A screen reader converts digital content into synthesised speech or braille output. It reads the Accessibility Tree
— not the visual layout — which is why semantic HTML and ARIA attributes are so critical. Users navigate by
headings, landmarks, links, and form controls. They cannot see the visual design at all.
3.1 How Screen Readers Work — The Mental Model
// Screen reader interaction model:
// 1. USER PRESSES A KEY
// H → jump to next heading
// B → jump to next button
// Tab → jump to next interactive element
// 1-6 → jump to heading level 1-6
// D → jump to next landmark region
// 2. SCREEN READER QUERIES THE ACCESSIBILITY TREE
// Finds the element, reads its accessible name + role + state
// 3. SCREEN READER ANNOUNCES
// 'Search, button' ← <button>Search</button>
// 'Product name, heading level 2' ← <h2>Product name</h2>
// 'Email, required, edit' ← <input type='email' required aria-label='Email'>
// 'Item 3 of 12, list' ← <li> inside <ul>
// 4. USER ACTIVATES THE ELEMENT
// Enter / Space on button → click fires
// Popular screen readers:
// JAWS — Windows. Most used in enterprise. Paid.
// NVDA — Windows. Free and open source. Common for testing.
// VoiceOver — macOS / iOS. Built in. Cmd+F5 to toggle.
// TalkBack — Android. Built in.
// Narrator — Windows. Built in.
```
// Testing with VoiceOver (macOS):
```
// Cmd+F5 → toggle VoiceOver
// VO+Right arrow → read next element
```
// VO+U → rotor (shows headings, links, landmarks, form controls)
```
// Tab → move to next interactive element
```
// VO = Ctrl+Option (the VoiceOver modifier key)
```
3.2 ARIA — Accessible Rich Internet Applications
```
ARIA (WAI-ARIA) is a set of HTML attributes that add semantic meaning to elements that native HTML cannot
```
express. The golden rule: ARIA's first rule is 'don't use ARIA'. Use semantic HTML first. Only add ARIA when
native HTML cannot achieve the required semantics.
```
// THE FIVE ARIA RULES (from the spec):
```
// Rule 1: Don't use ARIA if a native HTML element provides the semantics
// Rule 2: Don't change native semantics unless you have very good reason
// Rule 3: All interactive ARIA controls must be keyboard operable
```
// Rule 4: Don't hide visible, focusable elements (aria-hidden='true' + focusable = BAD)
```
// Rule 5: All interactive elements must have an accessible name
// ── ARIA ROLES ────────────────────────────────────────────────────
// Widget roles: button, checkbox, combobox, dialog, listbox,
// menu, menuitem, option, radio, slider, tab, tabpanel
// Landmark roles: banner, complementary, contentinfo, form,
// main, navigation, region, search
// Structure roles: heading, list, listitem, row, cell, columnheader
<div role='button' tabindex='0'>Custom button</div>
```
// Only do this when <button> genuinely cannot be used (rare!)
```
// Must ALSO add keyboard handler for Enter and Space
// ── ARIA STATES & PROPERTIES ──────────────────────────────────────
```
// States (can change dynamically):
```
// aria-expanded='true/false' — is a collapsible element open?
// aria-selected='true/false' — is a tab / option selected?
// aria-checked='true/false' — is a checkbox checked?
// aria-disabled='true' — is control disabled?
// aria-pressed='true/false' — is a toggle button pressed?
```
// aria-hidden='true' — hide from AT (decorative icon, overlay bg)
```
// aria-invalid='true' — field has a validation error
// aria-busy='true' — content is loading/updating
```
// Properties (generally static):
```
// aria-label='...' — accessible name override
```
// aria-labelledby='id1 id2' — name from another element(s)
```
// aria-describedby='id' — additional description from another element
// aria-haspopup='listbox' — element controls a popup
// aria-controls='id' — element controls another element
// aria-modal='true' — dialog is modal
// aria-required='true' — field is required
```
// aria-current='page' — current item in nav (page/step/date/location)
```
// aria-sort='ascending' — table column sort direction
// aria-valuemin/max/now/text — slider / progress value
3.3 Accessible Names — How AT Knows What to Call Your Elements
Every interactive element must have an accessible name. The browser computes the accessible name using a
specific priority order. Understanding this order is critical for passing interviews and fixing AT bugs.
```
// ACCESSIBLE NAME COMPUTATION (priority order, highest first):
```
```
// 1. aria-labelledby (references another element by ID)
```
<h2 id='dialog-title'>Delete Account</h2>
<div role='dialog' aria-labelledby='dialog-title'>
// Screen reader: 'Delete Account, dialog'
```
// 2. aria-label (inline string)
```
<button aria-label='Close dialog'>
<svg aria-hidden='true'><path d='...'/></svg>
</button>
```
// Screen reader: 'Close dialog, button' (NOT 'X button')
```
```
// 3. for/id label association (for form controls)
```
<label for='email'>Email address</label>
<input id='email' type='email'>
// Screen reader: 'Email address, edit'
```
// 4. Wrapped label (implicit association)
```
<label>
<input type='checkbox'> Subscribe to newsletter
</label>
// Screen reader: 'Subscribe to newsletter, checkbox, unchecked'
```
// 5. title attribute (last resort — not well supported, avoid)
```
<button title='Delete'>X</button>
// Screen reader: 'Delete, button' on some AT, 'X, button' on others
```
// 6. Text content (for buttons, links — the content itself)
```
<button>Add to Cart</button>
// Screen reader: 'Add to Cart, button'
// ── COMMON MISTAKES ────────────────────────────────────────────────
// ❌ Icon button with no accessible name
<button><svg>...</svg></button>
// Screen reader: just 'button' — no name. User has no idea what it does.
// ✅ Fix: aria-label on the button
<button aria-label='Close'><svg aria-hidden='true'>...</svg></button>
// ❌ Placeholder as the only label
<input placeholder='Enter email'>
// Placeholder disappears when user types. AT reads 'blank, edit'.
// ✅ Fix: always pair with a <label>
<label for='e'>Email</label><input id='e' placeholder='you@example.com'>
// ❌ Non-unique link text
<a href='/product/1'>Read more</a>
<a href='/product/2'>Read more</a>
// AT user browsing links hears: 'Read more, Read more, Read more...'
// No way to distinguish between them.
// ✅ Fix: descriptive link text or aria-label
<a href='/product/1'>Read more about Nike Air Max</a>
// Or:
<a href='/product/1' aria-label='Read more about Nike Air Max'>Read more</a>
3.4 ARIA Live Regions — Dynamic Content Announcements
```
When content changes dynamically (loading states, form validation, toasts, autocomplete results, cart count
```
```
updates), screen reader users do not automatically know about the change. ARIA live regions tell the screen
```
reader to announce specific DOM changes.
// ── aria-live values ─────────────────────────────────────────────
```
// 'off' → no announcement (default)
```
```
// 'polite' → announce when user finishes current activity (most common)
```
```
// 'assertive' → interrupt immediately (use rarely — very disruptive)
```
// ── aria-atomic ────────────────────────────────────────────────
// 'true' → announce the ENTIRE region when any part changes
```
// 'false' → announce only the changed portion (default)
```
// ── aria-relevant ─────────────────────────────────────────────
// 'additions' → announce when elements are added
// 'removals' → announce when elements are removed
// 'text' → announce text changes
// 'all' → all changes
// ── USE CASE 1: Status / toast notifications ───────────────────
<div
```
role='status'
```
aria-live='polite'
aria-atomic='true'
```
className='sr-only' // visually hidden but AT reads it
```
>
```
{statusMessage} {/* update this to trigger announcement */}
```
</div>
// role='status' is shorthand for aria-live='polite' + aria-atomic='true'
// role='alert' is shorthand for aria-live='assertive' + aria-atomic='true'
// Use role='alert' for: errors, critical warnings
// Use role='status' for: success messages, loading complete
// ── USE CASE 2: Form validation errors ─────────────────────────
```
function FormField({ label, error, ...inputProps }) {
```
```
const errorId = useId();
```
```
return (
```
<div>
```
<label htmlFor={inputProps.id}>{label}</label>
```
<input
```
{...inputProps}
```
```
aria-describedby={error ? errorId : undefined}
```
```
aria-invalid={!!error}
```
/>
```
{error && (
```
```
<span id={errorId} role='alert'> {/* assertive: announces immediately */}
```
```
{error}
```
</span>
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
// Screen reader announces: 'Email address, edit. Error: must contain @ symbol'
// ── USE CASE 3: Loading states ─────────────────────────────────
```
<div aria-live='polite' aria-atomic='true' aria-busy={isLoading}>
```
```
{isLoading ? (
```
<span>Loading results...</span>
```
) : (
```
```
<ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
```
```
)}
```
</div>
// When isLoading becomes false: 'Loading results...' disappears,
```
// '15 results found' (or the list) is announced
```
// ── USE CASE 4: Autocomplete / Combobox results ────────────────
<div aria-live='polite' className='sr-only'>
```
{results.length > 0
```
```
? `${results.length} results available. Use arrow keys to navigate.`
```
```
: 'No results found.'}
```
</div>
3.5 Complete Accessible Patterns — Real Code
// ── ACCESSIBLE MODAL ───────────────────────────────────────────
<div
```
role='dialog' // tells AT this is a dialog
```
aria-modal='true' // tells AT to hide background content
aria-labelledby='dlg-title' // name comes from the heading
aria-describedby='dlg-desc' // description from the body text
>
<h2 id='dlg-title'>Confirm Deletion</h2>
<p id='dlg-desc'>This action cannot be undone. Are you sure?</p>
```
<button onClick={onClose}>Cancel</button>
```
```
<button onClick={onConfirm}>Delete</button>
```
</div>
```
// On open: focus moves to first button (or heading if tabindex='-1')
```
// On close: focus returns to the trigger button
// ── ACCESSIBLE DROPDOWN / COMBOBOX ────────────────────────────
<div>
<button
aria-haspopup='listbox' // tells AT a listbox will open
```
aria-expanded={isOpen} // current state: open or closed
```
aria-controls='dropdown-list'
```
id='dropdown-trigger'
```
>
```
Sort by: {selectedLabel}
```
</button>
<ul
```
id='dropdown-list'
```
```
role='listbox'
```
aria-labelledby='dropdown-trigger'
```
hidden={!isOpen}
```
>
```
{options.map(opt => (
```
<li
```
key={opt.value}
```
```
role='option'
```
```
aria-selected={opt.value === selected}
```
```
onClick={() => handleSelect(opt)}
```
>
```
{opt.label}
```
</li>
```
))}
```
</ul>
</div>
// ── ACCESSIBLE ACCORDION ──────────────────────────────────────
<div>
<h3>
<button
```
aria-expanded={isOpen} // state: is panel visible?
```
aria-controls='panel-1' // which panel this button controls
```
id='accordion-1'
```
>
Shipping Information
</button>
</h3>
<div
```
id='panel-1'
```
```
role='region'
```
aria-labelledby='accordion-1' // name = button text
```
hidden={!isOpen}
```
>
<p>Free shipping on orders over ₹500.</p>
</div>
</div>
```
// ── VISUALLY HIDDEN CLASS (sr-only) ───────────────────────────
```
// Provides text ONLY to screen readers. Not visible but not aria-hidden.
```
.sr-only {
```
```
position: absolute;
```
```
width: 1px;
```
```
height: 1px;
```
```
padding: 0;
```
```
margin: -1px;
```
```
overflow: hidden;
```
```
clip: rect(0, 0, 0, 0);
```
```
white-space: nowrap;
```
```
border: 0;
```
```
}
```
// Use for: 'Loading...' announcements, additional context text,
// screen-reader-only instructions
// NOT display:none or visibility:hidden — those hide from AT too
Interview Q How does a screen reader determine what to announce when it focuses a button?
Walk me through the accessible name computation.
Interview Q What is aria-live? Implement a toast notification system that announces success
and error messages to screen reader users.
Interview Q What is the difference between aria-label, aria-labelledby, and aria-describedby?
Give a concrete example of when to use each.
Interview Q What is the first rule of ARIA? Give three examples of ARIA being used incorrectly
and how you would fix them.
Interview Q Make this icon button accessible: <button><svg>...</svg></button>
References
• ARIA APG — Design Patterns and Examples
• MDN — ARIA
• WebAIM — Screen Reader User Survey
• Léonie Watson — Understanding Screen Reader Interaction
• ARIA in HTML — W3C spec
Topic 4 Color Contrast — Perceivable Design for
All Vision Conditions
Colour contrast ensures that text and UI components are readable by users with low vision, colour blindness,
and age-related vision changes. WCAG defines minimum contrast ratios using the relative luminance formula.
About 8% of men and 0.5% of women have colour blindness — this is not an edge case.
4.1 WCAG Contrast Ratios — The Numbers to Memorise
Content Type Level AA Ratio Level AAA Ratio Notes
```
Normal text (< 18pt / <
```
```
14pt bold)
```
4.5:1 7:1 Covers the vast majority
of body text
```
Large text (≥ 18pt or ≥
```
```
14pt bold)
```
3:1 4.5:1 Large text is easier to
read, so lower threshold
```
UI components (input
```
borders, icons, focus
```
indicators)
```
3:1 N/A Buttons, form field
outlines, interactive icons
Inactive / disabled
components
No requirement N/A Disabled state is
intentionally muted
Decorative content No requirement N/A Backgrounds, pure
decoration, logos
Logotypes No requirement N/A Brand logos are exempt
4.2 How Contrast Ratio is Calculated
```
// Contrast ratio formula: (L1 + 0.05) / (L2 + 0.05)
```
// Where L1 is the lighter colour's relative luminance,
// L2 is the darker colour's relative luminance.
// Relative luminance is calculated from sRGB values.
// Example pairs:
```
// Black (#000000) on White (#FFFFFF) → 21:1 (maximum possible)
```
```
// #767676 on White (#FFFFFF) → 4.54:1 (just passes AA for normal text)
```
```
// #949494 on White (#FFFFFF) → 3.03:1 (FAILS AA for normal text)
```
```
// Navy (#1F4E79) on White (#FFFFFF) → 9.0:1 (excellent)
```
```
// Yellow (#FFFF00) on White (#FFFFFF) → 1.07:1 (terrible — fails everything)
```
// You do NOT need to calculate this manually in interviews.
// The formula shows you understand the concept.
```
// In practice: use tools (see Topic 5).
```
```
// JavaScript implementation (for automated testing):
```
```
function getRelativeLuminance(hex) {
```
```
const rgb = hex.replace('#','').match(/.{2}/g)
```
```
.map(x => parseInt(x, 16) / 255)
```
```
.map(v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
```
```
return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
```
```
}
```
```
function getContrastRatio(hex1, hex2) {
```
```
const L1 = getRelativeLuminance(hex1);
```
```
const L2 = getRelativeLuminance(hex2);
```
```
const lighter = Math.max(L1, L2);
```
```
const darker = Math.min(L1, L2);
```
```
return (lighter + 0.05) / (darker + 0.05);
```
```
}
```
```
console.log(getContrastRatio('#1F4E79', '#FFFFFF').toFixed(2)); // 9.00
```
```
console.log(getContrastRatio('#767676', '#FFFFFF').toFixed(2)); // 4.54
```
4.3 Never Rely on Colour Alone — WCAG 1.4.1
```
WCAG 1.4.1 (Level A): Colour must not be the ONLY visual means of conveying information, indicating an
```
action, prompting a response, or distinguishing a visual element. About 300 million people worldwide have
colour blindness — they cannot distinguish red from green.
// ❌ WRONG — colour alone conveys error state
```
<input style={{ borderColor: hasError ? 'red' : 'green' }} />
```
// Red/green colour blindness: user sees no difference
// ✅ CORRECT — colour + icon + text
<div>
<input
```
style={{ borderColor: hasError ? '#DC2626' : '#16A34A' }}
```
```
aria-invalid={hasError}
```
```
aria-describedby={hasError ? 'error-msg' : undefined}
```
/>
```
{hasError && (
```
<span id='error-msg' role='alert'>
```
<svg aria-hidden='true'>⚠</svg> {/* icon — not colour alone */}
```
```
{' '}Email must contain @ symbol {/* text — not colour alone */}
```
</span>
```
)}
```
</div>
// ❌ WRONG — status conveyed only by colour
```
<span style={{ color: isOnline ? 'green' : 'red' }}>●</span>
```
// ✅ CORRECT — colour + text label
```
<span style={{ color: isOnline ? '#16A34A' : '#DC2626' }}
```
```
aria-label={isOnline ? 'Online' : 'Offline'}>
```
```
● {isOnline ? 'Online' : 'Offline'}
```
</span>
// ❌ WRONG — required fields shown only with red asterisk, no explanation
// ✅ CORRECT — explain the convention
<p>Fields marked with <span aria-hidden='true'>*</span>
<span className='sr-only'>an asterisk</span> are required.
</p>
// ❌ WRONG — active nav item shown only by colour
<nav>
```
<a href='/' style={{ color: 'red' }}>Home</a>
```
</nav>
// ✅ CORRECT — aria-current='page' + underline or weight
<nav>
<a href='/' aria-current='page'
```
style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Home</a>
```
</nav>
4.4 Practical Colour Choices for Accessible Design Systems
Use Case Minimum Ratio Example Accessible
Pair
Notes
Body text on white
background
4.5:1 #374151 on #FFFFFF
```
(10.7:1) — Tailwind
```
gray-700
Dark greys are easier to
read than pure black for
long text
Primary button text 4.5:1 White on #1D4ED8
```
(6.9:1) — Tailwind blue-
```
700
```
Check: does button text
```
contrast with the button
background colour
Error red text 4.5:1 #B91C1C on #FFFFFF
```
(7.4:1) — Tailwind red-
```
700
Bright red #FF0000 on
```
white = 3.99:1 — FAILS
```
AA for normal text
Success green text 4.5:1 #15803D on #FFFFFF
```
(5.74:1) — Tailwind
```
green-700
Bright green #00FF00
on white = 1.37:1 —
catastrophically fails
Placeholder text 4.5:1 #6B7280 on #FFFFFF
```
(5.74:1) — Tailwind
```
gray-500
Many designs use
placeholder that fails
contrast — a common
audit finding
Focus ring 3:1 vs adjacent #0066CC on white =
5.74:1 — passes
Must contrast with both
the element AND the
page background
Disabled text No requirement #9CA3AF or similar —
clearly muted
Signal disabled state
through muted
appearance + aria-
disabled
```
Link text (underlined) 4.5:1 vs background #1D4ED8 underlined =
```
passes
If no underline: 3:1 vs
adjacent AND 4.5:1 vs
background both
required
4.5 Dark Mode — Accessibility Considerations
// Dark mode inverts the challenge: dark background, light text
// You must re-verify contrast for BOTH light and dark themes
// CSS custom properties — the right way to handle both modes
```
:root {
```
```
--color-text: #1E293B; /* light mode: dark on white */
```
```
--color-text-muted: #64748B;
```
```
--color-bg: #FFFFFF;
```
```
--color-primary: #1D4ED8;
```
```
--color-error: #B91C1C;
```
```
}
```
```
@media (prefers-color-scheme: dark) {
```
```
:root {
```
```
--color-text: #E2E8F0; /* dark mode: light on dark */
```
```
--color-text-muted: #94A3B8;
```
```
--color-bg: #0F172A;
```
```
--color-primary: #60A5FA; /* blue-400: 7.07:1 on #0F172A */
```
```
--color-error: #F87171; /* red-400: 5.74:1 on #0F172A */
```
/* Note: different colours needed in dark mode to maintain contrast */
/* The 'dark mode' colour is NOT just the inverse of the light colour */
```
}
```
```
}
```
```
// User preference toggle (overrides OS setting):
```
```
const [theme, setTheme] = useState(
```
```
() => localStorage.getItem('theme') || 'system'
```
```
);
```
```
useEffect(() => {
```
```
const root = document.documentElement;
```
```
if (theme === 'dark') root.setAttribute('data-theme', 'dark');
```
```
else if (theme === 'light') root.removeAttribute('data-theme');
```
```
else root.removeAttribute('data-theme'); // 'system' — let media query decide
```
```
localStorage.setItem('theme', theme);
```
```
}, [theme]);
```
```
[data-theme='dark'] {
```
```
--color-text: #E2E8F0;
```
/* etc */
```
}
```
4.6 Reduced Motion — prefers-reduced-motion
```
WCAG 2.3.3 (Level AAA) and WCAG 2.3.1 (Level A) cover motion and animation. Many users with vestibular
```
disorders, epilepsy, or motion sensitivity experience physical discomfort from excessive animation. Always
respect the prefers-reduced-motion media query.
/* CSS — disable non-essential animations for users who prefer reduced motion */
```
@media (prefers-reduced-motion: reduce) {
```
*,
*::before,
```
*::after {
```
```
animation-duration: 0.01ms !important;
```
```
animation-iteration-count: 1 !important;
```
```
transition-duration: 0.01ms !important;
```
```
scroll-behavior: auto !important;
```
```
}
```
```
}
```
/* Better: only animate where it adds meaning, reduce everywhere else */
```
.spinner { animation: spin 1s linear infinite; }
```
```
@media (prefers-reduced-motion: reduce) {
```
```
.spinner { animation: none; } /* show static indicator instead */
```
```
}
```
/* JavaScript — check the preference */
```
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```
// In a React animation component:
```
function AnimatedCounter({ value }) {
```
```
const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)');
```
// If reduced: show value immediately without counting animation
```
if (prefersReduced) return <span>{value}</span>;
```
```
return <CountUpAnimation to={value} />;
```
```
}
```
// Three motion categories:
```
// Essential: loading indicator (must still be shown, just simpler)
```
```
// Functional: state change feedback (fade in/out OK if brief)
```
// Decorative: hero parallax, floating particles → remove entirely
Interview Q What is the WCAG contrast ratio requirement for normal text? What about large
text and UI components?
```
Interview Q A designer uses a bright red (#FF0000) error message on a white background. Is
```
this accessible? What would you change?
Interview Q 'We use a green border for success and red for error.' What WCAG principle does
this potentially violate and how do you fix it?
Interview Q How do you handle colour contrast when your app supports dark mode? Walk me
through your strategy.
References
• WebAIM — Contrast Checker
• Coolors — Accessible Colour Palette Generator
• WCAG 1.4.1 — Use of Color
```
• WCAG 1.4.3 — Contrast (Minimum)
```
• Whocanuse.com — Colour blindness simulator
Topic 5 Testing & Tools — Audit, Automate &
Verify
Accessibility testing cannot be fully automated — automated tools catch approximately 30-40% of WCAG
issues. The other 60-70% require manual keyboard testing, screen reader testing, and human judgement about
meaning and context. A complete testing strategy uses both.
5.1 The Four-Layer Testing Strategy
Layer When What It Catches What It Misses
1. Automated static
analysis
During development
```
(ESLint plugin)
```
Missing alt text, invalid
ARIA usage, form
without labels, heading
order, interactive div
without role
Logical errors: wrong
label, misleading alt
text, poor focus order
2. Automated browser
testing
```
CI pipeline (axe-core,
```
```
Playwright)
```
WCAG violations:
contrast, ARIA,
structure — on every
build
Context-dependent
issues, keyboard UX
feel, AT
announcements
3. Manual keyboard
testing
Before release Focus order, focus trap,
keyboard shortcuts,
escape key, all
interactive paths
reachable
Screen reader
behaviour, visual layout
context
4. Screen reader
testing
Before release & major
changes
Actual AT
announcements, live
region behaviour, modal
experience, form
completion
None — most
comprehensive layer,
but slowest
5.2 Automated Tools — axe DevTools & Lighthouse
```
// ── axe DevTools (Browser Extension) ─────────────────────────────
```
// Install: Chrome Extension 'axe DevTools' by Deque
// Run: DevTools → axe DevTools tab → 'Scan ALL of my page'
// Output: list of issues with:
// - Which WCAG criterion violated
// - Which HTML element is the problem
// - Why it is a problem
// - How to fix it
```
// - 'Best Practice' issues (not WCAG but recommended)
```
```
// ── axe-core — programmatic (for CI/CD) ───────────────────────────
```
// npm install axe-core @axe-core/react
// In development only — run axe on every render and log violations:
```
import React from 'react';
```
```
import ReactDOM from 'react-dom/client';
```
```
if (process.env.NODE_ENV !== 'production') {
```
```
import('@axe-core/react').then(axe => {
```
```
axe.default(React, ReactDOM, 1000); // check every 1s
```
```
});
```
```
}
```
```
// ── axe with Playwright (CI/CD) ───────────────────────────────────
```
```
import { test, expect } from '@playwright/test';
```
```
import AxeBuilder from '@axe-core/playwright';
```
```
test('checkout page has no WCAG AA violations', async ({ page }) => {
```
```
await page.goto('/checkout');
```
```
const results = await new AxeBuilder({ page })
```
```
.withTags(['wcag2a', 'wcag2aa', 'wcag21aa']) // only AA violations
```
```
.analyze();
```
```
expect(results.violations).toEqual([]);
```
```
});
```
// ── Lighthouse ────────────────────────────────────────────────────
// DevTools → Lighthouse tab → 'Accessibility' checkbox → Analyse
```
// Scores 0-100. Score of 100 ≠ fully accessible (only automated checks).
```
```
// Useful for: trend tracking, quick overview, CI integration (lighthouse-ci).
```
// lighthouse-ci: fail the build if accessibility score drops below 90.
// ── ESLint jsx-a11y plugin ────────────────────────────────────────
// npm install -D eslint-plugin-jsx-a11y
// .eslintrc.js:
// plugins: ['jsx-a11y']
// extends: ['plugin:jsx-a11y/recommended']
// Catches at write time:
// - <img> without alt
// - <a> without href
// - onClick on non-interactive element without role + keyboard handler
// - <label> not associated with a form control
// - Invalid ARIA attribute names
5.3 Manual Keyboard Testing — The Checklist
Plug in a physical keyboard. Disconnect your mouse. Navigate your entire application using only keyboard. Use
this checklist:
Test What to Check Pass Criteria
Tab order Tab through every page. Check
the sequence.
Focus moves in logical order
matching visual layout. No
element is skipped.
Focus visibility Watch where focus is at every
step.
Focus indicator is clearly visible
at all times. Never disappears.
All interactive elements Tab to every button, link, input,
select.
Every interactive element is
reachable by keyboard.
Activation Press Enter and Space on
buttons. Enter on links.
Buttons respond to both Enter
and Space. Links respond to
Enter.
Modal dialogs Open a modal. Tab through it. Focus is trapped inside modal.
Escape closes modal. Focus
returns to trigger.
Dropdowns and menus Open a menu with keyboard.
Navigate options.
Arrow keys navigate options.
Escape closes. Enter selects.
Custom widgets Test tabs, accordions, date
pickers.
Follows APG keyboard pattern
for that widget type.
```
Skip links Press Tab on page load (first
```
```
Tab press).
```
Skip link appears. Enter on it
jumps to main content.
Form completion Complete a form using only
keyboard.
Can reach and complete every
field. Can submit. Errors are
clear.
5.4 Screen Reader Testing — The Procedure
```
// ── QUICK TESTING SETUP (macOS VoiceOver) ───────────────────────
```
// Enable: Cmd + F5
// Disable: Cmd + F5
// Read: Ctrl + Option + Right arrow
```
// Rotor: Ctrl + Option + U (shows headings, links, landmarks, form controls)
```
// ── CORE SCREEN READER TEST SCENARIOS ────────────────────────────
// TEST 1: Page orientation
```
// • Navigate by headings (H key in NVDA/JAWS, VO+Cmd+H in VoiceOver)
```
// • Is the heading structure logical? Does it describe the page?
// • Navigate by landmarks — can you jump to main, nav, search?
// TEST 2: Form completion
// • Tab to each field. Does the label announce correctly?
// • Submit with validation errors. Are errors announced?
// • Does aria-describedby provide helpful additional context?
// TEST 3: Dynamic content
// • Trigger a loading state. Is 'Loading...' announced?
// • Complete the load. Are results announced?
// • Trigger a form error. Is the error announced immediately?
// • Show a toast notification. Is it announced?
// TEST 4: Interactive widgets
// • Open a modal. Does AT announce it as a dialog with its name?
// • Is focus trapped? Does Escape close it?
// • Open a dropdown. Are options navigable? Is selected state announced?
// TEST 5: Images and icons
// • Are informative images announced with meaningful alt text?
```
// • Are decorative images ignored (alt='' or aria-hidden)?
```
```
// • Are icon buttons announced with their function (not 'image')?
```
// ── COMMON SCREEN READER BUGS FOUND ONLY BY MANUAL TESTING ───────
```
// • aria-label conflicts with visible label (AT reads aria-label, not label text)
```
// • Live region fires before AT has finished reading the trigger
// • Focus moved programmatically but AT doesn't follow it
// • Role='presentation' on something that IS meaningful to AT users
// • aria-hidden='true' on an element that still receives keyboard focus
5.5 CI/CD Integration — Automated Accessibility Gates
// ── OPTION 1: Playwright + axe in CI ─────────────────────────────
// .github/workflows/accessibility.yml
// runs: npx playwright test --project=chromium tests/a11y.spec.ts
// a11y.spec.ts — run on all critical pages
const CRITICAL_PAGES = [
```
{ name: 'Home', path: '/' },
```
```
{ name: 'Product', path: '/products/1' },
```
```
{ name: 'Checkout', path: '/checkout' },
```
```
{ name: 'Login', path: '/login' },
```
```
];
```
```
for (const page of CRITICAL_PAGES) {
```
```
test(`${page.name} has no WCAG AA violations`, async ({ page: pw }) => {
```
```
await pw.goto(page.path);
```
```
await pw.waitForLoadState('networkidle');
```
```
const results = await new AxeBuilder({ page: pw })
```
```
.withTags(['wcag2a', 'wcag2aa'])
```
```
.analyze();
```
```
if (results.violations.length > 0) {
```
```
console.log(JSON.stringify(results.violations, null, 2));
```
```
}
```
```
expect(results.violations).toHaveLength(0);
```
```
});
```
```
}
```
// ── OPTION 2: Lighthouse CI ──────────────────────────────────────
// lighthouserc.json
```
{
```
```
'ci': {
```
```
'assert': {
```
```
'assertions': {
```
```
'categories:accessibility': ['error', { 'minScore': 0.9 }]
```
// fail build if accessibility score drops below 90
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
}
```
// ── OPTION 3: ESLint in pre-commit hook ──────────────────────────
// .husky/pre-commit
// npx eslint --plugin jsx-a11y src/ --ext .jsx,.tsx
// Catches: missing alt, invalid ARIA, interactive div without role
// Runs before every commit — fastest feedback loop
5.6 Building an Accessible Design System — Component Contracts
// Every component in a design system should document its a11y contract:
/**
- Button Component
*
- Accessibility contract:
- - Uses native <button> element — keyboard operability built-in
- - If icon-only: MUST receive aria-label prop (enforced by TypeScript)
- - Loading state: sets aria-disabled and aria-busy, announces 'Loading'
- - Disabled state: uses disabled attribute (not aria-disabled alone)
*
- @example
- // Text button — no special a11y props needed
- <Button>Add to Cart</Button>
*
- // Icon button — aria-label required
- <Button variant='icon' aria-label='Close dialog'>
- <CloseIcon aria-hidden='true' />
- </Button>
*/
```
interface ButtonProps {
```
```
children: React.ReactNode;
```
```
variant?: 'primary' | 'secondary' | 'icon';
```
```
// aria-label required when variant='icon' (no visible text)
```
```
'aria-label'?: string;
```
```
isLoading?: boolean;
```
```
disabled?: boolean;
```
```
}
```
```
function Button({ children, variant, isLoading, disabled, ...rest }) {
```
```
return (
```
<button
```
disabled={disabled || isLoading} // native disabled = no keyboard access needed
```
```
aria-busy={isLoading}
```
```
{...rest}
```
>
```
{isLoading ? (
```
<>
<Spinner aria-hidden='true' />
<span className='sr-only'>Loading, please wait</span>
</>
```
) : children}
```
</button>
```
);
```
```
}
```
Interview Q What percentage of WCAG issues can automated tools like axe catch? What kinds
of issues can only be found with manual testing?
Interview Q Walk me through your complete accessibility testing process before shipping a new
feature.
Interview Q How would you integrate accessibility testing into a CI/CD pipeline? Where would
you put the gates and what would they check?
Interview Q You are building a design system. How do you ensure every component shipped in
the library meets accessibility requirements?
References
• axe DevTools — Chrome Extension by Deque
• @axe-core/playwright — CI automation
• eslint-plugin-jsx-a11y
• WebAIM — Screen Reader Testing Guide
• Radix UI — Accessible primitives
• Headless UI — Accessible unstyled components
• WCAG 2.2 Quick Reference
Master Cheat Sheet All 5 Topics at a Glance
Complete Accessibility Decision Reference
When you need to... Do this Never do this
```
Create a clickable action Use <button> (activates on Enter
```
- Space)
<div onclick> — no role, no
keyboard, not focusable
Create a navigation link Use <a href='...'> <div onclick> that changes the
URL — AT treats it as non-link
Label a form field <label for='id'> or wrap input in
<label>
Placeholder as the only label —
disappears on type
Label an icon button aria-label='Close dialog' on
<button>
Leave icon buttons with no text
and no aria-label
Mark current nav item aria-current='page' on the active
link
Colour alone to indicate active
state
Show/hide content aria-expanded='true/false' + aria-
controls
Change visibility without
updating ARIA states
Indicate a loading state aria-busy='true' + aria-live region
announcement
Show a spinner with no AT
announcement — user hears
nothing
Report a form error role='alert' or aria-live='polite' +
aria-invalid='true' + aria-
describedby
Red border alone — invisible to
AT users
Hide decorative content aria-hidden='true' or alt='' on
images
aria-hidden='true' on a focusable
element — keyboard user is
stuck
Trap focus in a modal Focus trap + Escape closes +
return focus on close
Allow Tab to leave modal —
keyboard user loses context
Skip repetitive navigation Skip link as first focusable
element in <body>
Force users to Tab through 30
nav links on every page
Announce dynamic content aria-live region or
```
role='status'/'alert'
```
Inject content without any live
region — AT never announces it
Test contrast ratios WebAIM contrast checker / axe
DevTools
Trust your design eye — human
vision varies enormously
```
Respect motion preference @media (prefers-reduced-
```
```
motion: reduce)
```
Apply animations to everyone
regardless of their OS
preference
WCAG Level AA — The Critical Numbers
Requirement WCAG Criterion Value / Rule
Normal text contrast 1.4.3 AA 4.5:1 minimum ratio with
background
```
Large text contrast 1.4.3 AA 3:1 minimum (≥ 18pt or ≥ 14pt
```
```
bold)
```
UI component contrast 1.4.11 AA 3:1 for input borders, icons,
focus rings
```
Focus indicator 2.4.7 AA (2.4.11 WCAG 2.2 AA) Visible focus — minimum 2px
```
outline, 3:1 contrast
Colour alone 1.4.1 A Colour must NOT be the only
cue
Keyboard accessible 2.1.1 A All functionality operable by
keyboard
No keyboard trap 2.1.2 A User can always Tab out of any
component
Skip navigation 2.4.1 A Mechanism to bypass repeated
content
Page title 2.4.2 A <title> describes the current
page
Focus order 2.4.3 A Tab order is logical and
meaningful
Link purpose 2.4.4 A Link text identifies destination
from context
Language 3.1.1 A <html lang='en'> set correctly
Error identification 3.3.1 A Errors identified with text
description, not just colour
Labels or instructions 3.3.2 A All form fields have labels
Error suggestion 3.3.3 AA Suggest how to correct errors in
text
```
KEY INSIGHT In a system design interview, the accessibility answer structure is: (1) SEMANTIC
```
```
HTML as the foundation — it is free accessibility. (2) KEYBOARD — every path
```
```
Tab-accessible, focus visible, trap in modals, skip links. (3) SCREEN READER —
```
ARIA roles/states/properties, accessible names, live regions for dynamic content.
```
(4) COLOUR — 4.5:1 for text, 3:1 for UI, never colour alone. (5) TESTING — axe
```
in CI, keyboard manual test, screen reader test. This five-part structure answers
any accessibility design question comprehensively.
Accessibility is not a feature — it is the quality of the product. Build it in from the start, not
bolted on at the end.