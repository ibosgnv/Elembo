import puppeteer from "puppeteer-core";
const out = process.argv[2];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--use-angle=metal", "--enable-gpu"] });
const p = await b.newPage();
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await p.setViewport({ width: 1440, height: 900 });
await p.goto("http://localhost:3800/", { waitUntil: "networkidle0" });
await sleep(2500);
const info = await p.evaluate(() => ({ canvas: !!document.querySelector(".float canvas"), size: (() => { const c = document.querySelector(".float canvas"); return c ? [c.width, c.height] : null; })(), imgsHidden: getComputedStyle(document.querySelector(".float > div:nth-child(2)")).opacity }));
console.log(JSON.stringify(info));
for (let i = 0; i < 4; i++) {
  await p.screenshot({ path: `${out}/b3d-${i}.png`, clip: { x: 520, y: 40, width: 400, height: 800 } });
  await sleep(1400);
}
// switch flavour
await p.click('[role="radiogroup"] [role="radio"]:nth-child(5)');
await sleep(1800);
await p.screenshot({ path: `${out}/b3d-swap.png`, clip: { x: 520, y: 40, width: 400, height: 800 } });
console.log("errors:", errs.slice(0, 5));
await b.close();
