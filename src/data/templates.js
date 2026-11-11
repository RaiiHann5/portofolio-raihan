import { bi } from "../i18n/localize";
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
    description: bi("Replace with a short description of this template — what it's for and who it suits.", "Ganti dengan deskripsi singkat template ini — buat apa, cocok buat siapa."),
    overview:
      bi("Replace with a full explanation: what problem this template solves, which kind of business it suits, and what sets it apart from similar templates. Two paragraphs is enough.", "Ganti dengan penjelasan lengkap: masalah apa yang diselesaikan template ini, cocok untuk jenis bisnis apa, dan apa yang membedakannya dari template sejenis. Dua paragraf sudah cukup."),
    category: "Landing Page",
    price: 149000,
    stack: ["React", "Tailwind CSS"],
    image: null,
    gallery: [],
    pages: bi("5 pages", "5 halaman"),
    license: bi("May be used for one commercial project.", "Boleh dipakai untuk satu proyek komersial."),
    includes: [
      bi("Full source code (React + Tailwind)", "Kode sumber lengkap (React + Tailwind)"),
      bi("Figma design file", "File desain Figma"),
      bi("Installation guide", "Panduan pemasangan"),
      bi("6 months of free updates", "Update gratis 6 bulan"),
    ],
    features: [
      { title: bi("Fully responsive", "Responsif penuh"), body: bi("Tested from 320px screens up to wide desktops.", "Diuji dari layar 320px sampai desktop lebar.") },
      { title: bi("SEO-ready", "Siap SEO"), body: bi("Meta tags, Open Graph, and heading structure are already in order.", "Meta tag, Open Graph, dan struktur heading sudah rapi.") },
      { title: bi("Easy to customize", "Mudah diubah"), body: bi("Colors and fonts are controlled through tokens, not hunted down one by one.", "Warna dan font diatur lewat token, bukan dicari satu per satu.") },
    ],
    demo: "",
    buy: "",
  },
  {
    id: "t02",
    slug: "template-02",
    title: "Template 02",
    description: bi("Replace with a short description of this template — what it's for and who it suits.", "Ganti dengan deskripsi singkat template ini — buat apa, cocok buat siapa."),
    overview:
      bi("Replace with a full explanation: what problem this template solves, which kind of business it suits, and what sets it apart from similar templates.", "Ganti dengan penjelasan lengkap: masalah apa yang diselesaikan template ini, cocok untuk jenis bisnis apa, dan apa yang membedakannya dari template sejenis."),
    category: "Dashboard",
    price: 249000,
    stack: ["React", "Tailwind CSS"],
    image: null,
    gallery: [],
    pages: bi("8 pages", "8 halaman"),
    license: bi("May be used for one commercial project.", "Boleh dipakai untuk satu proyek komersial."),
    includes: [
      bi("Full source code (React + Tailwind)", "Kode sumber lengkap (React + Tailwind)"),
      bi("Ready-to-use chart components", "Komponen grafik siap pakai"),
      bi("Installation guide", "Panduan pemasangan"),
      bi("6 months of free updates", "Update gratis 6 bulan"),
    ],
    features: [
      { title: bi("Chart components", "Komponen grafik"), body: bi("Line, bar, and donut charts ready to be filled with data.", "Grafik garis, batang, dan donat yang tinggal diisi data.") },
      { title: bi("Light & dark mode", "Mode terang & gelap"), body: bi("Two themes tuned to each other, not just inverted colors.", "Dua tema yang sudah diselaraskan, bukan sekadar warna dibalik.") },
      { title: bi("Filterable tables", "Tabel yang bisa disaring"), body: bi("Search, sorting, and filtering already work.", "Pencarian, urutan, dan penyaringan sudah jalan.") },
    ],
    demo: "",
    buy: "",
  },
  {
    id: "t03",
    slug: "template-03",
    title: "Template 03",
    description: bi("Replace with a short description of this template — what it's for and who it suits.", "Ganti dengan deskripsi singkat template ini — buat apa, cocok buat siapa."),
    overview:
      bi("Replace with a full explanation: what problem this template solves, which kind of business it suits, and what sets it apart from similar templates.", "Ganti dengan penjelasan lengkap: masalah apa yang diselesaikan template ini, cocok untuk jenis bisnis apa, dan apa yang membedakannya dari template sejenis."),
    category: "E-commerce",
    price: 199000,
    stack: ["React", "Tailwind CSS"],
    image: null,
    gallery: [],
    pages: bi("6 pages", "6 halaman"),
    license: bi("May be used for one commercial project.", "Boleh dipakai untuk satu proyek komersial."),
    includes: [
      bi("Full source code (React + Tailwind)", "Kode sumber lengkap (React + Tailwind)"),
      bi("Product & cart pages", "Halaman produk & keranjang"),
      bi("Installation guide", "Panduan pemasangan"),
      bi("6 months of free updates", "Update gratis 6 bulan"),
    ],
    features: [
      { title: bi("Checkout flow", "Alur checkout"), body: bi("From product list to confirmation, every page is there.", "Dari daftar produk sampai konfirmasi, semua halamannya ada.") },
      { title: bi("Product gallery", "Galeri produk"), body: bi("Several photos per product with a fullscreen view.", "Beberapa foto per produk dengan tampilan layar penuh.") },
      { title: bi("Ready to connect", "Siap dihubungkan"), body: bi("Data structure prepared to plug into any backend.", "Struktur data disiapkan untuk disambung ke backend mana pun.") },
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
