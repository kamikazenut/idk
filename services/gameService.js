const NodeCache = require('node-cache');
const slugify = require('slugify');
const supabaseAdmin = require('../lib/supabaseAdmin');
const { cleanArray, cleanHtml, cleanText, toBoolean, toNumber } = require('../lib/sanitize');

const pageCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const GAME_SELECT = `
  *,
  profiles:created_by(username, avatar_url),
  ratings(score),
  download_links(id, label, url, source_type, file_size_mb, version, platform_target, click_count, is_active, sort_order),
  game_tags(tags(id, name, slug, color_hex))
`;

const emptyHomeData = {
  featured: [],
  newest: [],
  downloaded: [],
  topRated: [],
  randomPick: null,
  tags: []
};

const emptyFilters = {
  genres: [],
  platforms: [],
  decades: []
};

function normalizeGame(row) {
  if (!row) return null;
  const scores = row.ratings || [];
  const avg = scores.length
    ? scores.reduce((sum, rating) => sum + Number(rating.score || 0), 0) / scores.length
    : 0;
  const tags = (row.game_tags || []).map((item) => item.tags).filter(Boolean);
  const activeLinks = (row.download_links || [])
    .filter((link) => link.is_active !== false)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return {
    ...row,
    rating_average: Number(avg.toFixed(1)),
    rating_count: scores.length,
    tags,
    active_download_links: activeLinks
  };
}

function buildSlug(title, fallback) {
  const base = title || fallback || 'game';
  return slugify(base, { lower: true, strict: true, trim: true });
}

function gamePayload(body, createdBy) {
  const title = cleanText(body.title, 180);
  return {
    title,
    slug: cleanText(body.slug, 220) || buildSlug(title),
    description: cleanHtml(body.description),
    short_description: cleanText(body.short_description, 280),
    genre: cleanArray(body.genre),
    platform: cleanArray(body.platform),
    release_year: toNumber(body.release_year),
    developer: cleanText(body.developer, 180),
    publisher: cleanText(body.publisher, 180),
    cover_image_url: cleanText(body.cover_image_url, 1000),
    banner_image_url: cleanText(body.banner_image_url, 1000),
    screenshots: cleanArray(body.screenshots).map((url) => ({ url })),
    system_requirements: cleanHtml(body.system_requirements),
    is_featured: toBoolean(body.is_featured),
    is_published: toBoolean(body.is_published),
    created_by: createdBy || null,
    updated_at: new Date().toISOString()
  };
}

function downloadLinkPayload(body, gameId) {
  return {
    game_id: gameId,
    label: cleanText(body.label, 180),
    url: cleanText(body.url, 1000),
    source_type: cleanText(body.source_type, 30) || 'external',
    file_size_mb: toNumber(body.file_size_mb),
    version: cleanText(body.version, 80),
    platform_target: cleanText(body.platform_target, 120),
    is_active: toBoolean(body.is_active),
    sort_order: toNumber(body.sort_order, 0)
  };
}

async function getHomeData() {
  const cacheKey = 'home-data';
  const cached = pageCache.get(cacheKey);
  if (cached) return cached;

  const [featured, newest, downloaded, rated, randomPick, tags] = await Promise.all([
    supabaseAdmin.from('games').select(GAME_SELECT).eq('is_published', true).eq('is_featured', true).order('updated_at', { ascending: false }).limit(5),
    supabaseAdmin.from('games').select(GAME_SELECT).eq('is_published', true).order('created_at', { ascending: false }).limit(8),
    supabaseAdmin.from('games').select(GAME_SELECT).eq('is_published', true).order('download_count', { ascending: false }).limit(8),
    supabaseAdmin.from('games').select(GAME_SELECT).eq('is_published', true).limit(20),
    supabaseAdmin.rpc('random_published_games', { result_limit: 1 }),
    supabaseAdmin.from('tags').select('*').order('name')
  ]);

  const backendError = [featured, newest, downloaded, rated, randomPick, tags].find((result) => result.error);
  if (backendError) {
    console.warn('Supabase home query failed:', backendError.error.message);
    return emptyHomeData;
  }

  const topRated = (rated.data || [])
    .map(normalizeGame)
    .sort((a, b) => b.rating_average - a.rating_average)
    .slice(0, 8);

  const data = {
    featured: (featured.data || []).map(normalizeGame),
    newest: (newest.data || []).map(normalizeGame),
    downloaded: (downloaded.data || []).map(normalizeGame),
    topRated,
    randomPick: normalizeGame(randomPick.data?.[0]),
    tags: tags.data || []
  };

  pageCache.set(cacheKey, data);
  return data;
}

