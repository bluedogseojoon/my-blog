/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  poweredByHeader: false,
  // GitHub Pages에 올릴 때(STATIC_EXPORT=1)는 모든 페이지를 HTML 파일로 뽑아 out 폴더에 담아요.
  ...(process.env.STATIC_EXPORT === "1" && { output: "export", trailingSlash: true, images: { unoptimized: true } }),
  ...(basePath && { basePath }),
};
export default nextConfig;
