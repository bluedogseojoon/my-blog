import Link from "next/link";
import { categories, site } from "@/lib/site";
import { getAllPosts, getPostsByCategory } from "@/lib/content";
import PostCard from "./PostCard";

export default function Home() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">결론부터 알려 주는 생활 블로그</p>
          <h1>{site.tagline}</h1>
          <p className="muted lead">{site.description}</p>
          <div className="chips">
            {categories.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="chip">
                {c.name} <span>{getPostsByCategory(c.slug).length}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>최신 글</h2>
          <Link href="/posts" className="more">전체 보기 →</Link>
        </div>
        {featured && (
          <div className="grid-featured">
            <PostCard post={featured} large />
            <div className="stack">
              {rest.slice(0, 2).map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        )}
      </section>

      {categories
        .filter((c) => getPostsByCategory(c.slug).length > 0)
        .map((c) => (
          <section key={c.slug} className="container section">
            <div className="section-head">
              <h2>{c.name}</h2>
              <Link href={`/category/${c.slug}`} className="more">더 보기 →</Link>
            </div>
            <p className="muted">{c.description}</p>
            <div className="grid">
              {getPostsByCategory(c.slug).slice(0, 3).map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        ))}
    </>
  );
}
