# Neev

See who holds you, and reach them. No account; everything stays on the phone.

## What is here

| Path | What it is | State |
| --- | --- | --- |
| `apps/pilot` | The tested v6 prototype as an installable, offline PWA (service worker, IndexedDB backup of state, bench hidden unless `?bench`). Ship this to the first 200 testers. | Builds, runs offline, survives localStorage eviction |
| `packages/core` | Typed, dependency-free core: rings, portfolio, kindest gap, crisis gate, AI charter, device boundary, draft orchestration with fallback. The rewrite's foundation. | 21 tests passing |
| `workers/api` | The only server code: anonymous weekly counts (D1) and a structure-only draft relay (Workers AI) that refuses any payload able to carry text. | 7 tests passing, bundles with wrangler |

## Run it

```bash
npm ci
npm run check          # types, tests, build
npm run dev -w @neev/pilot
```

## Deploy

1. Cloudflare account → `npx wrangler login`.
2. Pilot: `npx wrangler pages deploy apps/pilot/dist --project-name neev` (or push to `main`; CI deploys with the two secrets set).
3. API: `cd workers/api && npx wrangler d1 create neev`, paste the id into `wrangler.toml`, `npx wrangler d1 execute neev --file schema.sql --remote`, `npx wrangler deploy`.

## Rules every change must keep

Read [CHARTER.md](CHARTER.md). The tests enforce most of it; review enforces the rest.
