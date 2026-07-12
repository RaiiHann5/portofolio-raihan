import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import MagneticButton from "../ui/MagneticButton";
import InteractiveDotGrid from "../ui/InteractiveDotGrid";
import { useCursor } from "../../context/CursorContext";

export default function Hero() {
  const rootRef = useRef(null);
  const headlineRef = useRef(null);
  const contentRef = useRef(null);
  const { setCursor, clearCursor } = useCursor();

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

  function scrollToWork(e) {
    e.preventDefault();
    document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="top"
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
          Frontend &amp; Creative Developer
        </div>

        <h1
          ref={headlineRef}
          className="hero-headline font-display max-w-5xl text-[13vw] font-medium leading-[0.98] tracking-tight sm:text-[8vw] lg:text-[6.4vw]"
          style={{ "--mx": "50%", "--my": "50%" }}
        >
          <span className="block overflow-hidden">
            <span className="hero-line-inner block">Building digital</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line-inner block">
              experiences with{" "}
              <em
                className="hero-glow-word not-italic"
                onMouseEnter={() => setCursor("Hi", "label")}
                onMouseLeave={clearCursor}
              >
                code
              </em>
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line-inner block">and creativity.</span>
          </span>
        </h1>

        <div className="hero-fade mt-10 flex max-w-xl flex-col gap-8 sm:mt-12">
          <p className="text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            I'm Raihan — I build fast, scalable, and accessible web applications that provide seamless user experiences.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton
              as="a"
              href="#work"
              variant="outline"
              cursorLabel="View"
              onClick={scrollToWork}
            >
              See my work
              <ArrowUpRight size={16} strokeWidth={2.2} />
            </MagneticButton>
            <MagneticButton
              as="a"
              href="#contact"
              variant="outline"
              cursorLabel="Say hi"
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector("#contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get in touch
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="hero-fade relative z-10 mx-auto flex w-full max-w-[1400px] items-end justify-between text-[var(--text-muted)]">
        <div className="flex items-center gap-2 text-sm">
          <span
            className="focus-ring inline-flex cursor-pointer items-center gap-2"
            onMouseEnter={() => setCursor("Scroll", "label")}
            onMouseLeave={clearCursor}
            onClick={scrollToWork}
          >
            Scroll to explore
            <ArrowDownRight size={15} className="animate-bounce" />
          </span>
        </div>
        <p className="hidden font-mono text-xs uppercase tracking-[0.2em] sm:block">
          Based in Indonesia — Available worldwide, click the grid ✦
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