const crypto = require('crypto');

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function ensureToken(req) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  return req.session.csrfToken;
}

function getSubmittedToken(req) {
  return req.body?._csrf || req.headers['x-csrf-token'] || req.query?._csrf || '';
}

function sameToken(expected, submitted) {
  const expectedBuffer = Buffer.from(expected);
  const submittedBuffer = Buffer.from(String(submitted));
  return expectedBuffer.length === submittedBuffer.length && crypto.timingSafeEqual(expectedBuffer, submittedBuffer);
}

function csrfProtection(req, res, next) {
  const expected = ensureToken(req);
  if (SAFE_METHODS.has(req.method)) return next();

  if (!sameToken(expected, getSubmittedToken(req))) {
    const error = new Error('Invalid CSRF token');
    error.code = 'EBADCSRFTOKEN';
    error.status = 403;
    return next(error);
  }

  return next();
}

function exposeCsrf(req, res, next) {
  res.locals.csrfToken = ensureToken(req);
  next();
}

module.exports = {
  csrfProtection,
  exposeCsrf
};
