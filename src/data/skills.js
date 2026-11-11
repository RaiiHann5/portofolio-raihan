// Tiap skill punya warna brand-nya sendiri, dipakai buat glow/border pas hover.
// Skill dengan array warna (Figma) = ikonnya emang multicolor,
// dipakai buat efek conic-gradient dot di pill.
export const SKILL_COLORS = {
  React: ["#00C4CC", "#1B4EF5"],
  JavaScript: ["#FBC02D", "#FF8F00"],
  "Tailwind CSS": ["#792CA2", "#1B4EF5"],
  "MySql": ["#00758F", "#F29111"],
  "MongoDB": ["#328E6E", "#67AE6E"],
  "PostgreSQL": ["#336791", "#4DB6AC"],
  "Figma": ["#F24E1E", "#FF7262", "#A259FF", "#1ABCFE", "#0ACF83"],
  "Git": ["#F05033"],
  "Supabase": ["#3ECF8E", "#249361"],
  "PHP": ["#4647AE", "#8494FF"],
  "Laravel": ["#D6336C", "#D62828"],
  "Github": ["#4E56C0", "#9B5DE0"],
  "Flutter": ["#02569B", "#54C5F8"],
  "Kotlin": ["#7F52FF", "#B924E8"],
  "Firebase": ["#FFCA28", "#DD2C00"],
  "TypeScript": ["#3178C6", "#235A97"],
  "Python": ["#3776AB", "#FFD43B"],
};

// Fallback kalau ada skill baru yang belum didaftarin di atas
export const DEFAULT_SKILL_COLOR = "#8B8B8B";

export const skillGroups = [
  {
    label: "Frontend",
    note: "Core craft",
    skills: ["React", "JavaScript", "TypeScript", "CSS3", "Tailwind CSS"],
  },
  {
    label: "Mobile",
    note: "Android & cross-platform",
    skills: ["Flutter", "Kotlin", "Firebase"],
  },
  {
    label: "Database",
    note: "Motion & feel",
    skills: ["MySql", "MongoDB", "PostgreSQL", "Supabase"],
  },
  {
    label: "Backend",
    note: "Server & data",
    skills: ["Node.js", "PHP", "Laravel", "Python", "MongoDB"],
  },
  {
    label: "Design",
    note: "Visual & prototyping",
    skills: ["Figma"],
  },
  {
    label: "Tools",
    note: "Daily drivers",
    skills: ["Git", "Github"],
  },
];

// Persentase = penilaian diri sendiri, bukan hasil tes. Isi dengan jujur
// supaya cocok dengan kemampuan sebenarnya saat ditanya. Angka 0–100.
export const technicalLevels = [
  { name: "HTML", level: 90 },
  { name: "CSS", level: 88 },
  { name: "JavaScript", level: 80 },
  { name: "React", level: 80 },
  { name: "Tailwind CSS", level: 85 },
  { name: "PHP & Laravel", level: 70 },
  { name: "UI Design (Figma)", level: 75 },
  { name: "Git & GitHub", level: 70 },
];

// `key` merujuk ke teks di translations.js (profile.soft1 dst.) supaya
// namanya ikut dua bahasa dan bisa diubah dari /admin/text.
export const softLevels = [
  { key: "profile.soft1", level: 80 },
  { key: "profile.soft2", level: 85 },
  { key: "profile.soft3", level: 80 },
  { key: "profile.soft4", level: 70 },
  { key: "profile.soft5", level: 85 },
];
