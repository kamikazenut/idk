const supabaseAdmin = require('../lib/supabaseAdmin');
const tmdbService = require('./tmdbService');
const { cleanText, toBoolean, toNumber } = require('../lib/sanitize');

const emptyListing = {
  items: [],
  total: 0,
  page: 1,
  perPage: 12,
  totalPages: 1
};

const MEDIA_SELECT = `
  *,
  media_download_links(id, label, url, source_type, file_size_mb, quality, language, version, click_count, is_active, sort_order),
  media_ratings(score)
`;

const EPISODE_SELECT = `
  *,
  media_download_links(id, label, url, source_type, file_size_mb, quality, language, version, click_count, is_active, sort_order),
  media_ratings(score)
`;

function handleMissingMediaTable(error, fallback) {
  if (!error) return fallback;
  if (['42P01', '42703', 'PGRST200', 'PGRST205'].includes(error.code)) {
    console.warn('Media tables are not ready yet:', error.message);
    return fallback;
  }
  throw error;
}

function activeLinks(row) {
  return (row.media_download_links || [])
    .filter((link) => link.is_active !== false)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

function ratingStats(row) {
  const scores = row.media_ratings || [];
  const avg = scores.length
    ? scores.reduce((sum, rating) => sum + Number(rating.score || 0), 0) / scores.length
    : 0;
  return {
    rating_average: Number(avg.toFixed(1)),
    rating_count: scores.length
  };
}

function normalizeMedia(row) {
  if (!row) return null;
  return {
    ...row,
    poster_url: tmdbService.imageUrl(row.poster_path, 'w500'),
    backdrop_url: tmdbService.imageUrl(row.backdrop_path, 'w1280'),
    active_download_links: activeLinks(row),
    ...ratingStats(row)
  };
}

function normalizeSeason(row) {
  if (!row) return null;
  return {
    ...row,
    poster_url: tmdbService.imageUrl(row.poster_path, 'w500')
  };
}

function normalizeEpisode(row) {
  if (!row) return null;
  return {
    ...row,
    still_url: tmdbService.imageUrl(row.still_path, 'w500'),
    active_download_links: activeLinks(row),
    ...ratingStats(row)
  };
}

function mediaPayloadFromTmdb(mediaType, tmdb, body = {}, userId = null) {
  return {
    media_type: mediaType,
    tmdb_id: Number(tmdb.tmdbId || body.tmdb_id),
    title: tmdb.title || cleanText(body.title, 220),
    overview: tmdb.overview || '',
    poster_path: tmdb.posterPath || null,
    backdrop_path: tmdb.backdropPath || null,
    release_date: tmdb.releaseDate || null,
    runtime_minutes: tmdb.runtimeMinutes || null,
    genres: tmdb.genres || [],
    original_language: tmdb.originalLanguage || '',
    status: tmdb.status || '',
    tmdb_vote_average: tmdb.voteAverage || 0,
    tmdb_vote_count: tmdb.voteCount || 0,
    metadata: tmdb.metadata || {},
    is_featured: toBoolean(body.is_featured),
    is_published: toBoolean(body.is_published),
    last_synced_at: new Date().toISOString(),
    created_by: userId
  };
}

function linkPayload(body, target = {}) {
  return {
    media_item_id: target.mediaItemId || null,
    episode_id: target.episodeId || null,
    label: cleanText(body.label, 180),
    url: cleanText(body.url, 1000),
    source_type: cleanText(body.source_type, 30) || 'external',
    file_size_mb: toNumber(body.file_size_mb),
    quality: cleanText(body.quality, 60),
    language: cleanText(body.language, 80),
    version: cleanText(body.version, 80),
    is_active: toBoolean(body.is_active),
    sort_order: toNumber(body.sort_order, 0)
  };
}

async function upsertSeason(mediaItemId, season) {
  const payload = {
    media_item_id: mediaItemId,
    tmdb_season_id: season.tmdbSeasonId,
    season_number: season.seasonNumber,
    name: season.name,
    overview: season.overview,
    poster_path: season.posterPath,
    air_date: season.airDate,
    episode_count: season.episodeCount || 0,
    metadata: season.metadata || {}
  };
  const { data, error } = await supabaseAdmin
    .from('media_seasons')
    .upsert(payload, { onConflict: 'media_item_id,season_number' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function upsertEpisode(mediaItemId, seasonId, episode) {
  const payload = {
    media_item_id: mediaItemId,
    season_id: seasonId,
    tmdb_episode_id: episode.tmdbEpisodeId,
    episode_key: episode.episodeKey,
    season_number: episode.seasonNumber,
    episode_number: episode.episodeNumber,
    title: episode.title,
    overview: episode.overview,
    still_path: episode.stillPath,
    air_date: episode.airDate,
    runtime_minutes: episode.runtimeMinutes,
    metadata: episode.metadata || {},
    is_published: true
  };
  const { data, error } = await supabaseAdmin
    .from('media_episodes')
    .upsert(payload, { onConflict: 'media_item_id,season_number,episode_number' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function syncShowSeasons(mediaItem, tmdbShow) {
  const seasons = (tmdbShow.seasons || []).filter((season) => season.seasonNumber > 0);
  await Promise.all(seasons.map((season) => upsertSeason(mediaItem.id, season)));
}

async function createOrSyncMedia({ mediaType, tmdbId, body = {}, userId = null }) {
  const tmdb = mediaType === 'movie'
    ? await tmdbService.getMovie(tmdbId)
    : await tmdbService.getShow(tmdbId);
  if (!tmdb) throw new Error('TMDB item was not found or TMDB is not configured.');

  const payload = mediaPayloadFromTmdb(mediaType, tmdb, body, userId);
  const { data, error } = await supabaseAdmin
    .from('media_items')
    .upsert(payload, { onConflict: 'media_type,tmdb_id' })
    .select(MEDIA_SELECT)
    .single();
  if (error) throw error;
  if (mediaType === 'show') await syncShowSeasons(data, tmdb);
  return normalizeMedia(data);
}

async function ensureSeasonEpisodes(mediaItem, seasonNumber) {
  const season = await tmdbService.getSeason(mediaItem.tmdb_id, seasonNumber);
  if (!season) return { season: null, episodes: [] };
  const seasonRow = await upsertSeason(mediaItem.id, season);
  const episodes = await Promise.all((season.episodes || []).map((episode) => upsertEpisode(mediaItem.id, seasonRow.id, episode)));
  return { season: normalizeSeason(seasonRow), episodes: episodes.map(normalizeEpisode) };
}

async function listMedia(options = {}) {
  const page = Math.max(Number(options.page) || 1, 1);
  const perPage = Math.min(Number(options.perPage) || 12, 48);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabaseAdmin
    .from('media_items')
    .select(MEDIA_SELECT, { count: 'exact' })
    .eq('is_published', true);

  if (options.type === 'movie') query = query.eq('media_type', 'movie');
  if (options.type === 'show') query = query.eq('media_type', 'show');
  if (options.genre) query = query.contains('genres', [options.genre]);
  if (options.q) query = query.ilike('title', `%${cleanText(options.q, 120)}%`);

  switch (options.sort) {
    case 'downloads':
      query = query.order('download_count', { ascending: false });
      break;
    case 'az':
      query = query.order('title');
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);
  if (error) return handleMissingMediaTable(error, { ...emptyListing, page, perPage });
  return {
    items: (data || []).map(normalizeMedia),
    total: count || 0,
    page,
    perPage,
    totalPages: Math.max(Math.ceil((count || 0) / perPage), 1)
  };
}

async function getMedia(mediaType, tmdbId, { countView = true } = {}) {
  const { data, error } = await supabaseAdmin
    .from('media_items')
    .select(MEDIA_SELECT)
    .eq('media_type', mediaType)
    .eq('tmdb_id', Number(tmdbId))
    .eq('is_published', true)
    .maybeSingle();
  if (error) return handleMissingMediaTable(error, null);
  const media = normalizeMedia(data);
  if (media && countView) supabaseAdmin.rpc('increment_media_view_count', { target_media_item_id: media.id }).then(() => {}).catch(console.error);
  return media;
}

async function getAdminMedia(id) {
  const { data, error } = await supabaseAdmin.from('media_items').select(MEDIA_SELECT).eq('id', id).single();
  if (error) throw error;
  return normalizeMedia(data);
}

async function listAdminMedia(options = {}) {
  const page = Math.max(Number(options.page) || 1, 1);
  const perPage = Math.min(Number(options.perPage) || 20, 200);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  let query = supabaseAdmin.from('media_items').select(MEDIA_SELECT, { count: 'exact' }).order('created_at', { ascending: false });
  if (options.q) query = query.ilike('title', `%${cleanText(options.q, 120)}%`);
  if (options.type) query = query.eq('media_type', options.type);
  const { data, count, error } = await query.range(from, to);
  if (error) throw error;
  return { items: (data || []).map(normalizeMedia), total: count || 0, page, perPage, totalPages: Math.max(Math.ceil((count || 0) / perPage), 1) };
}

async function updateMediaFlags(id, body) {
  const { data, error } = await supabaseAdmin
    .from('media_items')
    .update({
      is_published: toBoolean(body.is_published),
      is_featured: toBoolean(body.is_featured)
    })
    .eq('id', id)
    .select(MEDIA_SELECT)
    .single();
  if (error) throw error;
  return normalizeMedia(data);
}

async function getSeasons(mediaItemId) {
  const { data, error } = await supabaseAdmin
    .from('media_seasons')
    .select('*')
    .eq('media_item_id', mediaItemId)
    .order('season_number');
  if (error) return handleMissingMediaTable(error, []);
  return (data || []).map(normalizeSeason);
}

async function getSeason(mediaItemId, seasonNumber) {
  const { data, error } = await supabaseAdmin
    .from('media_seasons')
    .select('*')
    .eq('media_item_id', mediaItemId)
    .eq('season_number', Number(seasonNumber))
    .maybeSingle();
  if (error) return handleMissingMediaTable(error, null);
  return normalizeSeason(data);
}

async function listEpisodes(mediaItemId, seasonNumber) {
  const { data, error } = await supabaseAdmin
    .from('media_episodes')
    .select(EPISODE_SELECT)
    .eq('media_item_id', mediaItemId)
    .eq('season_number', Number(seasonNumber))
    .order('episode_number');
  if (error) return handleMissingMediaTable(error, []);
  return (data || []).map(normalizeEpisode);
}

async function getEpisodeByNumbers(mediaItemId, seasonNumber, episodeNumber, { countView = true } = {}) {
  const { data, error } = await supabaseAdmin
    .from('media_episodes')
    .select(EPISODE_SELECT)
    .eq('media_item_id', mediaItemId)
    .eq('season_number', Number(seasonNumber))
    .eq('episode_number', Number(episodeNumber))
    .eq('is_published', true)
    .maybeSingle();
  if (error) return handleMissingMediaTable(error, null);
  const episode = normalizeEpisode(data);
  if (episode && countView) supabaseAdmin.rpc('increment_media_episode_view_count', { target_episode_id: episode.id }).then(() => {}).catch(console.error);
  return episode;
}

async function getAdminEpisode(id) {
  const { data, error } = await supabaseAdmin
    .from('media_episodes')
    .select('*, media_items(id, title, tmdb_id, media_type)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

async function addDownloadLink(body, target) {
  const { data, error } = await supabaseAdmin.from('media_download_links').insert(linkPayload(body, target)).select().single();
  if (error) throw error;
  return data;
}

async function updateDownloadLink(linkId, body) {
  const payload = linkPayload(body, {});
  delete payload.media_item_id;
  delete payload.episode_id;
  const { data, error } = await supabaseAdmin.from('media_download_links').update(payload).eq('id', linkId).select().single();
  if (error) throw error;
  return data;
}

async function deleteDownloadLink(linkId) {
  const { error } = await supabaseAdmin.from('media_download_links').delete().eq('id', linkId);
  if (error) throw error;
}

async function getDownloadLink(linkId) {
  const { data, error } = await supabaseAdmin
    .from('media_download_links')
    .select('*, media_items(id, tmdb_id, media_type, title, is_published), media_episodes(id, media_item_id, episode_key, title, is_published, media_items(id, tmdb_id, media_type, title, is_published))')
    .eq('id', linkId)
    .eq('is_active', true)
    .single();
  if (error) return null;
  return data;
}

async function getGenres() {
  const { data, error } = await supabaseAdmin.from('media_items').select('genres').eq('is_published', true);
  if (error) return handleMissingMediaTable(error, []);
  const genres = new Set();
  (data || []).forEach((item) => (item.genres || []).forEach((genre) => genres.add(genre)));
  return [...genres].sort();
}

module.exports = {
  normalizeMedia,
  normalizeEpisode,
  createOrSyncMedia,
  ensureSeasonEpisodes,
  listMedia,
  getMedia,
  getAdminMedia,
  listAdminMedia,
  updateMediaFlags,
  getSeasons,
  getSeason,
  listEpisodes,
  getEpisodeByNumbers,
  getAdminEpisode,
  addDownloadLink,
  updateDownloadLink,
  deleteDownloadLink,
  getDownloadLink,
  getGenres
};
