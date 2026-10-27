// 글을 올리기 전에 빠진 것이 없는지 점검해 주는 코드예요.
//
//   npm run check                         → 모든 글 점검
//   npm run check -- content/posts/a.md   → 특정 글만 점검
//
// ❌ 오류가 하나라도 있으면 실패로 끝나요. ⚠️ 경고는 참고만 하면 돼요.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const POSTS_DIR = path.join(ROOT, "content/posts");
const CATEGORIES = ["travel", "parenting", "digital", "life", "money"];
// 글에 남아 있으면 안 되는 빈칸 표시들이에요.
const PLACEHOLDERS = ["[내 후기", "[쿠팡링크", "[사진", "[링크", "TODO", "XXX"];

const allSlugs = new Set(fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")));
const pageSlugs = new Set(fs.readdirSync(path.join(ROOT, "content/pages")).map((f) => f.replace(/\.md$/, "")));

function check(file) {
  const errors = [];
  const warns = [];
  const slug = path.basename(file, ".md");
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) errors.push("파일 이름은 영어 소문자, 숫자, -만 써요 (예: baby-winter-cover.md)");

  // 머리말(맨 위 --- 사이) 점검
  for (const key of ["title", "description", "category", "date"]) {
    if (!data[key]) errors.push(`머리말에 ${key}가 없어요`);
  }
  if (data.category && !CATEGORIES.includes(data.category)) errors.push(`category는 ${CATEGORIES.join(", ")} 중 하나여야 해요`);
  if (!Array.isArray(data.tags) || data.tags.length < 3) warns.push("tags(검색 키워드)를 3개 이상 넣으면 좋아요");
  if (!Array.isArray(data.summary) || data.summary.length < 3) warns.push("summary(결론부터 볼게요 상자)를 3줄 이상 넣으면 좋아요");
  if (!Array.isArray(data.faq) || data.faq.length < 3) warns.push("faq(자주 묻는 질문)를 3개 이상 넣으면 구글에 잘 보여요");
  if (data.title && data.title.length > 45) warns.push(`제목이 ${data.title.length}자예요. 45자 안쪽이면 검색 결과에서 덜 잘려요`);
  if (data.description && (data.description.length < 50 || data.description.length > 160))
    warns.push(`description이 ${data.description.length}자예요. 50~160자가 좋아요`);

  // 쿠팡/네이버 상품 점검
  for (const p of data.products ?? []) {
    const store = p.store ?? "coupang";
    if (!p.url) errors.push(`상품 "${p.name}"에 링크가 비어 있어요. 내 파트너스 링크가 없으면 수익이 안 생겨요`);
    else if (store === "coupang" && !p.url.startsWith("https://link.coupang.com/"))
      errors.push(`상품 "${p.name}" 링크가 쿠팡파트너스 링크(https://link.coupang.com/...)가 아니에요`);
    else if (store === "naver" && !p.url.startsWith("https://"))
      errors.push(`상품 "${p.name}" 링크 주소가 이상해요`);
  }

  // 빈칸이 남아 있는지 점검
  for (const mark of PLACEHOLDERS) {
    if (raw.includes(mark)) errors.push(`"${mark}" 빈칸이 아직 남아 있어요. 직접 채워 주세요`);
  }

  // 이미지 점검: 파일이 있는지, 설명(alt)이 있는지
  const images = [...content.matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)];
  if (images.length === 0) warns.push("본문에 이미지가 하나도 없어요");
  for (const [, alt, src] of images) {
    if (!alt.trim()) errors.push(`이미지 ${src}에 설명(alt)이 없어요`);
    if (src.startsWith("/") && !fs.existsSync(path.join(ROOT, "public", src))) errors.push(`이미지 파일이 없어요: public${src}`);
  }
  if (data.cover && !fs.existsSync(path.join(ROOT, "public", data.cover))) errors.push(`표지 파일이 없어요: public${data.cover}`);
  if (!data.cover) warns.push("cover(표지 이미지)가 없어요");

  // 블로그 안의 다른 글 링크가 살아 있는지 점검
  for (const [, target] of content.matchAll(/\]\(\/posts\/([^)#/\s]+)/g)) {
    if (!allSlugs.has(target)) errors.push(`없는 글로 연결돼요: /posts/${target}`);
  }
  for (const [, target] of content.matchAll(/\]\(\/([a-z-]+)\)/g)) {
    if (!pageSlugs.has(target) && !["posts"].includes(target)) warns.push(`이 주소가 맞는지 확인해 주세요: /${target}`);
  }

  return { slug, errors, warns };
}

const files = process.argv.slice(2).length
  ? process.argv.slice(2).map((f) => path.resolve(f))
  : [...allSlugs].map((s) => path.join(POSTS_DIR, `${s}.md`));

let failed = 0;
for (const file of files) {
  const { slug, errors, warns } = check(file);
  const mark = errors.length ? "❌" : warns.length ? "⚠️ " : "✅";
  console.log(`${mark} ${slug}`);
  errors.forEach((e) => console.log(`   ❌ ${e}`));
  warns.forEach((w) => console.log(`   ⚠️  ${w}`));
  if (errors.length) failed++;
}
console.log(failed ? `\n${failed}개 글에 고칠 곳이 있어요.` : `\n모든 글 점검 통과!`);
process.exit(failed ? 1 : 0);
