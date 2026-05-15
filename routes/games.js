const express = require('express');
const supabaseAdmin = require('../lib/supabaseAdmin');
const gameService = require('../services/gameService');
const userService = require('../services/userService');
const { logEvent } = require('../services/analyticsService');
const { requireLogin } = require('../middleware/auth');
const { cleanText } = require('../lib/sanitize');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [result, filters, tags] = await Promise.all([
      gameService.listGames(req.query),
      gameService.getFilters(),
      gameService.getTags()
    ]);

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json(result);
    }

    return res.render('pages/games', {
      title: 'Browse Games',
      metaDescription: 'Browse public domain game downloads by genre, platform, decade, rating, and popularity.',
      ...result,
      filters,
      tags,
      query: req.query
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const game = await gameService.getGameBySlug(req.params.slug);
    if (!game) return next();

    const [relatedGames, comments, userRating, wishlist] = await Promise.all([
      gameService.getRelatedGames(game),
      supabaseAdmin
        .from('comments')
        .select('*, profiles(username, avatar_url)')
        .eq('game_id', game.id)
        .eq('is_approved', true)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false }),
      req.user
        ? supabaseAdmin.from('ratings').select('score').eq('game_id', game.id).eq('user_id', req.user.id).maybeSingle()
        : Promise.resolve({ data: null }),
      req.user
        ? supabaseAdmin.from('wishlists').select('id').eq('game_id', game.id).eq('user_id', req.user.id).maybeSingle()
        : Promise.resolve({ data: null })
    ]);

    await logEvent({ eventType: 'page_view', entityId: game.id, userId: req.user?.id, metadata: { path: req.path } });

    return res.render('pages/game-detail', {
      title: `${game.title} Download`,
      metaDescription: game.short_description || `Download ${game.title}, a public domain game.`,
      game,
      relatedGames,
      comments: comments.data || [],
      userRating: userRating.data?.score || 0,
      inWishlist: Boolean(wishlist.data?.id),
      ogImage: game.banner_image_url || game.cover_image_url
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/:id/rate', requireLogin, async (req, res, next) => {
  try {
    await userService.rateGame(req.user.id, req.params.id, req.body.score);
    gameService.pageCache.flushAll();
    req.flash('success', 'Rating saved.');
    res.redirect(req.get('referer') || `/games/${req.body.slug || ''}`);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/wishlist', requireLogin, async (req, res, next) => {
  try {
    const result = await userService.toggleWishlist(req.user.id, req.params.id);
    if (req.headers.accept?.includes('application/json')) return res.json(result);
    req.flash('success', result.active ? 'Added to wishlist.' : 'Removed from wishlist.');
    return res.redirect(req.get('referer') || '/games');
  } catch (error) {
    return next(error);
  }
});

router.post('/:id/comments', requireLogin, async (req, res, next) => {
  try {
    await userService.addComment(req.user.id, req.params.id, cleanText(req.body.body, 2000), req.body.parent_id || null);
    req.flash('success', 'Comment submitted for moderation.');
    res.redirect(req.get('referer') || '/games');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
