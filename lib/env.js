function normalizeHttpUrl(value, fallback) {
  const raw = String(value || fallback || '').trim();
  if (!raw) return raw;
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

module.exports = {
  normalizeHttpUrl
};
