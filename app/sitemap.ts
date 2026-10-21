import type { MetadataRoute } from "next";
import { categories, site } from "@/lib/site";
import { getAllPages, getAllPosts } from "@/lib/content";

// /sitemap.xml 주소로 자동 생성돼요. 서치콘솔에 이 주소를 등록하면 돼요.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  return [
    { url: site.url, lastModified: posts[0]?.date, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/posts`, changeFrequency: "daily", priority: 0.8 },
    ...categories.map((c) => ({ url: `${site.url}/category/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...posts.map((p) => ({ url: `${site.url}/posts/${p.slug}`, lastModified: p.updated ?? p.date, priority: 0.9 })),
    ...getAllPages().map((p) => ({ url: `${site.url}/${p.slug}`, priority: 0.3 })),
  ];
}
