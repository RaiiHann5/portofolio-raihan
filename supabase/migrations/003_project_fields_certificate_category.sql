-- =====================================================================
-- MIGRASI: field proyek (problem, goal, docs_url) + kategori sertifikat
--
-- Jalankan sekali kalau project Supabase Anda SUDAH pernah menjalankan
-- schema.sql. Aman dijalankan ulang (pakai "if not exists").
-- Sertifikat yang sudah ada otomatis berkategori 'pelatihan'.
--
-- Cara pakai: Supabase -> SQL Editor -> New query -> tempel -> Run.
-- =====================================================================

alter table public.projects     add column if not exists problem  text default '';
alter table public.projects     add column if not exists goal     text default '';
alter table public.projects     add column if not exists docs_url text default '';

alter table public.certificates add column if not exists category text default 'pelatihan';
