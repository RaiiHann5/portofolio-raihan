-- =====================================================================
-- MIGRASI: tabel testimoni
--
-- Jalankan sekali kalau project Supabase Anda SUDAH pernah menjalankan
-- schema.sql. Pemasangan baru cukup menjalankan schema.sql.
--
-- Cara pakai: Supabase -> SQL Editor -> New query -> tempel -> Run.
-- =====================================================================

create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text default '',
  message    text not null,
  photo      text default '',
  position   int  default 0,
  published  boolean default true,
  created_at timestamptz default now()
);

alter table public.testimonials enable row level security;

create policy "public read testimonials" on public.testimonials for select using (published);
create policy "admin all testimonials"   on public.testimonials for all to authenticated using (true) with check (true);

create index if not exists testimonials_position_idx on public.testimonials (position);
