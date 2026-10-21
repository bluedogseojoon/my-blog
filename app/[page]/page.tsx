import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPages, getPage } from "@/lib/content";

// 소개, 문의, 개인정보처리방침 같은 고정 페이지예요. content/pages 폴더의 .md 파일로 관리해요.
type Props = { params: Promise<{ page: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPages().map((p) => ({ page: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getPage((await params).page);
  if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: `/${page.slug}` } };
}

export default async function StaticPage({ params }: Props) {
  const page = getPage((await params).page);
  if (!page) notFound();
  return (
    <article className="container narrow section">
      <h1 className="page-title">{page.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: page.html }} />
    </article>
  );
}
