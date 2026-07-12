import { useMagnetic } from "../../hooks/useMagnetic";
import { useCursor } from "../../context/CursorContext";

/**
 * A button/link with a magnetic pull effect and optional cursor label.
 * variant: "solid" | "outline" | "ghost"
 */
export default function MagneticButton({
  as = "button",
  variant = "outline",
  className = "",
  cursorLabel,
  children,
  ...props
}) {
  const ref = useMagnetic(0.4);
  const { setCursor, clearCursor } = useCursor();
  const Component = as;

  const base =
    "focus-ring group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-tight transition-colors duration-300";

  const variants = {
    solid:
      "bg-[var(--text)] text-[var(--bg)] hover:opacity-90",
    normal:
      "bg-[var(--text)] text-[var(--text-black)] hover:opacity-90",
    outline:
      "border border-[var(--border-strong)] text-[var(--text)] hover:border-[var(--text)]",
    ghost: "text-[var(--text)] hover:text-[var(--accent-1)]",
  };

  return (
    <Component
      ref={ref}
      className={`${base} ${variants[variant]} ${className}`}
      onMouseEnter={() => cursorLabel && setCursor(cursorLabel, "label")}
      onMouseLeave={() => cursorLabel && clearCursor()}
      {...props}
    >
      {children}
    </Component>
  );
}
