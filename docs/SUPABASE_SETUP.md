# Panduan Setup Supabase — Taskflow (lengkap)

Ikuti langkah ini **berurutan**. Error `permission denied for table boards` hilang setelah bagian **SQL** dan **Auth** selesai.

---

## 1. Buat project Supabase

1. Buka [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** → isi nama (mis. `taskflow`), password database, region terdekat
3. Tunggu status project **Active** (±2 menit)

---

## 2. Ambil API keys untuk `.env.local`

1. Di sidebar: **Project Settings** (ikon gear) → **API**
2. Salin:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Di folder project `taskflow`, buat/edit file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Restart** dev server setelah mengubah env:

```bash
# Ctrl+C lalu:
npm run dev
```

---

## 3. Auth — supaya bisa login tanpa konfirmasi email

1. Sidebar: **Authentication** → **Providers**
2. Klik **Email**
3. Untuk development:
   - **Enable Email provider** = ON
   - **Confirm email** = **OFF** (matikan)
4. **Save**

### (Opsional) Site URL untuk production

1. **Authentication** → **URL Configuration**
2. **Site URL**: `http://localhost:3000` (dev) atau URL Vercel kamu
3. **Redirect URLs** — tambahkan:
   - `http://localhost:3000/**`
   - `https://nama-app.vercel.app/**`

---

## 4. Database — jalankan SQL

1. Sidebar: **SQL Editor**
2. **New query**
3. Pilih salah satu:

### Opsi A — Database sudah ada tabel tapi error permission (disarankan dulu)

Copy seluruh isi file:

`supabase/FIX_PERMISSIONS.sql`

→ Paste → **Run** (tombol hijau)

Harus muncul hasil: `Permissions fixed`

### Opsi B — Database kosong / mau setup dari nol

Copy seluruh isi file:

`supabase/FULL_SETUP.sql`

→ Paste → **Run**

> **Peringatan:** Opsi B **menghapus** semua data boards/tasks yang sudah ada.

---

## 5. Verifikasi di Table Editor

1. Sidebar: **Table Editor**
2. Harus ada 3 tabel:
   - `boards` — kolom: `id`, `user_id`, `title`, `description`, `cover_color`, `created_at`
   - `columns` — kolom: `id`, `board_id`, `title`, `position`, `color`, `created_at`
   - `tasks` — kolom: `id`, `column_id`, `user_id`, `title`, ...

3. Klik tabel `boards` → tab **RLS** harus **Enabled**
4. Tab **Policies** — minimal 4 policy untuk `boards` (select, insert, update, delete)

---

## 6. Cek trigger kolom default

1. **Database** → **Triggers** (atau SQL):

```sql
select tgname from pg_trigger where tgname in ('on_board_created', 'boards_set_user_id');
```

Harus ada trigger `on_board_created` (membuat To Do / In Progress / Done).

---

## 7. Test di aplikasi

1. `npm run dev` → buka `http://localhost:3000`
2. **Register** akun baru (email + password min. 6 karakter)
3. Masuk **Dashboard** → **New board** → isi title → **Create board**
4. Harus sukses (toast hijau) dan board muncul di grid
5. Klik board → 3 kolom + bisa **Add task**

---

## Troubleshooting

| Gejala | Solusi |
|--------|--------|
| `permission denied for table boards` | Jalankan lagi `FIX_PERMISSIONS.sql` |
| `new row violates row-level security` | Pastikan login; app mengirim `user_id` (update kode terbaru) |
| `column "cover_color" does not exist` | Jalankan `FIX_PERMISSIONS.sql` (menambah kolom) |
| Login gagal / redirect loop | Cek `.env.local`, restart dev server, matikan Confirm email |
| Board kosong tanpa kolom | Trigger `on_board_created` belum ada → jalankan `FULL_SETUP.sql` |
| Tidak bisa register | Password min. 6 karakter; cek **Authentication** → **Users** |

---

## 8. Deploy Vercel (nanti)

1. Push repo ke GitHub
2. Import di Vercel → set env yang sama (`NEXT_PUBLIC_SUPABASE_*`)
3. Di Supabase **URL Configuration**, tambahkan domain Vercel ke Redirect URLs

---

## File SQL di repo

| File | Kapan dipakai |
|------|----------------|
| `supabase/FIX_PERMISSIONS.sql` | Perbaiki permission tanpa hapus data |
| `supabase/FULL_SETUP.sql` | Setup ulang total |
| `supabase/migrations/001_board_cover_color.sql` | Hanya tambah kolom cover |
