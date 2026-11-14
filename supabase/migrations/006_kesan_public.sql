-- =====================================================================
-- MIGRASI 006: kesan & pesan langsung tampil (tanpa persetujuan admin)
--
-- Jalankan ini HANYA kalau 005_portfolio_pages.sql sudah pernah dijalankan
-- sebelum perubahan ini. Kalau 005 belum dijalankan, cukup jalankan 005
-- (isinya sudah versi terbaru). Aman dijalankan ulang.
-- =====================================================================

-- Insert: tidak lagi mewajibkan approved = false.
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
  );

-- Baca: semua kesan tampil untuk publik.
drop policy if exists "public read approved kesan" on public.messages;
drop policy if exists "public read kesan" on public.messages;
create policy "public read kesan" on public.messages
  for select using (kind = 'kesan');

-- Email dan status baca tetap rahasia dari pengunjung.
revoke select on public.messages from anon;
grant select (id, kind, name, relation, message, rating, created_at) on public.messages to anon;
