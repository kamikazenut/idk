const { createClient } = require('@supabase/supabase-js');
const { normalizeHttpUrl } = require('./env');

const supabaseUrl = normalizeHttpUrl(process.env.SUPABASE_URL, 'https://example.supabase.co');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Admin operations require the service role key.');
}

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey || 'service-role-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

module.exports = supabaseAdmin;
