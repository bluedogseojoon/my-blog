import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import PostCard from "../PostCard";

export const metadata: Metadata = {
  title: "전체 글",
  description: "블로그에 올라온 모든 글을 최신순으로 모아 봤어요.",
  alternates: { canonical: "/posts" },
};

export default function PostsPage() {
  const posts = getAllPosts();
  return (
    <section className="container section">
      <h1 className="page-title">전체 글</h1>
      <p className="muted">총 {posts.length}개의 글이 있어요.</p>
      <div className="grid">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
}
