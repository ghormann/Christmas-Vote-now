# Christmas Light Show Voting Website

A real-time voting website that lets visitors choose which Christmas song plays next at a synchronized light show. Visitors cast votes from their phones, and the results are broadcast to [fppscheduler](https://github.com/ghormann/fppscheduler) via MQTT to influence the show's playlist.

## Architecture Overview

```
Visitor Browser
      │
      │  HTTP / WebSocket (Hapi NES)
      ▼
┌─────────────┐       MQTT        ┌──────────────────┐
│  Node.js    │ ◄────────────────►│  MQTT Broker     │
│  Hapi Server│                   └──────────────────┘
│  :7654      │                          │
└─────────────┘                          │ /christmas/...
      ▲                           ┌──────┴───────┐
      │  Built static files       │ fppscheduler │
┌─────────────┐                   │  (on FPP box)│
│  Vue 3 +    │                   └──────────────┘
│  Vite       │
│  Frontend   │
└─────────────┘
```

- **Frontend** (`frontend/`) — Vue 3 SPA built with Vite. Served as static files by a web server (e.g., nginx). Communicates with the backend via REST and a persistent WebSocket subscription.
- **Backend** (`server/`) — Hapi.js server. Manages vote state, pushes real-time updates to all connected clients via [Hapi NES](https://hapi.dev/module/nes/) WebSockets, and relays votes/status to/from an MQTT broker.
- **MQTT Broker** — External broker (e.g., Mosquitto). The server subscribes to status topics published by FPP and fppscheduler, and publishes vote data back.

## Prerequisites

- [Node.js](https://nodejs.org/) v22 (use `nvm use 22`)
- An MQTT broker reachable from the server
- [fppscheduler](https://github.com/ghormann/fppscheduler) running on the FPP box with MQTT prefix `/christmas`

---

## Backend Setup (`server/`)

### 1. Configuration file

Copy the example config and fill in your MQTT broker details:

```sh
cp server/greglights_config_example.json server/greglights_config.json
```

Edit `server/greglights_config.json`:

```json
{
  "username": "your-mqtt-username",
  "password": "your-mqtt-password",
  "port": 1883,
  "host": "192.168.1.x",
  "send_enabled": true
}
```

| Field | Description |
|---|---|
| `host` | Hostname or IP of the MQTT broker |
| `port` | MQTT broker port (1883 for plain, 8883 for TLS) |
| `username` | MQTT username |
| `password` | MQTT password |
| `send_enabled` | Set `false` to disable publishing votes/queues to MQTT (dry-run mode) |

> **Note:** `greglights_config.json` contains credentials — do not commit it. It is listed in `.gitignore`.

### 2. Install dependencies

```sh
cd server
nvm use 22
npm install
```

### 3. Run for development

```sh
node index.js
```

The server listens on port `7654` by default. Override with the `port` environment variable:

```sh
port=8000 node index.js
```

### 4. Run for production (Docker)

```sh
cd server
docker-compose build
docker-compose up -d
```

The `docker-compose.yml` binds the server to `127.0.0.1:7654` on the host. Front it with nginx or another reverse proxy for HTTPS.

### API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/queue` | Returns the full data model (songs, names, snowmen, votes remaining for session) |
| `GET` | `/model` | Returns the full data model (no session info) |
| `GET/POST` | `/vote/{id}` | Cast a vote for song with the given ID |
| `DELETE` | `/vote/{id}` | Remove a previously cast vote for song `{id}` |
| `GET/POST` | `/votesnowman/{id}` | Vote for a snowman display |
| `GET` | `/status` | Returns server health status |
| `GET` | `/ws` | WebSocket endpoint (Hapi NES) — subscribe to `/publicData` for real-time model pushes |

Sessions are tracked server-side via a cookie (Hapi Yar). Each session gets 8 votes, replenished by 1 every 2 minutes.

### MQTT Topics

The server subscribes to these topics (all under the `/christmas/` prefix):

| Topic | Purpose |
|---|---|
| `/christmas/nameQueue` | Name queue status from fppscheduler |
| `/christmas/scheduler/status` | Scheduler run state (on/off, short list mode, debug) |
| `/christmas/scheduler/name_estimate` | Estimated time until next name is generated |
| `/christmas/scheduler/all_playlist` | Full song list with durations |
| `/christmas/snowman/status` | Available snowman displays and current selection |
| `/christmas/falcon/player/fpp2/playlist_details` | Currently playing song from FPP |
| `/christmas/clock` | Show clock tick |
| `/christmas/todayPower` | Power consumption stats |
| `/christmas/vote/stats` | Aggregated vote statistics |
| `/christmas/vote/setShortList` | Toggle short-list mode |
| `/christmas/vote/debug` | Toggle debug mode |

The server publishes to:

| Topic | Purpose |
|---|---|
| `/christmas/vote/add` | Notify fppscheduler of a new song vote |
| `/christmas/snowmanvote/add` | Notify fppscheduler of a snowman vote |
| `/christmas/vote/songQueue` | Broadcast current song queue (every 2 s) |
| `/christmas/vote/snowmenQueue` | Broadcast current snowman queue (every 2 s) |
| `/christmas/personsName` | Submit a visitor's name to the name display queue |
| `/christmas/scheduler/requestSongs` | Request full playlist from fppscheduler on startup |

### Known Limitations

- The MQTT prefix `/christmas` is hard-coded in `lib/mymqtt.js`.
- The root redirect URL (`https://vote-now.org`) is hard-coded in `routes/index.js` but only used for a redirect on a 404.
- TLS MQTT is supported in the code but currently commented out; plain `mqtt://` is active.

---

## Frontend Setup (`frontend/`)

### 1. Environment files

Vite uses `.env` files to inject the backend URL at build time. Two files are used:

**`.env.local`** — used automatically during `npm run dev` (never committed):

```env
VITE_API_BASE_URL=http://localhost:7654
VITE_WS_URL=ws://localhost:7654/ws
```

**`.env.production`** — used automatically during `npm run build`:

```env
VITE_API_BASE_URL=https://your-domain.com/api
VITE_WS_URL=wss://your-domain.com/ws
```

Update `.env.production` to match your production server's domain before building.

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL for REST API calls to the Hapi server |
| `VITE_WS_URL` | WebSocket URL for real-time Hapi NES subscription |

### 2. Install dependencies

```sh
cd frontend
nvm use 22
npm install
```

### 3. Development server

```sh
npm run dev
```

Starts Vite dev server at `http://localhost:8080` (bound to all interfaces via `host: true` in `vite.config.js`). API requests proxy to the backend via the URL in `.env.local`.

### 4. Production build

```sh
npm run build
```

Outputs static files to `frontend/dist/`. Copy these to your web server's document root.

### 5. Other scripts

| Command | Description |
|---|---|
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint and auto-fix with ESLint |
| `npm run format` | Format source files with Prettier |
| `npm run test` | Run unit tests with Vitest |

### Frontend Pages

| Route | Component | Description |
|---|---|---|
| `/` | `HomeView` | Song voting — list of available songs with vote buttons |
| `/names` | `NameQueue` | Submit your name to appear on the light show name display |
| `/info` | `InfoView` | Show information and FAQ |
| `/stats` | `StatsView` | Voting and power usage statistics |
| `/other` | `OtherDisplaysView` | Other display elements (snowmen voting, etc.) |

### Key Dependencies

| Package | Purpose |
|---|---|
| Vue 3 + Vite | UI framework and build tool |
| Pinia | State management |
| Vue Router 4 | Client-side routing |
| `@hapi/nes` | WebSocket client for real-time server pushes |
| Axios | HTTP REST client |
| Bootstrap 5 | UI styling |

---

## Development Workflow

**Run backend and frontend in separate terminals:**

```sh
# Terminal 1 — backend
cd server && nvm use 22 && node index.js

# Terminal 2 — frontend
cd frontend && nvm use 22 && npm run dev
```

The frontend dev server at `http://localhost:8080` connects to the backend at `http://localhost:7654` as configured in `frontend/.env.local`.

## Production Deployment

1. Build the frontend: `cd frontend && npm run build`
2. Copy `frontend/dist/` files to your web server document root.
3. Configure your web server to reverse-proxy `/api/` and `/ws` to `http://127.0.0.1:7654`.
4. Start the backend via Docker: `cd server && docker-compose up -d`.
