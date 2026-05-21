const supabaseAdmin = require('../lib/supabaseAdmin');
const { cleanText } = require('../lib/sanitize');

async function getProfile(userId) {
  const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', userId).single();
  if (error) return null;
  return data;
}

async function updateProfile(userId, body) {
  const payload = {
    username: cleanText(body.username, 80),
    avatar_url: cleanText(body.avatar_url, 1000),
    bio: cleanText(body.bio, 500),
    updated_at: new Date().toISOString()
  };
  const { data, error } = await supabaseAdmin.from('profiles').update(payload).eq('id', userId).select().single();
  if (error) throw error;
  return data;
}

async function getProfilePage(userId) {
  const [profile, wishlist, comments, ratings] = await Promise.all([
    supabaseAdmin.from('profiles').select('*').eq('id', userId).single(),
    supabaseAdmin.from('wishlists').select('created_at, games(*)').eq('user_id', userId).order('created_at', { ascending: false }),
    supabaseAdmin.from('comments').select('*, games(title, slug)').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('ratings').select('*, games(title, slug)').eq('user_id', userId).order('created_at', { ascending: false })
  ]);

  return {
    profile: profile.data,
    wishlist: wishlist.data || [],
    comments: comments.data || [],
    ratings: ratings.data || []
  };
}

async function toggleWishlist(userId, gameId) {
  const existing = await supabaseAdmin
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('game_id', gameId)
    .maybeSingle();

  if (existing.data?.id) {
    const { error } = await supabaseAdmin.from('wishlists').delete().eq('id', existing.data.id);
    if (error) throw error;
    return { active: false };
  }

  const { error } = await supabaseAdmin.from('wishlists').insert({ user_id: userId, game_id: gameId });
  if (error) throw error;
  return { active: true };
}

async function rateGame(userId, gameId, score) {
  const parsed = Math.max(1, Math.min(5, Number(score) || 1));
  const { data, error } = await supabaseAdmin
    .from('ratings')
    .upsert({ user_id: userId, game_id: gameId, score: parsed }, { onConflict: 'user_id,game_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function addComment(userId, gameId, body, parentId) {
  const payload = {
    user_id: userId,
    game_id: gameId,
    body: cleanText(body, 2000),
    parent_id: parentId || null,
    is_approved: false
  };
  const { data, error } = await supabaseAdmin.from('comments').insert(payload).select().single();
  if (error) throw error;
  return data;
}

async function listUsers({ q = '', page = 1, perPage: perPageOption } = {}) {
  const perPage = Math.min(Math.max(Number(perPageOption) || 20, 1), 200);
  const currentPage = Math.max(Number(page) || 1, 1);
  const from = (currentPage - 1) * perPage;
  const to = from + perPage - 1;
  let query = supabaseAdmin.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false });
  if (q) query = query.or(`username.ilike.%${q}%,bio.ilike.%${q}%`);
  const { data, count, error } = await query.range(from, to);
  if (error) throw error;
  return { users: data || [], total: count || 0, page: currentPage, perPage, totalPages: Math.max(Math.ceil((count || 0) / perPage), 1) };
}

async function getUserStats(userId) {
  const [downloads, comments, ratings] = await Promise.all([
    supabaseAdmin.from('download_log').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabaseAdmin.from('comments').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabaseAdmin.from('ratings').select('id', { count: 'exact', head: true }).eq('user_id', userId)
  ]);

  return {
    downloads: downloads.count || 0,
    comments: comments.count || 0,
    ratings: ratings.count || 0
  };
}

async function updateRole(userId, role) {
  const allowed = ['user', 'moderator', 'admin'];
  const nextRole = allowed.includes(role) ? role : 'user';
  const { data, error } = await supabaseAdmin.from('profiles').update({ role: nextRole }).eq('id', userId).select().single();
  if (error) throw error;
  return data;
}

async function setBanned(userId, banned) {
  const { data, error } = await supabaseAdmin.from('profiles').update({ banned: Boolean(banned) }).eq('id', userId).select().single();
  if (error) throw error;
  return data;
}

module.exports = {
  getProfile,
  updateProfile,
  getProfilePage,
  toggleWishlist,
  rateGame,
  addComment,
  listUsers,
  getUserStats,
  updateRole,
  setBanned
};
