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

## Doors: one permanent link per entry point

Every episode, Short, book QR code and email gets its own short link on your own domain. The door sets the first words the person sees (episode doors open on that episode's question, in Hinglish); nothing about the person is recorded.

| Link | Opens from | Example |
| --- | --- | --- |
| `/1` … `/5` | The five episodes | `neev.example/1` in Ep 1's description and end screen |
| `/p` | Neev · Ek Parichay | |
| `/s/01` … `/s/32` | Each Short | Map Shorts to episodes in `N.shorts` in `p7-doors.js` |
| `/b/<book>` | Book QR codes: `village`, `noht`, `coherence`, `tps`, `tdor`, `lhq` | Print `neev.example/b/village` |
| `/m/<campaign>` | Email links | `/m/launch-jan` |
| `/c` | The course | |

Printed QR codes live for years: always print your own domain, never a `vercel.app` or `pages.dev` address.

## Deploy on Vercel

1. Import the GitHub repo in Vercel, set **Root Directory** to `apps/pilot`. `vercel.json` already sets install, build, output, the door rewrites and security headers.
2. Add your domain (for example `neev.twopointsingularity.com`) and make it the production domain.
3. Use Pro before the public launch: the series and books make it commercial use, and Pro bills overages instead of pausing the site.
4. Keep on-device AI models off Vercel (Hugging Face or R2).

## Deploy on Cloudflare (alternative)

1. Cloudflare account → `npx wrangler login`.
2. Pilot: `npx wrangler pages deploy apps/pilot/dist --project-name neev` (or push to `main`; CI deploys with the two secrets set).
3. API: `cd workers/api && npx wrangler d1 create neev`, paste the id into `wrangler.toml`, `npx wrangler d1 execute neev --file schema.sql --remote`, `npx wrangler deploy`.

## Rules every change must keep

Read [CHARTER.md](CHARTER.md). The tests enforce most of it; review enforces the rest.
