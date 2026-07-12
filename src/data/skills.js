// Tiap skill punya warna brand-nya sendiri, dipakai buat glow/border pas hover.
// Skill dengan array warna (Figma, Canva) = ikonnya emang multicolor,
// dipakai buat efek conic-gradient dot di pill.
export const SKILL_COLORS = {
  React: ["#00C4CC", "#1B4EF5"],
  JavaScript: ["#FBC02D", "#FF8F00"],
  CSS3: ["#2C5EAD", "#1591DC"],
  "Tailwind CSS": ["#792CA2", "#1B4EF5"],
  "MySql": ["#00758F", "#F29111"],
  "MongoDB": ["#328E6E", "#67AE6E"],
  "PostgreSQL": ["#336791", "#4DB6AC"],
  "Figma": ["#F24E1E", "#FF7262", "#A259FF", "#1ABCFE", "#0ACF83"],
  "Canva": ["#00C4CC", "#7D2AE8"],
  "ChatGPT": ["#2E4540", "#0B0909"],
  "Claude": ["#FF9A00", "#FF6B35"],
  "Git": ["#F05033"],
  "VS Code": ["#2C5EAD", "#1591DC"],
  "Node.js": ["#22C55E", "#15803D"],
  "Supabase": ["#3ECF8E", "#249361"],
  "DeepSeek": ["#61DAFB", "#3B82F6"],
  "Perplexity": ["#1B3C53", "#061E29"],
  "PHP": ["#4647AE", "#8494FF"],
  "Laravel": ["#D6336C", "#D62828"],
  "Framer": ["#1A05A2", "#8F0177"],
  "CorelDRAW": ["#F15A24", "#FBB03B"],
  "XAMPP": ["#FF6C37", "#FF9E3D"],
  "Laragon": ["#1E90FF", "#00CED1"],
  "Github": ["#4E56C0", "#9B5DE0"],
};

// Fallback kalau ada skill baru yang belum didaftarin di atas
export const DEFAULT_SKILL_COLOR = "#8B8B8B";

export const skillGroups = [
  {
    label: "Frontend",
    note: "Core craft",
    skills: ["React", "JavaScript", "CSS3", "Tailwind CSS"],
  },
  {
    label: "Database",
    note: "Motion & feel",
    skills: ["MySql", "MongoDB", "PostgreSQL", "Supabase"],
  },
  {
    label: "AI Tools",
    note: "Depth & dimension",
    skills: ["ChatGPT", "Claude", "DeepSeek", "Perplexity"],
  },
  {
    label: "Backend",
    note: "Server & data",
    skills: ["Node.js","PHP", "Laravel","MongoDB"],
  },
  {
    label: "Design",
    note: "Visual & prototyping",
    skills: ["Figma", "Canva","Framer","CorelDRAW"],
  },
  {
    label: "Tools",
    note: "Daily drivers",
    skills: ["Git", "VS Code","Github", "XAMPP", "Laragon"],
  },
];