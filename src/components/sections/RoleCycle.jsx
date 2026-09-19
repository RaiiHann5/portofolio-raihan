import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

// Empat identitas yang sama-sama benar untuk fullstack developer, jadi
// dirotasi daripada dipaksa jadi satu label. Diam di kata terakhir
// ("Fullstack Developer") sedikit lebih lama sebelum berputar lagi,
// karena itu ringkasan dari tiga yang sebelumnya.
const ROLE_KEYS = ["hero.role1", "hero.role2", "hero.role3", "hero.role4"];
const HOLD_MS = 2200;
const HOLD_LAST_MS = 3200;

export default function RoleCycle() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    function schedule() {
      const hold = index === ROLE_KEYS.length - 1 ? HOLD_LAST_MS : HOLD_MS;
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        // Tunggu transisi fade-out selesai (200ms) baru ganti kata dan
        // fade-in lagi — kalau teksnya diganti duluan, kata baru muncul
        // mendadak di tengah animasi keluar.
        setTimeout(() => {
          setIndex((i) => (i + 1) % ROLE_KEYS.length);
          setVisible(true);
        }, 200);
      }, hold);
    }

    schedule();
    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  return (
    <span
      className="inline-block min-w-[9ch] transition-all duration-200 ease-out"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-4px)" }}
    >
      {t(ROLE_KEYS[index])}
    </span>
  );
}
