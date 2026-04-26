# Frontend Architecture Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the WebSocket connection state machine, move polling ownership to the store, and replace hardcoded URLs with Vite env vars.

**Architecture:** The existing Vue 3 + Pinia + `@hapi/nes` WebSocket architecture is correct and stays unchanged. The store gains a `wsConnected` state flag and manages its own fallback poll lifecycle. `AvailSongList.vue` is simplified to an initial-fetch-only component.

**Tech Stack:** Vue 3, Pinia, Vite, `@hapi/nes` 14.x, axios, Vitest, `@vue/test-utils`, jsdom

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `frontend/src/stores/display.js` | Modify | Add `wsConnected` state; reconnect/poll logic; env var URLs |
| `frontend/src/components/AvailSongList.vue` | Modify | Remove `setInterval`; keep single `fetchState()` on mount |
| `frontend/.env.production` | Create | Production URLs baked into `vite build` output |
| `frontend/.env.local` | Create (gitignored) | Dev URLs for `vite dev` — covered by `*.local` in `.gitignore` |
| `frontend/vite.config.js` | Modify | Add Vitest test config |
| `frontend/package.json` | Modify | Add `vitest`, `@vue/test-utils`, `jsdom`; add `test` script |
| `frontend/src/stores/__tests__/display.test.js` | Create | Unit tests for connection state machine and poll lifecycle |

---

## Task 1: Set Up Vitest

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/vite.config.js`

- [ ] **Step 1: Install test dependencies**

Run in `frontend/`:
```bash
npm install --save-dev vitest @vue/test-utils jsdom
```
Expected: packages added to `node_modules`, `package-lock.json` updated.

- [ ] **Step 2: Add test script to package.json**

In `frontend/package.json`, add `"test": "vitest"` to `"scripts"`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --fix",
    "format": "prettier --write src/",
    "test": "vitest"
  }
}
```

- [ ] **Step 3: Add test config to vite.config.js**

Replace the full contents of `frontend/vite.config.js` with:
```js
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  server: {
    host: true,
    port: 8080,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    env: {
      VITE_API_BASE_URL: 'http://localhost:7654/api',
      VITE_WS_URL: 'ws://localhost:7654/ws',
    },
  },
})
```

- [ ] **Step 4: Create test directory and a smoke-test file**

Create `frontend/src/stores/__tests__/display.test.js` with:
```js
import { describe, it, expect } from 'vitest'

describe('placeholder', () => {
  it('vitest is working', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 5: Run the smoke test**

Run in `frontend/`:
```bash
npm test -- --run
```
Expected output:
```
✓ src/stores/__tests__/display.test.js > placeholder > vitest is working

