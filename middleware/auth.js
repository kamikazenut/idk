const { createUserClient } = require('../lib/supabase');
const supabaseAdmin = require('../lib/supabaseAdmin');

async function attachUser(req, res, next) {
  res.locals.user = null;
  res.locals.profile = null;
  res.locals.isAdmin = false;
  res.locals.isModerator = false;

  const accessToken = req.session?.accessToken;
  if (!accessToken) return next();

  try {
    const userClient = createUserClient(accessToken);
    const { data: authData, error: authError } = await userClient.auth.getUser(accessToken);
    if (authError || !authData?.user) {
      req.session.destroy(() => {});
      return next();
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profile?.banned) {
      req.session.destroy(() => {});
      req.flash?.('error', 'This account has been suspended.');
      return next();
    }

    req.user = authData.user;
    req.profile = profile;
    req.supabase = userClient;

    res.locals.user = authData.user;
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
