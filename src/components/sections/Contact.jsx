import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useCursor } from "../../context/CursorContext";
import { useLanguage } from "../../context/LanguageContext";
import MagneticButton from "../ui/MagneticButton";
import GradientOrb from "../ui/GradientOrb";
import ContactForm from "../contact/ContactForm";
import AccountCard from "../contact/AccountCard";
import { useContent } from "../../context/ContentContext";
import { site } from "../../data/site";

// Jam lokal live, biar terasa ada orang sungguhan di baliknya.
function LiveStatus() {
  const { t } = useLanguage();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: site.timezone,
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
      {t("contact.available")} · {time || "--:--"} {t("contact.localTime")}
    </div>
  );
}

function AccountGroup({ titleKey, descriptionKey, accounts }) {
  const { t } = useLanguage();
  if (!accounts.length) return null;

  return (
    <div data-reveal className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-xl font-medium tracking-tight">
          {t(titleKey)}
        </h3>
        <p className="max-w-[52ch] text-sm leading-relaxed text-[var(--text-muted)]">
          {t(descriptionKey)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {accounts.map((account) => (
          <AccountCard key={account.brand} account={account} />
        ))}
      </div>
    </div>
  );
}

export default function Contact() {
  const containerRef = useScrollReveal({ y: 28, stagger: 0.07 });
  const { links } = useContent();
  const { setCursor, clearCursor } = useCursor();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative overflow-hidden px-6 pb-28 pt-32 sm:px-10 sm:pt-40"
    >
      <GradientOrb className="left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2" />

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-24">
        <header className="flex flex-col items-start gap-8">
          <p data-reveal className="eyebrow">
            {t("contact.label")}
          </p>

          <h1
            data-reveal
            className="font-display max-w-4xl text-4xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            {t("contact.title")}
          </h1>

          <p
            data-reveal
            className="max-w-[56ch] text-base leading-relaxed text-[var(--text-muted)] sm:text-lg"
          >
            {t("contact.description")}
          </p>

          <div data-reveal>
            <LiveStatus />
          </div>
        </header>

        {/* Form di kiri, kontak langsung di kanan. Sebagian orang lebih
            percaya ngirim email sendiri daripada ngisi form, jadi dua-duanya
            disediakan berdampingan, bukan salah satu. */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
          <div data-reveal className="lg:col-span-7">
            <h2 className="font-display mb-8 text-2xl font-medium tracking-tight">
              {t("form.title")}
            </h2>
            <ContactForm />
          </div>

          <div data-reveal className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9">
            <h2 className="font-display text-2xl font-medium tracking-tight">
              {t("contact.directTitle")}
            </h2>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              {t("contact.directBody")}
            </p>

            <MagneticButton
              as="button"
              type="button"
              onClick={handleCopy}
              variant="outline"
              cursorLabel={copied ? "Copied" : "Copy"}
              className="w-fit"
            >
              {site.email}
              {copied ? (
                <Check size={16} strokeWidth={2.4} className="text-[var(--accent-1)]" />
              ) : (
                <Copy size={15} strokeWidth={2.2} className="opacity-70" />
              )}
            </MagneticButton>

            <a
              href={`mailto:${site.email}`}
              onMouseEnter={() => setCursor("Send", "label")}
              onMouseLeave={clearCursor}
              className="focus-ring group inline-flex w-fit items-center gap-1.5 text-sm text-[var(--text-faint)] transition-colors duration-300 hover:text-[var(--accent-1)]"
            >
              {t("contact.openMailApp")}
              <ArrowUpRight
                size={14}
                strokeWidth={2.2}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>

        {/* Dua kelompok akun sengaja dipisah: satu buat ngikutin, satu buat
            transaksi. Orang yang datang buat nge-hire gak perlu nyaring
            akun sosmed dulu. */}
        <div className="flex flex-col gap-16 border-t border-[var(--border)] pt-20">
          <AccountGroup
            titleKey="accounts.hireTitle"
            descriptionKey="accounts.hireDescription"
            accounts={links.hire || []}
          />
          <AccountGroup
            titleKey="accounts.socialTitle"
            descriptionKey="accounts.socialDescription"
            accounts={links.social || []}
          />
        </div>
      </div>

      {/* Dicetak sekali di sini, bukan di tiap AccountCard. */}
      <style>{`
        .account-wash {
          background: var(--brand);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .account-card:hover,
        .account-card:focus-visible {
          border-color: var(--brand);
        }
        .account-card:hover .account-wash,
        .account-card:focus-visible .account-wash {
          /* Sangat tipis — cukup buat ngasih rona, bukan ngeblok teks. */
          opacity: 0.07;
        }
        .account-card:hover .account-icon,
        .account-card:focus-visible .account-icon {
          color: var(--brand);
          border-color: color-mix(in srgb, var(--brand) 45%, transparent);
          box-shadow: 0 0 22px -6px var(--brand);
        }
        .account-card:hover .account-title,
        .account-card:focus-visible .account-title {
          color: var(--brand);
        }
        .account-card:hover .account-arrow,
        .account-card:focus-visible .account-arrow {
          color: var(--brand);
          transform: translate(2px, -2px);
        }
        @media (prefers-reduced-motion: reduce) {
          .account-card:hover .account-arrow,
          .account-card:focus-visible .account-arrow { transform: none; }
        }
      `}</style>
    </section>
  );
}
