// Assembles the tested prototype into a real document for the pilot PWA.
import { readFileSync, writeFileSync } from "node:fs";
const r = (f) => readFileSync(new URL(`./proto/${f}`, import.meta.url), "utf8");
let actions = r("p3-actions.js").trimEnd();
if (!actions.endsWith("boot();")) throw new Error("p3-actions.js must end with boot();");
actions = actions.slice(0, -7).replace('window.addEventListener("hashchange", route);', 'window.addEventListener("hashchange", function () { route(); });');
const strip = (s) => { s = s.trimEnd(); return s.endsWith("boot();") ? s.slice(0, -7) : s; };
const app = [r("p3-core.js"), r("p3-views.js"), actions, strip(r("p4-ext.js")), strip(r("p5-ext.js")), r("p6-audit.js")].join("\n");
const body = r("shell.html").replace("/*CONTENT*/", () => r("content.js")).replace("/*APP*/", () => app);
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#16130f">
<meta name="description" content="See who holds you, and reach them. No account. Everything stays on your phone.">
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
