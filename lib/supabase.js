const { createClient } = require('@supabase/supabase-js');
const { normalizeHttpUrl } = require('./env');

const supabaseUrl = normalizeHttpUrl(process.env.SUPABASE_URL, 'https://example.supabase.co');
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing SUPABASE_URL or SUPABASE_ANON_KEY. Add them to .env before using database-backed features.');
}

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || 'anon-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

function createUserClient(accessToken) {
  return createClient(
    supabaseUrl,
    supabaseAnonKey || 'anon-key',
    {
      global: {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );
}

module.exports = {
  supabase,
  createUserClient
};
