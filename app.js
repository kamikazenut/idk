require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const packageJson = require('./package.json');

const { attachUser } = require('./middleware/auth');
const { csrfProtection, exposeCsrf } = require('./middleware/csrf');
const { generalLimiter } = require('./middleware/rateLimit');

const indexRoutes = require('./routes/index');
const gameRoutes = require('./routes/games');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const searchRoutes = require('./routes/search');
const downloadRoutes = require('./routes/downloads');
const modRoutes = require('./routes/mods');
const modDownloadRoutes = require('./routes/modDownloads');
const mediaRoutes = require('./routes/media');
const mediaDownloadRoutes = require('./routes/mediaDownloads');
const adminDashboardRoutes = require('./routes/admin/dashboard');
const adminGameRoutes = require('./routes/admin/games');
const adminModRoutes = require('./routes/admin/mods');
const adminMediaRoutes = require('./routes/admin/media');
const adminUserRoutes = require('./routes/admin/users');
const adminCommentRoutes = require('./routes/admin/comments');
const adminAnalyticsRoutes = require('./routes/admin/analytics');
const adminTagRoutes = require('./routes/admin/tags');

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
const trustProxy = process.env.TRUST_PROXY === 'false' ? false : Number(process.env.TRUST_PROXY || 1);
const sessionMaxAgeDays = Number(process.env.SESSION_MAX_AGE_DAYS || 30);
const assetVersion = process.env.ASSET_VERSION || process.env.SOURCE_COMMIT || process.env.COOLIFY_GIT_COMMIT_SHA || packageJson.version;
const staticMaxAge = process.env.STATIC_MAX_AGE || (process.env.NODE_ENV === 'production' ? '1h' : 0);

app.set('trust proxy', trustProxy);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

app.use((req, res, next) => {
  if (!/%3f/i.test(req.url)) return next();

  try {
    const decodedUrl = decodeURIComponent(req.url);
    const isLocalPath = decodedUrl.startsWith('/') && !/^\/https?:/i.test(decodedUrl);
    if (isLocalPath && decodedUrl.includes('?')) {
      return res.redirect(301, decodedUrl);
    }
  } catch (error) {
    return next();
  }

  return next();
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net', 'code.jquery.com', 'cdn.datatables.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net', 'cdn.datatables.net', 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:', 'https:', 'image.tmdb.org'],
      connectSrc: ["'self'", process.env.SUPABASE_URL || 'https://*.supabase.co'],
      frameSrc: ["'self'", process.env.SUPABASE_URL || 'https://*.supabase.co']
    }
  }
}));
app.use(compression());
app.use(generalLimiter);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(express.json({ limit: '2mb' }));
app.use(methodOverride((req) => req.body?._method || req.query?._method));
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  maxAge: staticMaxAge,
  setHeaders: (res, filePath) => {
    if (/\.(css|js)$/i.test(filePath)) {
      res.setHeader('Cache-Control', `public, max-age=${process.env.STATIC_ASSET_MAX_AGE_SECONDS || 3600}, must-revalidate`);
    }
  }
}));

app.use(session({
  name: 'piracycloud.sid',
  secret: process.env.SESSION_SECRET || 'dev-session-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    maxAge: 1000 * 60 * 60 * 24 * sessionMaxAgeDays
  }
}));

app.use(flash());
app.use(attachUser);
app.use(csrfProtection);
app.use(exposeCsrf);

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  res.locals.assetVersion = assetVersion;
  res.setHeader('Cache-Control', 'no-store');
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', indexRoutes);
app.use('/games', gameRoutes);
app.use('/auth', authRoutes);
app.use('/search', searchRoutes);
app.use('/downloads', downloadRoutes);
app.use('/mods', modRoutes);
app.use('/mod-downloads', modDownloadRoutes);
app.use('/media', mediaRoutes);
app.use('/media-downloads', mediaDownloadRoutes);
app.use('/admin', adminDashboardRoutes);
app.use('/admin/games', adminGameRoutes);
app.use('/admin/mods', adminModRoutes);
app.use('/admin/media', adminMediaRoutes);
app.use('/admin/users', adminUserRoutes);
app.use('/admin/comments', adminCommentRoutes);
app.use('/admin/analytics', adminAnalyticsRoutes);
app.use('/admin/tags', adminTagRoutes);
app.use('/', userRoutes);

app.use((req, res) => {
  res.status(404).render('pages/error', {
    title: 'Page Not Found',
    statusCode: 404,
    message: 'That page is not in the archive yet.'
  });
});

app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    req.flash('error', 'Security token expired. Please try again.');
    return res.redirect(req.get('referer') || '/');
  }

  console.error(err);
  return res.status(err.status || 500).render('pages/error', {
    title: 'Something Went Wrong',
    statusCode: err.status || 500,
    message: process.env.NODE_ENV === 'production' ? 'The server hit a snag.' : err.message
  });
});

if (require.main === module) {
  app.listen(port, host, () => {
    console.log(`piracy.cloud running on http://${host}:${port}`);
  });
}

module.exports = app;
