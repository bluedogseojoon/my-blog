import Link from "next/link";
import { getCategory, withBase } from "@/lib/site";
import { formatDate, type Post } from "@/lib/content";

export default function PostCard({ post }: { post: Post }) {
  const cat = getCategory(post.category);
  return (
    <article className="card">
      <Link href={`/posts/${post.slug}`} className="card-link">
        <div className={`card-cover cover-${post.category}`} aria-hidden>
          {post.cover ? <img src={withBase(post.cover)} alt="" loading="lazy" /> : <span className="cover-icon">{cat?.icon}</span>}
        </div>
        <div className="card-body">
          <p className="card-meta">
            {cat && <span className="badge">{cat.name}</span>}
            <i aria-hidden />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <i aria-hidden />
            <span>{post.readingMinutes}분</span>
          </p>
          <h3 className="card-title">{post.title}</h3>
          <p className="card-desc">{post.description}</p>
        </div>
      </Link>
    </article>
  );
}
