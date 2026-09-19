import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ArrowDownRight, ArrowUpRight, Mail } from "lucide-react";
import MagneticButton from "../ui/MagneticButton";
import InteractiveDotGrid from "../ui/InteractiveDotGrid";
import RoleCycle from "./RoleCycle";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import { useCursor } from "../../context/CursorContext";
import { useLanguage } from "../../context/LanguageContext";
import { site, hasWhatsapp, contactLink } from "../../data/site";

// Instagram sengaja difilter: kalau URL-nya masih kosong di data/site.js,
// ikonnya gak dirender daripada nampilin link mati.
const socialLinks = [
  { label: "GitHub", href: site.socials.github, Icon: GithubIcon },
  { label: "LinkedIn", href: site.socials.linkedin, Icon: LinkedinIcon },
  { label: "Email", href: `mailto:${site.email}`, Icon: Mail },
].filter((link) => Boolean(link.href));

export default function Hero() {
  const rootRef = useRef(null);
  const headlineRef = useRef(null);
  const contentRef = useRef(null);
  const { setCursor, clearCursor } = useCursor();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.set(".hero-line-inner", { yPercent: 110 })
        .set(".hero-fade", { opacity: 0, y: 16 })
        .to(".hero-line-inner", {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.09,
          delay: 0.15,
        })
        .to(
          ".hero-fade",
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
          "-=0.6"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Cursor-reactive headline glow + a very subtle parallax tilt on the
  // content block. Both are driven off the same rAF-throttled mousemove so
  // there's a single source of truth and no layout thrash.
  useEffect(() => {
    const headline = headlineRef.current;
    const content = contentRef.current;
    if (!headline || !content) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    let raf = null;
    let px = 0.5;
    let py = 0.5;

    function onMouseMove(e) {
      const rect = headline.getBoundingClientRect();
      px = (e.clientX - rect.left) / rect.width;
      py = (e.clientY - rect.top) / rect.height;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        headline.style.setProperty("--mx", `${px * 100}%`);
        headline.style.setProperty("--my", `${py * 100}%`);
        const tiltX = (py - 0.5) * -2;
        const tiltY = (px - 0.5) * 2;
        content.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        raf = null;
      });
    }

    function onMouseLeave() {
      content.style.transform = "rotateX(0deg) rotateY(0deg)";
    }

    const section = rootRef.current;
    section?.addEventListener("mousemove", onMouseMove);
    section?.addEventListener("mouseleave", onMouseLeave);
    return () => {
      section?.removeEventListener("mousemove", onMouseMove);
      section?.removeEventListener("mouseleave", onMouseLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 pb-10 pt-32 text-[var(--text)] transition-colors duration-700 sm:px-10 sm:pt-36"
      style={{ perspective: "1200px" }}
    >
      <InteractiveDotGrid />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center transition-transform duration-300 ease-out"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="hero-fade eyebrow mb-8 flex items-center gap-3">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-1)]" />
          <RoleCycle />
        </div>

        <h1
          ref={headlineRef}
          className="hero-headline font-display max-w-5xl text-[13vw] font-medium leading-[0.98] tracking-tight sm:text-[8vw] lg:text-[6.4vw]"
          style={{ "--mx": "50%", "--my": "50%" }}
        >
          <span className="block overflow-hidden">
            <span className="hero-line-inner block">{t("hero.line1")}</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line-inner block">
              {t("hero.line2Pre")}{" "}
              <em
                className="hero-glow-word not-italic"
                onMouseEnter={() => setCursor("Hi", "label")}
                onMouseLeave={clearCursor}
              >
                {t("hero.line2Word")}
              </em>
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line-inner block">{t("hero.line3")}</span>
          </span>
        </h1>

        <div className="hero-fade mt-10 flex max-w-xl flex-col gap-8 sm:mt-12">
          <p className="text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            {t("hero.intro")}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton
              as="button"
              variant="outline"
              cursorLabel="View"
              onClick={() => navigate("/project")}
            >
              {t("hero.ctaWork")}
              <ArrowUpRight size={16} strokeWidth={2.2} />
            </MagneticButton>
            <MagneticButton
              as="button"
              variant="outline"
              cursorLabel="Say hi"
              onClick={() => navigate("/find-me")}
            >
              {t("hero.ctaContact")}
            </MagneticButton>
          </div>

          {/* Jalur kontak langsung. Di situs jasa, satu klik ke chat jauh
              lebih sering dipakai daripada form di halaman terpisah. */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={contactLink(t("process.prefill"))}
              target={hasWhatsapp() ? "_blank" : undefined}
              rel={hasWhatsapp() ? "noopener noreferrer" : undefined}
              onMouseEnter={() => setCursor("Chat", "label")}
              onMouseLeave={clearCursor}
              className="focus-ring group inline-flex items-center gap-2 text-sm text-[var(--text)]"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-1)] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent-1)]" />
              </span>
              <span className="relative">
                {t("hero.openLabel")}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[var(--accent-1)] transition-all duration-300 group-hover:w-full" />
              </span>
            </a>

            <span aria-hidden className="h-4 w-px bg-[var(--border)]" />

            <ul className="flex items-center gap-1">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    onMouseEnter={() => setCursor(label, "label")}
                    onMouseLeave={clearCursor}
                    className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-faint)] transition-colors duration-300 hover:text-[var(--accent-1)]"
                  >
                    <Icon size={17} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="hero-fade relative z-10 mx-auto flex w-full max-w-[1400px] items-end justify-between text-[var(--text-muted)]">
        <div className="flex items-center gap-2 text-sm">
          <span
            className="focus-ring inline-flex cursor-pointer items-center gap-2"
            onMouseEnter={() => setCursor("Scroll", "label")}
            onMouseLeave={clearCursor}
            onClick={() => navigate("/project")}
          >
            {t("hero.scrollHint")}
            <ArrowDownRight size={15} className="animate-bounce" />
          </span>
        </div>
        <p className="hidden font-mono text-xs uppercase tracking-[0.2em] sm:block">
          {t("hero.availability")}
        </p>
      </div>

      <style>{`
        .hero-glow-word {
          position: relative;
          background: radial-gradient(
            160px 90px at var(--mx, 50%) var(--my, 50%),
            color-mix(in srgb, var(--accent-1) 85%, white 15%) 0%,
            var(--accent-1) 55%,
            color-mix(in srgb, var(--accent-1) 70%, white 30%) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        @media (hover: hover) {
          .hero-headline:hover .hero-glow-word {
            filter: drop-shadow(0 0 18px color-mix(in srgb, var(--accent-1) 55%, transparent));
          }
        }
      `}</style>
    </section>
  );
}
