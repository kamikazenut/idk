const express = require('express');
const { requireModerator } = require('../../middleware/auth');
const mediaService = require('../../services/mediaService');
const tmdbService = require('../../services/tmdbService');

const router = express.Router();

router.use(requireModerator);

function episodeManagerUrl(episode) {
  return `/admin/media/${episode.media_item_id}/seasons/${episode.season_number}/episodes#episode-${episode.id}`;
}

router.get('/', async (req, res, next) => {
  try {
    const result = await mediaService.listAdminMedia(req.query);
    res.render('admin/media', {
      layout: 'layouts/admin',
      title: 'Manage Media',
      ...result,
      query: req.query,
      tmdbConfigured: tmdbService.hasCredentials()
    });
  } catch (error) {
    next(error);
  }
});

router.get('/new', (req, res) => {
  res.render('admin/media-import', {
    layout: 'layouts/admin',
    title: 'Import from TMDB',
    results: [],
    query: req.query,
    tmdbConfigured: tmdbService.hasCredentials()
  });
});

router.get('/search', async (req, res, next) => {
  try {
    const results = req.query.q ? await tmdbService.search(req.query.q, req.query.type || 'multi') : [];
    res.render('admin/media-import', {
      layout: 'layouts/admin',
      title: 'Import from TMDB',
      results,
      query: req.query,
      tmdbConfigured: tmdbService.hasCredentials()
    });
  } catch (error) {
    next(error);
  }
});

router.post('/import', async (req, res, next) => {
  try {
    const media = await mediaService.createOrSyncMedia({
      mediaType: req.body.media_type,
      tmdbId: req.body.tmdb_id,
      body: req.body,
      userId: req.user.id
    });
    req.flash('success', `${media.title} imported from TMDB.`);
    res.redirect(`/admin/media/${media.id}/edit`);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/edit', async (req, res, next) => {
  try {
    const [media, seasons] = await Promise.all([
      mediaService.getAdminMedia(req.params.id),
      mediaService.getSeasons(req.params.id)
    ]);
    res.render('admin/media-form', {
      layout: 'layouts/admin',
      title: `Edit ${media.title}`,
      media,
      seasons,
      action: `/admin/media/${media.id}?_method=PUT`,
      tmdbConfigured: tmdbService.hasCredentials()
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const media = await mediaService.updateMediaFlags(req.params.id, req.body);
    req.flash('success', 'Media updated.');
    res.redirect(`/admin/media/${media.id}/edit`);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/sync', async (req, res, next) => {
  try {
    const current = await mediaService.getAdminMedia(req.params.id);
    const media = await mediaService.createOrSyncMedia({
      mediaType: current.media_type,
      tmdbId: current.tmdb_id,
      body: current,
      userId: req.user.id
    });
    req.flash('success', 'TMDB metadata synced.');
    res.redirect(`/admin/media/${media.id}/edit`);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/links', async (req, res, next) => {
  try {
    await mediaService.addDownloadLink(req.body, { mediaItemId: req.params.id });
    req.flash('success', 'Media link added.');
    res.redirect(`/admin/media/${req.params.id}/edit#download-links`);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/links/:linkId', async (req, res, next) => {
  try {
    await mediaService.updateDownloadLink(req.params.linkId, req.body);
    req.flash('success', 'Media link updated.');
    res.redirect(`/admin/media/${req.params.id}/edit#download-links`);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id/links/:linkId', async (req, res, next) => {
  try {
    await mediaService.deleteDownloadLink(req.params.linkId);
    req.flash('success', 'Media link deleted.');
    res.redirect(`/admin/media/${req.params.id}/edit#download-links`);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/seasons/:seasonNumber/sync', async (req, res, next) => {
  try {
    const media = await mediaService.getAdminMedia(req.params.id);
    await mediaService.ensureSeasonEpisodes(media, req.params.seasonNumber);
    req.flash('success', 'Season episodes synced from TMDB.');
    res.redirect(`/admin/media/${req.params.id}/seasons/${req.params.seasonNumber}/episodes`);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/seasons/:seasonNumber/episodes', async (req, res, next) => {
  try {
    const media = await mediaService.getAdminMedia(req.params.id);
    const [season, episodes] = await Promise.all([
      mediaService.getSeason(media.id, req.params.seasonNumber),
      mediaService.listEpisodes(media.id, req.params.seasonNumber)
    ]);

    res.render('admin/media-season-episodes', {
      layout: 'layouts/admin',
      title: `${media.title} - Season ${req.params.seasonNumber}`,
      media,
      season,
      episodes
    });
  } catch (error) {
    next(error);
  }
});

router.post('/episodes/:episodeId/links', async (req, res, next) => {
  try {
    await mediaService.addDownloadLink(req.body, { episodeId: req.params.episodeId });
    const episode = await mediaService.getAdminEpisode(req.params.episodeId);
    req.flash('success', 'Episode link added.');
    res.redirect(episodeManagerUrl(episode));
  } catch (error) {
    next(error);
  }
});

router.put('/episodes/:episodeId/links/:linkId', async (req, res, next) => {
  try {
    await mediaService.updateDownloadLink(req.params.linkId, req.body);
    const episode = await mediaService.getAdminEpisode(req.params.episodeId);
    req.flash('success', 'Episode link updated.');
    res.redirect(episodeManagerUrl(episode));
  } catch (error) {
    next(error);
  }
});

router.delete('/episodes/:episodeId/links/:linkId', async (req, res, next) => {
  try {
    await mediaService.deleteDownloadLink(req.params.linkId);
    const episode = await mediaService.getAdminEpisode(req.params.episodeId);
    req.flash('success', 'Episode link deleted.');
    res.redirect(episodeManagerUrl(episode));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
