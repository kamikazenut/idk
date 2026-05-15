insert into public.tags (name, slug, description, color_hex) values
  ('Action', 'action', 'Fast, reflex-driven games.', '#32d9ff'),
  ('Adventure', 'adventure', 'Exploration, story, and discovery.', '#2dd4bf'),
  ('Arcade', 'arcade', 'Score chasing and immediate play.', '#ff4fd8'),
  ('Browser', 'browser', 'Playable in modern web browsers.', '#ffd166'),
  ('DOS', 'dos', 'Classic DOS-compatible games.', '#8b5cf6'),
  ('Puzzle', 'puzzle', 'Logic, pattern, and problem-solving games.', '#22c55e'),
  ('RPG', 'rpg', 'Role-playing and character progression.', '#f97316'),
  ('Strategy', 'strategy', 'Tactical, strategic, and planning-heavy releases.', '#06b6d4')
on conflict (slug) do nothing;
