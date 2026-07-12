import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * A soft, slow-drifting gradient orb that reacts subtly to pointer
 * position. Kept intentionally faint — ambient atmosphere, not decoration.
 */
export default function GradientOrb({ className = "" }) {
  const orbRef = useRef(null);

  useEffect(() => {
    const el = orbRef.current;
    if (!el || window.matchMedia("(hover: none)").matches) return undefined;

    const xTo = gsap.quickTo(el, "x", { duration: 1.6, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 1.6, ease: "power2.out" });

    function handleMove(e) {
      const relX = (e.clientX / window.innerWidth - 0.5) * 60;
      const relY = (e.clientY / window.innerHeight - 0.5) * 60;
      xTo(relX);
      yTo(relY);
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={orbRef}
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{
        background:
          "radial-gradient(circle at 30% 30%, var(--accent-1), transparent 60%), radial-gradient(circle at 70% 70%, var(--accent-2), transparent 60%)",
        opacity: 0.22,
      }}
    />
  );
}
