import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, getRelatedPosts, formatDate } from "@/lib/content";
import { affiliate, getCategory, site } from "@/lib/site";
import PostCard from "../../PostCard";
import ProductBox from "../../ProductBox";

type Props = { params: Promise<{ slug: string }> };

// 빌드할 때 모든 글을 미리 HTML로 만들어 둬요. (검색엔진이 바로 읽을 수 있어요)
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const url = `/posts/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const cat = getCategory(post.category);
  const related = getRelatedPosts(post);
  const url = `${site.url}/posts/${post.slug}`;
  const stores = new Set(post.products.map((p) => p.store));

  // 구글이 글 정보를 정확히 이해하도록 돕는 구조화 데이터(JSON-LD)예요.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      author: { "@type": "Person", name: site.author, url: `${site.url}/about` },
      publisher: { "@type": "Organization", name: site.name, url: site.url },
      mainEntityOfPage: url,
      keywords: post.tags.join(", "),
      articleSection: cat?.name,
      inLanguage: "ko-KR",
      image: post.cover ? `${site.url}${post.cover}` : undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: site.url },
        { "@type": "ListItem", position: 2, name: cat?.name, item: `${site.url}/category/${post.category}` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
    ...(post.faq.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: post.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container post-layout">
        <article className="post">
          <nav className="breadcrumb" aria-label="현재 위치">
            <Link href="/">홈</Link> <span>/</span> <Link href={`/category/${post.category}`}>{cat?.name}</Link>
          </nav>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-desc">{post.description}</p>
          <p className="meta">
            {site.author} · <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.updated && <> · 수정 <time dateTime={post.updated}>{formatDate(post.updated)}</time></>} ·{" "}
            {post.readingMinutes}분 읽기
          </p>

          {stores.size > 0 && (
            <p className="ad-notice">
              {stores.has("coupang") && <>{affiliate.coupangNotice} </>}
              {stores.has("naver") && affiliate.naverNotice}
            </p>
          )}

          {post.summary.length > 0 && (
            <aside className="summary-box">
              <p className="summary-title">결론부터 볼게요</p>
              <ul>
                {post.summary.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </aside>
          )}

          {post.headings.length > 2 && (
            <details className="toc toc-mobile">
              <summary>목차</summary>
              <Toc headings={post.headings} />
            </details>
          )}

          <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

          {post.products.length > 0 && <ProductBox products={post.products} />}

          {post.faq.length > 0 && (
            <section className="faq">
              <h2 id="faq">자주 묻는 질문</h2>
              {post.faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </section>
          )}

          {post.tags.length > 0 && (
            <ul className="tags">
              {post.tags.map((t) => (
                <li key={t}>#{t}</li>
              ))}
            </ul>
          )}
        </article>

        {post.headings.length > 2 && (
          <aside className="toc toc-side" aria-label="목차">
            <p className="summary-title">목차</p>
            <Toc headings={post.headings} />
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <section className="container section">
          <div className="section-head">
            <h2>함께 보면 좋은 글</h2>
          </div>
          <div className="grid">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Toc({ headings }: { headings: { id: string; text: string; level: number }[] }) {
  return (
    <ol>
      {headings.map((h) => (
        <li key={h.id} className={h.level === 3 ? "toc-sub" : undefined}>
          <a href={`#${h.id}`}>{h.text}</a>
        </li>
      ))}
    </ol>
  );
}
