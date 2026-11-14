import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, FileText, Briefcase, Award, Quote, BookOpen, MessageSquareHeart } from "lucide-react";
import gsap from "gsap";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useCursor } from "../../context/CursorContext";
import { useLanguage } from "../../context/LanguageContext";

const links = [
  { key: "nav.home", to: "/" },
  { key: "nav.about", to: "/about" },
  { key: "nav.project", to: "/project" },
  { key: "nav.marketplace", to: "/marketplace" },
  { key: "nav.findMe", to: "/find-me" },
];

// Isi dropdown "Lainnya". Menambah halaman baru cukup menambah satu baris di sini.
const moreGroups = [
  {
    key: "more.groupProfile",
    items: [
      { key: "more.cv", to: "/cv", Icon: FileText },
      { key: "more.experience", to: "/pengalaman", Icon: Briefcase },
      { key: "more.certificates", to: "/sertifikat", Icon: Award },
    ],
  },
  {
    key: "more.groupInteract",
    items: [
      { key: "more.testimonials", to: "/testimoni", Icon: Quote },
      { key: "more.blog", to: "/blog", Icon: BookOpen },
      { key: "more.feedback", to: "/kesan-pesan", Icon: MessageSquareHeart },
    ],
  },
];
const moreItems = moreGroups.flatMap((g) => g.items);

