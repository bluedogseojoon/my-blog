# 생활노트 블로그

여러 주제(여행, 육아, 디지털 꿀팁, 생활 정보, 돈 공부)를 다루는 SEO 블로그예요.
Next.js로 만들었고, 모든 페이지를 **서버에서 미리 HTML로 만들어 두기 때문에** 구글과 네이버가 글 내용을 바로 읽을 수 있어요.

## 폴더 구조 한눈에 보기

| 폴더/파일 | 하는 일 |
| --- | --- |
| `content/posts/` | 블로그 글 (.md 파일 하나 = 글 하나) |
| `content/pages/` | 고정 페이지 (소개, 문의, 개인정보처리방침) |
| `lib/site.ts` | 블로그 이름, 주소, 카테고리 설정 |
| `app/` | 화면 디자인과 페이지 코드 |
| `app/globals.css` | 색, 글꼴 등 디자인 |

## 새 글 올리는 법

1. `content/posts/` 폴더에 `영어-주소.md` 파일을 만들어요. 파일 이름이 글 주소가 돼요. (예: `jeju-with-baby.md` → `/posts/jeju-with-baby`)
2. 맨 위에 아래 머리말을 붙이고, 그 아래에 본문을 마크다운으로 써요.

```markdown
---
title: "글 제목 (검색 키워드를 앞쪽에)"
description: "검색 결과에 보이는 설명 1~2문장"
category: travel        # travel, parenting, digital, life, money 중 하나
tags: [키워드1, 키워드2]
date: 2026-10-21        # 미래 날짜로 쓰면 그날까지 숨겨져요 (예약 발행)
summary:
  - "결론부터 볼게요 상자에 들어갈 요약 1"
  - "요약 2"
faq:
  - q: "자주 묻는 질문"
    a: "답변"
---

## 첫 번째 소제목
본문...
```

3. (선택) 쿠팡파트너스, 네이버 커넥트 상품을 넣고 싶으면 머리말에 `products`를 추가해요. 넣으면 글 맨 위에 광고 안내 문구가 자동으로 붙고, 본문 아래에 상품 상자가 생겨요.

```yaml
products:
  - name: "기내 반입 접이식 휴대용 유모차"
    note: "한 줄 설명 (선택)"
    price: "15만원대"          # 선택
    url: "https://link.coupang.com/a/xxxx"   # 쿠팡파트너스에서 만든 내 링크
    store: coupang            # coupang 또는 naver
```

`url`을 비워 두면 임시로 쿠팡 검색 결과로 연결돼요. **수익이 생기려면 꼭 파트너스에서 만든 내 링크로 바꿔 주세요.**

4. GitHub에 올리면 Vercel이 자동으로 사이트를 새로 만들어요.

## Claude로 새 글 자동으로 만들기

Claude Code에서 이 저장소를 열고 **"새 글 써 줘: 주제"** 라고 말하면 돼요. Claude가 아래 순서로 진행해요.

1. 주제, 쿠팡파트너스 링크, 직접 써 본 경험을 물어봐요.
2. 글 초안(`content/posts/`)과 표지·정보 카드 이미지를 만들어요.
3. 빠진 게 없는지 점검하고, 검토용 PR을 올려요.
4. PR을 열어 읽어 보고 **Merge**를 누르면 사이트에 발행돼요.

| 파일 | 하는 일 |
| --- | --- |
| `CLAUDE.md` | Claude가 글 쓸 때 지키는 규칙 (말투, 구조, 검색, 쿠팡) |
| `.claude/skills/new-post/SKILL.md` | 새 글 만드는 순서 |
| `scripts/make-images.mjs` | 표지·정보 카드 이미지 만들기 (`npm run images -- content/images/글주소.json`) |
| `scripts/check-post.mjs` | 발행 전 점검 (`npm run check`) |
| `.github/workflows/check.yml` | PR이 올라오면 자동으로 점검 |
| `.claude/skills/nightly-drafts/SKILL.md` | 밤마다 글감 이슈를 초안 PR로 만드는 순서 |
| `docs/개선기록.md` | 꼬꼬비가 지적한 내용 기록 (두 번 나오면 규칙으로) |
| `scripts/indexnow.mjs` | 글이 발행되면 네이버·빙에 새 글을 자동으로 알려요 (IndexNow) |

점검에서 잡아 주는 것: 비어 있는 쿠팡 링크, 남아 있는 `[내 후기]` 빈칸, 없는 이미지 파일, 이미지 설명(alt) 누락, 없는 글로 가는 링크, 잘못된 카테고리.

### 휴대폰으로 글감 적어 두기 (밤사이 자동 초안)

1. 휴대폰 GitHub 앱 → 이 저장소 → **Issues → New issue → 새 글감**을 눌러요.
2. 주제, 상품 링크, 내 후기, 사진을 생각나는 만큼 적고 저장해요.
3. 매일 밤 Claude가 글감을 읽고 초안 PR을 만들어 둬요. (하룻밤 최대 3개)
4. 다음 날 PR을 읽고 **Merge**를 누르면 발행되고, 글감 이슈도 자동으로 닫혀요.

⚠️ 저장소가 공개라서 이슈 내용과 사진도 공개예요. 아이 얼굴이 나온 사진은 피해 주세요.

### 검색엔진에 새 글 알리기

- **네이버·빙:** 글이 발행되면 자동으로 알려요(IndexNow). 따로 할 일이 없어요. 예전 글까지 한꺼번에 알리고 싶으면 **Actions → Deploy to GitHub Pages → Run workflow**를 눌러요.
- **구글:** 서치콘솔에 `sitemap.xml`을 한 번만 제출해 두면 알아서 찾아와요. 빨리 올리고 싶은 글만 서치콘솔 **URL 검사 → 색인 생성 요청**을 눌러요.

## 이미 들어 있는 SEO 기능

- 페이지마다 제목, 설명, 대표 주소(canonical), 오픈그래프(카톡/SNS 미리보기)
- 구조화 데이터(JSON-LD): 글(BlogPosting), 위치 경로(Breadcrumb), 자주 묻는 질문(FAQPage)
- `/sitemap.xml`, `/robots.txt`, `/rss.xml` 자동 생성
- 목차, 관련 글, 카테고리 페이지로 내부 링크 연결
- 휴대폰 화면, 다크 모드 지원

## 내 컴퓨터에서 실행해 보기

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 을 열면 돼요.

## 사이트 주소 (GitHub Pages)

`main` 브랜치에 글이 올라가면 GitHub가 자동으로 사이트를 새로 만들어 올려요.

- 주소: https://bluedogseojoon.github.io/my-blog/
- 처음 한 번만: 저장소 **Settings → Pages → Source**를 **GitHub Actions**로 바꿔 주세요.
- 진행 상황은 저장소의 **Actions** 탭에서 볼 수 있어요.

## 배포 후 꼭 할 일

1. Vercel 환경변수에 `NEXT_PUBLIC_SITE_URL` = 실제 주소(예: `https://myblog.vercel.app`)를 넣어요.
2. 구글 서치콘솔, 네이버 서치어드바이저에 사이트를 등록하고 `sitemap.xml`, `rss.xml`을 제출해요.
3. 인증 코드는 환경변수 `NEXT_PUBLIC_GOOGLE_VERIFICATION`, `NEXT_PUBLIC_NAVER_VERIFICATION`에 넣어요.
4. `content/pages/contact.md`의 이메일 주소를 실제 주소로 바꿔요.
