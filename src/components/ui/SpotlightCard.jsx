import { useRef } from "react";

/**
 * Kartu dengan cahaya lembut yang mengikuti kursor. Posisi cahaya ditulis
 * langsung ke CSS variable (tanpa render ulang), jadi ringan. Di layar
 * sentuh tidak ada hover, jadi efeknya otomatis tidak muncul.
 */
export default function SpotlightCard({ as: Tag = "div", className = "", style, children, ...props }) {
  const ref = useRef(null);

  function handleMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMove}
      className={`group/spot relative isolate overflow-hidden ${className}`}
      style={style}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, var(--accent-1) 14%, transparent), transparent 70%)",
        }}
      />
      {children}
    </Tag>
  );
}
