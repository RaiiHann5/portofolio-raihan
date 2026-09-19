import { marqueeStack } from "../../data/services";
import { brands } from "../../data/brands";
import BrandGlyph from "../ui/BrandGlyph";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

function Item({ name, isDark }) {
  const brand = brands[name];
  // hexDark cuma dipakai buat brand yang warna resminya nyaris hitam,
  // supaya logonya gak hilang ditelan background gelap.
  const color = brand ? (isDark && brand.hexDark ? brand.hexDark : brand.hex) : undefined;

  return (
    <li
      className="marquee-item group flex shrink-0 items-center gap-2.5 px-7"
      style={{ "--brand": color }}
    >
      <BrandGlyph
        name={name}
        size={22}
        className="text-[var(--text-faint)] transition-colors duration-300 group-hover:text-[var(--brand)]"
      />
      <span className="font-mono text-sm tracking-tight text-[var(--text-muted)] transition-colors duration-300 group-hover:text-[var(--text)]">
        {name}
      </span>
    </li>
  );
}

export default function TechMarquee() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <section
      aria-label={t("stack.label")}
      className="marquee-band relative border-y border-[var(--border)] py-6"
    >
      {/* Judulnya tetap ada buat screen reader & mesin pencari; secara
          visual diwakili baris logo yang berjalan di bawah ini. */}
      <h2 className="sr-only">{t("stack.label")}</h2>

      <div className="marquee-viewport relative overflow-hidden">
        {/* Dua salinan identik: begitu salinan pertama habis bergeser,
            salinan kedua sudah persis di posisinya, jadi loop-nya mulus. */}
        <ul className="marquee-track flex w-max items-center">
          {marqueeStack.map((name) => (
            <Item key={name} name={name} isDark={isDark} />
          ))}
        </ul>
        <ul className="marquee-track flex w-max items-center" aria-hidden="true">
          {marqueeStack.map((name) => (
            <Item key={`${name}-dup`} name={name} isDark={isDark} />
          ))}
        </ul>
      </div>

      <style>{`
        .marquee-viewport {
          display: flex;
          /* Ujung kiri-kanan dibuat memudar supaya baris terasa terus
             berjalan keluar layar, bukan terpotong mendadak. */
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
        }
        .marquee-track {
          animation: marquee-scroll 42s linear infinite;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        /* Berhenti pas disentuh biar logonya bisa dibaca & di-hover. */
        .marquee-band:hover .marquee-track,
        .marquee-band:focus-within .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
          .marquee-viewport { overflow-x: auto; }
          .marquee-track[aria-hidden="true"] { display: none; }
        }
      `}</style>
    </section>
  );
}
