import { site } from "./site";

/**
 * Dua kelompok akun yang sengaja dipisah di halaman Find Me.
 *
 * `social`   = tempat orang ngikutin kerjaan saya.
 * `hire`     = tempat orang bisa beneran nge-hire / transaksi.
 *
 * Entry dengan `url` kosong otomatis gak dirender (lihat visiblePlatforms),
 * jadi aman ninggalin placeholder di sini sampai akunnya dibuat.
 * `brand` harus cocok dengan key di data/brands.js.
 */
const socialAccounts = [
  {
    brand: "GitHub",
    handle: "@RaiiHann5",
    url: site.socials.github,
    noteKey: "accounts.noteGithub",
  },
  {
    brand: "LinkedIn",
    handle: "in/raihan",
    url: site.socials.linkedin,
    noteKey: "accounts.noteLinkedin",
  },
  {
    brand: "Instagram",
    handle: "",
    url: site.socials.instagram,
    noteKey: "accounts.noteInstagram",
  },
  {
    brand: "TikTok",
    handle: "",
    url: site.socials.tiktok,
    noteKey: "accounts.noteTiktok",
  },
  {
    brand: "Email",
    handle: site.email,
    url: `mailto:${site.email}`,
    noteKey: "accounts.noteEmail",
  },
];

const hireAccounts = [
  {
    brand: "Fiverr",
    handle: "",
    url: site.platforms.fiverr,
    noteKey: "accounts.noteFiverr",
  },
  {
    brand: "Upwork",
    handle: "",
    url: site.platforms.upwork,
    noteKey: "accounts.noteUpwork",
  },
  {
    brand: "Fastwork",
    handle: "",
    url: site.platforms.fastwork,
    noteKey: "accounts.noteFastwork",
  },
  {
    brand: "JobStreet",
    handle: "",
    url: site.platforms.jobstreet,
    noteKey: "accounts.noteJobstreet",
  },
  {
    brand: "Freelancer",
    handle: "",
    url: site.platforms.freelancer,
    noteKey: "accounts.noteFreelancer",
  },
];

/** Buang entry yang URL-nya masih kosong supaya gak ada kartu link mati. */
function visible(list) {
  return list.filter((item) => Boolean(item.url));
}

export const socials = visible(socialAccounts);
export const hirePlatforms = visible(hireAccounts);
