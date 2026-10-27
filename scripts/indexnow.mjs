// 새로 올라가거나 바뀐 글을 네이버·빙 같은 검색엔진에 바로 알려 주는 코드예요. (IndexNow)
// GitHub에 글이 올라가 사이트가 새로 만들어진 뒤 자동으로 실행돼요.
//
//   node scripts/indexnow.mjs 이전커밋 지금커밋   → 그사이 바뀐 글만 알려요
//   node scripts/indexnow.mjs all                 → 모든 글을 알려요 (Actions에서 직접 실행할 때)
//
// 구글은 IndexNow를 쓰지 않아요. 구글은 서치콘솔에 낸 사이트맵을 보고 알아서 찾아와요.

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import matter from "gray-matter";

const KEY = "920d2bd5260fdbc536fb4d9f34f7375b";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://bluedogseojoon.github.io/my-blog";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const [from = "HEAD~1", to = "HEAD"] = process.argv.slice(2);
let changed = [];
if (from === "all") {
  changed = fs.readdirSync(path.join(ROOT, "content/posts")).filter((f) => f.endsWith(".md")).map((f) => `content/posts/${f}`);
} else try {
  changed = execSync(`git diff --name-only --diff-filter=AM ${from} ${to} -- content/posts`, { cwd: ROOT })
    .toString()
    .split("\n")
    .filter((f) => f.endsWith(".md"));
} catch {
  console.log("바뀐 글 목록을 못 읽었어요. 이번에는 건너뛸게요.");
  process.exit(0);
}

// 예약 발행(미래 날짜) 글은 아직 사이트에 없으니 빼요.
const today = new Date();
const urls = changed
  .filter((f) => fs.existsSync(path.join(ROOT, f)))
  .filter((f) => new Date(matter(fs.readFileSync(path.join(ROOT, f), "utf8")).data.date) <= today)
  .map((f) => `${SITE}/posts/${path.basename(f, ".md")}/`);

if (urls.length === 0) {
  console.log("새로 알릴 글이 없어요.");
  process.exit(0);
}

urls.forEach((u) => console.log(`  → ${u}`));
if (process.env.DRY_RUN) process.exit(0);

const host = new URL(SITE).host;
try {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
  });
  // 200, 202면 잘 전달된 거예요.
  console.log(`IndexNow 응답: ${res.status}`);
} catch (e) {
  console.log(`IndexNow에 알리지 못했어요: ${e.message}`);
}
