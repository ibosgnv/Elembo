// Interaction checks against a running server. Usage: node scripts/check.mjs [baseUrl]
import puppeteer from "puppeteer-core";

const base = process.argv[2] ?? "http://localhost:3800";
const results = [];
const ok = (name, pass, detail = "") => results.push({ name, pass, detail });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
});
const errors = [];
async function open(path, vp = { width: 1440, height: 900 }, reduced = false) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  if (reduced) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  page.on("pageerror", (e) => errors.push(`${path}: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`${path}: ${m.text()}`));
  page.on("requestfailed", (r) => errors.push(`${path}: request failed ${r.url()}`));
  await page.goto(base + path, { waitUntil: "networkidle0" });
  return page;
}

// 1. Flavour switching
{
  const page = await open("/");
  await sleep(1500);
  for (let i = 0; i < 5; i++) {
    await page.click(`[role="radiogroup"] [role="radio"]:nth-child(${i + 1})`);
    await sleep(1400);
    const s = await page.evaluate((i) => {
      const radios = [...document.querySelectorAll('[role="radiogroup"] [role="radio"]')];
      const imgs = [...document.querySelectorAll('.float img[alt^="Bouteille"]')];
      const visible = [...document.querySelectorAll("section [data-hero-line]")].length;
      const box = imgs[0]?.closest(".float")?.getBoundingClientRect();
      return { checked: radios[i].getAttribute("aria-checked"), alt: imgs.map((x) => x.alt), visible, h: Math.round(box?.height ?? 0) };
    }, i);
    ok(`Saveur ${i + 1} sélectionnée`, s.checked === "true", `bottle box ${s.h}px, ${s.alt[0]}`);
  }
  // keyboard arrows in radiogroup
  await page.focus('[role="radiogroup"] [role="radio"][aria-checked="true"]');
  await page.keyboard.press("ArrowRight");
  await sleep(1300);
  const first = await page.evaluate(() => document.activeElement?.textContent);
  ok("Flèches clavier dans le sélecteur", first === "Orange", `focus: ${first}`);

  // 2. Product dialog with keyboard
  const btn = await page.$('button[aria-label^="Informations sur le jus Ananas"]');
  await btn.focus();
  await page.keyboard.press("Enter");
  await sleep(500);
  const openState = await page.evaluate(() => ({ open: !!document.querySelector("dialog[open]"), title: document.querySelector("dialog[open] h2")?.textContent }));
  ok("Fiche produit s’ouvre au clavier", openState.open && openState.title === "Ananas", openState.title);
  await page.keyboard.press("Escape");
  await sleep(300);
  const after = await page.evaluate(() => ({ open: !!document.querySelector("dialog[open]"), focus: document.activeElement?.getAttribute("aria-label") }));
  ok("Échap ferme la fiche et rend le focus", !after.open && after.focus?.includes("Ananas"), after.focus);

  // images
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); }
  });
  await sleep(1000);
  const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
  ok("Aucune image cassée (accueil)", broken.length === 0, broken.join(", "));
  const hidden = await page.evaluate(() => [...document.querySelectorAll("main h2")].filter((h) => !h.closest("dialog")).filter((h) => +getComputedStyle(h.closest("[style]") ?? h).opacity < 0.5 || h.getBoundingClientRect().height === 0).map((h) => h.textContent));
  ok("Titres visibles après défilement", hidden.length === 0, hidden.join(", "));
  await page.close();
}

// 3. Mobile menu
{
  const page = await open("/", { width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.click('button[aria-label="Ouvrir le menu"]');
  await sleep(400);
  const menuOpen = await page.evaluate(() => !!document.querySelector('dialog[aria-label="Menu"][open]'));
  ok("Menu mobile s’ouvre", menuOpen);
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}), page.click('dialog[open] a[href="/points-de-vente"].display')]);
  await sleep(800);
  ok("Lien du menu mobile navigue", page.url().endsWith("/points-de-vente"), page.url());
  const closed = await page.evaluate(() => !document.querySelector('dialog[aria-label="Menu"][open]'));
  ok("Menu se referme après navigation", closed);
  const hiddenBtn = await page.evaluate(() => [...document.querySelectorAll("header a")].filter((a) => a.textContent.includes("Où nous trouver") && a.getBoundingClientRect().width > 0).length);
  ok("Bouton desktop masqué sur mobile", hiddenBtn === 0);
  // Label not covered by the Goûter button
  await page.goto(base + "/", { waitUntil: "networkidle0" });
  await sleep(1800);
  const overlap = await page.evaluate(() => {
    const b = document.querySelector('button[aria-label^="Goûter"]').getBoundingClientRect();
    const f = document.querySelector(".float").getBoundingClientRect();
    return !(b.right < f.left || b.left > f.right || b.bottom < f.top || b.top > f.bottom);
  });
  ok("Le bouton Goûter ne couvre pas la bouteille (mobile)", !overlap);
  await page.close();
}

// 4. City pages + directions
for (const c of ["kinshasa", "kimpese", "matadi"]) {
  const page = await open(`/points-de-vente/${c}`);
  const d = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent,
    dirs: [...document.querySelectorAll('a[href^="https://www.google.com/maps/search/"]')].length,
    tel: [...document.querySelectorAll('a[href^="tel:+243"]')].length,
  }));
  ok(`Page ${c}`, d.dirs > 0 && d.tel > 0, `${d.h1}: ${d.dirs} itinéraires, ${d.tel} téléphones`);
  await page.close();
}

// 5. Contact behaves honestly without backend
{
  const page = await open("/contact?sujet=revendeur");
  await sleep(300);
  const pre = await page.evaluate(() => document.querySelector('input[value="revendeur"]')?.checked);
  ok("Sujet pré-sélectionné depuis l’URL", pre === true);
  await page.click('button[type="submit"]');
  await sleep(300);
  const invalid = await page.evaluate(() => ({ focus: document.activeElement?.id, alert: document.querySelector('[role="alert"]')?.textContent?.slice(0, 40) }));
  ok("Validation : focus sur le premier champ invalide", invalid.focus === "nom", JSON.stringify(invalid));
  await page.type("#nom", "Test Elembo");
  await page.type("#telephone", "+243 894 830 974");
  await page.type("#message", "Bonjour, ceci est un test de formulaire.");
  await page.click('button[type="submit"]');
  await sleep(1200);
  const res = await page.evaluate(() => ({ text: document.querySelector('[role="alert"]')?.textContent ?? "", success: !!document.body.textContent.includes("Message envoyé"), mailto: !!document.querySelector('a[href^="mailto:info@elembo-rdc.com?subject"]') }));
  ok("Pas de faux succès sans backend", !res.success && res.text.includes("pas encore activé") && res.mailto, res.text.slice(0, 60));
  await page.close();
}

// 6. Reduced motion: content readable without animation
{
  const page = await open("/", { width: 1440, height: 900 }, true);
  await sleep(500);
  const vis = await page.evaluate(() => {
    const hs = [...document.querySelectorAll("main h1, main h2")];
    return hs.filter((h) => { let e = h; while (e) { if (+getComputedStyle(e).opacity < 0.5) return true; e = e.parentElement; } return false; }).map((h) => h.textContent);
  });
  ok("Mouvement réduit : tous les titres visibles sans défilement", vis.length === 0, vis.join(", "));
  const anim = await page.evaluate(() => getComputedStyle(document.querySelector(".marquee")).animationName);
  ok("Mouvement réduit : bandeau immobile", anim === "none", anim);
  await page.close();
}

// 7. All routes respond
for (const p of ["/", "/produits", "/notre-histoire", "/points-de-vente", "/contact"]) {
  const page = await open(p);
  ok(`Route ${p}`, !!(await page.$("h1")));
  await page.close();
}
const notFound = await (await fetch(base + "/nope")).status;
ok("404 sur une route inconnue", notFound === 404, String(notFound));

await browser.close();
for (const r of results) console.log(`${r.pass ? "✓" : "✗"} ${r.name}${r.detail ? " — " + r.detail : ""}`);
console.log(`\n${results.filter((r) => r.pass).length}/${results.length} réussis`);
if (errors.length) console.log("\nErreurs console :\n" + [...new Set(errors)].join("\n"));
