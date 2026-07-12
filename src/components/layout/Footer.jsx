import { useEffect, useRef, useState } from "react";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { label: "GitHub", href: "https://github.com/RaiiHann5" },
  { label: "LinkedIn", href: "https://linkedin.com/in/raihan" },
  { label: "Email", href: "mailto:rezkiraihan123@gmail.com" },
];

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

    const rootStyles = getComputedStyle(document.documentElement);
    const dotColor = rootStyles.getPropertyValue("--foreground").trim() || "#888888";

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)] px-6 py-16 sm:px-10 sm:py-24">
      <DotGrid />

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          <div className="flex flex-col gap-4">
            <p className="text-2xl font-medium tracking-tight"> Raihan </p>
            <p className="eyebrow max-w-[28ch] text-[var(--border)]">
              Building interfaces that feel alive.
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="eyebrow mb-1 opacity-60">Navigate</p>
            {links.map((link) => (
              <a key={link.label} href={link.href} className="group relative w-fit text-sm">
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <nav className="flex flex-col gap-3">
            <p className="eyebrow mb-1 opacity-60">Connect</p>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHovered(s.label)}
                onMouseLeave={() => setHovered(null)}
                className="group flex w-fit items-center gap-2 text-sm"
              >
                <span>{s.label}</span>
                <span
                  className={
                    hovered === s.label
                      ? "translate-x-0 opacity-100 transition-all duration-300"
                      : "-translate-x-1 opacity-0 transition-all duration-300"
                  }
                >
                  {"->"}
                </span>
              </a>
            ))}
          </nav>
        </div>

        <button
          onClick={scrollToTop}
          className="group relative w-full overflow-hidden border-t border-[var(--border)] py-8 text-left"
        >
          <span className="block text-[12vw] font-medium leading-none tracking-tighter transition-transform duration-500 group-hover:-translate-y-1 sm:text-[6vw]">
            Let's build something.
          </span>
          <span className="eyebrow absolute right-0 top-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            back to top
          </span>
        </button>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
          <p className="eyebrow">© {new Date().getFullYear()} Raihan Rezki Ramadhan</p>
          <p className="eyebrow">Built with React, GSAP &amp; Tailwind</p>
        </div>
      </div>
    </footer>
  );
}