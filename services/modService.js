const slugify = require('slugify');
const supabaseAdmin = require('../lib/supabaseAdmin');
const { cleanArray, cleanHtml, cleanText, toBoolean, toNumber } = require('../lib/sanitize');

const emptyModListing = {
  mods: [],
  total: 0,
  page: 1,
  perPage: 12,
  totalPages: 1
};

const MOD_GAME_SELECT = `
  *,
  linked_game:game_id(id, title, slug, cover_image_url),
  mod_game_categories(sort_order, mod_categories(id, name, slug, description, color_hex))
`;

const MOD_SELECT = `
  *,
  mod_games(id, title, slug, cover_image_url, banner_image_url, game_id),
  mod_categories(id, name, slug, color_hex),
  mod_ratings(score),
  mod_download_links(id, label, url, source_type, file_size_mb, version, click_count, is_active, sort_order)
`;

function buildSlug(value, fallback = 'item') {
  return slugify(value || fallback, { lower: true, strict: true, trim: true });
}

function normalizeMod(mod) {
  if (!mod) return null;
  const scores = mod.mod_ratings || [];
  const avg = scores.length
    ? scores.reduce((sum, rating) => sum + Number(rating.score || 0), 0) / scores.length
    : 0;
  const activeLinks = (mod.mod_download_links || [])
    .filter((link) => link.is_active !== false)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return {
    ...mod,
    rating_average: Number(avg.toFixed(1)),
    rating_count: scores.length,
    active_download_links: activeLinks
  };
}

function normalizeModComment(comment) {
  if (!comment) return null;
  return {
    ...comment,
    replies: []
  };
}

function normalizeModGame(row) {
  if (!row) return null;
  return {
    ...row,
    categories: (row.mod_game_categories || [])
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((item) => item.mod_categories)
      .filter(Boolean)
  };
}

function modGamePayload(body, createdBy) {
  const title = cleanText(body.title, 180);
  const payload = {
    title,
    slug: cleanText(body.slug, 220) || buildSlug(title),
    description: cleanHtml(body.description),
    cover_image_url: cleanText(body.cover_image_url, 1000),
    banner_image_url: cleanText(body.banner_image_url, 1000),
    game_id: cleanText(body.game_id, 80) || null,
    is_featured: toBoolean(body.is_featured),
    is_published: toBoolean(body.is_published),
    updated_at: new Date().toISOString()
  };
  if (createdBy) payload.created_by = createdBy;
  return payload;
}

function modPayload(body, createdBy) {
  const title = cleanText(body.title, 180);
  const payload = {
    mod_game_id: cleanText(body.mod_game_id, 80),
    category_id: cleanText(body.category_id, 80) || null,
    title,
    slug: cleanText(body.slug, 220) || buildSlug(title),
    summary: cleanText(body.summary, 320),
    description: cleanHtml(body.description),
    author_name: cleanText(body.author_name, 180),
    version: cleanText(body.version, 80),
    supported_versions: cleanArray(body.supported_versions),
    install_instructions: cleanHtml(body.install_instructions),
    cover_image_url: cleanText(body.cover_image_url, 1000),
    screenshots: cleanArray(body.screenshots).map((url) => ({ url })),
    file_size_mb: toNumber(body.file_size_mb),
    is_featured: toBoolean(body.is_featured),
    is_published: toBoolean(body.is_published),
    updated_at: new Date().toISOString()
  };
  if (createdBy) payload.created_by = createdBy;
  return payload;
}

function modLinkPayload(body, modId) {
  return {
    mod_id: modId,
    label: cleanText(body.label, 180),
    url: cleanText(body.url, 1000),
    source_type: cleanText(body.source_type, 30) || 'external',
    file_size_mb: toNumber(body.file_size_mb),
    version: cleanText(body.version, 80),
    is_active: toBoolean(body.is_active),
    sort_order: toNumber(body.sort_order, 0)
  };
}

function handleMissingModsTable(error, fallback) {
  if (!error) return fallback;
  if (['42P01', '42703', 'PGRST200', 'PGRST205'].includes(error.code)) {
    console.warn('Mods tables are not ready yet:', error.message);
    return fallback;
  }
  throw error;
}

async function listModGames() {
  const { data, error } = await supabaseAdmin
    .from('mod_games')
    .select(`${MOD_GAME_SELECT}, mods(id, is_published, deleted_at)`)
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('title');
  if (error) return handleMissingModsTable(error, []);
  return (data || []).map((row) => ({
    ...normalizeModGame(row),
    mod_count: (row.mods || []).filter((mod) => mod.is_published && !mod.deleted_at).length
  }));
}

async function getModGameBySlug(slug) {
  const { data, error } = await supabaseAdmin
    .from('mod_games')
    .select(MOD_GAME_SELECT)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error) return null;
  return normalizeModGame(data);
}

