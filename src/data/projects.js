import Englishpath from "../assets/Englishpath2.png";
import Webtera from "../assets/Webtera.png";
import Mathlabs from "../assets/Mathlabs2.png";
import Coffeecon from "../assets/Coffecon.png";

// ---------------------------------------------------------------------
// CATATAN BUAT DIISI SENDIRI
//
// `gallery` sekarang cuma berisi satu screenshot per proyek, karena memang
// cuma itu yang ada di folder assets. Halaman detail tetap tampil rapi
// dengan satu gambar, tapi bagian ini baru terasa hidup kalau tiap proyek
// punya 3–5 tangkapan layar (halaman utama, satu fitur inti, tampilan HP).
// Tinggal import gambarnya di atas lalu masukkan ke array `gallery`.
//
// `overview` dan `features` disusun dari deskripsi yang sudah ada — periksa
// ulang dan koreksi kalau ada yang tidak sesuai kenyataan proyeknya.
// ---------------------------------------------------------------------

export const projects = [
  {
    id: "p01",
    slug: "webtera-landing-page",
    title: "Webtera Landing Page",
    description:
      "A landing page for a web development agency, showcasing their services, portfolio, and client testimonials.",
    overview:
      "Webtera needed a single page that could explain what the team does and turn a visitor into an enquiry without a sales call in between. The page walks through services, past work, and testimonials in the order a prospective client actually asks about them, and keeps a contact route visible the whole way down.",
    role: "Design & frontend development",
    type: "Agency landing page",
    stack: ["React", "Tailwind CSS", "Storybook"],
    year: "2023",
    demo: "https://raiihann5.github.io/Webtera-/",
    repo: "",
    image: Webtera,
    gallery: [Webtera],
    features: [
      {
        title: "Service-first structure",
        body: "Content ordered around what a prospective client wants to know first, rather than around the company's internal structure.",
      },
      {
        title: "Component library",
        body: "Built with Storybook so each section could be reviewed in isolation before being assembled into the page.",
      },
      {
        title: "Contact always reachable",
        body: "A persistent route to the enquiry form, so interest never has to survive a scroll back to the top.",
      },
    ],
    gradient: "linear-gradient(135deg, #302014, #0a0a0b)",
  },
  {
    id: "p02",
    slug: "coffee-con",
    title: "Coffee-con",
    description:
      "A site for a modern cafe offering an immersive culinary experience built around specialty coffee and artisanal pastries.",
    overview:
      "A cafe site where the photography does most of the work. The layout stays out of the way of the images, the menu is readable on a phone held in one hand at a table, and the location and hours are reachable within one tap from anywhere on the page.",
    role: "Design & frontend development",
    type: "Hospitality website",
    stack: ["React", "Tailwind CSS", "JavaScript"],
    year: "2026",
    demo: "",
    repo: "",
    image: Coffeecon,
    gallery: [Coffeecon],
    features: [
      {
        title: "Menu built for one hand",
        body: "Type size and tap targets set for reading on a phone at a table, which is where a cafe menu is actually opened.",
      },
      {
        title: "Photography-led layout",
        body: "Generous image sizing with restrained typography, so the product stays the loudest thing on the page.",
      },
      {
        title: "Location within reach",
        body: "Hours and directions available from any point on the page rather than buried in a footer.",
      },
    ],
    gradient: "linear-gradient(135deg, #143232, #0a0a0b)",
  },
  {
    id: "p03",
    slug: "math-labs",
    title: "Math Labs",
    description:
      "A digital education website providing materials, practice exercises, and step-by-step math solutions.",
    overview:
      "Most math resources show the answer. This one shows the route to it. Worked solutions are broken into steps a student can follow line by line, sitting alongside the reference material and practice sets for the same topic.",
    role: "Full-stack development",
    type: "Education platform",
    stack: ["React", "Tailwind CSS", "Node.js"],
    year: "2023",
    demo: "",
    repo: "",
    image: Mathlabs,
    gallery: [Mathlabs],
    features: [
      {
        title: "Step-by-step solutions",
        body: "Each answer expands into the working behind it, so a student can find the exact line where their own attempt diverged.",
      },
      {
        title: "Practice alongside theory",
        body: "Exercises sit next to the material they test, instead of in a separate section that gets skipped.",
      },
      {
        title: "Topic-based navigation",
        body: "Organised by subject rather than by chapter number, so material is findable without knowing the syllabus.",
      },
    ],
    gradient: "linear-gradient(135deg, #302014, #0a0a0b)",
  },
  {
    id: "p04",
    slug: "englishpath",
    title: "EnglishPath",
    description:
      "An English learning platform with structured lessons and practice built for self-paced study.",
    overview:
      "A self-study English platform organised around finishing something in one sitting. Lessons are short, practice follows immediately after the material it tests, and progress is visible enough to be worth coming back to.",
    role: "Design & frontend development",
    type: "Education platform",
    stack: ["React", "Tailwind CSS", "JavaScript"],
    year: "2025",
    demo: "",
    repo: "",
    image: Englishpath,
    gallery: [Englishpath],
    features: [
      {
        title: "Short, finishable lessons",
        body: "Units sized so a session has a clear end, which is what keeps self-paced study going past week one.",
      },
      {
        title: "Practice after each unit",
        body: "Exercises placed directly after the material rather than collected into a separate quiz section.",
      },
      {
        title: "Visible progress",
        body: "Completion shown per topic, so the next thing to do is never a decision the learner has to make.",
      },
    ],
    gradient: "linear-gradient(135deg, #1a2e35, #0a0a0b)",
  },
];

/** Cari proyek dari slug di URL. */
export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}

/** Proyek berikutnya, memutar ke awal di ujung daftar. */
export function getNextProject(slug) {
  const i = projects.findIndex((project) => project.slug === slug);
  if (i === -1) return null;
  return projects[(i + 1) % projects.length];
}