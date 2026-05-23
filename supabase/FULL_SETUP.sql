-- ============================================================
-- TASKFLOW — SETUP LENGKAP (Supabase SQL Editor → Run)
-- Gunakan ini jika database masih kosong ATAU mau reset total.
-- HATI-HATI: DROP akan menghapus semua data boards/tasks!
-- ============================================================

-- 1) Extensions
create extension if not exists "pgcrypto";

-- 2) Hapus objek lama (urutan penting karena foreign key)
drop trigger if exists on_board_created on public.boards;
drop function if exists public.create_default_columns() cascade;
drop function if exists public.set_board_user_id() cascade;
drop table if exists public.tasks cascade;
drop table if exists public.columns cascade;
drop table if exists public.boards cascade;

-- 3) Tabel BOARDS
create table public.boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  cover_color text default 'indigo',
  created_at timestamptz not null default now()
);

-- 4) Tabel COLUMNS
create table public.columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards (id) on delete cascade,
  title text not null,
  position integer not null default 0,
  color text default '#6366f1',
  created_at timestamptz not null default now()
);

-- 5) Tabel TASKS
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  column_id uuid not null references public.columns (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- 6) Index (performa)
create index boards_user_id_idx on public.boards (user_id);
create index columns_board_id_idx on public.columns (board_id);
create index tasks_column_id_idx on public.tasks (column_id);
create index tasks_user_id_idx on public.tasks (user_id);

-- 7) Auto isi user_id saat insert board (jika client lupa kirim)
create or replace function public.set_board_user_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  if new.user_id is null then
    raise exception 'Not authenticated';
  end if;
  if new.user_id is distinct from auth.uid() then
    raise exception 'user_id must match authenticated user';
  end if;
  return new;
end;
$$;

create trigger boards_set_user_id
  before insert on public.boards
  for each row
  execute function public.set_board_user_id();

-- 8) Trigger: 3 kolom default per board baru
create or replace function public.create_default_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.columns (board_id, title, position, color) values
    (new.id, 'To Do',       0, '#6366f1'),
    (new.id, 'In Progress', 1, '#f59e0b'),
    (new.id, 'Done',        2, '#10b981');
  return new;
end;
$$;

create trigger on_board_created
  after insert on public.boards
  for each row
  execute function public.create_default_columns();

-- 9) Row Level Security
alter table public.boards enable row level security;
alter table public.columns enable row level security;
alter table public.tasks enable row level security;

-- BOARDS policies
create policy "boards_select_own"
  on public.boards for select
  to authenticated
  using (auth.uid() = user_id);

create policy "boards_insert_own"
  on public.boards for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "boards_update_own"
  on public.boards for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "boards_delete_own"
  on public.boards for delete
  to authenticated
  using (auth.uid() = user_id);

-- COLUMNS policies (akses lewat kepemilikan board)
create policy "columns_select_own"
  on public.columns for select
  to authenticated
  using (
    exists (
      select 1 from public.boards b
      where b.id = columns.board_id and b.user_id = auth.uid()
    )
  );

create policy "columns_insert_own"
  on public.columns for insert
  to authenticated
  with check (
    exists (
      select 1 from public.boards b
      where b.id = columns.board_id and b.user_id = auth.uid()
    )
  );

create policy "columns_update_own"
  on public.columns for update
  to authenticated
  using (
    exists (
      select 1 from public.boards b
      where b.id = columns.board_id and b.user_id = auth.uid()
    )
  );

create policy "columns_delete_own"
  on public.columns for delete
  to authenticated
  using (
    exists (
      select 1 from public.boards b
      where b.id = columns.board_id and b.user_id = auth.uid()
    )
  );

-- TASKS policies
create policy "tasks_select_own"
  on public.tasks for select
  to authenticated
  using (auth.uid() = user_id);

create policy "tasks_insert_own"
  on public.tasks for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "tasks_update_own"
  on public.tasks for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "tasks_delete_own"
  on public.tasks for delete
  to authenticated
  using (auth.uid() = user_id);

-- 10) GRANT — ini yang sering hilang → "permission denied for table boards"
grant usage on schema public to postgres, anon, authenticated, service_role;

grant all on table public.boards to authenticated, service_role;
grant all on table public.columns to authenticated, service_role;
grant all on table public.tasks to authenticated, service_role;

grant all on all sequences in schema public to authenticated, service_role;

-- Trigger functions
grant execute on function public.set_board_user_id() to authenticated, service_role;
grant execute on function public.create_default_columns() to authenticated, service_role;

-- Selesai ✓
select 'Taskflow schema OK' as status;
