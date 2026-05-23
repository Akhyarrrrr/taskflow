# TASKFLOW — Setup Guide
Ikuti langkah ini URUT, jangan skip.

---

## STEP 1 — Buat project Next.js

Buka terminal di folder project kamu (misal: D:\PROJECT), lalu jalankan:

```bash
npx create-next-app@latest taskflow --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd taskflow
```

Kalau ada pertanyaan saat install, jawab semua default (tekan Enter).

---

## STEP 2 — Install dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install lucide-react
```

---

## STEP 3 — Setup Supabase

1. Buka https://supabase.com → Login / Register (gratis)
2. Klik "New Project"
   - Name: `taskflow`
   - Password: buat password database (simpan!)
   - Region: pilih Singapore (terdekat dari Indonesia)
3. Tunggu project selesai dibuat (~1-2 menit)
4. Buka: Project Settings → API
5. Copy dua nilai ini:
   - `Project URL` → ini NEXT_PUBLIC_SUPABASE_URL
   - `anon public` key → ini NEXT_PUBLIC_SUPABASE_ANON_KEY

---

## STEP 4 — Buat file .env.local

Di root folder taskflow, buat file `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxx
```

Ganti dengan nilai yang kamu copy dari Supabase tadi.

---

## STEP 5 — Jalankan SQL Schema di Supabase

1. Di Supabase dashboard → klik "SQL Editor" di sidebar
2. Klik "New query"
3. Paste SELURUH isi file `supabase_schema.sql`
4. Klik "Run" (atau Ctrl+Enter)
5. Pastikan tidak ada error merah

---

## STEP 6 — Copy semua file kode

Salin semua file dari folder starter kit ini ke project kamu:

```
taskflow/
├── .env.local                          ← buat sendiri (step 4)
├── middleware.ts                       ← copy dari starter kit
├── types/
│   └── index.ts                       ← copy
├── lib/
│   └── supabase/
│       ├── client.ts                  ← copy
│       └── server.ts                  ← copy
└── app/
    ├── layout.tsx                     ← REPLACE yang ada
    ├── page.tsx                       ← REPLACE yang ada
    ├── globals.css                    ← BIARKAN (sudah ada dari Next.js)
    ├── (auth)/
    │   ├── login/
    │   │   └── page.tsx              ← copy
    │   └── register/
    │       └── page.tsx              ← copy
    └── (dashboard)/
        ├── dashboard/
        │   ├── page.tsx              ← copy
        │   └── DashboardClient.tsx   ← copy
        └── board/
            └── [id]/
                ├── page.tsx          ← copy
                └── BoardClient.tsx   ← copy
```

---

## STEP 7 — Jalankan project

```bash
npm run dev
```

Buka http://localhost:3000 → harusnya langsung redirect ke /login

---

## STEP 8 — Test

1. Register akun baru di /register
2. Login
3. Buat board pertama
4. Klik board → muncul 3 kolom: To Do, In Progress, Done
5. Tambah task, drag & drop antar kolom

---

## STEP 9 — Deploy ke Vercel

```bash
# Push ke GitHub dulu
git init
git add .
git commit -m "feat: initial taskflow setup"
git remote add origin https://github.com/Akhyarrrrr/taskflow.git
git push -u origin main
```

Lalu:
1. Buka vercel.com → Import repo `taskflow`
2. Di Environment Variables, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy → selesai, dapat URL gratis!

---

## TROUBLESHOOTING

**Error: Cannot find module '@supabase/ssr'**
→ Jalankan: `npm install @supabase/ssr`

**Error: Hydration failed**
→ Pastikan `suppressHydrationWarning` ada di `<html>` di layout.tsx

**Login tidak redirect**
→ Cek apakah .env.local sudah benar, restart dev server

**Drag & drop tidak berfungsi**
→ Pastikan `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` sudah terinstall

---

## COMMIT SCHEDULE (wajib!)

Setiap sesi coding → minimal 1 commit:

```bash
git add .
git commit -m "feat: add task drag and drop"
git push
```

Contoh commit message yang bagus:
- `feat: add login page`
- `feat: create board functionality`
- `fix: task card priority badge color`
- `style: improve dashboard layout`
- `feat: add due date to tasks`
