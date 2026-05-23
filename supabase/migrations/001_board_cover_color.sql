-- Run in Supabase SQL Editor if your boards table was created without cover_color
alter table public.boards
  add column if not exists cover_color text default 'indigo';
