import { SKILL_COLORS, DEFAULT_SKILL_COLOR } from "../../data/skills";

function resolveColor(name) {
  const color = SKILL_COLORS[name] || DEFAULT_SKILL_COLOR;
  if (Array.isArray(color)) {
    return {
      isMulti: true,
      solid: color[0],
      background: `conic-gradient(from 90deg, ${color.join(", ")}, ${color[0]})`,
    };
  }
  return { isMulti: false, solid: color, background: color };
}

// Nentuin warna teks (hitam/putih) otomatis berdasarkan kecerahan warna background,
// biar tulisan selalu kebaca jelas walau warnanya terang (kuning) atau gelap.
function getTextColor(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#0A0A0A" : "#FFFFFF";
}

export default function SkillPill({ name }) {
  const { isMulti, solid, background } = resolveColor(name);
  const textColor = isMulti ? "#FFFFFF" : getTextColor(solid);

  return (
    <span
      className="group/pill relative inline-flex cursor-default items-center overflow-hidden rounded-full px-4 py-2 text-sm font-medium tracking-tight transition-all duration-300 ease-out"
      style={{
        background,
        color: textColor,
        boxShadow: `0 1px 2px ${solid}30`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px) scale(1.06)";
        e.currentTarget.style.boxShadow = `0 10px 24px -4px ${solid}70, 0 0 0 1px ${solid}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = `0 1px 2px ${solid}30`;
      }}
    >
      {/* Kilau/shine yang nyapu dari kiri ke kanan pas hover */}
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/25 transition-transform duration-700 ease-out group-hover/pill:translate-x-full"
        style={{ width: "40%" }}
      />

      {/* Dot conic muter khusus buat Figma, biar multicolor-nya tetap kebaca sebagai gerakan, bukan cuma gradient statis */}
      {isMulti && (
        <span
          className="relative mr-2 h-2 w-2 shrink-0 rounded-full"
          style={{ background: "#FFFFFF", opacity: 0.9 }}
        />
      )}

      <span className="relative">{name}</span>
    </span>
  );
}