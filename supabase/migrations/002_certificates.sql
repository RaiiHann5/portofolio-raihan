-- =====================================================================
-- MIGRASI: tabel sertifikat
--
-- Pakai file ini kalau project Supabase Anda SUDAH pernah menjalankan
-- supabase/schema.sql sebelumnya. Isinya hanya bagian baru (tabel
-- certificates), jadi aman dijalankan sekali tanpa bentrok dengan
-- kebijakan yang sudah ada.
--
-- Kalau ini pemasangan BARU (belum pernah menjalankan schema.sql sama
-- sekali), lewati file ini — cukup jalankan schema.sql yang sudah
-- memuat tabel ini di dalamnya.
--
-- Cara pakai: Supabase -> SQL Editor -> New query -> tempel semua ini -> Run.
-- =====================================================================

create table if not exists public.certificates (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  issuer         text not null,
  date           text default '',
  credential_id  text default '',
  credential_url text default '',
  image          text default '',
  skills         jsonb default '[]'::jsonb,
  position       int  default 0,
  published      boolean default true,
  created_at     timestamptz default now()
);

alter table public.certificates enable row level security;

create policy "public read certificates" on public.certificates for select using (published);
create policy "admin all certificates"   on public.certificates for all to authenticated using (true) with check (true);

create index if not exists certificates_position_idx on public.certificates (position);
