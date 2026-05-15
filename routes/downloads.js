const express = require('express');
const supabaseAdmin = require('../lib/supabaseAdmin');
const { downloadLimiter } = require('../middleware/rateLimit');
const { logDownload } = require('../services/analyticsService');
const { pageCache } = require('../services/gameService');

const router = express.Router();

router.post('/:linkId', downloadLimiter, async (req, res, next) => {
  try {
    const { data: link, error } = await supabaseAdmin
      .from('download_links')
      .select('*, games(id, slug, title)')
      .eq('id', req.params.linkId)
      .eq('is_active', true)
      .single();

    if (error || !link) {
      req.flash('error', 'That download link is unavailable.');
      return res.redirect(req.get('referer') || '/games');
    }

    await logDownload({
      gameId: link.game_id,
      linkId: link.id,
      userId: req.user?.id,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    pageCache.flushAll();

    return res.redirect(link.url);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