async function listGames(options = {}) {
  const page = Math.max(Number(options.page) || 1, 1);
  const perPage = Math.min(Number(options.perPage) || 12, 48);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabaseAdmin
    .from('games')
    .select(GAME_SELECT, { count: 'exact' })
    .eq('is_published', true);

  if (options.genre) query = query.contains('genre', [options.genre]);
  if (options.platform) query = query.contains('platform', [options.platform]);
  if (options.decade) {
    const start = Number(options.decade);
    if (Number.isFinite(start)) query = query.gte('release_year', start).lt('release_year', start + 10);
  }
  if (options.q) query = query.textSearch('search_vector', options.q, { type: 'websearch' });
  if (options.tag) {
    const { data: tagRows } = await supabaseAdmin.from('tags').select('id').eq('slug', options.tag).limit(1);
    const tagId = tagRows?.[0]?.id;
    if (tagId) {
      const { data: gameTags } = await supabaseAdmin.from('game_tags').select('game_id').eq('tag_id', tagId);
      const gameIds = (gameTags || []).map((item) => item.game_id);
      if (!gameIds.length) {
        return {
          games: [],
          total: 0,
          page,
          perPage,
          totalPages: 1
        };
      }
      query = query.in('id', gameIds);
    } else {
      return {
        games: [],
        total: 0,
        page,
        perPage,
        totalPages: 1
      };
    }
  }

  switch (options.sort) {
    case 'downloads':
      query = query.order('download_count', { ascending: false });
      break;
    case 'rating':
      query = query.order('download_count', { ascending: false });
      break;
    case 'az':
      query = query.order('title', { ascending: true });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);
  if (error) {
    console.warn('Supabase game listing failed:', error.message);
    return {
      games: [],
      total: 0,
      page,
      perPage,
      totalPages: 1
    };
  }

  let games = (data || []).map(normalizeGame);
  if (options.rating) {
    const min = Number(options.rating);
    games = games.filter((game) => game.rating_average >= min);
  }
  if (options.sort === 'rating') {
    games.sort((a, b) => b.rating_average - a.rating_average);
  }

  return {
    games,
    total: count || 0,
    page,
    perPage,
    totalPages: Math.max(Math.ceil((count || 0) / perPage), 1)
  };
}

async function getGameBySlug(slug, { countView = true } = {}) {
  const cacheKey = `game:${slug}`;
  const cached = pageCache.get(cacheKey);
  if (cached) {
    if (countView) incrementViewCount(cached.id).catch(console.error);
    return cached;
  }

  const { data, error } = await supabaseAdmin
    .from('games')
    .select(GAME_SELECT)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error) return null;

  const game = normalizeGame(data);
  pageCache.set(cacheKey, game);
  if (countView) incrementViewCount(game.id).catch(console.error);
  return game;
}

async function getGameForAdmin(id) {
  const { data, error } = await supabaseAdmin.from('games').select(GAME_SELECT).eq('id', id).single();
  if (error) throw error;
  return normalizeGame(data);
}

async function getRelatedGames(game) {
  const primaryGenre = game?.genre?.[0];
  if (!primaryGenre) return [];
  const { data } = await supabaseAdmin
    .from('games')
    .select(GAME_SELECT)
    .eq('is_published', true)
    .neq('id', game.id)
    .contains('genre', [primaryGenre])
    .limit(4);
  return (data || []).map(normalizeGame);
}

async function incrementViewCount(gameId) {
  await supabaseAdmin.rpc('increment_game_view_count', { target_game_id: gameId });
}

async function createGame(body, userId) {
  const payload = gamePayload(body, userId);
  const { data, error } = await supabaseAdmin.from('games').insert(payload).select().single();
  if (error) throw error;
  pageCache.flushAll();
  return data;
}

async function updateGame(id, body) {
  const payload = gamePayload(body);
  delete payload.created_by;
  if (!payload.cover_image_url) delete payload.cover_image_url;
  if (!payload.banner_image_url) delete payload.banner_image_url;
  if (!payload.screenshots.length) delete payload.screenshots;
  const { data, error } = await supabaseAdmin.from('games').update(payload).eq('id', id).select().single();
  if (error) throw error;
  pageCache.flushAll();
  return data;
}

