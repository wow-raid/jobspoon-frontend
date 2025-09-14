// src/routes/sitemap.xml/+server.ts
import { PUBLIC_BASE_URL } from '$env/static/public';
export const prerender = true;

if (!PUBLIC_BASE_URL) {
    throw new Error('PUBLIC_BASE_URL is required at build time.');
}
if (PUBLIC_BASE_URL.includes('localhost')) {
    // 프로덕션 빌드에서는 막고 싶다면 주석 해제
    // throw new Error('PUBLIC_BASE_URL must not point to localhost in production builds');
}

const BASE = PUBLIC_BASE_URL.replace(/\/+$/, ''); // 끝 슬래시 제거
const URLS = ['/', '/ai-interview', '/ai-interview/guide', '/ai-interview/faq'];

// 간단 조인 헬퍼
const join = (base: string, p: string) =>
    p === '/' ? base + '/' : base + (p.startsWith('/') ? p : `/${p}`);

const xml = (items: string) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;

export const GET = () => {
    const now = new Date().toISOString();
    const items = URLS.map((p) =>
        `<url><loc>${join(BASE, p)}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq></url>`
    ).join('\n');
    return new Response(xml(items), { headers: { 'Content-Type': 'application/xml' } });
};
