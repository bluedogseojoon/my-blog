import { pageUrl, site } from "@/lib/site";
import { getAllPosts } from "@/lib/content";

// 네이버 서치어드바이저에 RSS로 등록하면 새 글이 더 빨리 수집돼요.
export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const items = getAllPosts()
    .map(
      (p) => `<item>
  <title>${esc(p.title)}</title>
  <link>${pageUrl(`/posts/${p.slug}`)}</link>
  <guid>${pageUrl(`/posts/${p.slug}`)}</guid>
  <description>${esc(p.description)}</description>
  <pubDate>${new Date(p.date).toUTCString()}</pubDate>
</item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(site.name)}</title>
<link>${site.url}</link>
<description>${esc(site.description)}</description>
<language>ko</language>
${items}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
