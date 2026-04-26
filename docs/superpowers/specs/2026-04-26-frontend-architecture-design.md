# Frontend Architecture Design
**Date:** 2026-04-26  
**Status:** Approved

## Context

The Christmas Vote Now frontend is a Vue 3 SPA that lets visitors vote for the next Christmas light show song and see what others are voting for in near real-time. The backend is a Hapi.js server using `@hapi/nes` for WebSocket support, driven by an MQTT broker that fires every 1-2 seconds. At peak the site serves ~80 concurrent users.

## Current Architecture (Correct, Needs Fixes)

The overall architecture is correct and does not need to change:

- **Vue 3 + Pinia + Vue Router** — appropriate SPA stack
- **WebSocket push via `@hapi/nes`** — server broadcasts the full data model on every MQTT event (~1-2s), giving all connected users near-real-time vote updates
- **HTTP POST/DELETE for voting** — the voting user gets immediate feedback from the response; all other users see the change on the next MQTT broadcast (~1-2s later)

The problems are implementation issues within this correct architecture.

## Problems to Fix

### 1. Polling fallback runs unconditionally alongside the WebSocket

`AvailSongList.vue` calls `setInterval(display.fetchState, 10000)` on mount regardless of WebSocket connection state. Every client always runs both the WebSocket and the 10-second poll simultaneously. The intent was a fallback for WebSocket failure, but the implementation makes it always-on.

### 2. A component owns a global side effect with no cleanup

`AvailSongList.vue` starts the polling interval and never clears it. If the component unmounts and remounts, a second interval starts. The store — not a component — should own all polling lifecycle.

### 3. No WebSocket reconnection logic

`onDisconnect` logs to the console but takes no action. If the WebSocket drops, the app silently goes stale until the user refreshes.

### 4. Hardcoded URLs

`https://vote-now.org/api/...` and `wss://vote-now.org/ws` are hardcoded strings in the store, with commented-out localhost alternatives. This creates copy/paste risk and makes switching between dev and prod manual.

## Design

### Connection State Machine

Add `wsConnected: false` to store state. The connection lifecycle:

1. **App mounts** → `initWS()` → attempt `client.connect()`
2. **`onConnect`** → set `wsConnected = true`, call `stopFallbackPoll()`
3. **`onDisconnect`** → set `wsConnected = false`, schedule reconnect attempt after 3s
4. **Reconnect attempt** → call `client.connect()` again
   - Success → `onConnect` fires, poll stops
   - Failure → wait 3s, retry; after 3 failed attempts, call `startFallbackPoll()`
5. **Fallback poll** → `setInterval(fetchState, 10000)` — runs only while WebSocket is down

### Poll Ownership Moves to the Store

`startFallbackPoll()` and `stopFallbackPoll()` are store actions, called only by the connection state machine. The store holds the interval handle internally.

`AvailSongList.vue` retains a single `display.fetchState()` call in `onMounted` for the initial data load (the WebSocket may not have broadcast yet). It no longer manages any interval.

### Environment Variables via Vite

Replace hardcoded URLs with Vite env vars, baked into the bundle at build time:

| Variable | Dev (`.env.local`) | Prod (`.env.production`) |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:7654/api` | `https://vote-now.org/api` |
| `VITE_WS_URL` | `ws://localhost:7654/ws` | `wss://vote-now.org/ws` |

`.env.local` is gitignored. `.env.production` is committed. Apache serves static files with prod URLs already compiled in — no Apache config changes needed.

## Files Affected

| File | Change |
|---|---|
| `src/stores/display.js` | Add `wsConnected` state; implement reconnect logic in `onDisconnect`; add `startFallbackPoll` / `stopFallbackPoll` actions; replace hardcoded URLs with `import.meta.env.*` |
| `src/components/AvailSongList.vue` | Remove `setInterval`; keep single `fetchState()` in `onMounted` |
| `.env.production` | New file — production URLs |
| `.env.local` | New file (gitignored) — localhost URLs for dev |
| `.gitignore` | Ensure `.env.local` is listed |

## Out of Scope

- Replacing `@hapi/nes` with SSE (not needed at this scale)
- Splitting the monolithic `displayStore` (works fine, not causing problems)
- Any server-side changes
