import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import PostCard from "../PostCard";
import CategoryChips from "../CategoryChips";

export const metadata: Metadata = {
  title: "전체 글",
  description: "블로그에 올라온 모든 글을 최신순으로 모아 봤어요.",
  alternates: { canonical: "/posts" },
};

export default function PostsPage() {
  const posts = getAllPosts();
  return (
    <section className="container section">
      <div className="page-head">
        <h1 className="page-title">전체 글</h1>
        <p className="muted">총 {posts.length}개의 글이 있어요.</p>
        <CategoryChips />
      </div>
      <div className="grid" style={{ marginTop: 40 }}>
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
}
