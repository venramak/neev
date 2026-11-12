# Neev (the rebuilt app)

Three circles, five places, thirteen roles. The user answers through moments, names each person's role in their own words, and every layer ends in one act with a real person.

- `src/content.js`: the canon (circles, places, roles, layers, acts) in Hinglish and English.
- `src/logic.js`: pure logic (people, layer unlock by act or 24 hours, findings, share cards, doors, crisis gate). Tested in `test/`.
- `src/app.js`, `src/styles.css`: the interface. No framework, no login, no server. State lives in the browser.
- `npm run build` writes `dist/index.html` (one self-contained page) plus the PWA files.

Layers: 1 Five places, 2 Rasoi, 3 Both ways, 4 Aangan, 5 Mohalla. Layer 6 (drift, knots, the gone) is not built yet.

Not done: the crisis word list needs a counsellor's review; share links point at `SITE_URL` and work once the app is live there.
