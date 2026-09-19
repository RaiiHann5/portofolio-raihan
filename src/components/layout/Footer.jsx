import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { site } from "../../data/site";
import { marqueeStack } from "../../data/services";
import { useLanguage } from "../../context/LanguageContext";

// Halaman-halaman asli dari router. Sebelumnya di sini masih anchor
// (#work, #about, #contact) sisa versi single-page — semuanya link mati
// begitu situsnya pindah ke react-router.
const pageLinks = [
  { key: "nav.about", to: "/about" },
  { key: "nav.project", to: "/project" },
  { key: "nav.marketplace", to: "/marketplace" },
  { key: "nav.findMe", to: "/find-me" },
];

const expertiseKeys = [
  "footer.expert1",
  "footer.expert2",
  "footer.expert3",
  "footer.expert4",
];

const socials = [
  { label: "GitHub", href: site.socials.github },
  { label: "LinkedIn", href: site.socials.linkedin },
  { label: "Email", href: `mailto:${site.email}` },
].filter((s) => Boolean(s.href));

function DotGrid() {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const spacing = 26;
    const baseRadius = 2;
    const maxRadius = 5;
    const influenceRadius = 140;

    let dots = [];
    let mouse = { x: -9999, y: -9999 };
    let frameId;

    // --foreground gak pernah didefinisikan di index.css, jadi titiknya
    // selalu jatuh ke abu-abu hardcoded dan gak ikut ganti pas light mode.
    const rootStyles = getComputedStyle(document.documentElement);
    const dotColor =
      rootStyles.getPropertyValue("--text-faint").trim() || "#888888";

    function buildDots(width, height) {
      dots = [];
      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          dots.push({ x, y });
        }
      }
    }

    function resize() {
      const rect = wrapper.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots(rect.width, rect.height);
    }

    function draw() {
      const rect = wrapper.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (const dot of dots) {
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const t = Math.max(0, 1 - dist / influenceRadius);
        const radius = baseRadius + (maxRadius - baseRadius) * t;
        const opacity = 0.45 + 0.55 * t;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.globalAlpha = opacity;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frameId = requestAnimationFrame(draw);
    }

    function handleMouseMove(e) {
      const rect = wrapper.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function handleMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    draw();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="absolute inset-0 h-full w-full">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  );
}

export default function Footer() {
  const [hovered, setHovered] = useState(null);
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)] px-6 py-16 sm:px-10 sm:py-24">
      <DotGrid />

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-2">
            <p className="font-display text-2xl font-medium tracking-tight">
              {site.shortName}
            </p>
            <p className="max-w-[30ch] text-sm leading-relaxed text-[var(--text-muted)]">
              {t("footer.tagline")}
            </p>
            <p className="mt-2 font-mono text-xs text-[var(--text-faint)]">
              {site.location}
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="eyebrow mb-1 text-[var(--text-faint)]">
              {t("footer.navigate")}
            </p>
            {pageLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group relative w-fit text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
              >
                <span>{t(link.key)}</span>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Dua kolom di bawah ini bukan navigasi — isinya teks biasa yang
              bikin keahlian & tools kebaca mesin pencari tanpa harus klik
              ke halaman lain dulu. */}
          <div className="flex flex-col gap-3">
            <p className="eyebrow mb-1 text-[var(--text-faint)]">
              {t("footer.expertise")}
            </p>
            <ul className="flex flex-col gap-3">
              {expertiseKeys.map((key) => (
                <li key={key} className="text-sm text-[var(--text-muted)]">
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <p className="eyebrow mb-1 text-[var(--text-faint)]">
              {t("footer.tools")}
            </p>
            <ul className="flex flex-col gap-3">
              {marqueeStack.slice(0, 6).map((tool) => (
                <li key={tool} className="text-sm text-[var(--text-muted)]">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-6 border-t border-[var(--border)] pt-8">
          <p className="eyebrow text-[var(--text-faint)]">
            {t("footer.connect")}
          </p>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHovered(s.label)}
              onMouseLeave={() => setHovered(null)}
              className="group flex w-fit items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              <span>{s.label}</span>
              <span
                aria-hidden
                className={
                  hovered === s.label
                    ? "inline-flex translate-x-0 opacity-100 transition-all duration-300"
                    : "inline-flex -translate-x-1 opacity-0 transition-all duration-300"
                }
              >
                <ArrowUpRight size={14} strokeWidth={2.2} />
              </span>
            </a>
          ))}
        </nav>

        <button
          onClick={scrollToTop}
          className="focus-ring group relative w-full overflow-hidden border-t border-[var(--border)] py-8 text-left"
        >
          <span className="font-display block text-[12vw] font-medium leading-none tracking-tighter transition-transform duration-500 group-hover:-translate-y-1 sm:text-[6vw]">
            {t("footer.cta")}
          </span>
          <span className="eyebrow absolute right-0 top-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {t("footer.backToTop")}
          </span>
        </button>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
          <p className="eyebrow">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="eyebrow">{t("footer.builtWith")}</p>
        </div>
      </div>
    </footer>
  );
}
