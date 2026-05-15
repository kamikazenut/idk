const { createUserClient } = require('../lib/supabase');
const { supabase } = require('../lib/supabase');
const supabaseAdmin = require('../lib/supabaseAdmin');

async function getUserFromSession(req) {
  let accessToken = req.session?.accessToken;
  const refreshToken = req.session?.refreshToken;
  if (!accessToken) return { user: null, userClient: null };

  let userClient = createUserClient(accessToken);
  let { data, error } = await userClient.auth.getUser(accessToken);

  if ((error || !data?.user) && refreshToken) {
    const refreshed = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (!refreshed.error && refreshed.data?.session) {
      accessToken = refreshed.data.session.access_token;
      req.session.accessToken = accessToken;
      req.session.refreshToken = refreshed.data.session.refresh_token || refreshToken;
      userClient = createUserClient(accessToken);
      ({ data, error } = await userClient.auth.getUser(accessToken));
    }
  }

  if (error || !data?.user) return { user: null, userClient: null };
  return { user: data.user, userClient };
}

async function attachUser(req, res, next) {
  res.locals.user = null;
  res.locals.profile = null;
  res.locals.isAdmin = false;
  res.locals.isModerator = false;

  if (!req.session?.accessToken) return next();

  try {
    const { user, userClient } = await getUserFromSession(req);
    if (!user) {
      req.session.destroy(() => {});
      return next();
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile?.banned) {
      req.session.destroy(() => {});
      req.flash?.('error', 'This account has been suspended.');
      return next();
    }

    req.user = user;
    req.profile = profile;
    req.supabase = userClient;

    res.locals.user = user;
    res.locals.profile = profile;
    res.locals.isAdmin = profile?.role === 'admin';
    res.locals.isModerator = profile?.role === 'moderator' || profile?.role === 'admin';
  } catch (error) {
    console.error('attachUser failed:', error);
  }

  return next();
}

function requireLogin(req, res, next) {
  if (req.user) return next();
  req.flash('error', 'Please sign in to continue.');
  return res.redirect(`/auth/login?next=${encodeURIComponent(req.originalUrl)}`);
}

function requireModerator(req, res, next) {
  if (req.profile?.role === 'moderator' || req.profile?.role === 'admin') return next();
  req.flash('error', 'Moderator access required.');
  return res.redirect('/');
}

function requireAdmin(req, res, next) {
  if (req.profile?.role === 'admin') return next();
  req.flash('error', 'Admin access required.');
  return res.redirect('/');
}

function redirectIfAuthenticated(req, res, next) {
  if (!req.user) return next();
  return res.redirect('/profile');
}

module.exports = {
  attachUser,
  requireLogin,
  requireModerator,
  requireAdmin,
  redirectIfAuthenticated
};
