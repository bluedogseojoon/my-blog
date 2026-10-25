import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory, site } from "@/lib/site";
import { getPostsByCategory } from "@/lib/content";
import PostCard from "../../PostCard";
import CategoryChips from "../../CategoryChips";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getCategory((await params).slug);
  if (!cat) return {};
  return {
    title: `${cat.name} 글 모음`,
    description: cat.description,
    alternates: { canonical: `/category/${cat.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const cat = getCategory((await params).slug);
  if (!cat) notFound();
  const posts = getPostsByCategory(cat.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name} 글 모음`,
    description: cat.description,
    url: `${site.url}/category/${cat.slug}`,
  };

  return (
    <section className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="page-head">
        <nav className="breadcrumb" aria-label="현재 위치">
          <Link href="/">홈</Link> <span>/</span> 카테고리
        </nav>
        <h1 className="page-title">{cat.name}</h1>
        <p className="muted">{cat.description}</p>
        <CategoryChips active={cat.slug} />
      </div>
      {posts.length ? (
        <div className="grid" style={{ marginTop: 40 }}>
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      ) : (
        <p className="empty">아직 이 카테고리에 글이 없어요. 곧 채워질 예정이에요.</p>
      )}
    </section>
  );
}