Test Files  1 passed (1)
Tests       1 passed (1)
```

- [ ] **Step 6: Commit**

```bash
git add frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/src/stores/__tests__/display.test.js
git commit -m "chore: add vitest testing infrastructure"
```

---

## Task 2: Create Environment Variable Files

**Files:**
- Create: `frontend/.env.production`
- Create: `frontend/.env.local`

Note: `frontend/.gitignore` already contains `*.local`, so `.env.local` is automatically gitignored.

- [ ] **Step 1: Create .env.production**

Create `frontend/.env.production` with:
```
VITE_API_BASE_URL=https://vote-now.org/api
VITE_WS_URL=wss://vote-now.org/ws
```

- [ ] **Step 2: Create .env.local**

Create `frontend/.env.local` with:
```
VITE_API_BASE_URL=http://localhost:7654/api
VITE_WS_URL=ws://localhost:7654/ws
```

- [ ] **Step 3: Verify .env.local is gitignored**

Run:
```bash
git check-ignore -v frontend/.env.local
```
Expected: `frontend/.gitignore:16:*.local	frontend/.env.local`

If not ignored, add `.env.local` to `frontend/.gitignore` manually.

- [ ] **Step 4: Commit**

```bash
git add frontend/.env.production
git commit -m "chore: add Vite environment variable files for dev and production URLs"
```

(Do NOT `git add frontend/.env.local` — it is gitignored and local-only.)

---

## Task 3: Replace Hardcoded URLs with Env Vars

**Files:**
- Modify: `frontend/src/stores/display.js`

- [ ] **Step 1: Write the failing test**

Replace the smoke test in `frontend/src/stores/__tests__/display.test.js` with:
```js
import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        votesRemaining: { remaining: 8, status: 'OK', snowmanId: -1 },
        model: {
          songs: [],
          snowmenQueue: [],
          nameQueue: [],
          current: { status: 'idle', enabled: true, nameStatus: '', secondsTotal: -1, secondsRemaining: -1, isDisplayHours: false, isShortList: false, title: '' },
          health: { lastStats: new Date().toISOString(), status: 'OK' },
          stats: {},
          powerStats: { kwh: 0, dollars: 0 },
          nameEstimates: { estimated_seconds: 0, message: '' },
        },
      },
    }),
    post: vi.fn().mockResolvedValue({
      data: {
        votesRemaining: { remaining: 7, status: 'OK', snowmanId: -1 },
        model: {
          songs: [], snowmenQueue: [], nameQueue: [],
          current: { status: 'idle', enabled: true, nameStatus: '', secondsTotal: -1, secondsRemaining: -1, isDisplayHours: false, isShortList: false, title: '' },
          health: { lastStats: new Date().toISOString(), status: 'OK' },
          stats: {}, powerStats: { kwh: 0, dollars: 0 },
          nameEstimates: { estimated_seconds: 0, message: '' },
        },
      },
    }),
    delete: vi.fn().mockResolvedValue({
      data: {
        votesRemaining: { remaining: 9, status: 'OK', snowmanId: -1 },
        model: {
          songs: [], snowmenQueue: [], nameQueue: [],
          current: { status: 'idle', enabled: true, nameStatus: '', secondsTotal: -1, secondsRemaining: -1, isDisplayHours: false, isShortList: false, title: '' },
          health: { lastStats: new Date().toISOString(), status: 'OK' },
          stats: {}, powerStats: { kwh: 0, dollars: 0 },
          nameEstimates: { estimated_seconds: 0, message: '' },
        },
      },
    }),
  },
}))

vi.mock('@hapi/nes/lib/client', () => {
  let instance
  const MockClient = vi.fn().mockImplementation(() => {
    instance = { connect: vi.fn().mockResolvedValue(undefined), onConnect: null, onDisconnect: null, onUpdate: null }
    return instance
  })
  MockClient.getInstance = () => instance
  return { default: MockClient }
})

import axios from 'axios'
import { displayStore } from '../display'

