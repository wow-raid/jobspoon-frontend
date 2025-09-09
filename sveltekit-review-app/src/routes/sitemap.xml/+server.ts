export const prerender = true;

const BASE = 'https://example.com';
const URLS = [
    '/', '/ai-interview', '/ai-interview/guide', '/ai-interview/faq'
];

const xml = (items: string) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;

export const GET = () => {
    const items = URLS.map(
        (p) => `<url><loc>${BASE}${p}</loc><changefreq>weekly</changefreq></url>`
    ).join('\n');
    return new Response(xml(items), { headers: { 'Content-Type': 'application/xml' } });
};
