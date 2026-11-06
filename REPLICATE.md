# Running your own Neev

An NGO, school or hospice can run its own copy with no servers holding user data.

1. Fork this repository. Change `apps/pilot/proto/content.js` for your language, helplines and examples.
2. Get your helpline numbers and crisis wording reviewed locally.
3. Build and deploy the pilot to any static host (Cloudflare Pages, GitHub Pages, Netlify).
4. The API worker is optional. Without it the app works fully, minus the anonymous counts and the cloud drafts.
5. Keep the charter. Code is AGPL-3.0: your changes stay open too.