async function listMods(options = {}) {
  const page = Math.max(Number(options.page) || 1, 1);
  const perPage = Math.min(Number(options.perPage) || 12, 48);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabaseAdmin
    .from('mods')
    .select(MOD_SELECT, { count: 'exact' })
    .eq('is_published', true)
    .is('deleted_at', null);

  if (options.mod_game_id) query = query.eq('mod_game_id', options.mod_game_id);
  if (options.category_id) query = query.eq('category_id', options.category_id);
  if (options.q) query = query.textSearch('search_vector', cleanText(options.q, 200), { type: 'websearch' });

  switch (options.sort) {
    case 'downloads':
      query = query.order('download_count', { ascending: false });
      break;
    case 'rating':
      query = query.order('download_count', { ascending: false });
      break;
    case 'az':
      query = query.order('title');
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);
  if (error) return handleMissingModsTable(error, { ...emptyModListing, page, perPage });
  let mods = (data || []).map(normalizeMod);
  if (options.sort === 'rating') mods = mods.sort((a, b) => b.rating_average - a.rating_average);
  return { mods, total: count || 0, page, perPage, totalPages: Math.max(Math.ceil((count || 0) / perPage), 1) };
}

async function getModBySlug(slug, { modGameId = null, countView = true } = {}) {
  let query = supabaseAdmin
    .from('mods')
    .select(MOD_SELECT)
    .eq('slug', slug)
    .eq('is_published', true)
    .is('deleted_at', null);

  if (modGameId) query = query.eq('mod_game_id', modGameId);

  const { data, error } = await query.single();
  if (error) return null;
  const mod = normalizeMod(data);
  if (countView) supabaseAdmin.rpc('increment_mod_view_count', { target_mod_id: mod.id }).then(() => {}).catch(console.error);
  return mod;
}

async function getModsForGame(gameId, limit = 4) {
  const { data: hubs, error } = await supabaseAdmin.from('mod_games').select('id, title, slug').eq('game_id', gameId).eq('is_published', true).limit(1);
  if (error) return handleMissingModsTable(error, { hub: null, mods: [] });
  const hub = hubs?.[0];
  if (!hub) return { hub: null, mods: [] };
  const result = await listMods({ mod_game_id: hub.id, perPage: limit, sort: 'downloads' });
  return { hub, mods: result.mods };
}

async function listCategories() {
  const { data, error } = await supabaseAdmin.from('mod_categories').select('*').order('sort_order').order('name');
  if (error) return handleMissingModsTable(error, []);
  return data || [];
}

async function listLinkedGameOptions() {
  const { data, error } = await supabaseAdmin
    .from('games')
    .select('id, title, slug')
    .order('title');
  if (error) throw error;
  return data || [];
}

async function listAdminModGames(options = {}) {
  const page = Math.max(Number(options.page) || 1, 1);
  const perPage = Math.min(Math.max(Number(options.perPage) || 20, 1), 200);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  let query = supabaseAdmin.from('mod_games').select(`${MOD_GAME_SELECT}, mods(id, deleted_at)`, { count: 'exact' }).order('created_at', { ascending: false });
  if (options.q) query = query.ilike('title', `%${options.q}%`);
  const { data, count, error } = await query.range(from, to);
  if (error) throw error;
  return {
    modGames: (data || []).map((row) => ({ ...normalizeModGame(row), mod_count: (row.mods || []).filter((mod) => !mod.deleted_at).length })),
    total: count || 0,
    page,
    perPage,
    totalPages: Math.max(Math.ceil((count || 0) / perPage), 1)
  };
}

async function listAdminMods(options = {}) {
  const page = Math.max(Number(options.page) || 1, 1);
  const perPage = Math.min(Math.max(Number(options.perPage) || 20, 1), 200);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  let query = supabaseAdmin.from('mods').select(MOD_SELECT, { count: 'exact' }).order('created_at', { ascending: false });
  if (options.q) query = query.ilike('title', `%${options.q}%`);
  if (options.mod_game_id) query = query.eq('mod_game_id', options.mod_game_id);
  const { data, count, error } = await query.range(from, to);
  if (error) throw error;
  return { mods: (data || []).map(normalizeMod), total: count || 0, page, perPage, totalPages: Math.max(Math.ceil((count || 0) / perPage), 1) };
}

async function getAdminModGame(id) {
  const { data, error } = await supabaseAdmin.from('mod_games').select(MOD_GAME_SELECT).eq('id', id).single();
  if (error) throw error;
  return normalizeModGame(data);
}

async function getAdminMod(id) {
  const { data, error } = await supabaseAdmin.from('mods').select(MOD_SELECT).eq('id', id).single();
  if (error) throw error;
  return normalizeMod(data);
}

async function createModGame(body, userId) {
  const { data, error } = await supabaseAdmin.from('mod_games').insert(modGamePayload(body, userId)).select().single();
  if (error) throw error;
  return data;
}

