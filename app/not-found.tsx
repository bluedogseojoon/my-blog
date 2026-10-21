import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container narrow section center">
      <h1 className="page-title">페이지를 찾을 수 없어요</h1>
      <p className="muted">주소가 바뀌었거나 삭제된 글일 수 있어요.</p>
      <Link href="/" className="chip">홈으로 가기</Link>
    </section>
  );
}
