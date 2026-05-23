-- ============================================================
-- TASKFLOW — PERBAIKAN CEPAT (tanpa hapus data)
-- Jalankan jika error: "permission denied for table boards"
-- ============================================================

-- Tambah kolom cover jika belum ada
alter table public.boards
  add column if not exists cover_color text default 'indigo';

-- Pastikan RLS aktif
alter table public.boards enable row level security;
alter table public.columns enable row level security;
alter table public.tasks enable row level security;

-- Hapus policy lama (nama bisa beda di project kamu)
drop policy if exists "Users can only see their own boards" on public.boards;
drop policy if exists "Users can create their own boards" on public.boards;
drop policy if exists "Users can update their own boards" on public.boards;
drop policy if exists "Users can delete their own boards" on public.boards;
drop policy if exists "boards_select_own" on public.boards;
drop policy if exists "boards_insert_own" on public.boards;
drop policy if exists "boards_update_own" on public.boards;
drop policy if exists "boards_delete_own" on public.boards;

drop policy if exists "Users can see columns of their boards" on public.columns;
drop policy if exists "Users can manage columns of their boards" on public.columns;
drop policy if exists "columns_select_own" on public.columns;
drop policy if exists "columns_insert_own" on public.columns;
drop policy if exists "columns_update_own" on public.columns;
drop policy if exists "columns_delete_own" on public.columns;

drop policy if exists "Users can see their own tasks" on public.tasks;
drop policy if exists "Users can manage their own tasks" on public.tasks;
drop policy if exists "tasks_select_own" on public.tasks;
drop policy if exists "tasks_insert_own" on public.tasks;
drop policy if exists "tasks_update_own" on public.tasks;
drop policy if exists "tasks_delete_own" on public.tasks;

-- Policy baru (eksplisit role authenticated)
create policy "boards_select_own" on public.boards for select to authenticated using (auth.uid() = user_id);
create policy "boards_insert_own" on public.boards for insert to authenticated with check (auth.uid() = user_id);
create policy "boards_update_own" on public.boards for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "boards_delete_own" on public.boards for delete to authenticated using (auth.uid() = user_id);

create policy "columns_select_own" on public.columns for select to authenticated
  using (exists (select 1 from public.boards b where b.id = columns.board_id and b.user_id = auth.uid()));
create policy "columns_insert_own" on public.columns for insert to authenticated
  with check (exists (select 1 from public.boards b where b.id = columns.board_id and b.user_id = auth.uid()));
create policy "columns_update_own" on public.columns for update to authenticated
  using (exists (select 1 from public.boards b where b.id = columns.board_id and b.user_id = auth.uid()));
create policy "columns_delete_own" on public.columns for delete to authenticated
  using (exists (select 1 from public.boards b where b.id = columns.board_id and b.user_id = auth.uid()));

create policy "tasks_select_own" on public.tasks for select to authenticated using (auth.uid() = user_id);
create policy "tasks_insert_own" on public.tasks for insert to authenticated with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.tasks for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks_delete_own" on public.tasks for delete to authenticated using (auth.uid() = user_id);

-- GRANT (penyebab utama "permission denied")
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on table public.boards to authenticated, service_role;
grant all on table public.columns to authenticated, service_role;
grant all on table public.tasks to authenticated, service_role;
grant all on all sequences in schema public to authenticated, service_role;

-- Trigger auto user_id + kolom default
create or replace function public.set_board_user_id()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.user_id is null then new.user_id := auth.uid(); end if;
  return new;
end;
$$;

drop trigger if exists boards_set_user_id on public.boards;
create trigger boards_set_user_id
  before insert on public.boards
  for each row execute function public.set_board_user_id();

create or replace function public.create_default_columns()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.columns (board_id, title, position, color) values
    (new.id, 'To Do', 0, '#6366f1'),
    (new.id, 'In Progress', 1, '#f59e0b'),
    (new.id, 'Done', 2, '#10b981');
  return new;
end;
$$;

drop trigger if exists on_board_created on public.boards;
create trigger on_board_created
  after insert on public.boards
  for each row execute function public.create_default_columns();

grant execute on function public.set_board_user_id() to authenticated, service_role;
grant execute on function public.create_default_columns() to authenticated, service_role;

select 'Permissions fixed' as status;
