import Link from "next/link";
import { categories } from "@/lib/site";
import { getAllPosts, getPostsByCategory } from "@/lib/content";

// 전체 / 카테고리별로 글을 골라 보는 버튼 줄이에요. active에는 지금 보고 있는 카테고리를 넣어요.
export default function CategoryChips({ active }: { active?: string }) {
  return (
    <nav className="chips" aria-label="카테고리">
      <Link href="/posts" className={active ? "chip" : "chip active"}>
        전체 <span>{getAllPosts().length}</span>
      </Link>
      {categories.map((c) => (
        <Link key={c.slug} href={`/category/${c.slug}`} className={c.slug === active ? "chip active" : "chip"}>
          {c.name} <span>{getPostsByCategory(c.slug).length}</span>
        </Link>
      ))}
    </nav>
  );
}
