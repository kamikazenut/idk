const express = require('express');
const supabaseAdmin = require('../lib/supabaseAdmin');
const { downloadLimiter } = require('../middleware/rateLimit');
const { logModDownload } = require('../services/analyticsService');

const router = express.Router();

router.post('/:linkId', downloadLimiter, async (req, res, next) => {
  try {
    const { data: link, error } = await supabaseAdmin
      .from('mod_download_links')
      .select('*, mods(id, title, slug, is_published, deleted_at, mod_games(slug))')
      .eq('id', req.params.linkId)
      .eq('is_active', true)
      .single();

    if (error || !link || !link.mods?.is_published || link.mods?.deleted_at) {
      req.flash('error', 'That mod download link is unavailable.');
      return res.redirect(req.get('referer') || '/mods');
    }

    await logModDownload({
      modId: link.mod_id,
      linkId: link.id,
      userId: req.user?.id,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    return res.redirect(link.url);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
