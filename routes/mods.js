const express = require('express');
const modService = require('../services/modService');
const { logEvent } = require('../services/analyticsService');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [modGames, categories] = await Promise.all([
      modService.listModGames(),
      modService.listCategories()
    ]);
    const selectedCategory = req.query.category
      ? categories.find((item) => item.slug === req.query.category)
      : null;
    const latestMods = await modService.listMods({
      ...req.query,
      category_id: selectedCategory?.id,
      perPage: 12
    });

    await logEvent({ eventType: 'page_view', userId: req.user?.id, metadata: { path: '/mods' } });

    return res.render('pages/mods', {
      title: 'Mods Archive',
      metaDescription: 'Browse standalone mod hubs,',
      modGames,
      categories,
      selectedCategory,
      latestMods,
      query: req.query
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/:gameSlug', async (req, res, next) => {
  try {
    const modGame = await modService.getModGameBySlug(req.params.gameSlug);
    if (!modGame) return next();

    const category = req.query.category
      ? (modGame.categories || []).find((item) => item.slug === req.query.category)
      : null;

    const result = await modService.listMods({
      ...req.query,
      mod_game_id: modGame.id,
      category_id: category?.id
    });

    await logEvent({ eventType: 'page_view', entityId: modGame.id, userId: req.user?.id, metadata: { path: req.path, type: 'mod_game' } });

    return res.render('pages/mod-hub', {
      title: `${modGame.title} Mods`,
      metaDescription: `Browse ${modGame.title} mods, modpacks, maps, tools, server setups, and related files.`,
      modGame,
      selectedCategory: category,
      ...result,
      query: req.query,
      ogImage: modGame.banner_image_url || modGame.cover_image_url
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/:gameSlug/:modSlug', async (req, res, next) => {
  try {
    const modGame = await modService.getModGameBySlug(req.params.gameSlug);
    if (!modGame) return next();

    const mod = await modService.getModBySlug(req.params.modSlug, { modGameId: modGame.id });
    if (!mod) return next();

    const [comments, userRating, related] = await Promise.all([
      modService.listCommentsForMod(mod.id),
      modService.getUserRating(req.user?.id, mod.id),
      modService.listMods({ mod_game_id: modGame.id, category_id: mod.category_id, perPage: 4, sort: 'downloads' })
    ]);

    await logEvent({ eventType: 'page_view', entityId: mod.id, userId: req.user?.id, metadata: { path: req.path, type: 'mod' } });

    return res.render('pages/mod-detail', {
      title: `${mod.title} Mod`,
      metaDescription: mod.summary || `Download ${mod.title} for ${modGame.title}.`,
      modGame,
      mod,
      comments,
      userRating,
      relatedMods: related.mods.filter((item) => item.id !== mod.id),
      ogImage: mod.cover_image_url || modGame.banner_image_url || modGame.cover_image_url
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/:modId/rate', requireLogin, async (req, res, next) => {
  try {
    await modService.rateMod(req.user.id, req.params.modId, req.body.score);
    req.flash('success', 'Mod rating saved.');
    return res.redirect(req.get('referer') || '/mods');
  } catch (error) {
    return next(error);
  }
});

router.post('/:modId/comments', requireLogin, async (req, res, next) => {
  try {
    await modService.addModComment(req.user.id, req.params.modId, req.body.body, req.body.parent_id || null);
    req.flash('success', 'Mod comment submitted for moderation.');
    return res.redirect(req.get('referer') || '/mods');
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
