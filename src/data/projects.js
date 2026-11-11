import { bi } from "../i18n/localize";
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
      bi("A landing page for a web development agency, showcasing their services, portfolio, and client testimonials.", "Landing page untuk agensi pengembangan web, menampilkan layanan, portofolio, dan testimoni klien mereka."),
    overview:
      bi("Webtera needed a single page that could explain what the team does and turn a visitor into an enquiry without a sales call in between. The page walks through services, past work, and testimonials in the order a prospective client actually asks about them, and keeps a contact route visible the whole way down.", "Webtera butuh satu halaman yang bisa menjelaskan apa yang dikerjakan tim dan mengubah pengunjung jadi calon klien tanpa perlu telepon penjualan di tengahnya. Halamannya menelusuri layanan, karya terdahulu, dan testimoni dengan urutan yang memang ditanyakan calon klien, dan jalur kontak selalu terlihat sepanjang halaman."),
    role: bi("Design & frontend development", "Desain & pengembangan frontend"),
    type: bi("Agency landing page", "Landing page agensi"),
    stack: ["React", "Tailwind CSS"],
    year: "2023",
    demo: "https://raiihann5.github.io/Webtera-/",
    repo: "",
    image: Webtera,
    gallery: [Webtera],
    features: [
      {
        title: bi("Service-first structure", "Struktur berpusat pada layanan"),
        body: bi("Content ordered around what a prospective client wants to know first, rather than around the company's internal structure.", "Konten diurutkan berdasarkan hal yang pertama ingin diketahui calon klien, bukan berdasarkan struktur internal perusahaan."),
      },
      {
        title: bi("Component library", "Pustaka komponen"),
        body: bi("Built with Storybook so each section could be reviewed in isolation before being assembled into the page.", "Dibangun dengan Storybook supaya tiap section bisa ditinjau terpisah sebelum dirakit menjadi halaman."),
      },
      {
        title: bi("Contact always reachable", "Kontak selalu terjangkau"),
        body: bi("A persistent route to the enquiry form, so interest never has to survive a scroll back to the top.", "Jalur tetap menuju formulir pertanyaan, jadi ketertarikan pengunjung tidak perlu bertahan sampai mereka scroll balik ke atas."),
      },
    ],
    gradient: "linear-gradient(135deg, #302014, #0a0a0b)",
  },
  {
    id: "p02",
    slug: "coffee-con",
    title: "Coffee-con",
    description:
      bi("A site for a modern cafe offering an immersive culinary experience built around specialty coffee and artisanal pastries.", "Situs untuk kafe modern yang menawarkan pengalaman kuliner imersif dengan kopi specialty dan pastry artisan."),
    overview:
      bi("A cafe site where the photography does most of the work. The layout stays out of the way of the images, the menu is readable on a phone held in one hand at a table, and the location and hours are reachable within one tap from anywhere on the page.", "Situs kafe di mana fotografi yang paling banyak bekerja. Layout-nya tidak menghalangi gambar, menunya enak dibaca di HP yang dipegang satu tangan di meja, dan lokasi serta jam buka bisa dijangkau dalam satu ketukan dari mana pun di halaman."),
    role: bi("Design & frontend development", "Desain & pengembangan frontend"),
    type: bi("Hospitality website", "Situs hospitality"),
    stack: ["React", "Tailwind CSS", "JavaScript"],
    year: "2026",
    demo: "",
    repo: "",
    image: Coffeecon,
    gallery: [Coffeecon],
    features: [
      {
        title: bi("Menu built for one hand", "Menu untuk satu tangan"),
        body: bi("Type size and tap targets set for reading on a phone at a table, which is where a cafe menu is actually opened.", "Ukuran huruf dan area ketuk diatur untuk dibaca di HP saat duduk di meja, tempat menu kafe sebenarnya dibuka."),
      },
      {
        title: bi("Photography-led layout", "Layout berbasis fotografi"),
        body: bi("Generous image sizing with restrained typography, so the product stays the loudest thing on the page.", "Ukuran gambar yang lega dengan tipografi yang tertahan, jadi produknya tetap jadi hal paling mencolok di halaman."),
      },
      {
        title: bi("Location within reach", "Lokasi mudah dijangkau"),
        body: bi("Hours and directions available from any point on the page rather than buried in a footer.", "Jam buka dan petunjuk arah tersedia dari titik mana pun di halaman, bukan terkubur di footer."),
      },
    ],
    gradient: "linear-gradient(135deg, #143232, #0a0a0b)",
  },
  {
    id: "p03",
    slug: "math-labs",
    title: "Math Labs",
    description:
      bi("A digital education website providing materials, practice exercises, and step-by-step math solutions.", "Situs edukasi digital yang menyediakan materi, latihan soal, dan solusi matematika langkah demi langkah."),
    overview:
      bi("Most math resources show the answer. This one shows the route to it. Worked solutions are broken into steps a student can follow line by line, sitting alongside the reference material and practice sets for the same topic.", "Kebanyakan sumber belajar matematika cuma menampilkan jawaban. Yang ini menampilkan jalan menuju jawabannya. Solusi dipecah jadi langkah-langkah yang bisa diikuti siswa baris demi baris, berdampingan dengan materi acuan dan latihan soal untuk topik yang sama."),
    role: bi("Full-stack development", "Pengembangan full-stack"),
    type: bi("Education platform", "Platform edukasi"),
    stack: ["React", "Tailwind CSS"],
    year: "2023",
    demo: "",
    repo: "",
    image: Mathlabs,
    gallery: [Mathlabs],
    features: [
      {
        title: bi("Step-by-step solutions", "Solusi langkah demi langkah"),
        body: bi("Each answer expands into the working behind it, so a student can find the exact line where their own attempt diverged.", "Tiap jawaban bisa dibuka sampai ke proses di baliknya, jadi siswa bisa menemukan baris tepat di mana jawabannya mulai melenceng."),
      },
      {
        title: bi("Practice alongside theory", "Latihan berdampingan dengan teori"),
        body: bi("Exercises sit next to the material they test, instead of in a separate section that gets skipped.", "Soal latihan diletakkan di samping materi yang diujinya, bukan di bagian terpisah yang akhirnya dilewati."),
      },
      {
        title: bi("Topic-based navigation", "Navigasi berbasis topik"),
        body: bi("Organised by subject rather than by chapter number, so material is findable without knowing the syllabus.", "Disusun per subjek, bukan per nomor bab, jadi materi mudah ditemukan tanpa perlu hafal silabus."),
      },
    ],
    gradient: "linear-gradient(135deg, #302014, #0a0a0b)",
  },
  {
    id: "p04",
    slug: "englishpath",
    title: "EnglishPath",
    description:
      bi("An English learning platform with structured lessons and practice built for self-paced study.", "Platform belajar bahasa Inggris dengan pelajaran terstruktur dan latihan untuk belajar mandiri sesuai kecepatan sendiri."),
    overview:
      bi("A self-study English platform organised around finishing something in one sitting. Lessons are short, practice follows immediately after the material it tests, and progress is visible enough to be worth coming back to.", "Platform belajar bahasa Inggris mandiri yang dirancang supaya sesuatu bisa selesai dalam sekali duduk. Pelajarannya pendek, latihan langsung menyusul setelah materi yang diujinya, dan progres terlihat cukup jelas untuk bikin orang mau kembali lagi."),
    role: bi("Design & frontend development", "Desain & pengembangan frontend"),
    type: bi("Education platform", "Platform edukasi"),
    stack: ["React", "Tailwind CSS", "JavaScript"],
    year: "2025",
    demo: "",
    repo: "",
    image: Englishpath,
    gallery: [Englishpath],
    features: [
      {
        title: bi("Short, finishable lessons", "Pelajaran pendek yang bisa diselesaikan"),
        body: bi("Units sized so a session has a clear end, which is what keeps self-paced study going past week one.", "Unit dibuat sedemikian rupa sehingga satu sesi punya akhir yang jelas, yang bikin belajar mandiri bertahan lewat minggu pertama."),
      },
      {
        title: bi("Practice after each unit", "Latihan setelah tiap unit"),
        body: bi("Exercises placed directly after the material rather than collected into a separate quiz section.", "Soal ditaruh tepat setelah materinya, bukan dikumpulkan di bagian kuis terpisah."),
      },
      {
        title: bi("Visible progress", "Progres terlihat"),
        body: bi("Completion shown per topic, so the next thing to do is never a decision the learner has to make.", "Penyelesaian ditampilkan per topik, jadi langkah berikutnya tidak pernah jadi keputusan yang harus diambil pelajar."),
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