import { getOverrides } from "./overrides";

// Kamus terjemahan manual. Tiap key nge-mapping ke teks EN & ID yang
// ditulis sendiri (bukan hasil mesin), jadi nadanya bisa dijaga tetap
// natural di kedua bahasa. Tambah section baru di sini seiring halaman
// lain di-remake.
export const translations = {
  nav: {
    home: { en: "Home", id: "Beranda" },
    about: { en: "About Me", id: "Tentang Saya" },
    project: { en: "Project", id: "Proyek" },
    marketplace: { en: "Marketplace", id: "Marketplace" },
    findMe: { en: "Find Me", id: "Temui Saya" },
  },
  marketplace: {
    comingSoonTitle: {
      en: "Marketplace is being put together",
      id: "Marketplace-nya lagi disiapin",
    },
    comingSoonBody: {
      en: "This is where I'll list templates, UI kits, and other stuff you can actually buy. Not live yet — check back soon.",
      id: "Di sini nanti ada template, UI kit, dan hal lain yang bisa lo beli. Belum live, balik lagi nanti.",
    },
    label: { en: "Marketplace", id: "Marketplace" },
    title: { en: "Templates, ready to ship.", id: "Template, siap langsung pakai." },
    description: {
      en: "Frontend templates I've built and cleaned up for reuse — grab one and skip the setup work.",
      id: "Template frontend yang udah saya bikin dan rapiin buat dipakai ulang — tinggal ambil, gak perlu mulai dari nol.",
    },
    filterAll: { en: "All", id: "Semua" },
    preview: { en: "Preview", id: "Preview" },
    buyNow: { en: "Buy now", id: "Beli sekarang" },
    empty: {
      en: "No templates in this category yet.",
      id: "Belum ada template di kategori ini.",
    },
    details: { en: "Details", id: "Detail" },
  },
  detail: {
    backToProjects: { en: "All projects", id: "Semua proyek" },
    backToMarketplace: { en: "All templates", id: "Semua template" },
    overview: { en: "Overview", id: "Ringkasan" },
    features: { en: "What's inside", id: "Isinya apa saja" },
    techStack: { en: "Built with", id: "Dibangun dengan" },
    role: { en: "Role", id: "Peran" },
    type: { en: "Type", id: "Jenis" },
    year: { en: "Year", id: "Tahun" },
    liveDemo: { en: "Live demo", id: "Demo langsung" },
    sourceCode: { en: "Source code", id: "Kode sumber" },
    viewCaseStudy: { en: "Read the case study", id: "Baca studi kasusnya" },
    nextProject: { en: "Next project", id: "Proyek berikutnya" },
    includes: { en: "What you get", id: "Yang Anda dapat" },
    pages: { en: "Pages", id: "Halaman" },
    license: { en: "License", id: "Lisensi" },
    notForSaleYet: { en: "Not on sale yet", id: "Belum dijual" },
    screenshot: { en: "Screenshot", id: "Tangkapan layar" },
    expand: { en: "Expand", id: "Perbesar" },
    close: { en: "Close", id: "Tutup" },
    next: { en: "Next image", id: "Gambar berikutnya" },
    previous: { en: "Previous image", id: "Gambar sebelumnya" },
    noImages: { en: "Screenshots coming soon", id: "Tangkapan layar menyusul" },
  },
  contact: {
    label: { en: "Contact", id: "Kontak" },
    title: {
      en: "Have a project in mind? Let's talk about it.",
      id: "Ada proyek yang ingin dikerjakan? Mari kita bicarakan.",
    },
    description: {
      en: "Fill in the form and tell me what you're building, or reach me directly on any of the platforms below. Either way it lands in the same inbox.",
      id: "Isi formulirnya dan ceritakan apa yang sedang Anda bangun, atau hubungi saya langsung lewat platform di bawah. Dua-duanya masuk ke kotak masuk yang sama.",
    },
    available: { en: "Available for work", id: "Terbuka untuk kerja sama" },
    localTime: { en: "local time", id: "waktu setempat" },
    directTitle: { en: "Prefer email?", id: "Lebih suka email?" },
    directBody: {
      en: "Some people would rather write from their own inbox. Copy the address and send it however you like.",
      id: "Sebagian orang lebih nyaman menulis dari email sendiri. Salin alamatnya dan kirim sesuai cara Anda.",
    },
    openMailApp: { en: "or open your mail app", id: "atau buka aplikasi email Anda" },
  },
  form: {
    title: { en: "Send a message", id: "Kirim pesan" },
    name: { en: "Your name", id: "Nama Anda" },
    namePlaceholder: { en: "Budi Santoso", id: "Budi Santoso" },
    email: { en: "Your email", id: "Email Anda" },
    emailPlaceholder: { en: "budi@perusahaan.com", id: "budi@perusahaan.com" },
    message: { en: "What do you need?", id: "Apa yang Anda butuhkan?" },
    messagePlaceholder: {
      en: "A landing page for my catering business, around 5 pages, needed by August.",
      id: "Landing page untuk usaha katering saya, sekitar 5 halaman, dibutuhkan sebelum Agustus.",
    },
    submit: { en: "Send message", id: "Kirim pesan" },
    sending: { en: "Sending", id: "Mengirim" },
    replyNote: {
      en: "Usually answered the same day.",
      id: "Biasanya dibalas di hari yang sama.",
    },
    sentTitle: { en: "Message sent", id: "Pesan terkirim" },
    sentBody: {
      en: "Thanks — it's in my inbox. I'll reply to the email address you gave, usually within a day.",
      id: "Terima kasih — pesannya sudah masuk. Saya akan membalas ke alamat email yang Anda isi, biasanya dalam sehari.",
    },
    mailtoTitle: { en: "Your mail app is opening", id: "Aplikasi email Anda sedang terbuka" },
    mailtoBody: {
      en: "The message has been drafted there with what you typed. Press send in your mail app to finish.",
      id: "Pesannya sudah disiapkan di sana berisi apa yang Anda tulis. Tekan kirim di aplikasi email Anda untuk menyelesaikan.",
    },
    sendAnother: { en: "Write another message", id: "Tulis pesan lagi" },
    errName: { en: "Please enter your name.", id: "Mohon isi nama Anda." },
    errEmailEmpty: {
      en: "Please enter your email so I can reply.",
      id: "Mohon isi email Anda supaya saya bisa membalas.",
    },
    errEmailInvalid: {
      en: "That email address is missing something — check the @ and the domain.",
      id: "Alamat email itu sepertinya kurang lengkap — periksa tanda @ dan domainnya.",
    },
    errMessage: {
      en: "Tell me a little more — at least a sentence.",
      id: "Ceritakan sedikit lebih banyak — minimal satu kalimat.",
    },
    errSend: {
      en: "The message didn't go through. Check your connection and try again, or email me directly.",
      id: "Pesannya gagal terkirim. Periksa koneksi Anda lalu coba lagi, atau kirim email langsung ke saya.",
    },
  },
  accounts: {
    hireTitle: { en: "Hire me here", id: "Nge-hire saya di sini" },
    hireDescription: {
      en: "Platforms where the contract, payment, and delivery are handled for you. Good if you'd rather not work on a handshake.",
      id: "Platform yang mengurus kontrak, pembayaran, dan serah terima untuk Anda. Cocok kalau Anda tidak ingin bekerja hanya berdasar kesepakatan lisan.",
    },
    socialTitle: { en: "Follow along", id: "Ikuti perkembangannya" },
    socialDescription: {
      en: "Where I post work in progress and the things I'm learning.",
      id: "Tempat saya menaruh pekerjaan yang sedang berjalan dan hal-hal yang sedang saya pelajari.",
    },
    noteGithub: { en: "Code and side projects", id: "Kode dan proyek sampingan" },
    noteLinkedin: { en: "Work history and updates", id: "Riwayat kerja dan kabar terbaru" },
    noteInstagram: { en: "Visual work", id: "Karya visual" },
    noteTiktok: { en: "Short build clips", id: "Klip singkat proses ngoding" },
    noteEmail: { en: "Straight to my inbox", id: "Langsung ke kotak masuk saya" },
    noteFiverr: { en: "Fixed-price packages", id: "Paket dengan harga tetap" },
    noteUpwork: { en: "Hourly or contract work", id: "Kerja per jam atau kontrak" },
    noteFastwork: { en: "Local projects, IDR", id: "Proyek lokal, rupiah" },
    noteJobstreet: { en: "Full-time roles", id: "Posisi penuh waktu" },
    noteFreelancer: { en: "Project bidding", id: "Lelang proyek" },
  },
  hero: {
    eyebrow: { en: "Fullstack Developer", id: "Fullstack Developer" },
    role1: { en: "App Developer", id: "App Developer" },
    role2: { en: "Web Developer", id: "Web Developer" },
    role3: { en: "Mobile Developer", id: "Mobile Developer" },
    role4: { en: "Fullstack Developer", id: "Fullstack Developer" },
    line1: { en: "Building digital", id: "Membangun pengalaman" },
    line2Pre: { en: "experiences with", id: "digital dengan" },
    line2Word: { en: "code", id: "kode" },
    line3: { en: "and creativity.", id: "dan kreativitas." },
    intro: {
      en: "I'm Raihan — I build fast, scalable, and accessible web applications that provide seamless user experiences.",
      id: "Saya Raihan — saya bikin web app yang cepat, scalable, dan accessible, dengan pengalaman pengguna yang mulus.",
    },
    ctaWork: { en: "See my work", id: "Lihat karya saya" },
    ctaContact: { en: "Get in touch", id: "Hubungi saya" },
    scrollHint: { en: "Scroll to explore", id: "Scroll untuk jelajahi" },
    availability: {
      en: "Based in Indonesia — Available worldwide, click the grid ✦",
      id: "Berbasis di Indonesia — terbuka kerja sama dari mana saja, klik gridnya ✦",
    },
    ctaHire: { en: "Start a project", id: "Mulai proyek" },
    openLabel: { en: "Open for freelance work", id: "Terbuka untuk proyek freelance" },
    connectLabel: { en: "Find me on", id: "Temui saya di" },
  },
  stack: {
    label: { en: "Tools I work with", id: "Tools yang saya pakai" },
  },
  services: {
    label: { en: "Services", id: "Layanan" },
    title: {
      en: "What I can build for you.",
      id: "Apa yang bisa saya bangun untuk Anda.",
    },
    description: {
      en: "From a single landing page to a full web app. Pick the one closest to your need — or just describe the problem and we'll figure out the scope together.",
      id: "Dari satu halaman landing sampai web app lengkap. Pilih yang paling dekat dengan kebutuhan Anda — atau ceritakan saja masalahnya, scope-nya kita susun bareng.",
    },
    expandHint: { en: "Tap to read more", id: "Ketuk untuk baca detail" },

    landingTitle: { en: "Landing page & company profile", id: "Landing page & company profile" },
    landingLead: {
      en: "One page that explains what you sell and gets people to contact you.",
      id: "Satu halaman yang menjelaskan apa yang Anda jual dan bikin orang menghubungi Anda.",
    },
    landingDetail: {
      en: "Copy structured around what your customer actually wants to know, a layout that holds up on a phone, and contact links that go straight to WhatsApp or your inbox. Ships with proper page titles and meta tags so it shows up correctly when someone shares it.",
      id: "Struktur konten disusun dari apa yang benar-benar ingin diketahui calon pelanggan, layout yang tetap rapi di layar HP, dan tombol kontak yang langsung mengarah ke WhatsApp atau email Anda. Sudah termasuk judul halaman dan meta tag yang benar, jadi tampilannya bagus saat dibagikan.",
    },

    webappTitle: { en: "Web app & admin dashboard", id: "Web app & dashboard admin" },
    webappLead: {
      en: "Something with logins, data, and screens your team uses every day.",
      id: "Aplikasi dengan login, data, dan halaman yang dipakai tim Anda tiap hari.",
    },
    webappDetail: {
      en: "User accounts and roles, forms that validate before they save, tables you can filter and export, and a database designed so the numbers stay correct as the data grows. Built on React with a Laravel or Node backend, whichever fits your team better.",
      id: "Akun pengguna dan pembagian hak akses, form yang divalidasi sebelum tersimpan, tabel yang bisa difilter dan diekspor, serta struktur database yang dirancang supaya angkanya tetap akurat saat datanya membesar. Dibangun dengan React plus backend Laravel atau Node, tergantung mana yang lebih cocok buat tim Anda.",
    },

    mobileTitle: { en: "Mobile app development", id: "Pengembangan aplikasi mobile" },
    mobileLead: {
      en: "One codebase for iOS and Android, or native when it's worth it.",
      id: "Satu basis kode untuk iOS dan Android, atau native kalau memang perlu.",
    },
    mobileDetail: {
      en: "Built with React Native or Flutter so the app ships to both app stores from a single codebase, with Firebase handling auth, push notifications, and realtime data. For apps where native performance matters — heavy animation, camera work, background processing — I build natively in Kotlin or Swift instead.",
      id: "Dibangun dengan React Native atau Flutter supaya aplikasinya rilis ke dua app store sekaligus dari satu basis kode, dengan Firebase yang mengurus autentikasi, notifikasi push, dan data realtime. Untuk aplikasi yang butuh performa native — animasi berat, kerja kamera, proses di background — saya bangun native pakai Kotlin atau Swift.",
    },

    motionTitle: { en: "Interface & motion work", id: "Interface & motion" },
    motionLead: {
      en: "The layer that makes a product feel considered instead of assembled.",
      id: "Lapisan yang bikin produk terasa dipikirkan, bukan sekadar ditempel jadi.",
    },
    motionDetail: {
      en: "Transitions that show what changed, micro-interactions on the parts people touch most, and a small design system — spacing, type scale, colour tokens — so the next screen you add still looks like it belongs.",
      id: "Transisi yang menjelaskan apa yang berubah, interaksi kecil di bagian yang paling sering disentuh, dan design system ringkas — spacing, skala tipografi, token warna — supaya halaman berikutnya yang Anda tambahkan tetap terlihat satu keluarga.",
    },

    rebuildTitle: { en: "Rebuild & speed-up", id: "Rebuild & percepat situs" },
    rebuildLead: {
      en: "You already have a site. It's slow, dated, or breaks on mobile.",
      id: "Situsnya sudah ada. Tapi lambat, ketinggalan zaman, atau berantakan di HP.",
    },
    rebuildDetail: {
      en: "I audit what's there first, then rebuild the parts that are costing you — heavy images, render-blocking scripts, layouts that collapse on small screens, missing keyboard and screen-reader support. You get a before-and-after report, not just a new coat of paint.",
      id: "Saya audit dulu kondisi sekarang, lalu bangun ulang bagian yang merugikan — gambar kegedean, script yang menghambat render, layout yang ambruk di layar kecil, sampai dukungan keyboard dan screen reader yang belum ada. Anda dapat laporan sebelum–sesudah, bukan cuma tampilan baru.",
    },
  },
  work: {
    label: { en: "Selected work", id: "Karya pilihan" },
    title: { en: "Things I've shipped.", id: "Yang sudah saya kerjakan." },
    description: {
      en: "A few recent builds. Hover a title to see it.",
      id: "Beberapa proyek terbaru. Arahkan kursor ke judulnya untuk melihat.",
    },
    viewAll: { en: "See all projects", id: "Lihat semua proyek" },
  },
  process: {
    label: { en: "How it works", id: "Cara kerjanya" },
    title: { en: "Four steps, no surprises.", id: "Empat langkah, tanpa kejutan." },
    description: {
      en: "The same process whether it's a one-page site or a dashboard. You always know what's happening and what it costs before I start.",
      id: "Prosesnya sama, mau situs satu halaman atau dashboard. Anda selalu tahu apa yang sedang dikerjakan dan berapa biayanya sebelum saya mulai.",
    },
    step1Title: { en: "We talk", id: "Kita ngobrol" },
    step1Body: {
      en: "Tell me the problem and who it's for. 20 minutes on a call is usually enough. Free, and you're not committed to anything.",
      id: "Ceritakan masalahnya dan untuk siapa. Biasanya 20 menit ngobrol sudah cukup. Gratis, dan belum terikat apa-apa.",
    },
    step2Title: { en: "Scope & quote", id: "Scope & penawaran" },
    step2Body: {
      en: "You get a written list of what's included, what isn't, a fixed price, and a delivery date. Nothing starts until you agree to it.",
      id: "Anda menerima daftar tertulis: apa yang termasuk, apa yang tidak, harga tetap, dan tanggal selesai. Pengerjaan baru mulai setelah Anda setuju.",
    },
    step3Title: { en: "Build in the open", id: "Dikerjakan terbuka" },
    step3Body: {
      en: "A live preview link from day one, updated as I go. You see progress weekly and can redirect early instead of at the end.",
      id: "Link preview live sejak hari pertama, terus diperbarui. Anda melihat progres tiap minggu dan bisa mengoreksi arah sejak awal, bukan di ujung.",
    },
    step4Title: { en: "Launch & hand over", id: "Rilis & serah terima" },
    step4Body: {
      en: "I deploy it, hand you every account and file, and walk you through editing it yourself. Thirty days of fixes included.",
      id: "Saya deploy, serahkan semua akun dan file, lalu ajari cara mengeditnya sendiri. Termasuk 30 hari perbaikan.",
    },
    ctaTitle: {
      en: "Got something in mind?",
      id: "Ada yang ingin dikerjakan?",
    },
    ctaBody: {
      en: "Send a short description of the project. I usually reply the same day.",
      id: "Kirim deskripsi singkat proyeknya. Biasanya saya balas di hari yang sama.",
    },
    ctaPrimary: { en: "Chat on WhatsApp", id: "Chat WhatsApp" },
    ctaPrimaryFallback: { en: "Email me", id: "Email saya" },
    ctaSecondary: { en: "See contact details", id: "Lihat detail kontak" },
    prefill: {
      en: "Hi Raihan, I'd like to discuss a project.",
      id: "Halo Raihan, saya mau diskusi soal sebuah proyek.",
    },
  },
  footer: {
    tagline: { en: "Building interfaces that feel alive.", id: "Bikin interface yang terasa hidup." },
    navigate: { en: "Pages", id: "Halaman" },
    expertise: { en: "Expertise", id: "Keahlian" },
    tools: { en: "Tools", id: "Tools" },
    connect: { en: "Connect", id: "Terhubung" },
    backToTop: { en: "back to top", id: "kembali ke atas" },
    cta: { en: "Let's build something.", id: "Ayo bangun sesuatu." },
    builtWith: { en: "Built with React, GSAP & Tailwind", id: "Dibuat dengan React, GSAP & Tailwind" },
    expert1: { en: "Web Development", id: "Web Development" },
    expert2: { en: "Mobile App Development", id: "Pengembangan Aplikasi Mobile" },
    expert3: { en: "Fullstack & Backend", id: "Fullstack & Backend" },
    expert4: { en: "UI & Motion Design", id: "UI & Motion Design" },
  },
  about: {
    label: { en: "About", id: "Tentang" },
    title: {
      en: "A fullstack developer who thinks like a designer.",
      id: "Fullstack developer yang mikirnya kayak desainer.",
    },
    bio1: {
      en: "Hey there, I'm Raihan Rezki Ramadhan. What started as a fun experiment with code has grown into a genuine passion for building digital products end to end — web, mobile, and everything that connects them. I specialize in creating experiences for teams who believe that how a product feels is just as important as how it functions under the hood.",
      id: "Halo, saya Raihan Rezki Ramadhan. Awalnya cuma iseng coba-coba coding, lama-lama jadi passion beneran buat bikin produk digital dari ujung ke ujung — web, mobile, dan segala yang menghubungkannya. Saya fokus bikin experience buat tim yang percaya kalau rasa pakai sebuah produk sama pentingnya dengan cara kerjanya di belakang layar.",
    },
    bio2: {
      en: "My current focus spans motion-driven web interfaces and cross-platform mobile apps — the kind of detail that turns a good product into a memorable one, on whatever screen it's opened. When I'm not building, I'm usually reverse-engineering interactions from apps I admire, or sketching new ones of my own.",
      id: "Fokus saya sekarang mencakup interface web yang motion-driven dan aplikasi mobile cross-platform — detail-detail kecil yang bikin produk biasa jadi lebih diingat, di layar manapun dibukanya. Kalau lagi gak ngoding, biasanya saya bongkar-bongkar interaksi dari aplikasi yang saya suka, atau iseng bikin sketsa interaksi baru sendiri.",
    },
    badgeAvailable: { en: "Available for work", id: "Terbuka untuk kerja sama" },
    focus1Title: { en: "User Centric Approach", id: "Pendekatan Berpusat pada User" },
    focus1Body: {
      en: "Developing interfaces where every layout, button, and interaction serves a clear, intuitive purpose for the user.",
      id: "Bikin interface di mana tiap layout, tombol, dan interaksi punya tujuan yang jelas dan intuitif buat user.",
    },
    focus1Detail: {
      en: "Prioritizing clear navigation, readable typography, and logical user journeys that make complex tasks feel effortless.",
      id: "Mengutamakan navigasi yang jelas, tipografi yang gampang dibaca, dan alur user yang logis, biar tugas yang ribet kerasa gampang.",
    },
    focus2Title: { en: "Responsive & Accessible", id: "Responsif & Accessible" },
    focus2Body: {
      en: "Ensuring that every user, regardless of their device or ability, gets a flawless and inclusive web experience.",
      id: "Mastiin setiap user, apapun device atau kondisinya, tetap dapet pengalaman web yang mulus dan inklusif.",
    },
    focus2Detail: {
      en: "Implementing fluid layouts that adapt gracefully to any screen size, alongside strict adherence to WCAG standards and semantic HTML.",
      id: "Pakai layout fluid yang nyesuaiin diri ke ukuran layar apapun, plus disiplin ke standar WCAG dan semantic HTML.",
    },
    focus3Title: { en: "Seamless Integration", id: "Integrasi yang Mulus" },
    focus3Body: {
      en: "Connecting beautiful front-end interfaces with robust back-end systems to create dynamic, data-driven sites.",
      id: "Nyambungin front-end yang enak dilihat dengan sistem back-end yang solid, jadi situsnya dinamis dan data-driven.",
    },
    focus3Detail: {
      en: "Efficiently managing API data fetching and global state to ensure real-time information flows smoothly without breaking the UI.",
      id: "Ngatur fetching data API dan global state secara efisien, biar informasi real-time ngalir mulus tanpa bikin UI berantakan.",
    },
  },
};

/**
 * Ambil teks dari dictionary berdasar path "section.key" dan bahasa aktif.
 *
 * Urutan prioritas:
 *   1. Teks yang ditimpa lewat panel admin (tabel site_text)
 *   2. Kamus statis di file ini
 *   3. Bahasa Inggris sebagai cadangan terakhir
 *
 * Override yang isinya string kosong sengaja diabaikan — admin yang
 * mengosongkan sebuah field berarti ingin kembali ke teks bawaan, bukan
 * ingin menampilkan ruang kosong di halaman.
 */
export function translate(path, lang) {
  const [section, key] = path.split(".");
  const fallback = translations[section]?.[key];

  const override = getOverrides()[path];
  if (override) {
    const value = override[lang] || override.en;
    if (value) return value;
  }

  if (!fallback) return path;
  return fallback[lang] || fallback.en;
}

/** Daftar rata semua key bawaan, dipakai panel admin buat nampilin form. */
export function listTextKeys() {
  const rows = [];
  for (const [section, entries] of Object.entries(translations)) {
    for (const [key, value] of Object.entries(entries)) {
      rows.push({
        path: `${section}.${key}`,
        section,
        key,
        defaultEn: value.en,
        defaultId: value.id,
      });
    }
  }
  return rows;
}
