// Bundles src/ into one self-contained page. dist/index.html is the site; dist/artifact.html is the same app without the document shell.
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, cpSync } from "node:fs";
const SITE = process.env.SITE_URL || "https://neev.twopointsingularity.com";
const out = await build({ entryPoints: ["src/app.js"], bundle: true, format: "iife", minify: true, write: false, target: "es2020" });
const js = out.outputFiles[0].text.replace(/<\/script/g, "<\\/script");
const css = readFileSync("src/styles.css", "utf8");
const fonts = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hind:wght@400;600&family=IBM+Plex+Mono:wght@400;500&family=Kalam:wght@400;700&family=Rozha+One&display=swap">';
const body = `<style>${css}</style><div id="app"></div><script>${js}</script>`;
const desc = "Aap kitne logon se bane hain? Teen ghere, paanch jagah. Koi login nahi, koi score nahi.";
mkdirSync("dist", { recursive: true });
cpSync("public", "dist", { recursive: true });
writeFileSync("dist/index.html", `<!doctype html><html lang="hi-Latn"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Neev</title>
<meta name="description" content="${desc}"><meta name="theme-color" content="#13110F">
<link rel="manifest" href="/manifest.webmanifest"><link rel="icon" href="/icon.svg"><link rel="apple-touch-icon" href="/icon-192.png">
<meta property="og:title" content="Neev"><meta property="og:description" content="${desc}">
<meta property="og:image" content="${SITE}/og.png"><meta property="og:url" content="${SITE}/"><meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>${fonts}</head><body>${body}</body></html>`);
writeFileSync("dist/artifact.html", `<meta name="claude:viewport-fit-sides" content="cover"><title>Neev</title>${fonts}${body}`);
console.log("built", (js.length / 1024).toFixed(0) + " KB js");