describe('displayStore - URL configuration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('fetchState calls the API base URL from env', async () => {
    const store = displayStore()
    await store.fetchState()
    expect(axios.get).toHaveBeenCalledWith('http://localhost:7654/api/queue')
  })

  it('addVote calls the API base URL from env', async () => {
    const store = displayStore()
    await store.addVote(42)
    expect(axios.post).toHaveBeenCalledWith('http://localhost:7654/api/vote/42')
  })

  it('removeVote calls the API base URL from env', async () => {
    const store = displayStore()
    await store.removeVote(42)
    expect(axios.delete).toHaveBeenCalledWith('http://localhost:7654/api/vote/42')
  })

  it('addSnowmanVote calls the API base URL from env', async () => {
    const store = displayStore()
    await store.addSnowmanVote(3)
    expect(axios.post).toHaveBeenCalledWith('http://localhost:7654/api/votesnowman/3')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run in `frontend/`:
```bash
npm test -- --run
```
Expected: FAIL — tests call `https://vote-now.org/api/...` but expect `http://localhost:7654/api/...`.

- [ ] **Step 3: Replace hardcoded URLs in display.js**

In `frontend/src/stores/display.js`, update the four action methods and `initWS`:

Change `fetchState`:
```js
async fetchState() {
  let r = await axios.get(import.meta.env.VITE_API_BASE_URL + '/queue')
  this.setSongs(r.data)
  this.setPublic(r.data.model)
},
```

Change `addVote`:
```js
async addVote(id) {
  let r = await axios.post(import.meta.env.VITE_API_BASE_URL + '/vote/' + id)
  this.setSongs(r.data)
  this.setPublic(r.data.model)
},
```

Change `addSnowmanVote`:
```js
async addSnowmanVote(id) {
  let r = await axios.post(import.meta.env.VITE_API_BASE_URL + '/votesnowman/' + id)
  this.setSongs(r.data)
  this.setPublic(r.data.model)
},
```

Change `removeVote`:
```js
async removeVote(id) {
  let r = await axios.delete(import.meta.env.VITE_API_BASE_URL + '/vote/' + id)
  this.setSongs(r.data)
  this.setPublic(r.data.model)
},
```

Change the WebSocket URL in `initWS`:
```js
client = new Nes.Client(import.meta.env.VITE_WS_URL)
```

Also remove the commented-out localhost lines.

- [ ] **Step 4: Run the tests and verify they pass**

```bash
npm test -- --run
```
Expected:
```
✓ src/stores/__tests__/display.test.js > displayStore - URL configuration > fetchState calls the API base URL from env
✓ src/stores/__tests__/display.test.js > displayStore - URL configuration > addVote calls the API base URL from env
✓ src/stores/__tests__/display.test.js > displayStore - URL configuration > removeVote calls the API base URL from env
✓ src/stores/__tests__/display.test.js > displayStore - URL configuration > addSnowmanVote calls the API base URL from env

Test Files  1 passed (1)
Tests       4 passed (4)
```

- [ ] **Step 5: Verify dev server still works**

Run `npm run dev` in `frontend/`. Open browser at `http://localhost:8080`. Verify the page loads and data displays. Stop the server with Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/stores/display.js frontend/src/stores/__tests__/display.test.js
git commit -m "feat: replace hardcoded URLs with Vite env vars"
```

---

## Task 4: Implement Connection State Machine and Fallback Poll

**Files:**
- Modify: `frontend/src/stores/display.js`
- Modify: `frontend/src/stores/__tests__/display.test.js`

- [ ] **Step 1: Write the failing tests**

Append the following describe block to the end of `frontend/src/stores/__tests__/display.test.js` (after the closing `}` of the URL tests describe block):

```js
import NesClient from '@hapi/nes/lib/client'

describe('displayStore - connection state machine', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    NesClient.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    // Clean up any running poll intervals
    const store = displayStore()
    store.stopFallbackPoll()
  })

  it('wsConnected starts as false', () => {
    const store = displayStore()
    expect(store.wsConnected).toBe(false)
  })

  it('startFallbackPoll starts a 10-second interval', () => {
    const store = displayStore()
    const spy = vi.spyOn(global, 'setInterval')
    store.startFallbackPoll()
    expect(spy).toHaveBeenCalledWith(expect.any(Function), 10000)
  })

  it('startFallbackPoll does not start a second interval if already running', () => {
    const store = displayStore()
    const spy = vi.spyOn(global, 'setInterval')
    store.startFallbackPoll()
    store.startFallbackPoll()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('stopFallbackPoll clears a running interval', () => {
    const store = displayStore()
    const spy = vi.spyOn(global, 'clearInterval')
    store.startFallbackPoll()
    store.stopFallbackPoll()
    expect(spy).toHaveBeenCalled()
  })

  it('onConnect handler sets wsConnected to true and stops poll', async () => {
    const store = displayStore()
    const stopSpy = vi.spyOn(store, 'stopFallbackPoll')
    await store.initWS()
    const client = NesClient.getInstance()
    client.onConnect()
    expect(store.wsConnected).toBe(true)
    expect(stopSpy).toHaveBeenCalled()
  })

  it('onDisconnect handler sets wsConnected to false', async () => {
    const store = displayStore()
    await store.initWS()
    const client = NesClient.getInstance()
    client.onConnect()
    client.onDisconnect()
    expect(store.wsConnected).toBe(false)
  })

  it('onDisconnect starts fallback poll after 10 seconds if still disconnected', async () => {
    const store = displayStore()
    const startSpy = vi.spyOn(store, 'startFallbackPoll')
    await store.initWS()
    const client = NesClient.getInstance()
    client.onDisconnect()
    vi.advanceTimersByTime(10000)
    expect(startSpy).toHaveBeenCalled()
  })

  it('fallback poll does not start if WebSocket reconnects within 10 seconds', async () => {
    const store = displayStore()
    const startSpy = vi.spyOn(store, 'startFallbackPoll')
    await store.initWS()
    const client = NesClient.getInstance()
    client.onDisconnect()
    // Reconnect before the 10-second timeout fires
    client.onConnect()
    vi.advanceTimersByTime(10000)
    expect(startSpy).not.toHaveBeenCalled()
  })

  it('starts fallback poll immediately if initial connect throws', async () => {
    const store = displayStore()
    const startSpy = vi.spyOn(store, 'startFallbackPoll')
    // Make connect fail on the next call only
    NesClient.mockImplementationOnce(() => ({
      connect: vi.fn().mockRejectedValue(new Error('connection refused')),
      onConnect: null,
      onDisconnect: null,
      onUpdate: null,
    }))
    await store.initWS()
    expect(startSpy).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
npm test -- --run
```
Expected: the 8 new connection state machine tests all FAIL (store has no `wsConnected`, no `startFallbackPoll`, no `stopFallbackPoll`). The 4 URL tests from Task 3 should still pass.

- [ ] **Step 3: Add wsConnected to store state and module-level poll variable**

In `frontend/src/stores/display.js`, add `let pollInterval = null` on the line after `var client = undefined`:
```js
var client = undefined
let pollInterval = null
```

Add `wsConnected: false` to the state object (after `lastUpdatedTS`):
```js
lastUpdatedTS: 'Never',
wsConnected: false,
```

- [ ] **Step 4: Add startFallbackPoll and stopFallbackPoll actions**

In `frontend/src/stores/display.js`, add these two actions inside the `actions` object, before `setSongs`:
```js
startFallbackPoll() {
  if (pollInterval) return
  this.fetchState()
  pollInterval = setInterval(this.fetchState, 10000)
},
stopFallbackPoll() {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
},
```

- [ ] **Step 5: Replace initWS with the new connection state machine**

Replace the entire `initWS` action in `frontend/src/stores/display.js`:
```js
async initWS() {
  client = new Nes.Client(import.meta.env.VITE_WS_URL)

  client.onConnect = () => {
    this.wsConnected = true
    this.stopFallbackPoll()
  }

  client.onDisconnect = () => {
    this.wsConnected = false
    setTimeout(() => {
      if (!this.wsConnected) {
        this.startFallbackPoll()
      }
    }, 10000)
  }

  client.onUpdate = (update) => {
    this.setPublic(update)
  }

  try {
    await client.connect()
  } catch (e) {
    console.error('WebSocket connection failed, starting fallback poll', e)
    this.startFallbackPoll()
  }
},
```

- [ ] **Step 6: Run the tests and verify all pass**

```bash
npm test -- --run
```
Expected:
```
✓ displayStore - URL configuration (4 tests)
✓ displayStore - connection state machine (8 tests)

Test Files  1 passed (1)
Tests  12 passed (12)
```

- [ ] **Step 7: Commit**

```bash
git add frontend/src/stores/display.js frontend/src/stores/__tests__/display.test.js
git commit -m "feat: implement WebSocket connection state machine with fallback poll"
```

---

## Task 5: Fix AvailSongList.vue

**Files:**
- Modify: `frontend/src/components/AvailSongList.vue`

- [ ] **Step 1: Remove setInterval from AvailSongList.vue**

In `frontend/src/components/AvailSongList.vue`, replace the `onMounted` block:

Current:
```js
onMounted(() => {
  display.fetchState()
  setInterval(display.fetchState, 10000)
})
```

Replace with:
```js
onMounted(() => {
  display.fetchState()
})
```

Also remove `onMounted` from the import if it's the only use — check the import line:
```js
import { computed, onMounted } from 'vue'
```
`onMounted` is still used, so keep the import as-is.

- [ ] **Step 2: Run the full test suite**

```bash
npm test -- --run
```
Expected: all 12 tests still pass. There are no component tests for `AvailSongList` — that is acceptable since the behavior is now fully covered by the store tests.

- [ ] **Step 3: Manual smoke test**

Run `npm run dev` in `frontend/`. Open `http://localhost:8080`. Verify:
- Page loads and shows song list
- Vote buttons respond immediately
- `Last Updated` timestamp in the footer advances every 1-2 seconds (confirming WebSocket is active)
- No errors in browser console

Stop the server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/AvailSongList.vue
git commit -m "fix: move polling ownership to store, remove interval from AvailSongList"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Connection state machine with `wsConnected` flag — Task 4
- ✅ Fallback poll starts only when disconnected — Task 4 (`onDisconnect` + 10s timeout)
- ✅ Fallback poll stops when WebSocket reconnects — Task 4 (`onConnect` calls `stopFallbackPoll`)
- ✅ Poll ownership moved to store — Tasks 4 and 5
- ✅ Component does initial fetch only — Task 5
- ✅ Env vars for URLs — Tasks 2 and 3
- ✅ `.env.local` gitignored — Task 2 (covered by existing `*.local` rule)

**Placeholder scan:** No TBDs, TODOs, or vague steps found.

**Type consistency:** `startFallbackPoll` / `stopFallbackPoll` / `wsConnected` / `fetchState` names are consistent across all tasks.
