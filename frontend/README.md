# vote-now-frontend

See the [main README](../README.md) for full setup instructions, environment variable configuration, and development workflow.

## Quick Start

```sh
nvm use 22
npm install
npm run dev        # development server at http://localhost:8080
npm run build      # production build → dist/
npm run test       # run unit tests
npm run lint       # lint + auto-fix
npm run format     # format with Prettier
```

Environment files required:

- `.env.local` — development (not committed): set `VITE_API_BASE_URL` and `VITE_WS_URL`
- `.env.production` — production build: update to your production domain
