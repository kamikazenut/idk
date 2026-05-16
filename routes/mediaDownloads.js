const express = require('express');
const { downloadLimiter } = require('../middleware/rateLimit');
const mediaService = require('../services/mediaService');
const { logMediaDownload } = require('../services/analyticsService');

const router = express.Router();

router.post('/:linkId', downloadLimiter, async (req, res, next) => {
  try {
    const link = await mediaService.getDownloadLink(req.params.linkId);
    const media = link?.media_items || link?.media_episodes?.media_items;
    const episode = link?.media_episodes || null;

    if (!link || !media?.is_published || (episode && !episode.is_published)) {
      req.flash('error', 'That media link is unavailable.');
      return res.redirect(req.get('referer') || '/media');
    }

    await logMediaDownload({
      mediaItemId: link.media_item_id || null,
      episodeId: link.episode_id || null,
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
