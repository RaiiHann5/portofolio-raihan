// Daftar semua section bawaan yang bisa dinyalakan/dimatikan dari panel admin.
// `id` dipakai sebagai kunci permanen di database — jangan diganti setelah
// dipakai, karena pengaturan yang sudah tersimpan merujuk ke id ini.
// Untuk menambah section baru: tambahkan di sini, lalu bungkus komponennya
// dengan <SectionGate id="..."> di halaman terkait.

export const HIDDEN_SECTIONS_KEY = "hiddenSections";

export const sectionGroups = [
  {
    page: "Beranda",
    path: "/",
    sections: [
      { id: "hero", label: "Hero", hint: "Judul utama dan tombol di paling atas." },
      { id: "home-profile", label: "Profil", hint: "Foto dan deskripsi singkat, tepat di bawah hero." },
      { id: "tech-marquee", label: "Tools yang dipakai", hint: "Deretan logo teknologi berjalan." },
      { id: "services", label: "Layanan" },
      { id: "featured-work", label: "Karya pilihan" },
      { id: "process", label: "Proses kerja" },
    ],
  },
  {
    page: "About Me",
    path: "/about",
    sections: [
      { id: "about", label: "Profil", hint: "Foto dan deskripsi singkat." },
      { id: "skills", label: "Skills" },
      { id: "github-activity", label: "GitHub Activity" },
      { id: "experience", label: "Pengalaman" },
      { id: "certificates", label: "Sertifikat" },
      { id: "lab", label: "Beyond Code" },
    ],
  },
  {
    page: "Project",
    path: "/project",
    sections: [{ id: "projects", label: "Daftar proyek" }],
  },
  {
    page: "Marketplace",
    path: "/marketplace",
    sections: [{ id: "marketplace", label: "Katalog template" }],
  },
  {
    page: "Find Me",
    path: "/find-me",
    sections: [{ id: "contact", label: "Kontak & akun" }],
  },
];

/** Parse nilai tersimpan ("about,skills") jadi array id. */
export function parseHidden(value) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
