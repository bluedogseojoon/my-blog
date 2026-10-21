import type { MetadataRoute } from "next";
import { categories, pageUrl } from "@/lib/site";
import { getAllPages, getAllPosts } from "@/lib/content";

export const dynamic = "force-static";

// /sitemap.xml 주소로 자동 생성돼요. 서치콘솔에 이 주소를 등록하면 돼요.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  return [
    { url: pageUrl("/"), lastModified: posts[0]?.date, changeFrequency: "daily", priority: 1 },
    { url: pageUrl("/posts"), changeFrequency: "daily", priority: 0.8 },
    ...categories.map((c) => ({ url: pageUrl(`/category/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...posts.map((p) => ({ url: pageUrl(`/posts/${p.slug}`), lastModified: p.updated ?? p.date, priority: 0.9 })),
    ...getAllPages().map((p) => ({ url: pageUrl(`/${p.slug}`), priority: 0.3 })),
  ];
}
