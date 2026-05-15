const express = require('express');
const gameService = require('../services/gameService');
const { logSearch } = require('../services/analyticsService');
const { cleanText } = require('../lib/sanitize');
const supabaseAdmin = require('../lib/supabaseAdmin');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const q = cleanText(req.query.q, 200);
    const result = await gameService.listGames({ ...req.query, q, perPage: 18 });
    const [filters, tags] = await Promise.all([gameService.getFilters(), gameService.getTags()]);
    if (q) await logSearch({ query: q, userId: req.user?.id, filters: req.query });

    res.render('pages/search', {
      title: q ? `Search: ${q}` : 'Search Games',
      metaDescription: 'Search public domain games by title, description, developer, tag, genre, and platform.',
      ...result,
      filters,
      tags,
      query: { ...req.query, q }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/autocomplete', async (req, res, next) => {
  try {
    const q = cleanText(req.query.q, 100);
    if (q.length < 2) return res.json([]);
    const { data, error } = await supabaseAdmin
      .from('games')
      .select('title, slug, cover_image_url, genre')
      .eq('is_published', true)
      .or(`title.ilike.%${q}%,developer.ilike.%${q}%`)
      .limit(8);
    if (error) throw error;
    return res.json(data || []);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