async function softDeleteGame(id) {
  const { error } = await supabaseAdmin.from('games').update({ is_published: false, deleted_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
  pageCache.flushAll();
}

async function listAdminGames(options = {}) {
  const page = Math.max(Number(options.page) || 1, 1);
  const perPage = 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  let query = supabaseAdmin.from('games').select('*', { count: 'exact' }).order('created_at', { ascending: false });
  if (options.q) query = query.ilike('title', `%${options.q}%`);
  if (options.status === 'published') query = query.eq('is_published', true);
  if (options.status === 'draft') query = query.eq('is_published', false);
  const { data, count, error } = await query.range(from, to);
  if (error) throw error;
  return { games: data || [], total: count || 0, page, perPage, totalPages: Math.max(Math.ceil((count || 0) / perPage), 1) };
}

async function addDownloadLink(gameId, body) {
  const { data, error } = await supabaseAdmin.from('download_links').insert(downloadLinkPayload(body, gameId)).select().single();
  if (error) throw error;
  pageCache.flushAll();
  return data;
}

async function updateDownloadLink(linkId, body) {
  const payload = downloadLinkPayload(body, body.game_id);
  delete payload.game_id;
  const { data, error } = await supabaseAdmin.from('download_links').update(payload).eq('id', linkId).select().single();
  if (error) throw error;
  pageCache.flushAll();
  return data;
}

async function deleteDownloadLink(linkId) {
  const { error } = await supabaseAdmin.from('download_links').delete().eq('id', linkId);
  if (error) throw error;
  pageCache.flushAll();
}

async function getFilters() {
  const { data: games, error } = await supabaseAdmin.from('games').select('genre, platform, release_year').eq('is_published', true);
  if (error) {
    console.warn('Supabase filters query failed:', error.message);
    return emptyFilters;
  }
  const genres = new Set();
  const platforms = new Set();
  const decades = new Set();
  (games || []).forEach((game) => {
    (game.genre || []).forEach((item) => genres.add(item));
    (game.platform || []).forEach((item) => platforms.add(item));
    if (game.release_year) decades.add(Math.floor(game.release_year / 10) * 10);
  });

  return {
    genres: [...genres].sort(),
    platforms: [...platforms].sort(),
    decades: [...decades].sort((a, b) => b - a)
  };
}

async function getTags() {
  const { data, error } = await supabaseAdmin.from('tags').select('*').order('name');
  if (error) {
    console.warn('Supabase tags query failed:', error.message);
    return [];
  }
  return data || [];
}

async function createTag(body) {
  const name = cleanText(body.name, 120);
  const payload = {
    name,
    slug: cleanText(body.slug, 160) || buildSlug(name),
    description: cleanText(body.description, 500),
    color_hex: cleanText(body.color_hex, 20) || '#e11d48'
  };
  const { data, error } = await supabaseAdmin.from('tags').insert(payload).select().single();
  if (error) throw error;
  return data;
}

async function updateTag(id, body) {
  const name = cleanText(body.name, 120);
  const payload = {
    name,
    slug: cleanText(body.slug, 160) || buildSlug(name),
    description: cleanText(body.description, 500),
    color_hex: cleanText(body.color_hex, 20) || '#e11d48'
  };
  const { data, error } = await supabaseAdmin.from('tags').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function deleteTag(id) {
  const { error } = await supabaseAdmin.from('tags').delete().eq('id', id);
  if (error) throw error;
}

async function setGameTags(gameId, tagIds = []) {
  await supabaseAdmin.from('game_tags').delete().eq('game_id', gameId);
  const rows = tagIds.filter(Boolean).map((tagId) => ({ game_id: gameId, tag_id: tagId }));
  if (!rows.length) return;
  const { error } = await supabaseAdmin.from('game_tags').insert(rows);
  if (error) throw error;
}

module.exports = {
  getHomeData,
  listGames,
  getGameBySlug,
  getGameForAdmin,
  getRelatedGames,
  createGame,
  updateGame,
  softDeleteGame,
  listAdminGames,
  addDownloadLink,
  updateDownloadLink,
  deleteDownloadLink,
  getFilters,
  getTags,
  createTag,
  updateTag,
  deleteTag,
  setGameTags,
  normalizeGame,
  pageCache
};
