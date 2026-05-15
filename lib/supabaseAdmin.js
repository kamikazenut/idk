const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Admin operations require the service role key.');
}

const supabaseAdmin = createClient(
  supabaseUrl || 'https://example.supabase.co',
  serviceRoleKey || 'service-role-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

module.exports = supabaseAdmin;
