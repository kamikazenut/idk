const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const htmlConfig = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'a', 'code', 'pre'],
  ALLOWED_ATTR: ['href', 'target', 'rel']
};

function cleanHtml(value) {
  if (!value) return '';
  return DOMPurify.sanitize(String(value), htmlConfig).replace(/<a /g, '<a rel="nofollow noopener" target="_blank" ');
}

function cleanText(value, maxLength = 1000) {
  if (value === undefined || value === null) return '';
  const stripped = DOMPurify.sanitize(String(value), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
  return stripped.slice(0, maxLength);
}

function cleanArray(value) {
  if (!value) return [];
  const items = Array.isArray(value) ? value : String(value).split(',');
  return items.map((item) => cleanText(item, 80)).filter(Boolean);
}

function toBoolean(value) {
  return value === true || value === 'true' || value === 'on' || value === '1';
}

function toNumber(value, fallback = null) {
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

module.exports = {
  cleanHtml,
  cleanText,
  cleanArray,
  toBoolean,
  toNumber
};
