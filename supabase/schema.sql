-- =====================================================================
-- SKEMA DATABASE ADMIN PANEL
--
-- Cara pakai:
--   1. Buka supabase.com -> New project (gratis).
--   2. Masuk ke menu "SQL Editor" -> New query.
--   3. Tempel SELURUH isi file ini -> Run.
--   4. Menu "Authentication" -> Users -> Add user: isi email & password
--      Anda. Itu jadi akun admin. JANGAN aktifkan pendaftaran publik.
--   5. Menu "Project Settings" -> API: salin Project URL dan anon key
--      ke file .env (lihat .env.example).
--
-- Soal keamanan: anon key memang boleh terlihat publik — itu memang
-- dirancang untuk dipasang di browser. Yang menjaga data Anda adalah
-- Row Level Security di bawah ini: siapa pun boleh MEMBACA, tapi hanya
-- sesi yang sudah login yang boleh MENULIS. Jangan pernah menaruh
-- service_role key di kode frontend.
-- =====================================================================

-- ---------------------------------------------------------------------
-- PROYEK
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  description text default '',
  overview    text default '',
  problem     text default '',          -- masalah yang diselesaikan
  goal        text default '',          -- tujuan proyek
  role        text default '',
  type        text default '',
  year        text default '',
  demo        text default '',
  repo        text default '',
  docs_url    text default '',           -- link dokumentasi
  image       text default '',           -- URL gambar sampul
  gallery     jsonb default '[]'::jsonb, -- array URL gambar
  stack       jsonb default '[]'::jsonb, -- array nama teknologi
  features    jsonb default '[]'::jsonb, -- [{title, body}]
  gradient    text default 'linear-gradient(135deg, #26203a, #0a0a0b)',
  position    int  default 0,            -- urutan tampil, kecil di atas
  published   boolean default true,
  created_at  timestamptz default now()
);

-- ---------------------------------------------------------------------
-- TEMPLATE MARKETPLACE
-- ---------------------------------------------------------------------
create table if not exists public.templates (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  description text default '',
  overview    text default '',
  category    text default 'Landing Page',
  price       int  default 0,
  image       text default '',
  gallery     jsonb default '[]'::jsonb,
  stack       jsonb default '[]'::jsonb,
  includes    jsonb default '[]'::jsonb, -- array teks
  features    jsonb default '[]'::jsonb, -- [{title, body}]
  pages       text default '',
  license     text default '',
  demo        text default '',
  buy         text default '',
  position    int  default 0,
  published   boolean default true,
  created_at  timestamptz default now()
);

-- ---------------------------------------------------------------------
-- SERTIFIKAT
-- ---------------------------------------------------------------------
create table if not exists public.certificates (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  issuer         text not null,
  date           text default '',
  credential_id  text default '',
  credential_url text default '',
  image          text default '',           -- URL gambar lencana/sertifikat
  skills         jsonb default '[]'::jsonb, -- array nama teknologi terkait
  category       text default 'pelatihan',  -- 'lomba' | 'pelatihan'
  position       int  default 0,
  published      boolean default true,
  created_at     timestamptz default now()
);

-- ---------------------------------------------------------------------
-- TESTIMONI
-- ---------------------------------------------------------------------
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text default '',
  message    text not null,
  photo      text default '',           -- URL foto pemberi testimoni
  position   int  default 0,
  published  boolean default true,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- LINK / AKUN (sosmed, platform kerja, apa pun)
