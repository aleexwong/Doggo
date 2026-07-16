# PRD: Doggo Web — Dog Breed Guessing Game in an Android Emulator Frame

**Author:** Alex Wong
**Date:** 2026-07-16
**Status:** Draft

---

## 1. Overview

Doggo is an existing native Android app (Java, 2022): a multiple-choice dog breed
guessing game powered by the [Dog.CEO API](https://dog.ceo/dog-api/), with Firebase
auth and score storage. This project brings Doggo to the web as a playable,
fun mini-game embedded in Alex's personal React website — presented inside a
skeuomorphic **Android phone / emulator frame** so it feels like you're playing
the original app in the browser.

### Goal

Visitors to the personal site can play a polished dog-breed guessing game in
< 5 seconds, no install, no login — inside a convincing Android device frame
that nods to the project's origin as a native app.

### Non-Goals

- Running an actual Android emulator in the browser (e.g. streaming an AVD, or
  WASM emulation). This is heavy, slow, expensive to host, and unnecessary —
  the game logic is simple enough to reimplement natively in React. The
  "emulator" is a **visual frame**, not real emulation.
- Rebuilding the original Firebase auth flows (Google Sign-In, email/password).
  A personal-site game should have zero sign-up friction.
- Publishing anything back to the Play Store or modifying the Android app.

---

## 2. Background: What the Android App Does Today

Reference source: `app/src/main/java/com/bcit/doggo/`

| Feature | Android implementation | Web plan |
|---|---|---|
| Quiz round: dog photo + 4 breed choices | `DogFragment`, `DogViewModel`, `DogRepository` calling Dog.CEO | Reimplement in React |
| Breed list / random images | Dog.CEO REST API (free, no key, CORS-enabled) | Same API, called from the browser |
| Score persistence | Firebase Firestore per user | `localStorage` (v1); optional serverless leaderboard (v2) |
| Auth | Firebase Auth (Google, email/password) | None — anonymous play |
| Profile, tabs | `UserFragment`, `ViewPagerAdapter` | Not carried over |

---

## 3. Users & Use Cases

- **Site visitor / recruiter:** lands on the portfolio, sees an interactive
  phone on the projects page, plays a few rounds. Takeaway: this person ships
  fun, polished things.
- **Friends:** get sent the link, chase a high score / streak.
- **Alex:** a living portfolio piece that demonstrates the evolution of a
  school Android project into a modern web experience.

---

## 4. Product Requirements

### 4.1 The Android frame (the hook)

- A realistic phone chassis rendered in CSS/SVG: rounded bezel, camera
  punch-hole, status bar (clock, wifi/battery icons), and Android-style
  gesture bar at the bottom.
- Boot flourish: on first view (or on "power button" click), a brief
  Android-style boot animation (e.g. bouncing Doggo logo) before the game
  loads — 1–2 s max, skippable, shown once per session.
- Status bar clock shows the visitor's real local time.
- The frame is a reusable `<PhoneFrame>` component so other "apps" could be
  added to the site later.
- Responsive: fixed phone aspect ratio (~9:19.5) scaled to viewport; on
  mobile, the frame slims down or goes near-fullscreen so the game stays
  playable.

### 4.2 Core game loop (v1 — must have)

1. Fetch the full breed list from `https://dog.ceo/api/breeds/list/all` once
   at app start; flatten breed/sub-breed pairs into display names
   (e.g. "Golden Retriever").
2. Each round: pick a random correct breed, fetch a random image via
   `https://dog.ceo/api/breed/{breed}/images/random`, pick 3 distinct
   distractor breeds, shuffle 4 answer buttons.
3. Player taps an answer:
   - Correct → green flash, +points, streak increments.
   - Wrong → red flash on the tapped answer, correct answer highlighted.
4. Auto-advance to the next round after ~1.2 s (image for the next round is
   **prefetched** during the current round so rounds feel instant).
5. Game formats:
   - **Endless streak** (default): play until you miss; streak counter with
     personal best.
   - **Timed blitz**: 60 seconds, answer as many as possible.
6. Score HUD styled like an in-app top bar (Material-ish, matching the
   original app's look).

### 4.3 Fun & polish (v1)

- Micro-animations: image card slide/flip between rounds, button press
  states, confetti or paw-print burst on streak milestones (5, 10, 25...).
- Sound effects (bark on correct, whimper on wrong) — **muted by default**,
  toggle in the status bar; respect `prefers-reduced-motion`.
- Encouraging copy: streak flavor text ("Certified Dog Expert 🐾" at 10+).
- Loading states: skeleton/shimmer over the photo card, never a blank frame.
- Error state: if Dog.CEO is unreachable, show a friendly "the dogs are
  napping" screen with retry.

### 4.4 Persistence & sharing (v1)

- `localStorage`: best streak, best blitz score, games played, sound pref.
- "Share score" button → copies text like
  `I identified 14 dog breeds in a row on Doggo 🐶 <url>` to clipboard
  (Web Share API on mobile).

### 4.5 Site integration (v1)

- Delivered as a self-contained React component/package importable by the
  personal website (exact repo/route to match the site's stack).
- Route suggestion: `/doggo` (direct link for sharing) plus an embed on the
  projects page.
- SEO/social: OpenGraph card with a screenshot of the phone frame.
- A "View original Android source" link back to this GitHub repo.

### 4.6 v2 candidates (explicitly out of v1)

- Global leaderboard via a small serverless function + KV/Firestore, with
  a nickname prompt (no auth). Requires rate limiting / basic anti-cheat
  (server-issued round tokens) — deferred because it adds backend cost.
- Daily challenge (seeded breed set, same for everyone each day).
- Difficulty tiers (sub-breed distinctions, similar-breed distractor sets).
- "App drawer" home screen in the phone frame with other mini-apps.

---

## 5. Technical Design

### 5.1 Stack

- **React 18+** with TypeScript, Vite (or matching the site's existing
  toolchain — confirm before scaffolding).
- Plain CSS modules or Tailwind (match site convention) — no game engine
  needed; this is DOM/CSS animation territory. Framer Motion optional for
  transitions.
- State: a single `useReducer` game state machine
  (`boot → home → playing → roundResult → gameOver`). No Redux.
- No API key, no backend, no secrets in v1. Entire game is static-hostable.

### 5.2 Components

```
<DoggoApp>
 └─ <PhoneFrame>            // bezel, status bar, gesture bar, boot screen
     └─ <GameScreen>
         ├─ <ScoreHud>      // streak, timer, best
         ├─ <DogImageCard>  // photo, skeleton loader, transitions
         ├─ <AnswerGrid>    // 4 buttons, correct/wrong states
         └─ <ResultOverlay> // game over, share, play again
```

### 5.3 Dog.CEO API notes

- Free, no key, CORS-friendly, but **no SLA** — must handle failures
  gracefully (retry with backoff, cached fallback breed list bundled in the
  build so the answer grid never breaks).
- Some breed images are ambiguous/low quality; keep a small denylist
  mechanism for breeds that test badly.
- Normalize breed names: API returns `hound/afghan` → display "Afghan Hound".

### 5.4 Performance budgets

- Lazy-load the game bundle; the phone frame renders instantly with the boot
  screen while the bundle/breed list loads.
- Prefetch next-round image during the current round.
- Target: interactive < 2 s on 4G; bundle < 150 KB gzipped excluding images.

### 5.5 Accessibility

- All answers real `<button>`s, keyboard-playable (1–4 hotkeys), visible
  focus states, `aria-live` announcements for round results.
- Alt text: never leak the answer (use "a dog photo", not the breed).
- Color-blind-safe correct/wrong states (icons + color, not color alone).

---

## 6. Milestones

| # | Milestone | Scope | Est. |
|---|---|---|---|
| M1 | Playable core | Breed fetch, round loop, endless streak, plain UI | 1–2 days |
| M2 | Phone frame | `<PhoneFrame>`, status bar, boot animation, responsive | 1–2 days |
| M3 | Polish | Animations, sounds, milestones, error/loading states | 1–2 days |
| M4 | Site integration | Route/embed on personal site, OG card, share button | 1 day |
| M5 | Blitz mode + a11y pass | Timed mode, keyboard play, reduced motion | 1 day |

## 7. Success Metrics

- Median visitor plays ≥ 3 rounds (analytics event per round if the site has
  analytics; otherwise anecdotal).
- Game loads and first round is playable < 2 s on mobile.
- Zero-crash: API failure never shows a broken UI.

## 8. Open Questions

1. What stack is the personal website on (Next.js? Vite SPA?) — determines
   packaging (route in the same repo vs. separate package vs. iframe embed).
2. Should this live in a new repo (e.g. `doggo-web`) or a `web/` folder in
   this repo alongside the Android source?
3. Is a leaderboard worth the backend cost for v1, or is local best +
   share-to-clipboard enough? (PRD assumes the latter.)
4. Reuse the original app's launcher icon/branding assets from
   `app/src/main/res/` or refresh the branding?
