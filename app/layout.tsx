import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { site, nav, categories } from "@/lib/site";
import "./globals.css";

// 모든 페이지에 공통으로 들어가는 검색엔진용 기본 정보예요.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author }],
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss.xml" } },
  openGraph: { type: "website", siteName: site.name, locale: site.locale, url: "/" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  // 구글 서치콘솔, 네이버 서치어드바이저 인증 코드를 받으면 여기에 넣어요.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_NAVER_VERIFICATION
      ? { "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  description: site.description,
  inLanguage: "ko-KR",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body>
        <a className="skip" href="#main">본문 바로가기</a>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="logo">
              <span className="logo-mark" aria-hidden>●</span>
              {site.name}
            </Link>
            <nav aria-label="주요 메뉴" className="nav">
              {nav.map((n) => (
                <Link key={n.href} href={n.href}>
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <p className="logo">{site.name}</p>
              <p className="muted">{site.description}</p>
            </div>
            <div>
              <p className="footer-title">카테고리</p>
              <ul>
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/category/${c.slug}`}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="footer-title">안내</p>
              <ul>
                <li><Link href="/about">블로그 소개</Link></li>
                <li><Link href="/contact">문의하기</Link></li>
                <li><Link href="/privacy">개인정보처리방침</Link></li>
                <li><Link href="/posts">전체 글</Link></li>
                <li><a href="/rss.xml">RSS</a></li>
              </ul>
            </div>
          </div>
          <div className="container copyright">© {new Date().getFullYear()} {site.name}. All rights reserved.</div>
        </footer>
      </body>
    </html>
  );
}
