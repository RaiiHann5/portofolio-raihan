// PLACEHOLDER DATA — ganti semua entry di bawah ini dengan template asli
// (nama, harga, gambar preview, link demo & link beli) sebelum halaman
// Marketplace ini di-publish. Struktur field-nya udah final, tinggal isi.
//
// Field yang dipakai halaman detail (/marketplace/:slug):
//   slug      -> alamat URL-nya, huruf kecil dan pakai tanda hubung
//   gallery   -> array screenshot; kosong = ditampilkan placeholder
//   overview  -> penjelasan panjang, 1–2 paragraf
//   includes  -> daftar isi paket yang didapat pembeli
//   features  -> [{ title, body }], sorotan fitur
//   pages     -> jumlah/nama halaman yang termasuk
//   license   -> ketentuan pemakaian singkat
export const templates = [
  {
    id: "t01",
    slug: "template-01",
    title: "Template 01",
    description: "Ganti dengan deskripsi singkat template ini — buat apa, cocok buat siapa.",
    overview:
      "Ganti dengan penjelasan lengkap: masalah apa yang diselesaikan template ini, cocok untuk jenis bisnis apa, dan apa yang membedakannya dari template sejenis. Dua paragraf sudah cukup.",
    category: "Landing Page",
    price: 149000,
    stack: ["React", "Tailwind CSS"],
    image: null,
    gallery: [],
    pages: "5 halaman",
    license: "Boleh dipakai untuk satu proyek komersial.",
    includes: [
      "Kode sumber lengkap (React + Tailwind)",
      "File desain Figma",
      "Panduan pemasangan",
      "Update gratis 6 bulan",
    ],
    features: [
      { title: "Responsif penuh", body: "Diuji dari layar 320px sampai desktop lebar." },
      { title: "Siap SEO", body: "Meta tag, Open Graph, dan struktur heading sudah rapi." },
      { title: "Mudah diubah", body: "Warna dan font diatur lewat token, bukan dicari satu per satu." },
    ],
    demo: "",
    buy: "",
  },
  {
    id: "t02",
    slug: "template-02",
    title: "Template 02",
    description: "Ganti dengan deskripsi singkat template ini — buat apa, cocok buat siapa.",
    overview:
      "Ganti dengan penjelasan lengkap: masalah apa yang diselesaikan template ini, cocok untuk jenis bisnis apa, dan apa yang membedakannya dari template sejenis.",
    category: "Dashboard",
    price: 249000,
    stack: ["React", "Tailwind CSS"],
    image: null,
    gallery: [],
    pages: "8 halaman",
    license: "Boleh dipakai untuk satu proyek komersial.",
    includes: [
      "Kode sumber lengkap (React + Tailwind)",
      "Komponen grafik siap pakai",
      "Panduan pemasangan",
      "Update gratis 6 bulan",
    ],
    features: [
      { title: "Komponen grafik", body: "Grafik garis, batang, dan donat yang tinggal diisi data." },
      { title: "Mode terang & gelap", body: "Dua tema yang sudah diselaraskan, bukan sekadar warna dibalik." },
      { title: "Tabel yang bisa disaring", body: "Pencarian, urutan, dan penyaringan sudah jalan." },
    ],
    demo: "",
    buy: "",
  },
  {
    id: "t03",
    slug: "template-03",
    title: "Template 03",
    description: "Ganti dengan deskripsi singkat template ini — buat apa, cocok buat siapa.",
    overview:
      "Ganti dengan penjelasan lengkap: masalah apa yang diselesaikan template ini, cocok untuk jenis bisnis apa, dan apa yang membedakannya dari template sejenis.",
    category: "E-commerce",
    price: 199000,
    stack: ["React", "Tailwind CSS"],
    image: null,
    gallery: [],
    pages: "6 halaman",
    license: "Boleh dipakai untuk satu proyek komersial.",
    includes: [
      "Kode sumber lengkap (React + Tailwind)",
      "Halaman produk & keranjang",
      "Panduan pemasangan",
      "Update gratis 6 bulan",
    ],
    features: [
      { title: "Alur checkout", body: "Dari daftar produk sampai konfirmasi, semua halamannya ada." },
      { title: "Galeri produk", body: "Beberapa foto per produk dengan tampilan layar penuh." },
      { title: "Siap dihubungkan", body: "Struktur data disiapkan untuk disambung ke backend mana pun." },
    ],
    demo: "",
    buy: "",
  },
];

export const categories = ["All", "Landing Page", "Dashboard", "E-commerce"];

/** Cari template dari slug di URL. */
export function getTemplateBySlug(slug) {
  return templates.find((template) => template.slug === slug);
}
