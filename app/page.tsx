import Link from "next/link";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/content";
import PostCard from "./PostCard";
import CategoryChips from "./CategoryChips";

export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">{site.name} · 직접 해 보고 결론부터</p>
          <h1>
            여행, 육아, 생활 꿀팁
            <br />
            <em>{posts.length}개의 실전 노트</em>
          </h1>
          <p className="lead">{site.description}</p>
          <CategoryChips />
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>
            최신 글<span>{posts.length}</span>
          </h2>
          <Link href="/posts" className="more">전체 보기 →</Link>
        </div>
        <div className="grid">
          {posts.slice(0, 9).map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
    </>
  );
}