function MoreMenu({ t, setCursor, clearCursor }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const closeTimer = useRef(null);
  const { pathname } = useLocation();
  const active = moreItems.some(
    (i) => pathname === i.to || pathname.startsWith(`${i.to}/`)
  );

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    function onDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openNow() {
    clearTimeout(closeTimer.current);
    setOpen(true);
  }
  // Jeda singkat supaya menu tidak menutup saat kursor melintasi celah kecil.
  function closeSoon() {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        setCursor("", "default");
        openNow();
      }}
      onMouseLeave={() => {
        clearCursor();
        closeSoon();
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`nav-link focus-ring relative inline-flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
          active || open ? "text-white" : "text-[var(--text-muted)] hover:text-white"
        }`}
      >
        {t("more.menu")}
        <ChevronDown
          size={14}
          className="transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        />
        <span
          className="absolute -bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[var(--accent-1)] transition-all duration-300"
          style={{
            opacity: active ? 1 : 0,
            boxShadow: active ? "0 0 8px 2px var(--accent-1)" : "none",
          }}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="nav-more-panel absolute right-0 top-full z-50 mt-3 w-[min(22rem,90vw)] rounded-2xl border border-[var(--border)] p-3"
        >
          {moreGroups.map((group) => (
            <div key={group.key} className="py-1">
              <p className="eyebrow px-3 pb-1 pt-2 text-[var(--text-faint)]">{t(group.key)}</p>
              {group.items.map(({ key, to, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  role="menuitem"
                  className={({ isActive }) =>
                    `focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-[var(--surface-2)] ${
                      isActive ? "text-white" : "text-[var(--text-muted)] hover:text-white"
                    }`
                  }
                >
                  <Icon size={16} className="text-[var(--accent-1)]" />
                  {t(key)}
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const navRef = useRef(null);
  const mobilePanelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { setCursor, clearCursor } = useCursor();
  const { t } = useLanguage();

  useEffect(() => {
    const el = navRef.current;

    function onScroll() {
      const y = window.scrollY;
      el.classList.toggle("nav-scrolled", y > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  useEffect(() => {
    const panel = mobilePanelRef.current;
    if (!panel) return;
    if (open) {
      gsap.fromTo(
        panel,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.45, ease: "power3.out" }
      );
    }
  }, [open]);

  function navLinkClass({ isActive }) {
    return `nav-link focus-ring relative px-3 py-2 text-sm transition-colors ${
      isActive ? "text-white" : "text-[var(--text-muted)] hover:text-white"
    }`;
  }

  return (
    <header
      ref={navRef}
      className="nav-glass fixed inset-x-0 top-0 z-50 transition-all duration-500"
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 sm:px-10">
        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          className="focus-ring group flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
          onMouseEnter={() => setCursor("", "default")}
        >
          <span className="nav-logo-star relative flex h-2 w-2 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-1)] opacity-60 group-hover:opacity-90" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent-1)]" />
          </span>
          Raihan
        </NavLink>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                onMouseEnter={() => setCursor("", "default")}
                onMouseLeave={clearCursor}
                className={navLinkClass}
              >
                {({ isActive }) => (
                  <>
                    {t(link.key)}
                    <span
                      className="nav-link-dot absolute -bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[var(--accent-1)] transition-all duration-300"
                      style={{
                        opacity: isActive ? 1 : 0,
                        boxShadow: isActive ? "0 0 8px 2px var(--accent-1)" : "none",
                      }}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
          <li>
            <MoreMenu t={t} setCursor={setCursor} clearCursor={clearCursor} />
          </li>
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? t("a11y.closeMenu") : t("a11y.openMenu")}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="focus-ring flex h-9 w-9 flex-col items-center justify-center gap-1.5"
          >
            <span
              className="block h-px w-5 bg-white transition-transform duration-300"
              style={{
                transform: open ? "translateY(3.5px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block h-px w-5 bg-white transition-transform duration-300"
              style={{
                transform: open ? "translateY(-3.5px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {open && (
        <div
          ref={mobilePanelRef}
          className="nav-mobile-panel overflow-hidden px-6 pb-8 pt-2 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `focus-ring flex items-center gap-2 py-3 text-lg transition-colors ${
                      isActive ? "text-white" : "text-[var(--text-muted)] hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className="h-1 w-1 rounded-full bg-[var(--accent-1)] transition-opacity"
                        style={{ opacity: isActive ? 1 : 0 }}
                      />
                      {t(link.key)}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                type="button"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((o) => !o)}
                className="focus-ring flex w-full items-center gap-2 py-3 text-lg text-[var(--text-muted)] transition-colors hover:text-white"
              >
                <span className="h-1 w-1" />
                {t("more.menu")}
                <ChevronDown
                  size={18}
                  className="transition-transform duration-300"
                  style={{ transform: moreOpen ? "rotate(180deg)" : "none" }}
                />
              </button>
              {moreOpen && (
                <div className="mb-2 ml-3 flex flex-col gap-1 border-l border-[var(--border)] pl-4">
                  {moreGroups.map((group) => (
                    <div key={group.key} className="py-1">
                      <p className="eyebrow pb-1 pt-2 text-[var(--text-faint)]">{t(group.key)}</p>
                      {group.items.map(({ key, to, Icon }) => (
                        <NavLink
                          key={to}
                          to={to}
                          onClick={() => {
                            setOpen(false);
                            setMoreOpen(false);
                          }}
                          className={({ isActive }) =>
                            `focus-ring flex items-center gap-3 py-2.5 text-base transition-colors ${
                              isActive ? "text-white" : "text-[var(--text-muted)] hover:text-white"
                            }`
                          }
                        >
                          <Icon size={16} className="text-[var(--accent-1)]" />
                          {t(key)}
                        </NavLink>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </div>
      )}

      <style>{`
        /* Background navbar selalu gelap di dua mode, jadi semua teks di dalamnya
           dipaksa putih. Variabel tema ditimpa di sini supaya logo, link,
           tombol tema/bahasa, dropdown, dan menu HP ikut terang di light mode. */
        .nav-glass {
          --text: #ffffff;
          --text-muted: rgba(255, 255, 255, 0.74);
          --text-faint: rgba(255, 255, 255, 0.5);
          --border: rgba(255, 255, 255, 0.14);
          --border-strong: rgba(255, 255, 255, 0.28);
          --surface-2: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          background: color-mix(in srgb, #05060f 45%, transparent);
          backdrop-filter: blur(18px) saturate(140%);
          -webkit-backdrop-filter: blur(18px) saturate(140%);
          border-bottom: 1px solid transparent;
        }
        .nav-glass::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.06) 0%,
            rgba(255, 255, 255, 0) 100%
          );
        }
        .nav-glass.nav-scrolled {
          background: color-mix(in srgb, #05060f 68%, transparent);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px -12px rgba(0, 0, 0, 0.6);
        }
        .nav-more-panel {
          background: color-mix(in srgb, #05060f 92%, transparent);
          backdrop-filter: blur(18px) saturate(140%);
          -webkit-backdrop-filter: blur(18px) saturate(140%);
          box-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.7);
        }
        .nav-mobile-panel {
          background: color-mix(in srgb, #05060f 70%, transparent);
          backdrop-filter: blur(18px) saturate(140%);
          -webkit-backdrop-filter: blur(18px) saturate(140%);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-logo-star .animate-ping { animation: none; }
        }
      `}</style>
    </header>
  );
}
