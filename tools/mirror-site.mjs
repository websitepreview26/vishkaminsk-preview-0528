import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const origin = "https://vishkaminsk.by";
const outDir = path.resolve("public");
const pages = [
  "/",
  "/company/",
  "/avtopark/",
  "/uslugi/",
  "/otzyvy-zakazchikov/",
  "/news/",
  "/contact-us/",
];

const skipPatterns = [
  "/wp-admin/",
  "/wp-json/",
  "/xmlrpc.php",
  "/feed/",
  "/comments/feed/",
  "wc-ajax=",
];

const downloaded = new Set();
const queuedAssets = [];

function stripQuery(url) {
  url.search = "";
  url.hash = "";
  return url;
}

function shouldSkip(url) {
  return skipPatterns.some((pattern) => url.href.includes(pattern));
}

function isAsset(url) {
  return /\.(css|js|png|jpe?g|webp|gif|svg|ico|woff2?|ttf|eot|otf|mp4|webm|json)$/i.test(url.pathname);
}

function localFileFor(url) {
  const clean = stripQuery(new URL(url.href));
  let pathname = decodeURIComponent(clean.pathname);
  if (pathname.endsWith("/")) pathname += "index.html";
  if (!path.extname(pathname)) pathname = path.posix.join(pathname, "index.html");
  return path.join(outDir, pathname);
}

function pagePathFor(route) {
  if (route === "/") return path.join(outDir, "index.html");
  return path.join(outDir, route, "index.html");
}

function relativeUrl(fromFile, targetPath) {
  let rel = path.relative(path.dirname(fromFile), targetPath).replaceAll(path.sep, "/");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel;
}

function toUrl(raw, base) {
  if (!raw || raw.startsWith("data:") || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("viber:")) {
    return null;
  }
  try {
    return new URL(raw.replaceAll("&amp;", "&"), base);
  } catch {
    return null;
  }
}

function queueAsset(raw, base) {
  const url = toUrl(raw, base);
  if (!url || url.origin !== origin || shouldSkip(url) || !isAsset(url)) return;
  queuedAssets.push(stripQuery(url));
}

function collectAssets(html, base) {
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) queueAsset(match[1], base);
  for (const match of html.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
    for (const part of match[1].split(",")) queueAsset(part.trim().split(/\s+/)[0], base);
  }
  for (const match of html.matchAll(/url\((['"]?)([^'")]+)\1\)/gi)) queueAsset(match[2], base);
}

function rewriteHtml(html, pageFile, pageUrl) {
  html = html.replace(/<script[^>]+api\.venyoo\.ru\/wnew\.js[^>]*><\/script>/gi, "");
  html = html.replace(/<link[^>]+rel=["'](?:alternate|EditURI)["'][^>]*>/gi, "");
  html = html.replace(/<link[^>]+wp-json[^>]*>/gi, "");
  html = html.replace(/<script[^>]+contact-form-7[^>]*><\/script>/gi, "");
  html = html.replace(/<script[^>]+woocommerce[^>]*><\/script>/gi, "");

  html = html.replace(/\b(href|src)=["']([^"']+)["']/gi, (full, attr, raw) => {
    const url = toUrl(raw, pageUrl);
    if (!url || url.origin !== origin || shouldSkip(url)) return full;

    const clean = stripQuery(url);
    if (isAsset(clean)) {
      return `${attr}="${relativeUrl(pageFile, localFileFor(clean))}"`;
    }

    const route = pages.find((item) => item === clean.pathname);
    if (route) return `${attr}="${relativeUrl(pageFile, pagePathFor(route))}"`;
    return full;
  });

  html = html.replace(/\bsrcset=["']([^"']+)["']/gi, (full, raw) => {
    const rewritten = raw.split(",").map((part) => {
      const [asset, size] = part.trim().split(/\s+/, 2);
      const url = toUrl(asset, pageUrl);
      if (!url || url.origin !== origin || !isAsset(url)) return part.trim();
      const rel = relativeUrl(pageFile, localFileFor(stripQuery(url)));
      return size ? `${rel} ${size}` : rel;
    }).join(", ");
    return `srcset="${rewritten}"`;
  });

  html = html.replace(/<form\b([^>]*)>/gi, '<form$1 data-static-placeholder="true" action="#">');
  html = html.replace("</body>", '<script src="' + relativeUrl(pageFile, path.join(outDir, "assets", "placeholder-forms.js")) + '"></script></body>');
  return html;
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function downloadAsset(url) {
  const key = url.href;
  if (downloaded.has(key)) return;
  downloaded.add(key);
  const target = localFileFor(url);
  await mkdir(path.dirname(target), { recursive: true });
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    console.warn(`skip ${response.status} ${url.href}`);
    return;
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(target, buffer);

  if (/\.css$/i.test(url.pathname)) {
    const css = buffer.toString("utf8");
    const rewritten = css.replace(/url\((['"]?)([^'")]+)\1\)/gi, (full, quote, raw) => {
      const assetUrl = toUrl(raw, url.href);
      if (!assetUrl || assetUrl.origin !== origin || shouldSkip(assetUrl)) return full;
      const clean = stripQuery(assetUrl);
      if (!isAsset(clean)) return full;
      queuedAssets.push(clean);
      return `url(${quote}${relativeUrl(target, localFileFor(clean))}${quote})`;
    });
    if (rewritten !== css) await writeFile(target, rewritten);
  }
}

await mkdir(outDir, { recursive: true });

for (const route of pages) {
  const pageUrl = `${origin}${route}`;
  const pageFile = pagePathFor(route);
  const html = await fetchText(pageUrl);
  collectAssets(html, pageUrl);
  await mkdir(path.dirname(pageFile), { recursive: true });
  await writeFile(pageFile, rewriteHtml(html, pageFile, pageUrl));
  console.log(`page ${route}`);
}

while (queuedAssets.length) {
  const asset = queuedAssets.shift();
  await downloadAsset(asset);
}

await mkdir(path.join(outDir, "assets"), { recursive: true });
await writeFile(path.join(outDir, "assets", "placeholder-forms.js"), `
document.addEventListener("submit", function (event) {
  var form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();
  var button = form.querySelector('button[type="submit"], input[type="submit"]');
  var original = button ? (button.textContent || button.value) : "";
  if (button) {
    if ("value" in button) button.value = "Заявка принята";
    button.textContent = "Заявка принята";
    button.disabled = true;
  }
  var note = form.querySelector(".static-form-note");
  if (!note) {
    note = document.createElement("div");
    note.className = "static-form-note";
    note.style.cssText = "margin-top:12px;padding:12px 16px;border-radius:8px;background:#eef8f0;color:#14612a;font-weight:600;";
    form.appendChild(note);
  }
  note.textContent = "Это демо-заглушка: данные пока никуда не отправляются.";
  window.setTimeout(function () {
    if (button) {
      if ("value" in button) button.value = original || "Отправить";
      button.textContent = original || "Отправить";
      button.disabled = false;
    }
  }, 2500);
});
`);

await writeFile(path.join(outDir, ".nojekyll"), "");
console.log(`done: ${downloaded.size} assets`);
