import Link from "next/link";
import { getCategory } from "@/lib/site";
import { formatDate, type Post } from "@/lib/content";

export default function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  const cat = getCategory(post.category);
  return (
    <article className={large ? "card card-large" : "card"}>
      <Link href={`/posts/${post.slug}`} className="card-link">
        <div className={`card-cover cover-${post.category}`} aria-hidden>
          {post.cover ? <img src={post.cover} alt="" loading="lazy" /> : <span>{cat?.name}</span>}
        </div>
        <div className="card-body">
          {cat && <span className="badge">{cat.name}</span>}
          <h3 className="card-title">{post.title}</h3>
          <p className="card-desc">{post.description}</p>
          <p className="meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes}분 읽기
          </p>
        </div>
      </Link>
    </article>
  );
}
