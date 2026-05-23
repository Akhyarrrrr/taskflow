-- ============================================================
-- TASKFLOW — Supabase Schema
-- Paste ini di Supabase > SQL Editor > Run
-- ============================================================

-- Enable RLS
create extension if not exists "uuid-ossp";

-- BOARDS
create table public.boards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  cover_color text default 'indigo',
  created_at timestamptz default now() not null
);

alter table public.boards enable row level security;

create policy "Users can only see their own boards"
  on public.boards for select using (auth.uid() = user_id);

create policy "Users can create their own boards"
  on public.boards for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update their own boards"
  on public.boards for update using (auth.uid() = user_id);

create policy "Users can delete their own boards"
  on public.boards for delete using (auth.uid() = user_id);

-- COLUMNS
create table public.columns (
  id uuid default gen_random_uuid() primary key,
  board_id uuid references public.boards on delete cascade not null,
  title text not null,
  position integer not null default 0,
  color text default '#6366f1',
  created_at timestamptz default now() not null
);

alter table public.columns enable row level security;

create policy "Users can see columns of their boards"
  on public.columns for select
  using (exists (
    select 1 from public.boards
    where boards.id = columns.board_id and boards.user_id = auth.uid()
  ));

create policy "Users can manage columns of their boards"
  on public.columns for all
  using (exists (
    select 1 from public.boards
    where boards.id = columns.board_id and boards.user_id = auth.uid()
  ));

-- TASKS
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  column_id uuid references public.columns on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  position integer not null default 0,
  created_at timestamptz default now() not null
);

alter table public.tasks enable row level security;

create policy "Users can see their own tasks"
  on public.tasks for select using (auth.uid() = user_id);

create policy "Users can manage their own tasks"
  on public.tasks for all using (auth.uid() = user_id);

-- ============================================================
-- DEFAULT COLUMNS untuk setiap board baru (via function)
-- ============================================================
create or replace function public.create_default_columns()
returns trigger as $$
begin
  insert into public.columns (board_id, title, position, color) values
    (new.id, 'To Do',       0, '#6366f1'),
    (new.id, 'In Progress', 1, '#f59e0b'),
    (new.id, 'Done',        2, '#10b981');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_board_created
  after insert on public.boards
  for each row execute function public.create_default_columns();

-- GRANT (wajib — tanpa ini: "permission denied for table boards")
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on table public.boards to authenticated, service_role;
grant all on table public.columns to authenticated, service_role;
grant all on table public.tasks to authenticated, service_role;
grant all on all sequences in schema public to authenticated, service_role;
grant execute on function public.create_default_columns() to authenticated, service_role;
