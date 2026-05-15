const crypto = require('crypto');
const supabaseAdmin = require('../lib/supabaseAdmin');
const { cleanText } = require('../lib/sanitize');

function hashIp(ip = '') {
  const salt = process.env.SESSION_SECRET || 'dev-session-secret-change-me';
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

async function logEvent({ eventType, entityId = null, userId = null, metadata = {} }) {
  const { error } = await supabaseAdmin.from('analytics_events').insert({
    event_type: eventType,
    entity_id: entityId,
    user_id: userId,
    metadata
  });
  if (error) console.error('analytics_events insert failed:', error);
}

async function logDownload({ gameId, linkId, userId, ip, userAgent }) {
  const payload = {
    game_id: gameId,
    link_id: linkId,
    user_id: userId || null,
    ip_hash: hashIp(ip),
    user_agent: cleanText(userAgent, 500)
  };

  const [downloadLog, eventLog] = await Promise.all([
    supabaseAdmin.from('download_log').insert(payload),
    logEvent({ eventType: 'download', entityId: gameId, userId, metadata: { link_id: linkId } })
  ]);

  if (downloadLog.error) throw downloadLog.error;
  await supabaseAdmin.rpc('increment_download_counts', { target_game_id: gameId, target_link_id: linkId });
  return eventLog;
}

async function logModDownload({ modId, linkId, userId, ip, userAgent }) {
  const payload = {
    mod_id: modId,
    link_id: linkId,
    user_id: userId || null,
    ip_hash: hashIp(ip),
    user_agent: cleanText(userAgent, 500)
  };

  const [downloadLog, eventLog] = await Promise.all([
    supabaseAdmin.from('mod_download_log').insert(payload),
    logEvent({ eventType: 'download', entityId: modId, userId, metadata: { type: 'mod', link_id: linkId } })
  ]);

  if (downloadLog.error) throw downloadLog.error;
  await supabaseAdmin.rpc('increment_mod_download_counts', { target_mod_id: modId, target_link_id: linkId });
  return eventLog;
}

async function logSearch({ query, userId, filters = {} }) {
  await logEvent({
    eventType: 'search',
    userId,
    metadata: {
      query: cleanText(query, 200),
      filters
    }
  });
}

async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [
    games,
    allDownloads,
    todayDownloads,
    weekDownloads,
    users,
    pendingComments,
    recentDownloads,
    recentComments
  ] = await Promise.all([
    supabaseAdmin.from('games').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('download_log').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('download_log').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    supabaseAdmin.from('download_log').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo.toISOString()),
    supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('comments').select('id', { count: 'exact', head: true }).eq('is_approved', false),
    supabaseAdmin.from('download_log').select('created_at, games(title, slug), profiles(username)').order('created_at', { ascending: false }).limit(8),
    supabaseAdmin.from('comments').select('created_at, body, games(title, slug), profiles(username)').order('created_at', { ascending: false }).limit(8)
  ]);

  return {
    totals: {
      games: games.count || 0,
      downloads: allDownloads.count || 0,
      downloadsToday: todayDownloads.count || 0,
      downloadsWeek: weekDownloads.count || 0,
      users: users.count || 0,
      pendingComments: pendingComments.count || 0
    },
    activity: [
      ...(recentDownloads.data || []).map((item) => ({ type: 'download', ...item })),
      ...(recentComments.data || []).map((item) => ({ type: 'comment', ...item }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10)
  };
}

async function getTrend({ eventType = 'download', days = 30 } = {}) {
  const since = new Date();
  since.setDate(since.getDate() - Number(days));
  const { data, error } = await supabaseAdmin
    .from('analytics_events')
    .select('created_at')
    .eq('event_type', eventType)
    .gte('created_at', since.toISOString());
  if (error) throw error;

  const buckets = new Map();
  for (let i = 0; i <= days; i += 1) {
    const date = new Date(since);
    date.setDate(since.getDate() + i);
    buckets.set(date.toISOString().slice(0, 10), 0);
  }
  (data || []).forEach((item) => {
    const key = item.created_at.slice(0, 10);
    buckets.set(key, (buckets.get(key) || 0) + 1);
  });

  return {
    labels: [...buckets.keys()],
    values: [...buckets.values()]
  };
}

async function getAdminAnalytics() {
  const [trend, topGames, searches, registrations] = await Promise.all([
    getTrend({ eventType: 'download', days: 30 }),
    supabaseAdmin.from('games').select('title, slug, download_count').order('download_count', { ascending: false }).limit(10),
    supabaseAdmin.from('analytics_events').select('metadata').eq('event_type', 'search').limit(500),
    supabaseAdmin.from('profiles').select('created_at').order('created_at', { ascending: false }).limit(500)
  ]);

  const terms = new Map();
  (searches.data || []).forEach((item) => {
    const query = item.metadata?.query;
    if (query) terms.set(query, (terms.get(query) || 0) + 1);
  });

  const registrationBuckets = new Map();
  (registrations.data || []).forEach((item) => {
    const key = item.created_at.slice(0, 10);
    registrationBuckets.set(key, (registrationBuckets.get(key) || 0) + 1);
  });

  return {
    trend,
    topGames: topGames.data || [],
    topSearchTerms: [...terms.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([term, count]) => ({ term, count })),
    registrations: {
      labels: [...registrationBuckets.keys()].reverse(),
      values: [...registrationBuckets.values()].reverse()
    }
  };
}

async function listPendingComments() {
  const { data, error } = await supabaseAdmin
    .from('comments')
    .select('*, games(title, slug), profiles(username, avatar_url)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function updateComment(id, payload) {
  const { data, error } = await supabaseAdmin.from('comments').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

async function deleteComment(id) {
  const { error } = await supabaseAdmin.from('comments').delete().eq('id', id);
  if (error) throw error;
}

module.exports = {
  hashIp,
  logEvent,
  logDownload,
  logModDownload,
  logSearch,
  getDashboardStats,
  getTrend,
  getAdminAnalytics,
  listPendingComments,
  updateComment,
  deleteComment
};
