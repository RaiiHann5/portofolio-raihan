import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
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

export default function Navbar() {
  const navRef = useRef(null);
  const mobilePanelRef = useRef(null);
  const [open, setOpen] = useState(false);
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
            aria-label={open ? "Close menu" : "Open menu"}
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
          </ul>
        </div>
      )}

      <style>{`
        .nav-glass {
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