--
-- icon_path & icon_hex disimpan langsung di sini, bukan cuma nama brand.
-- Dengan begitu halaman publik bisa menggambar logonya tanpa perlu
-- memuat pustaka ikon apa pun — dan Anda bisa menambah brand baru yang
-- belum pernah ada di kode.
-- ---------------------------------------------------------------------
create table if not exists public.links (
  id         uuid primary key default gen_random_uuid(),
  "group"    text not null default 'social',  -- 'social' | 'hire' | nama grup baru
  label      text not null,
  handle     text default '',
  note       text default '',
  url        text not null,
  icon_name  text default '',   -- slug simple-icons, buat rujukan
  icon_path  text default '',   -- path SVG 24x24
  icon_hex   text default '',   -- warna brand, contoh #0A66C2
  icon_dark  text default '',   -- pengganti kalau warnanya terlalu gelap
  position   int  default 0,
  published  boolean default true,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- TEKS SITUS
--
-- Setiap baris menimpa satu key i18n (misal "hero.line1"). Yang tidak
-- ada barisnya otomatis memakai teks bawaan dari src/i18n/translations.js,
-- jadi situs tetap utuh walau tabel ini kosong.
-- ---------------------------------------------------------------------
create table if not exists public.site_text (
  key        text primary key,   -- contoh: 'hero.line1'
  en         text default '',
  id         text default '',
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- SECTION TAMBAHAN
--
-- Blok konten buatan sendiri yang ditempel ke sebuah halaman tanpa perlu
-- menyentuh kode. `blocks` berisi isinya, bentuknya tergantung `layout`.
-- ---------------------------------------------------------------------
create table if not exists public.sections (
  id          uuid primary key default gen_random_uuid(),
  page        text not null default 'home',  -- 'home' | 'about' | 'project' | 'marketplace' | 'find-me'
  layout      text not null default 'prose', -- 'prose' | 'cards' | 'stats' | 'gallery'
  eyebrow     text default '',
  title       text default '',
  body        text default '',
  blocks      jsonb default '[]'::jsonb,     -- [{title, body, image}]
  position    int  default 0,
  published   boolean default true,
  created_at  timestamptz default now()
);

-- ---------------------------------------------------------------------
-- PENGATURAN UMUM (email, WA, endpoint form, dsb.)
-- Disimpan sebagai pasangan key-value supaya bisa ditambah kapan saja.
-- ---------------------------------------------------------------------
create table if not exists public.settings (
  key        text primary key,
  value      text default '',
  updated_at timestamptz default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- Semua orang boleh baca yang published; hanya yang sudah login boleh ubah.
-- =====================================================================
alter table public.projects     enable row level security;
alter table public.templates    enable row level security;
alter table public.certificates enable row level security;
alter table public.testimonials enable row level security;
alter table public.links        enable row level security;
alter table public.site_text    enable row level security;
alter table public.sections     enable row level security;
alter table public.settings     enable row level security;

-- Baca publik
create policy "public read projects"     on public.projects     for select using (published);
create policy "public read templates"    on public.templates    for select using (published);
create policy "public read certificates" on public.certificates for select using (published);
create policy "public read testimonials" on public.testimonials for select using (published);
create policy "public read links"        on public.links        for select using (published);
create policy "public read sections"     on public.sections     for select using (published);
create policy "public read site_text"    on public.site_text    for select using (true);
create policy "public read settings"     on public.settings     for select using (true);

-- Tulis hanya untuk yang sudah login.
-- Admin juga perlu bisa MEMBACA baris yang belum published (draft),
-- karena itu ada policy select tambahan khusus untuk authenticated.
create policy "admin all projects"     on public.projects     for all to authenticated using (true) with check (true);
create policy "admin all templates"    on public.templates    for all to authenticated using (true) with check (true);
create policy "admin all certificates" on public.certificates for all to authenticated using (true) with check (true);
create policy "admin all testimonials" on public.testimonials for all to authenticated using (true) with check (true);
create policy "admin all links"        on public.links        for all to authenticated using (true) with check (true);
create policy "admin all site_text"    on public.site_text    for all to authenticated using (true) with check (true);
create policy "admin all sections"     on public.sections     for all to authenticated using (true) with check (true);
create policy "admin all settings"     on public.settings     for all to authenticated using (true) with check (true);

-- =====================================================================
-- STORAGE untuk gambar
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "admin upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media');

create policy "admin update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media');

create policy "admin delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media');

-- =====================================================================
-- Indeks untuk pengurutan
-- =====================================================================
create index if not exists projects_position_idx     on public.projects (position);
create index if not exists templates_position_idx    on public.templates (position);
create index if not exists certificates_position_idx  on public.certificates (position);
create index if not exists testimonials_position_idx  on public.testimonials (position);
create index if not exists links_group_idx           on public.links ("group", position);
create index if not exists sections_page_idx         on public.sections (page, position);


-- =====================================================================
-- HALAMAN TAMBAHAN (sama dengan migrations/005_portfolio_pages.sql)
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
