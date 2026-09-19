import { ArrowUpRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useCursor } from "../../context/CursorContext";
import { useLanguage } from "../../context/LanguageContext";

// Style-nya ditaruh sekali di Contact.jsx, bukan di tiap kartu, supaya
// blok CSS yang sama gak dicetak belasan kali di DOM.

/**
 * Kartu akun yang diam-diam monokrom, lalu "menyala" dengan warna resmi
 * brand-nya pas di-hover atau di-fokus keyboard.
 *
 * Semua warna dialirkan lewat satu custom property `--brand`, jadi yang
 * berubah cuma satu nilai — border, logo, teks, dan glow ikut sendiri.
 *
 * Ikonnya datang bersama datanya (path SVG + warna), bukan dicari dari
 * daftar brand yang di-hardcode. Itu yang bikin brand baru yang ditambah
 * lewat panel admin langsung tampil benar tanpa perlu ubah kode.
 */
export default function AccountCard({ account }) {
  const { brand: brandName, handle, note, noteKey, url, icon } = account;
  const { theme } = useTheme();
  const { setCursor, clearCursor } = useCursor();
  const { t } = useLanguage();

  const isDark = theme !== "light";
  const color = icon
    ? (isDark && icon.hexDark ? icon.hexDark : icon.hex) || "var(--text)"
    : "var(--text)";
  const isExternal = !url.startsWith("mailto:");

  // Baris kedua: handle kalau ada, kalau tidak keterangan. Keterangan bisa
  // datang sebagai teks jadi (dari database) atau key i18n (data bawaan).
  const subtitle = handle || note || (noteKey ? t(noteKey) : "");

  return (
    <a
      href={url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setCursor("Open", "label")}
      onMouseLeave={clearCursor}
      style={{ "--brand": color }}
      className="account-card focus-ring group relative flex items-center gap-4 overflow-hidden rounded-xl border border-[var(--border)] p-4 transition-colors duration-300"
    >
      {/* Lapisan warna brand yang cuma muncul saat hover. Dipisah jadi
          elemen sendiri supaya opacity-nya bisa dianimasikan tanpa ikut
          memudarkan teks di atasnya. */}
      <span aria-hidden className="account-wash pointer-events-none absolute inset-0" />

      <span className="account-icon relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-faint)] transition-colors duration-300">
        {icon?.path ? (
          <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d={icon.path} />
          </svg>
        ) : (
          <span aria-hidden className="font-mono text-xs">
            {(icon?.monogram || brandName.slice(0, 2)).toUpperCase()}
          </span>
        )}
      </span>

      <span className="relative z-10 min-w-0 flex-1">
        <span className="account-title block text-sm font-medium transition-colors duration-300">
          {icon?.title || brandName}
        </span>
        {subtitle && (
          <span className="mt-0.5 block truncate font-mono text-xs text-[var(--text-faint)]">
            {subtitle}
          </span>
        )}
      </span>

      <ArrowUpRight
        size={16}
        strokeWidth={2}
        aria-hidden
        className="account-arrow relative z-10 shrink-0 text-[var(--text-faint)] transition-all duration-300"
      />
    </a>
  );
}
