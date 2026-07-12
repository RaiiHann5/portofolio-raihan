import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ThemeToggle from "./ThemeToggle";
import { useCursor } from "../../context/CursorContext";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Journey", href: "#journey" },
  { label: "Beyond Code", href: "#beyond-code" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef(null);
  const mobilePanelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#top");
  const { setCursor, clearCursor } = useCursor();

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

  // Scroll-spy: light up the link for whichever section is currently
  // dominating the viewport, so the nav reflects where you actually are.
  useEffect(() => {
    const sectionIds = ["#top", ...links.map((l) => l.href)];
    const sections = sectionIds
      .map((id) => document.querySelector(id))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
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

  function handleNavClick(e, href) {
    e.preventDefault();
    setOpen(false);
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header
      ref={navRef}
      className="nav-glass fixed inset-x-0 top-0 z-50 transition-all duration-500"
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 sm:px-10">
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, "#top")}
          className="focus-ring group flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
          onMouseEnter={() => setCursor("", "default")}
        >
          <span className="nav-logo-star relative flex h-2 w-2 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-1)] opacity-60 group-hover:opacity-90" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent-1)]" />
          </span>
          Raihan
        </a>   

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const isActive = active === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  onMouseEnter={() => setCursor("", "default")}
                  onMouseLeave={clearCursor}
                  aria-current={isActive ? "true" : undefined}
                  className={`nav-link focus-ring relative px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className="nav-link-dot absolute -bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[var(--accent-1)] transition-all duration-300"
                    style={{
                      opacity: isActive ? 1 : 0,
                      boxShadow: isActive
                        ? "0 0 8px 2px var(--accent-1)"
                        : "none",
                    }}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-5 md:flex">
          <ThemeToggle />
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="nav-cta focus-ring rounded-full px-5 py-2 text-sm text-white transition-all"
          >
            Let's talk
          </a>
        </div>

        <div className="flex items-center gap-4 md:hidden">
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
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`focus-ring flex items-center gap-2 py-3 text-lg transition-colors ${
                    active === link.href
                      ? "text-white"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  <span
                    className="h-1 w-1 rounded-full bg-[var(--accent-1)] transition-opacity"
                    style={{ opacity: active === link.href ? 1 : 0 }}
                  />
                  {link.label}
                </a>
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
        .nav-link-dot { }
        .nav-cta {
          background: color-mix(in srgb, var(--accent-1) 18%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent-1) 55%, transparent);
        }
        .nav-cta:hover {
          background: color-mix(in srgb, var(--accent-1) 32%, transparent);
          box-shadow: 0 0 20px -4px var(--accent-1);
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