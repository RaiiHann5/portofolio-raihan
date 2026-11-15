-- =====================================================================
-- MIGRASI 007: Tools / bahasa yang bisa dikelola dari admin (+ ikon)
--
-- Section "Tools I reach for" di halaman About membaca tabel ini.
-- Tabel diisi otomatis dengan daftar tools yang sebelumnya ada di kode,
-- jadi tampilan tidak berubah sampai kamu mengeditnya lewat admin.
-- Aman dijalankan ulang (seed hanya jalan kalau tabel masih kosong).
-- =====================================================================

create table if not exists public.tools (
  id         uuid primary key default gen_random_uuid(),
  group_name text not null default 'Tools',   -- Frontend, Backend, dst (bebas)
  name       text not null,
  icon       text default '',                 -- URL gambar hasil upload
  icon_slug  text default '',                 -- slug Simple Icons, mis. react
  color      text default '',                 -- warna pill, mis. #00C4CC
  position   int  default 0,
  published  boolean default true,
  created_at timestamptz default now()
);

alter table public.tools enable row level security;
drop policy if exists "public read tools" on public.tools;
drop policy if exists "admin all tools" on public.tools;
create policy "public read tools" on public.tools for select using (published);
create policy "admin all tools"   on public.tools for all to authenticated using (true) with check (true);
create index if not exists tools_position_idx on public.tools (position);

insert into public.tools (group_name, name, icon_slug, position)
select v.g, v.n, v.s, v.p
from (values
  ('Frontend', 'React',        'react',        1),
  ('Frontend', 'JavaScript',   'javascript',   2),
  ('Frontend', 'TypeScript',   'typescript',   3),
  ('Frontend', 'CSS3',         'css',          4),
  ('Frontend', 'Tailwind CSS', 'tailwindcss',  5),
  ('Mobile',   'Flutter',      'flutter',      6),
  ('Mobile',   'Kotlin',       'kotlin',       7),
  ('Mobile',   'Firebase',     'firebase',     8),
  ('Database', 'MySql',        'mysql',        9),
  ('Database', 'MongoDB',      'mongodb',      10),
  ('Database', 'PostgreSQL',   'postgresql',   11),
  ('Database', 'Supabase',     'supabase',     12),
  ('Backend',  'Node.js',      'nodedotjs',    13),
  ('Backend',  'PHP',          'php',          14),
  ('Backend',  'Laravel',      'laravel',      15),
  ('Backend',  'Python',       'python',       16),
  ('Backend',  'MongoDB',      'mongodb',      17),
  ('Design',   'Figma',        'figma',        18),
  ('Tools',    'Git',          'git',          19),
  ('Tools',    'Github',       'github',       20)
) as v(g, n, s, p)
where not exists (select 1 from public.tools);
