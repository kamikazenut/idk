const express = require('express');
const { supabase } = require('../lib/supabase');
const supabaseAdmin = require('../lib/supabaseAdmin');
const { authLimiter } = require('../middleware/rateLimit');
const { redirectIfAuthenticated } = require('../middleware/auth');
const { cleanText } = require('../lib/sanitize');

const router = express.Router();

router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('pages/login', {
    title: 'Log In',
    metaDescription: 'Log in to rate, wishlist, comment, and download games.',
    next: req.query.next || '/'
  });
});

router.get('/register', redirectIfAuthenticated, (req, res) => {
  res.render('pages/register', {
    title: 'Create Account',
    metaDescription: 'Create a free piracy.cloud account.'
  });
});

router.post('/login', authLimiter, redirectIfAuthenticated, async (req, res, next) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanText(req.body.email, 255),
      password: req.body.password
    });
    if (error) {
      req.flash('error', error.message);
      return res.redirect('/auth/login');
    }

    req.session.accessToken = data.session.access_token;
    req.session.refreshToken = data.session.refresh_token;
    req.flash('success', 'Welcome back.');
    return res.redirect(req.body.next || '/profile');
  } catch (error) {
    return next(error);
  }
});

router.post('/register', authLimiter, redirectIfAuthenticated, async (req, res, next) => {
  try {
    const email = cleanText(req.body.email, 255);
    const username = cleanText(req.body.username, 80);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: req.body.password,
      options: {
        data: { username }
      }
    });

    if (error) {
      req.flash('error', error.message);
      return res.redirect('/auth/register');
    }

    if (data.session) {
      req.session.accessToken = data.session.access_token;
      req.session.refreshToken = data.session.refresh_token;
    }

    if (data.user) {
      await supabaseAdmin.from('profiles').upsert({
        id: data.user.id,
        username,
        role: 'user'
      });
    }

    req.flash('success', data.session ? 'Account created.' : 'Account created. Please check your email to confirm it.');
    return res.redirect(data.session ? '/profile' : '/auth/login');
  } catch (error) {
    return next(error);
  }
});

router.get('/oauth/:provider', authLimiter, async (req, res, next) => {
  try {
    const provider = req.params.provider;
    const allowed = ['github', 'google'];
    if (!allowed.includes(provider)) {
      req.flash('error', 'Unsupported OAuth provider.');
      return res.redirect('/auth/login');
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${res.locals.baseUrl}/auth/callback`
      }
    });
    if (error) throw error;
    return res.redirect(data.url);
  } catch (error) {
    return next(error);
  }
});

router.get('/callback', authLimiter, async (req, res, next) => {
  try {
    if (!req.query.code) {
      req.flash('error', 'Missing OAuth callback code.');
      return res.redirect('/auth/login');
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(req.query.code);
    if (error) throw error;
    req.session.accessToken = data.session.access_token;
    req.session.refreshToken = data.session.refresh_token;
    req.flash('success', 'Signed in.');
    return res.redirect('/profile');
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
