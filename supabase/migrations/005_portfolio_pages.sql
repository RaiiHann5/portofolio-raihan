-- =====================================================================
-- MIGRASI: halaman tambahan portfolio (menu "Lainnya")
--   - messages    : pesan kontak + kesan & pesan dari pengunjung
--   - posts       : blog / catatan ngoding
--   - experiences : pengalaman organisasi, kepanitiaan, lomba (dan PLK tambahan)
--   - kolom baru  : testimonials.category, certificates.documentation,
--                   projects.feedback / process_images / process_notes
--
-- Jalankan sekali di Supabase -> SQL Editor. Aman dijalankan ulang.
-- =====================================================================

-- ---------------------------------------------------------------------
-- PESAN MASUK
-- kind = 'kontak' (dari halaman Temui Saya) | 'kesan' (Kesan & Pesan)
-- Kesan baru tampil di situs hanya setelah admin menyetujui (approved).
-- ---------------------------------------------------------------------
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null default 'kontak',
  name       text not null,
  email      text default '',
  relation   text default '',          -- mis. Teman, Guru, Pengguna
  message    text not null,
  rating     int,
  is_read    boolean default false,
  approved   boolean default false,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

drop policy if exists "anyone can send message" on public.messages;
create policy "anyone can send message" on public.messages
  for insert to anon, authenticated
  with check (
    kind in ('kontak', 'kesan')
    and char_length(name) between 1 and 100
    and char_length(message) between 5 and 2000
    and char_length(coalesce(email, '')) <= 200
    and char_length(coalesce(relation, '')) <= 100
    and (rating is null or rating between 1 and 5)
    and is_read = false
    and approved = false
  );

drop policy if exists "public read approved kesan" on public.messages;
create policy "public read approved kesan" on public.messages
  for select using (kind = 'kesan' and approved);

drop policy if exists "admin all messages" on public.messages;
create policy "admin all messages" on public.messages
  for all to authenticated using (true) with check (true);

create index if not exists messages_created_idx on public.messages (created_at desc);

-- ---------------------------------------------------------------------
-- BLOG
-- ---------------------------------------------------------------------
create table if not exists public.posts (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  title      text not null,
  excerpt    text default '',
  content    text default '',          -- teks biasa; baris kosong = paragraf baru
  cover      text default '',
  tags       jsonb default '[]'::jsonb,
  position   int  default 0,
  published  boolean default true,
  created_at timestamptz default now()
);

alter table public.posts enable row level security;
drop policy if exists "public read posts" on public.posts;
drop policy if exists "admin all posts" on public.posts;
create policy "public read posts" on public.posts for select using (published);
create policy "admin all posts"   on public.posts for all to authenticated using (true) with check (true);
create index if not exists posts_position_idx on public.posts (position);

-- ---------------------------------------------------------------------
-- PENGALAMAN (organisasi / kepanitiaan / lomba / plk)
-- ---------------------------------------------------------------------
create table if not exists public.experiences (
  id          uuid primary key default gen_random_uuid(),
  category    text not null default 'organisasi',  -- plk | organisasi | lomba
  title       text not null,                        -- nama organisasi / lomba / tempat
  role        text default '',                      -- jabatan / peran / hasil
  period      text default '',
  description text default '',
  image       text default '',
  position    int  default 0,
  published   boolean default true,
  created_at  timestamptz default now()
);

alter table public.experiences enable row level security;
drop policy if exists "public read experiences" on public.experiences;
drop policy if exists "admin all experiences" on public.experiences;
create policy "public read experiences" on public.experiences for select using (published);
create policy "admin all experiences"   on public.experiences for all to authenticated using (true) with check (true);
create index if not exists experiences_position_idx on public.experiences (position);

-- ---------------------------------------------------------------------
-- KOLOM BARU DI TABEL YANG SUDAH ADA
-- ---------------------------------------------------------------------
alter table public.testimonials add column if not exists category text default 'pengguna';
-- guru | teman | pengguna | plk

alter table public.certificates add column if not exists documentation jsonb default '[]'::jsonb;
-- certificates.category sekarang boleh: pelatihan | lomba | prestasi

alter table public.projects add column if not exists feedback       jsonb default '[]'::jsonb; -- [{name, role, message}]
alter table public.projects add column if not exists process_images jsonb default '[]'::jsonb; -- dokumentasi proses
alter table public.projects add column if not exists process_notes  text  default '';
