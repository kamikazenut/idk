const express = require('express');
const mediaService = require('../services/mediaService');

const router = express.Router();

function parsePositiveInt(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

function sendStreamResponse(res, payload) {
  if (!payload) return res.status(404).json({ found: false, streams: [] });
  return res.json({
    found: true,
    ...payload,
    count: payload.streams.length
  });
}

router.get('/movie/:tmdbId', async (req, res, next) => {
  try {
    const tmdbId = parsePositiveInt(req.params.tmdbId);
    if (!tmdbId) return res.status(400).json({ error: 'A valid TMDB id is required.' });

    const payload = await mediaService.getMovieStreams(tmdbId);
    return sendStreamResponse(res, payload);
  } catch (error) {
    return next(error);
  }
});

router.get('/show/:tmdbId/:seasonNumber/:episodeNumber', async (req, res, next) => {
  try {
    const tmdbId = parsePositiveInt(req.params.tmdbId);
    const seasonNumber = parsePositiveInt(req.params.seasonNumber);
    const episodeNumber = parsePositiveInt(req.params.episodeNumber);
    if (!tmdbId || !seasonNumber || !episodeNumber) {
      return res.status(400).json({ error: 'Valid TMDB, season, and episode numbers are required.' });
    }

    const payload = await mediaService.getEpisodeStreams(tmdbId, seasonNumber, episodeNumber);
    return sendStreamResponse(res, payload);
  } catch (error) {
    return next(error);
  }
});

router.get('/tmdb/:tmdbId', async (req, res, next) => {
  try {
    const tmdbId = parsePositiveInt(req.params.tmdbId);
    if (!tmdbId) return res.status(400).json({ error: 'A valid TMDB id is required.' });

    const payload = await mediaService.getMovieStreams(tmdbId);
    return sendStreamResponse(res, payload);
  } catch (error) {
    return next(error);
  }
});

router.get('/tmdb/:tmdbId/:seasonNumber/:episodeNumber', async (req, res, next) => {
  try {
    const tmdbId = parsePositiveInt(req.params.tmdbId);
    const seasonNumber = parsePositiveInt(req.params.seasonNumber);
    const episodeNumber = parsePositiveInt(req.params.episodeNumber);
    if (!tmdbId || !seasonNumber || !episodeNumber) {
      return res.status(400).json({ error: 'Valid TMDB, season, and episode numbers are required.' });
    }

    const payload = await mediaService.getEpisodeStreams(tmdbId, seasonNumber, episodeNumber);
    return sendStreamResponse(res, payload);
  } catch (error) {
    return next(error);
  }
});

router.use((req, res) => {
  res.status(404).json({ found: false, streams: [] });
});

router.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'The stream API hit a snag.' : error.message
  });
});

module.exports = router;
