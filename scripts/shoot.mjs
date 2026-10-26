// Full-page screenshots at desktop and mobile widths, scrolling first so
// scroll-triggered reveals fire. Usage: node scripts/shoot.mjs [baseUrl] [outDir] [paths...]
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3800";
const out = process.argv[3] ?? "shots";
const paths = process.argv.slice(4).length
  ? process.argv.slice(4)
  : ["/", "/produits", "/notre-histoire", "/points-de-vente", "/points-de-vente/kinshasa", "/contact"];
mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
});
const viewports = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};
for (const [name, vp] of Object.entries(viewports)) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "networkidle0" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 1400));
    });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const file = `${out}/${name}${p === "/" ? "-home" : p.replaceAll("/", "-")}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(file, "horizontal overflow:", overflow);
  }
  await page.close();
}
await browser.close();
