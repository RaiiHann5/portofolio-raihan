import { useEffect, useRef, useState } from "react";
import { Mail, ArrowUpRight, Check, Copy } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useCursor } from "../../context/CursorContext";
import MagneticButton from "../ui/MagneticButton";
import GradientOrb from "../ui/GradientOrb";

const EMAIL = "rezkiraihan123@gmail.com";

const socials = [
  { label: "Email", href: `mailto:${EMAIL}`, icon: Mail, value: EMAIL },
  { label: "GitHub", href: "https://github.com/RaiiHann5", icon: GithubIcon, value: "@RaiiHann5" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon, value: "in/raihan" },
];

// Kartu sosial dengan spotlight yang mengikuti kursor
function SocialCard({ label, href, icon: Icon, value, index }) {
  const cardRef = useRef(null);
  const { setCursor, clearCursor } = useCursor();

  const handleMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <a
      ref={cardRef}
      key={label}
      href={href}
      data-reveal
      style={{ transitionDelay: `${index * 70}ms` }}
      onMouseMove={handleMove}
      onMouseEnter={() => setCursor("Open", "label")}
      onMouseLeave={clearCursor}
      className="focus-ring group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-[var(--border)] p-5 transition-colors duration-300 hover:border-[var(--border-strong)]"
    >
      {/* Spotlight layer */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(180px circle at var(--x, 50%) var(--y, 50%), color-mix(in srgb, var(--accent-1) 14%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <Icon
          size={18}
          className="text-[var(--text-faint)] transition-colors duration-300 group-hover:text-[var(--accent-1)]"
        />
        <ArrowUpRight
          size={14}
          strokeWidth={2.2}
          className="text-[var(--text-faint)] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
        />
      </div>

      <div className="relative z-10">
        <p className="text-xs text-[var(--text-faint)]">{label}</p>
        <p className="mt-0.5 text-sm">{value}</p>
      </div>
    </a>
  );
}

// Jam lokal live, biar terasa ada orang sungguhan di baliknya
function LiveStatus() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "Asia/Makassar",
        }).format(new Date())
      );
    update();
    const id = setInterval(update, 1000 * 30);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-[var(--text-faint)]">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-1)] opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent-1)]" />
      </span>
      Available for work · {time || "--:--"} local
    </div>
  );
}

export default function Contact() {
  const containerRef = useScrollReveal({ y: 36 });
  const { setCursor, clearCursor } = useCursor();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative overflow-hidden px-6 py-32 sm:px-10 sm:py-44"
    >
      <GradientOrb className="left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col items-start gap-16">
        <div data-reveal className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-1)]" />
          <span className="eyebrow">06 — Contact</span>
        </div>

        <h2
          data-reveal
          className="font-display max-w-4xl text-4xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl"
        >
          Have a project in mind?
          <br />
          Let's create something{" "}
          <span className="text-gradient">meaningful</span>.
        </h2>

        <div data-reveal className="flex flex-wrap items-center gap-4">
          <MagneticButton
            as="button"
            onClick={handleCopy}
            variant="solid"
            cursorLabel={copied ? "Copied" : "Copy email"}
            className="text-base"
          >
            {EMAIL}
            {copied ? (
              <Check size={18} strokeWidth={2.4} className="text-[var(--accent-1)]" />
            ) : (
              <Copy size={16} strokeWidth={2.2} className="opacity-70 transition-opacity group-hover:opacity-100" />
            )}
          </MagneticButton>

          <a
            href={`mailto:${EMAIL}`}
            onMouseEnter={() => setCursor("Send", "label")}
            onMouseLeave={clearCursor}
            className="focus-ring group flex items-center gap-1.5 text-sm text-[var(--text-faint)] transition-colors duration-300 hover:text-[var(--accent-1)]"
          >
            or open your mail app
            <ArrowUpRight
              size={14}
              strokeWidth={2.2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        <div data-reveal>
          <LiveStatus />
        </div>

        <div className="grid w-full max-w-2xl grid-cols-1 gap-3 border-t border-[var(--border)] pt-10 sm:grid-cols-3">
          {socials.map((social, i) => (
            <SocialCard key={social.label} index={i} {...social} />
          ))}
        </div>
      </div>
    </section>
  );
}