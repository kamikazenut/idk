const express = require('express');
const gameService = require('../services/gameService');
const { logEvent } = require('../services/analyticsService');
const supabaseAdmin = require('../lib/supabaseAdmin');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const data = await gameService.getHomeData();
    const filters = await gameService.getFilters();
    await logEvent({ eventType: 'page_view', userId: req.user?.id, metadata: { path: '/' } });
    res.render('pages/home', {
      title: 'piracy.cloud',
      metaDescription: 'Discover, rate, wishlist, and download games across every classic and modern genre.',
      ...data,
      filters
    });
  } catch (error) {
    next(error);
  }
});

router.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *
Allow: /
Sitemap: ${res.locals.baseUrl}/sitemap.xml
`);
});

router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const { data: games } = await supabaseAdmin
      .from('games')
      .select('slug, updated_at')
      .eq('is_published', true)
      .order('updated_at', { ascending: false })
      .limit(5000);

    const urls = [
      { loc: '/', lastmod: new Date().toISOString() },
      { loc: '/games', lastmod: new Date().toISOString() },
      { loc: '/search', lastmod: new Date().toISOString() },
      ...(games || []).map((game) => ({
        loc: `/games/${game.slug}`,
        lastmod: game.updated_at || new Date().toISOString()
      }))
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${res.locals.baseUrl}${url.loc}</loc><lastmod>${url.lastmod}</lastmod></url>`).join('\n')}
</urlset>`;
    res.type('application/xml').send(xml);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
