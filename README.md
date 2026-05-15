# Public Domain Game Vault

A full-stack public domain game download platform built with Node.js, Express, EJS, Bootstrap 5, and Supabase for PostgreSQL, Auth, and Storage.

## Features

- Public game discovery pages with featured games, filters, search, ratings, wishlists, comments, and download logging.
- Supabase Auth-backed account system with profiles, roles, suspension checks, and OAuth hooks.
- Admin panel for games, download links, users, comments, analytics, and tags.
- Supabase migrations with tables, indexes, RLS policies, helper functions, and storage bucket policies.
- Security middleware: Helmet, rate limiting, CSRF protection, sanitization, session cookies, and hashed IP logging.
- SEO routes for dynamic metadata, `sitemap.xml`, and `robots.txt`.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your Supabase keys.

3. Apply the SQL files in `migrations/` to your Supabase project in order.

4. Run the app:

   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000`.

## Supabase Notes

- Use the anon key for public client operations and the service role key only on the server.
- Create your first admin by updating `profiles.role` to `admin` in Supabase after registering.
- Storage uploads target the `game-media` bucket by default.
