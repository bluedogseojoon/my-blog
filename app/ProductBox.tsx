import type { Product } from "@/lib/content";

const storeLabel = { coupang: "쿠팡", naver: "네이버" };

// 글 본문 아래에 나오는 추천 상품 상자예요. 링크에는 광고 링크 표시(sponsored)를 붙여요.
export default function ProductBox({ products }: { products: Product[] }) {
  return (
    <section className="products" aria-labelledby="products-title">
      <h2 id="products-title">이 글에서 소개한 준비물</h2>
      <ul>
        {products.map((p) => {
          const href = p.url || `https://www.coupang.com/np/search?q=${encodeURIComponent(p.name)}`;
          return (
            <li key={p.name} className="product">
              <div>
                <p className="product-name">{p.name}</p>
                {p.note && <p className="product-note">{p.note}</p>}
              </div>
              <a
                className={`product-btn store-${p.store}`}
                href={href}
                target="_blank"
                rel="sponsored nofollow noopener"
              >
                {p.price ? `${p.price} · ` : ""}
                {storeLabel[p.store]}에서 보기
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
