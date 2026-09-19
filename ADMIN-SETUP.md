# Menyalakan panel admin

Situs ini tetap berjalan normal tanpa langkah-langkah di bawah. Selama
Supabase belum dipasang, halaman publik memakai data dari `src/data/` dan
`/admin` hanya menampilkan keterangan bahwa panelnya belum aktif.

## 1. Buat project Supabase

1. Daftar di [supabase.com](https://supabase.com) — tier gratis cukup.
2. **New project**. Simpan kata sandi database yang muncul.

## 2. Buat tabelnya

1. Buka menu **SQL Editor** → **New query**.
2. Tempel seluruh isi `supabase/schema.sql`, lalu **Run**.

Skrip itu membuat enam tabel, mengaktifkan Row Level Security, dan
membuat bucket penyimpanan gambar bernama `media`.

## 3. Buat akun admin Anda

**Authentication** → **Users** → **Add user**. Isi email dan kata sandi.
Itulah akun admin Anda.

Jangan aktifkan pendaftaran publik. Setiap orang yang bisa mendaftar akan
ikut punya hak tulis, karena aturan keamanannya berlaku untuk semua
pengguna yang sudah masuk.

## 4. Hubungkan ke situs

**Project Settings** → **API**. Salin dua nilai ke file `.env` di akar
proyek (contohnya ada di `.env.example`):

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhb...
```

Di Vercel, isi dua nilai yang sama di **Settings → Environment Variables**,
lalu deploy ulang. Perubahan environment variable tidak berlaku sampai
build berikutnya.

## 5. Masuk

Buka `/admin`.

---

## Soal keamanan

`VITE_SUPABASE_ANON_KEY` memang ikut terkirim ke browser pengunjung, dan
itu bukan kebocoran — kunci itu dirancang untuk publik. Yang menjaga data
Anda adalah Row Level Security di `supabase/schema.sql`: siapa pun boleh
membaca baris yang published, tetapi hanya sesi yang sudah masuk yang boleh
menulis.

**Jangan pernah menaruh `service_role` key di file `.env` frontend.** Kunci
itu melewati semua aturan keamanan.

Perlu diketahui juga: menyembunyikan menu `/admin` dari navigasi bukan
pengamanan. Yang benar-benar mengunci adalah aturan di database, dan itu
sudah terpasang.

## Yang bisa diubah dari panel

| Menu | Isinya |
|---|---|
| Proyek | Tambah, ubah, hapus, urutkan proyek. Termasuk galeri, tech stack, fitur, dan status draft. |
| Marketplace | Template yang dijual, harga, isi paket, link beli. Kategori yang Anda ketik otomatis jadi filter. |
| Sertifikat | Kartu di halaman About Me, tepat di atas "Life outside the editor". Nama penerbit yang cocok dengan brand terkenal otomatis dapat ikon. |
| Link & akun | Kartu di halaman Find Me. Bisa menambah brand apa pun — ikonnya dicari dari katalog 3.000 brand dan disimpan bersama datanya. |
| Teks halaman | Semua tulisan di situs, dalam dua bahasa. Dikosongkan = kembali ke teks bawaan. |
| Section tambahan | Blok konten baru yang ditempel di bawah halaman mana pun, tanpa menyentuh kode. |
| Pengaturan | Email, nomor WhatsApp, endpoint Formspree, lokasi, alamat situs. |

## Kalau tabelnya masih kosong

Tabel yang kosong sengaja **tidak** menimpa data bawaan. Jadi situs tidak
akan mendadak kosong di menit-menit pertama setelah database dibuat.
Begitu Anda menambah satu proyek lewat panel, seluruh daftar proyek
berpindah memakai database — jadi pindahkan semuanya sekaligus, jangan
setengah-setengah.
