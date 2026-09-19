// Layanan yang ditawarkan di halaman Home. Teksnya sengaja disimpan
// sebagai key i18n (lihat src/i18n/translations.js -> section "services")
// biar tetap dwibahasa. Stack-nya diambil dari nama yang sama persis
// dengan SKILL_COLORS di data/skills.js supaya warnanya kebaca.
export const services = [
  {
    id: "landing",
    titleKey: "services.landingTitle",
    leadKey: "services.landingLead",
    detailKey: "services.landingDetail",
    stack: ["React", "Tailwind CSS", "JavaScript"],
  },
  {
    id: "webapp",
    titleKey: "services.webappTitle",
    leadKey: "services.webappLead",
    detailKey: "services.webappDetail",
    stack: ["React", "Laravel", "Node.js", "PostgreSQL", "Supabase"],
  },
  {
    id: "mobile",
    titleKey: "services.mobileTitle",
    leadKey: "services.mobileLead",
    detailKey: "services.mobileDetail",
    stack: ["React Native", "Flutter", "Firebase"],
  },
  {
    id: "motion",
    titleKey: "services.motionTitle",
    leadKey: "services.motionLead",
    detailKey: "services.motionDetail",
    stack: ["React", "Figma", "Framer"],
  },
  {
    id: "rebuild",
    titleKey: "services.rebuildTitle",
    leadKey: "services.rebuildLead",
    detailKey: "services.rebuildDetail",
    stack: ["React", "Tailwind CSS", "PHP"],
  },
];

// Dipakai di TechMarquee. Urutannya diacak manual biar gak kebaca
// dikelompokkan per kategori pas jalan.
export const marqueeStack = [
  "React",
  "React Native",
  "Tailwind CSS",
  "Flutter",
  "Laravel",
  "Figma",
  "Node.js",
  "Kotlin",
  "PostgreSQL",
  "JavaScript",
  "Supabase",
  "Swift",
  "PHP",
  "Firebase",
  "Git",
  "MongoDB",
  "Framer",
];

// Tahapan kerja. Ini memang urutan, jadi penomoran 01–04 relevan.
export const processSteps = [
  { id: "talk", titleKey: "process.step1Title", bodyKey: "process.step1Body" },
  { id: "scope", titleKey: "process.step2Title", bodyKey: "process.step2Body" },
  { id: "build", titleKey: "process.step3Title", bodyKey: "process.step3Body" },
  { id: "launch", titleKey: "process.step4Title", bodyKey: "process.step4Body" },
];
