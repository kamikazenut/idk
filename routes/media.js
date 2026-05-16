const express = require('express');
const mediaService = require('../services/mediaService');
const tmdbService = require('../services/tmdbService');
const { logEvent } = require('../services/analyticsService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [result, genres] = await Promise.all([
      mediaService.listMedia(req.query),
      mediaService.getGenres()
    ]);

    if (req.xhr || req.headers.accept?.includes('application/json')) return res.json(result);

    await logEvent({ eventType: 'page_view', userId: req.user?.id, metadata: { path: '/media' } });
    return res.render('pages/media', {
      title: 'Movies & Shows',
      metaDescription: 'Browse the movie and show archive.',
      ...result,
      genres,
      query: req.query,
      tmdbConfigured: tmdbService.hasCredentials()
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/movie/:tmdbId', async (req, res, next) => {
  try {
    const media = await mediaService.getMedia('movie', req.params.tmdbId);
    if (!media) return next();

    await logEvent({ eventType: 'page_view', entityId: media.id, userId: req.user?.id, metadata: { path: req.path, type: 'movie' } });
    return res.render('pages/media-detail', {
      title: media.title,
      metaDescription: media.overview || `Open ${media.title}.`,
      media,
      seasons: [],
      tmdbAttribution: true,
      ogImage: media.backdrop_url || media.poster_url
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/show/:tmdbId', async (req, res, next) => {
  try {
    const media = await mediaService.getMedia('show', req.params.tmdbId);
    if (!media) return next();
    const seasons = await mediaService.getSeasons(media.id);

    await logEvent({ eventType: 'page_view', entityId: media.id, userId: req.user?.id, metadata: { path: req.path, type: 'show' } });
    return res.render('pages/media-detail', {
      title: media.title,
      metaDescription: media.overview || `Open ${media.title}.`,
      media,
      seasons,
      tmdbAttribution: true,
      ogImage: media.backdrop_url || media.poster_url
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/show/:tmdbId/season/:seasonNumber', async (req, res, next) => {
  try {
    const media = await mediaService.getMedia('show', req.params.tmdbId, { countView: false });
    if (!media) return next();

    let [season, episodes] = await Promise.all([
      mediaService.getSeason(media.id, req.params.seasonNumber),
      mediaService.listEpisodes(media.id, req.params.seasonNumber)
    ]);

    if (!season && tmdbService.hasCredentials()) {
      const synced = await mediaService.ensureSeasonEpisodes(media, req.params.seasonNumber);
      season = synced.season;
      episodes = synced.episodes;
    }

    if (!season) return next();
    return res.render('pages/media-season', {
      title: `${media.title} - ${season.name}`,
      metaDescription: season.overview || `Browse ${media.title} season ${season.season_number}.`,
      media,
      season,
      episodes,
      tmdbAttribution: true,
      ogImage: season.poster_url || media.backdrop_url || media.poster_url
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/show/:tmdbId/season/:seasonNumber/episode/:episodeNumber', async (req, res, next) => {
  try {
    const media = await mediaService.getMedia('show', req.params.tmdbId, { countView: false });
    if (!media) return next();

    let episode = await mediaService.getEpisodeByNumbers(media.id, req.params.seasonNumber, req.params.episodeNumber);
    if (!episode && tmdbService.hasCredentials()) {
      await mediaService.ensureSeasonEpisodes(media, req.params.seasonNumber);
      episode = await mediaService.getEpisodeByNumbers(media.id, req.params.seasonNumber, req.params.episodeNumber);
    }

    if (!episode) return next();
    return res.render('pages/media-episode', {
      title: `${media.title} - S${episode.season_number}E${episode.episode_number}`,
      metaDescription: episode.overview || `Open ${media.title} season ${episode.season_number}, episode ${episode.episode_number}.`,
      media,
      episode,
      tmdbAttribution: true,
      ogImage: episode.still_url || media.backdrop_url || media.poster_url
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
