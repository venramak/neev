// Assembles the tested prototype into a real document for the pilot PWA.
import { readFileSync, writeFileSync } from "node:fs";
const r = (f) => readFileSync(new URL(`./proto/${f}`, import.meta.url), "utf8");
let actions = r("p3-actions.js").trimEnd();
if (!actions.endsWith("boot();")) throw new Error("p3-actions.js must end with boot();");
actions = actions.slice(0, -7).replace('window.addEventListener("hashchange", route);', 'window.addEventListener("hashchange", function () { route(); });');
const strip = (s) => { s = s.trimEnd(); return s.endsWith("boot();") ? s.slice(0, -7) : s; };
const app = [r("p3-core.js"), r("p3-views.js"), actions, strip(r("p4-ext.js")), strip(r("p5-ext.js")), strip(r("p6-audit.js")), r("p7-doors.js")].join("\n");
const SITE = (process.env.SITE_URL || "").replace(/\/$/, "");
const body = r("shell.html").replace("<title>Neev Prototype</title>", "").replace("/*CONTENT*/", () => r("content.js")).replace("/*APP*/", () => app);
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#16130f">
<meta name="description" content="See who holds you, and reach them. No account. Everything stays on your phone.">
<title>Neev · Who holds you?</title>
<meta property="og:type" content="website">
<meta property="og:title" content="Neev · Who holds you?">
<meta property="og:description" content="A seven-minute look at the people who hold you, and one message to someone you've drifted from. No account. Everything stays on your phone.">
<meta property="og:image" content="${SITE}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icon-192.png">
<script src="/pilot.js"></script>
</head>
<body>
${body}
</body>
</html>
`;
writeFileSync(new URL("./index.html", import.meta.url), html);
console.log(`index.html: ${(html.length / 1024).toFixed(0)} KB`);
