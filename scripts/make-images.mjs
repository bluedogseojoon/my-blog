// 글에 들어갈 표지(cover.jpg)와 정보 카드(○○.png) 이미지를 만들어 주는 코드예요.
// 이미지 내용은 JSON 파일 하나에 적고, 아래처럼 실행해요.
//
//   node scripts/make-images.mjs content/images/글주소.json
//
// 결과는 public/images/posts/글주소/ 폴더에 저장돼요.
// (Playwright가 필요해요. Claude Code 클라우드 세션에는 이미 들어 있어요.)

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

// 카테고리마다 쓰는 색이에요. bg는 표지 배경, soft는 카드 배경, point는 강조색이에요.
const palettes = {
  parenting: { bg: "#fbf3e6", soft: "#fcf4e6", point: "#a35f00" },
  travel: { bg: "#e9f4ee", soft: "#edf6f1", point: "#1f7a55" },
  digital: { bg: "#e6edfb", soft: "#edf2fc", point: "#2050c0" },
  life: { bg: "#f3ede2", soft: "#f6f1e8", point: "#85622a" },
  money: { bg: "#ece9f8", soft: "#f1eefa", point: "#5b45b0" },
};

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// **강조** 부분을 강조색으로 칠해요.
const rich = (s = "") => esc(s).replace(/\*\*(.+?)\*\*/g, '<em>$1</em>');

function fontFaces() {
  return [
    ["Regular", 400],
    ["SemiBold", 600],
    ["Bold", 700],
  ]
    .map(([name, weight]) => {
      const data = fs.readFileSync(path.join(ROOT, "scripts/fonts", `Pretendard-${name}.woff2`)).toString("base64");
      return `@font-face{font-family:P;font-weight:${weight};src:url(data:font/woff2;base64,${data}) format("woff2")}`;
    })
    .join("");
}

function baseCss(c) {
  return `${fontFaces()}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:P,sans-serif;color:#1d1d1f;width:1200px;-webkit-font-smoothing:antialiased}
em{font-style:normal;color:${c.point}}`;
}

// 기본 표지 그림: 그림(art)을 따로 안 주면 동그라미 안에 큰 아이콘 글자를 넣어요.
function defaultArt(c, icon) {
  return `<svg width="340" height="340" viewBox="0 0 340 340">
  <circle cx="170" cy="170" r="155" fill="#ffffff" opacity=".65"/>
  <circle cx="170" cy="170" r="95" fill="${c.point}" opacity=".12"/>
  <text x="170" y="205" text-anchor="middle" font-family="P" font-weight="700" font-size="96" fill="${c.point}">${esc(icon || "✓")}</text>
</svg>`;
}

function coverHtml(spec, c) {
  const cv = spec.cover;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss(c)}
body{height:630px;background:${c.bg};position:relative;overflow:hidden}
.text{position:absolute;left:70px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center}
.label{align-self:flex-start;background:#fff;color:${c.point};font-weight:600;font-size:24px;padding:12px 22px;border-radius:999px;margin-bottom:30px}
h1{font-size:64px;font-weight:700;line-height:1.18;letter-spacing:-1.5px}
.sub{font-size:28px;color:#4b4b52;margin-top:30px}
.brand{position:absolute;left:70px;bottom:40px;font-size:22px;font-weight:700;color:#2f2f35;display:flex;align-items:center;gap:10px}
.brand:before{content:"";width:13px;height:13px;border-radius:50%;background:#2f6fed}
.art{position:absolute;right:110px;top:50%;transform:translateY(-50%);width:340px;height:340px}
</style></head><body>
<div class="text">
  <div class="label">${esc(cv.label)}</div>
  <h1>${cv.lines.map(rich).join("<br>")}</h1>
  ${cv.sub ? `<p class="sub">${rich(cv.sub)}</p>` : ""}
</div>
<div class="art">${cv.art || defaultArt(c, cv.icon)}</div>
<div class="brand">생활노트</div>
</body></html>`;
}

function cardHtml(card, c) {
  const cols = Math.min(card.items.length, 4);
  const items = card.items
    .map(
      (it, i) => `<div class="item">
    ${card.numbered === false ? "" : `<div class="num">${i + 1}</div>`}
    <h3>${rich(it.title)}</h3>
    ${it.sub ? `<p class="isub">${rich(it.sub)}</p>` : ""}
    <ul>${(it.bullets || []).map((b) => `<li>${rich(b)}</li>`).join("")}</ul>
  </div>`
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss(c)}
body{background:#fff;padding:56px}
h2{font-size:44px;font-weight:700;letter-spacing:-1px;line-height:1.3}
.sub{font-size:24px;color:#6e6e76;margin-top:12px}
.grid{display:grid;grid-template-columns:repeat(${cols},1fr);gap:22px;margin-top:34px}
.item{background:${c.soft};border-radius:26px;padding:28px 28px 32px}
.num{width:46px;height:46px;border-radius:50%;background:${c.point};color:#fff;font-weight:700;font-size:22px;display:flex;align-items:center;justify-content:center;margin-bottom:18px}
h3{font-size:30px;font-weight:700;letter-spacing:-.5px}
.isub{font-size:20px;font-weight:600;color:${c.point};margin-top:8px}
ul{list-style:none;margin-top:20px}
li{font-size:22px;line-height:1.45;padding-left:24px;position:relative;margin-top:12px}
li:before{content:"";position:absolute;left:2px;top:12px;width:9px;height:9px;border-radius:50%;background:${c.point}}
.foot{display:flex;justify-content:space-between;color:#9a9aa2;font-size:20px;margin-top:32px}
</style></head><body>
<h2>${rich(card.title)}</h2>
${card.sub ? `<p class="sub">${rich(card.sub)}</p>` : ""}
<div class="grid">${items}</div>
<div class="foot"><span>생활노트</span><span>직접 해 보고 결론부터 정리했어요</span></div>
</body></html>`;
}

async function main() {
  const specPath = process.argv[2];
  if (!specPath) {
    console.error("사용법: node scripts/make-images.mjs content/images/글주소.json");
    process.exit(1);
  }
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const c = palettes[spec.category];
  if (!c) throw new Error(`category는 ${Object.keys(palettes).join(", ")} 중 하나여야 해요.`);

  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch {
    console.error("Playwright가 없어요. Claude Code 클라우드 세션에서 실행하거나 `npm i -D playwright` 후 다시 해 주세요.");
    process.exit(1);
  }

  const outDir = path.join(ROOT, "public/images/posts", spec.slug);
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

  if (spec.cover) {
    await page.setContent(coverHtml(spec, c), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(outDir, "cover.jpg"), type: "jpeg", quality: 90 });
    console.log(`✓ cover.jpg`);
  }
  for (const card of spec.cards || []) {
    // 카드 높이는 내용 길이에 맞춰 자동으로 정해져요.
    await page.setViewportSize({ width: 1200, height: 100 });
    await page.setContent(cardHtml(card, c), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const file = path.join(outDir, `${card.file}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`✓ ${card.file}.png`);
  }
  await browser.close();
  console.log(`→ public/images/posts/${spec.slug}/ 에 저장했어요.`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
