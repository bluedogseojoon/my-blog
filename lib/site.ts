// 블로그 기본 설정: 이름, 주소, 카테고리는 여기서만 바꾸면 사이트 전체에 반영돼요.

export const site = {
  name: "생활노트",
  tagline: "여행, 육아, 생활 꿀팁을 결론부터 쉽게 정리하는 블로그",
  description:
    "여행 준비, 아이 키우기, 스마트폰과 생활 꿀팁까지. 직접 해 보고 결론부터 정리한 실전 정보를 모았어요.",
  // 배포 후 실제 도메인으로 바꿔 주세요. (사이트맵, 검색 노출 주소에 쓰여요)
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  author: "꼬꼬비",
  locale: "ko_KR",
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
};

export const categories: Category[] = [
  { slug: "travel", icon: "✈️", name: "여행", description: "국내외 여행 준비물, 코스, 아이와 함께하는 여행 팁" },
  { slug: "parenting", icon: "👶", name: "육아", description: "신생아부터 유아까지, 엄마가 직접 겪으며 정리한 육아 정보" },
  { slug: "digital", icon: "📱", name: "디지털 꿀팁", description: "스마트폰, 앱, 사진 정리처럼 매일 쓰는 디지털 생활 팁" },
  { slug: "life", icon: "🏠", name: "생활 정보", description: "살림, 정부 지원금, 알아 두면 돈 아끼는 생활 정보" },
  { slug: "money", icon: "💰", name: "돈 공부", description: "온라인 부업, 절약, 경제적 자유를 위한 돈 공부 기록" },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

// 상단 메뉴
export const nav = [
  ...categories.slice(0, 4).map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
  { href: "/about", label: "소개" },
];
