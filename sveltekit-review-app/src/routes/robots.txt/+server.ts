export const prerender = true;
export const GET = () =>
    new Response(
        `User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml\n`,
        { headers: { 'Content-Type': 'text/plain' } }
    );
