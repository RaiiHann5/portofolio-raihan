// Satu sumber kebenaran buat identitas & kontak.
// Kalau ganti email / username / nomor WA, cukup ubah di sini — semua
// komponen (Hero, Process, Footer, Contact) ikut berubah.

export const site = {
  name: "Raihan Rezki Ramadhan",
  shortName: "Raihan",
  role: "Fullstack Developer",
  location: "Banjarbaru, Indonesia",
  timezone: "Asia/Makassar",

  // Dipakai section GitHub Activity di About Me. Diambil manual dari URL
  // GitHub di bawah supaya section itu tidak perlu mem-parsing URL setiap
  // render — ganti dua-duanya sekaligus kalau username-nya berubah.
  githubUsername: "RaiiHann5",

  // GANTI ini setelah deploy. Dipakai buat canonical URL, og:url,
  // sitemap.xml, dan JSON-LD di index.html.
  url: "https://your-domain.vercel.app",

  email: "rezkiraihan123@gmail.com",

  // Format internasional tanpa "+" dan tanpa spasi, contoh: "6281234567890".
  // Selama masih ada huruf X, tombol "Chat WhatsApp" otomatis
  // fallback ke email — jadi gak akan pernah ada link mati.
  whatsapp: "62812XXXXXXXX",

  socials: {
    github: "https://github.com/RaiiHann5",
    linkedin: "https://linkedin.com/in/raihan",
    instagram: "",
    tiktok: "",
  },

  // Platform tempat orang bisa beneran nge-hire. Yang masih string kosong
  // otomatis gak dirender di halaman Find Me — jadi aman dibiarkan sampai
  // akunnya dibuat, gak akan muncul kartu dengan link mati.
  platforms: {
    fiverr: "",
    upwork: "",
    fastwork: "",
    jobstreet: "",
    freelancer: "",
  },

  // Endpoint Formspree buat form kontak, bentuknya:
  //   https://formspree.io/f/xxxxxxxx
  // Bikin gratis di formspree.io -> New Form -> salin endpoint-nya ke sini.
  // Selama masih kosong, form otomatis beralih ke mode mailto: isian user
  // tetap kepakai, cuma terkirim lewat aplikasi email mereka sendiri.
  formEndpoint: "",
};

/** true kalau nomor WA udah diisi beneran. */
export function hasWhatsapp() {
  return /^\d{9,15}$/.test(site.whatsapp);
}

/**
 * Link chat WhatsApp dengan pesan pembuka yang udah keisi.
 * Fallback ke mailto kalau nomornya belum diganti.
 */
export function contactLink(message) {
  if (hasWhatsapp()) {
    return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
  }
  return `mailto:${site.email}?subject=${encodeURIComponent("Project inquiry")}&body=${encodeURIComponent(message)}`;
}
