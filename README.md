# Taskflow

Kanban board modern untuk mengelola pekerjaan — dibangun dengan **Next.js 16**, **Supabase**, **Tailwind CSS**, dan **Framer Motion**.

![Taskflow](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=flat-square&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)

## Fitur

- Autentikasi (login / register) dengan Supabase Auth
- Dashboard multi-board dengan cover gradient
- Board Kanban: To Do · In Progress · Done
- Drag & drop antar kolom + reorder dalam kolom
- Task: prioritas, deadline, deskripsi, edit modal
- Pencarian task, statistik board, toast informatif
- UI responsif (mobile → desktop) dengan animasi halus

## Tech stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Database & Auth | Supabase (PostgreSQL + RLS) |
| Styling | Tailwind CSS 4 |
| DnD | @dnd-kit |
| Animasi | Framer Motion |
| Notifikasi | Sonner |

## Mulai cepat

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari [Supabase Dashboard](https://supabase.com/dashboard) → **Settings** → **API**.

### 3. Database Supabase

Jalankan SQL di **SQL Editor**:

- Sudah punya tabel? → `supabase/FIX_PERMISSIONS.sql`
- Setup baru? → `supabase/FULL_SETUP.sql`

Panduan lengkap: [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)

**Auth:** matikan **Confirm email** di Authentication → Providers → Email (untuk development).

### 4. Dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

