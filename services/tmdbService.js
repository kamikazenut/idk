const NodeCache = require('node-cache');

const tmdbCache = new NodeCache({ stdTTL: 60 * 60, checkperiod: 120 });
const apiBaseUrl = process.env.TMDB_API_BASE_URL || 'https://api.themoviedb.org/3';
const imageBaseUrl = process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

function hasCredentials() {
  return Boolean(process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_API_KEY);
}

function imageUrl(path, size = 'w500') {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${imageBaseUrl}/${size}${path}`;
}

async function request(endpoint, params = {}) {
  if (!hasCredentials()) return null;
  const url = new URL(`${apiBaseUrl}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });

  const headers = { accept: 'application/json' };
  if (process.env.TMDB_ACCESS_TOKEN) {
    headers.authorization = `Bearer ${process.env.TMDB_ACCESS_TOKEN}`;
  } else {
    url.searchParams.set('api_key', process.env.TMDB_API_KEY);
  }

  const cacheKey = url.toString();
  const cached = tmdbCache.get(cacheKey);
  if (cached) return cached;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    console.warn(`TMDB request failed ${response.status}: ${endpoint}`);
    return null;
  }

  const data = await response.json();
  tmdbCache.set(cacheKey, data);
  return data;
}

function normalizeMovie(data) {
  if (!data) return null;
  return {
    tmdbId: data.id,
    mediaType: 'movie',
    title: data.title || data.original_title || `Movie ${data.id}`,
    overview: data.overview || '',
    posterPath: data.poster_path,
    backdropPath: data.backdrop_path,
    posterUrl: imageUrl(data.poster_path, 'w500'),
    backdropUrl: imageUrl(data.backdrop_path, 'w1280'),
    releaseDate: data.release_date || null,
    year: data.release_date ? data.release_date.slice(0, 4) : '',
    runtimeMinutes: data.runtime || null,
    genres: (data.genres || []).map((genre) => genre.name),
    originalLanguage: data.original_language || '',
    status: data.status || '',
    voteAverage: data.vote_average || 0,
    voteCount: data.vote_count || 0,
    metadata: data
  };
}

function normalizeShow(data) {
  if (!data) return null;
  return {
    tmdbId: data.id,
    mediaType: 'show',
    title: data.name || data.original_name || `Show ${data.id}`,
    overview: data.overview || '',
    posterPath: data.poster_path,
    backdropPath: data.backdrop_path,
    posterUrl: imageUrl(data.poster_path, 'w500'),
    backdropUrl: imageUrl(data.backdrop_path, 'w1280'),
    releaseDate: data.first_air_date || null,
    year: data.first_air_date ? data.first_air_date.slice(0, 4) : '',
    runtimeMinutes: Array.isArray(data.episode_run_time) ? data.episode_run_time[0] || null : null,
    genres: (data.genres || []).map((genre) => genre.name),
    originalLanguage: data.original_language || '',
    status: data.status || '',
    voteAverage: data.vote_average || 0,
    voteCount: data.vote_count || 0,
    seasons: (data.seasons || []).map(normalizeSeasonSummary),
    metadata: data
  };
}

function normalizeSeasonSummary(season) {
  return {
    tmdbSeasonId: season.id,
    seasonNumber: season.season_number,
    name: season.name || `Season ${season.season_number}`,
    overview: season.overview || '',
    posterPath: season.poster_path,
    posterUrl: imageUrl(season.poster_path, 'w500'),
    airDate: season.air_date || null,
    episodeCount: season.episode_count || 0,
    metadata: season
  };
}

function normalizeEpisode(showId, seasonNumber, episode) {
  return {
    tmdbEpisodeId: episode.id,
    episodeKey: `${showId}-${seasonNumber}-${episode.episode_number}`,
    seasonNumber,
    episodeNumber: episode.episode_number,
    title: episode.name || `Episode ${episode.episode_number}`,
    overview: episode.overview || '',
    stillPath: episode.still_path,
    stillUrl: imageUrl(episode.still_path, 'w500'),
    airDate: episode.air_date || null,
    runtimeMinutes: episode.runtime || null,
    voteAverage: episode.vote_average || 0,
    voteCount: episode.vote_count || 0,
    metadata: episode
  };
}

function normalizeSeason(showId, season) {
  if (!season) return null;
  return {
    tmdbSeasonId: season.id,
    seasonNumber: season.season_number,
    name: season.name || `Season ${season.season_number}`,
    overview: season.overview || '',
    posterPath: season.poster_path,
    posterUrl: imageUrl(season.poster_path, 'w500'),
    airDate: season.air_date || null,
    episodeCount: (season.episodes || []).length,
    episodes: (season.episodes || []).map((episode) => normalizeEpisode(showId, season.season_number, episode)),
    metadata: season
  };
}

async function getMovie(tmdbId) {
  return normalizeMovie(await request(`/movie/${tmdbId}`, { append_to_response: 'images' }));
}

async function getShow(tmdbId) {
  return normalizeShow(await request(`/tv/${tmdbId}`, { append_to_response: 'images' }));
}

async function getSeason(tmdbId, seasonNumber) {
  return normalizeSeason(Number(tmdbId), await request(`/tv/${tmdbId}/season/${seasonNumber}`));
}

async function getEpisode(tmdbId, seasonNumber, episodeNumber) {
  const data = await request(`/tv/${tmdbId}/season/${seasonNumber}/episode/${episodeNumber}`);
  return data ? normalizeEpisode(Number(tmdbId), Number(seasonNumber), data) : null;
}

async function search(query, type = 'multi') {
  const endpoint = type === 'movie' ? '/search/movie' : type === 'show' ? '/search/tv' : '/search/multi';
  const data = await request(endpoint, { query, include_adult: false });
  return (data?.results || [])
    .filter((item) => ['movie', 'tv'].includes(item.media_type || type))
    .map((item) => {
      const mediaType = item.media_type === 'tv' || type === 'show' ? 'show' : 'movie';
      return {
        tmdbId: item.id,
        mediaType,
        title: mediaType === 'show' ? item.name || item.original_name : item.title || item.original_title,
        overview: item.overview || '',
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        posterUrl: imageUrl(item.poster_path, 'w342'),
        releaseDate: mediaType === 'show' ? item.first_air_date : item.release_date,
        voteAverage: item.vote_average || 0
      };
    });
}

module.exports = {
  hasCredentials,
  imageUrl,
  getMovie,
  getShow,
  getSeason,
  getEpisode,
  search
};
