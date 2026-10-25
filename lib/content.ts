// content 폴더의 마크다운(.md) 파일을 읽어서 글과 페이지로 바꿔 주는 코드예요.
// 새 글을 올리려면 content/posts 폴더에 .md 파일 하나만 추가하면 돼요.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";
import { basePath } from "./site";

const POSTS_DIR = path.join(process.cwd(), "content/posts");
const PAGES_DIR = path.join(process.cwd(), "content/pages");

export type Heading = { id: string; text: string; level: number };

export type FAQ = { q: string; a: string };

// 쿠팡파트너스, 네이버 커넥트 상품 하나. url을 비워 두면 쿠팡 검색 페이지로 연결돼요.
export type Product = {
  name: string;
  note?: string;
  price?: string;
  url?: string;
  store: "coupang" | "naver";
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  updated?: string;
  cover?: string;
  summary: string[];
  faq: FAQ[];
  products: Product[];
  html: string;
  headings: Heading[];
  readingMinutes: number;
};

export type Page = { slug: string; title: string; description: string; html: string };

function decodeEntities(s: string) {
  return s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function slugifyHeading(text: string, used: Map<string, number>) {
  const base =
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, "")
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-") || "section";
  const n = used.get(base) ?? 0;
  used.set(base, n + 1);
  return n ? `${base}-${n}` : base;
}

// 마크다운을 HTML로 바꾸면서, 목차(h2, h3)도 같이 뽑아요.
function render(markdown: string) {
  const headings: Heading[] = [];
  const used = new Map<string, number>();
  const md = new Marked();
  md.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const plain = decodeEntities(text.replace(/<[^>]+>/g, ""));
        const id = slugifyHeading(plain, used);
        if (depth === 2 || depth === 3) headings.push({ id, text: plain, level: depth });
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      table(token) {
        const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const rows = token.rows
          .map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`)
          .join("");
        return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
    },
  });
  const html = (md.parse(markdown, { async: false }) as string)
    // 본문 속 "/posts/..." 같은 내부 주소와 이미지 주소에도 basePath를 붙여요.
    .replace(/(src|href)="\/(?!\/)/g, `$1="${basePath}/`)
    // 본문 이미지는 화면에 보일 때 불러와서 페이지가 빨리 열려요.
    .replace(/<img /g, '<img loading="lazy" ');
  return { html, headings };
}

// 글 머리말의 날짜(2026-10-21)를 항상 같은 형식의 글자로 맞춰요.
function toISODate(value: unknown) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
}

function readPostFile(file: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const { html, headings } = render(content);
  const chars = content.replace(/\s/g, "").length;
  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title,
    description: data.description ?? "",
    category: data.category,
    tags: data.tags ?? [],
    date: toISODate(data.date),
    updated: data.updated ? toISODate(data.updated) : undefined,
    cover: data.cover,
    summary: data.summary ?? [],
    faq: data.faq ?? [],
    products: (data.products ?? []).map((p: Product) => ({ ...p, store: p.store ?? "coupang" })),
    html,
    headings,
    readingMinutes: Math.max(1, Math.round(chars / 500)),
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readPostFile)
    .filter((p) => new Date(p.date) <= new Date()) // 날짜가 미래인 글은 예약 글로 보고 숨겨요
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string) {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string) {
  return getAllPosts().filter((p) => p.category === category);
}

export function getRelatedPosts(post: Post, limit = 3) {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const score = (p: Post) =>
    (p.category === post.category ? 2 : 0) + p.tags.filter((t) => post.tags.includes(t)).length;
  return others.sort((a, b) => score(b) - score(a)).slice(0, limit);
}

export function getAllPages(): Page[] {
  if (!fs.existsSync(PAGES_DIR)) return [];
  return fs
    .readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(PAGES_DIR, file), "utf8"));
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title,
        description: data.description ?? "",
        html: render(content).html,
      };
    });
}

export function getPage(slug: string) {
  return getAllPages().find((p) => p.slug === slug);
}

export function formatDate(d: string) {
  const date = new Date(d);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}
