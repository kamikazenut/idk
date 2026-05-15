insert into public.tags (name, slug, description, color_hex) values
  ('Action', 'action', 'Fast, reflex-driven games.', '#e11d48'),
  ('Adventure', 'adventure', 'Exploration, story, and discovery.', '#71717a'),
  ('Arcade', 'arcade', 'Score chasing and immediate play.', '#a1a1aa'),
  ('Browser', 'browser', 'Playable in modern web browsers.', '#10b981'),
  ('DOS', 'dos', 'Classic DOS-compatible games.', '#71717a'),
  ('Puzzle', 'puzzle', 'Logic, pattern, and problem-solving games.', '#22c55e'),
  ('RPG', 'rpg', 'Role-playing and character progression.', '#f97316'),
  ('Strategy', 'strategy', 'Tactical, strategic, and planning-heavy releases.', '#06b6d4')
on conflict (slug) do nothing;
