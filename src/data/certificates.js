// DATA DUMMY — ganti lewat panel admin (/admin/certificates) begitu Anda
// punya sertifikat asli. Selama tabel `certificates` di database masih
// kosong, empat baris ini yang tampil di situs.
export const certificates = [
  {
    id: "c01",
    title: "React — Advanced Concepts",
    issuer: "Meta (Coursera)",
    date: "2024",
    credentialId: "XXXXXXXXXXXX",
    credentialUrl: "",
    image: "",
    skills: ["React", "JavaScript"],
  },
  {
    id: "c02",
    title: "Responsive Web Design",
    issuer: "freeCodeCamp",
    date: "2023",
    credentialId: "XXXXXXXXXXXX",
    credentialUrl: "",
    image: "",
    skills: ["HTML", "CSS"],
  },
  {
    id: "c03",
    title: "Laravel for APIs",
    issuer: "Laracasts",
    date: "2023",
    credentialId: "",
    credentialUrl: "",
    image: "",
    skills: ["Laravel", "PHP"],
  },
  {
    id: "c04",
    title: "UI Design Fundamentals",
    issuer: "Google (Coursera)",
    date: "2022",
    credentialId: "XXXXXXXXXXXX",
    credentialUrl: "",
    image: "",
    skills: ["Figma"],
  },
];