async function updateModGame(id, body) {
  const payload = modGamePayload(body);
  if (!payload.cover_image_url) delete payload.cover_image_url;
  if (!payload.banner_image_url) delete payload.banner_image_url;
  const { data, error } = await supabaseAdmin.from('mod_games').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function softDeleteModGame(id) {
  const { error } = await supabaseAdmin.from('mod_games').update({ is_published: false, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

async function setModGameCategories(modGameId, categoryIds = []) {
  await supabaseAdmin.from('mod_game_categories').delete().eq('mod_game_id', modGameId);
  const rows = categoryIds.filter(Boolean).map((categoryId, index) => ({ mod_game_id: modGameId, category_id: categoryId, sort_order: index }));
  if (!rows.length) return;
  const { error } = await supabaseAdmin.from('mod_game_categories').insert(rows);
  if (error) throw error;
}

async function listCommentsForMod(modId) {
  const { data, error } = await supabaseAdmin
    .from('mod_comments')
    .select('*, profiles(username, avatar_url)')
    .eq('mod_id', modId)
    .eq('is_approved', true)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) return handleMissingModsTable(error, []);

  const comments = (data || []).map(normalizeModComment);
  const byId = new Map(comments.map((comment) => [comment.id, comment]));
  const roots = [];
  comments.forEach((comment) => {
    if (comment.parent_id && byId.has(comment.parent_id)) {
      byId.get(comment.parent_id).replies.push(comment);
    } else {
      roots.push(comment);
    }
  });
  return roots;
}

async function getUserRating(userId, modId) {
  if (!userId) return 0;
  const { data, error } = await supabaseAdmin
    .from('mod_ratings')
    .select('score')
    .eq('mod_id', modId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) return 0;
  return data?.score || 0;
}

async function rateMod(userId, modId, score) {
  const payload = {
    user_id: userId,
    mod_id: modId,
    score: Math.max(1, Math.min(5, toNumber(score, 1)))
  };
  const { error } = await supabaseAdmin.from('mod_ratings').upsert(payload, { onConflict: 'user_id,mod_id' });
  if (error) throw error;
}

async function addModComment(userId, modId, body, parentId = null) {
  const payload = {
    user_id: userId,
    mod_id: modId,
    body: cleanText(body, 2000),
    parent_id: cleanText(parentId, 80) || null
  };
  const { data, error } = await supabaseAdmin.from('mod_comments').insert(payload).select().single();
  if (error) throw error;
  return data;
}

async function listModCommentsForAdmin() {
  const { data, error } = await supabaseAdmin
    .from('mod_comments')
    .select('*, mods(title, slug, mod_games(slug)), profiles(username, avatar_url)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function updateModComment(id, payload) {
  const { data, error } = await supabaseAdmin.from('mod_comments').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function deleteModComment(id) {
  const { error } = await supabaseAdmin.from('mod_comments').delete().eq('id', id);
  if (error) throw error;
}

async function createMod(body, userId) {
  const { data, error } = await supabaseAdmin.from('mods').insert(modPayload(body, userId)).select().single();
  if (error) throw error;
  return data;
}

async function updateMod(id, body) {
  const payload = modPayload(body);
  delete payload.created_by;
  if (!payload.cover_image_url) delete payload.cover_image_url;
  if (!payload.screenshots.length) delete payload.screenshots;
  if (payload.is_published) payload.deleted_at = null;
  const { data, error } = await supabaseAdmin.from('mods').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function softDeleteMod(id) {
  const { error } = await supabaseAdmin.from('mods').update({ is_published: false, deleted_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

async function addModDownloadLink(modId, body) {
  const { data, error } = await supabaseAdmin.from('mod_download_links').insert(modLinkPayload(body, modId)).select().single();
  if (error) throw error;
  return data;
}

async function updateModDownloadLink(linkId, body) {
  const payload = modLinkPayload(body, body.mod_id);
  delete payload.mod_id;
  const { data, error } = await supabaseAdmin.from('mod_download_links').update(payload).eq('id', linkId).select().single();
  if (error) throw error;
  return data;
}

async function deleteModDownloadLink(linkId) {
  const { error } = await supabaseAdmin.from('mod_download_links').delete().eq('id', linkId);
  if (error) throw error;
}

module.exports = {
  normalizeMod,
  normalizeModGame,
  listModGames,
  getModGameBySlug,
  listMods,
  getModBySlug,
  getModsForGame,
  listCategories,
  listLinkedGameOptions,
  listCommentsForMod,
  getUserRating,
  rateMod,
  addModComment,
  listModCommentsForAdmin,
  updateModComment,
  deleteModComment,
  listAdminModGames,
  listAdminMods,
  getAdminModGame,
  getAdminMod,
  createModGame,
  updateModGame,
  softDeleteModGame,
  setModGameCategories,
  createMod,
  updateMod,
  softDeleteMod,
  addModDownloadLink,
  updateModDownloadLink,
  deleteModDownloadLink
};
