import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Applies a magnetic pull effect to an element: it nudges toward the
 * cursor while hovered, and springs back to rest on leave.
 * @param {number} strength - 0..1, how much of the offset is applied
 */
export function useMagnetic(strength = 0.35) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(hover: none)").matches) return undefined;

    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });

    function handleMove(e) {
      const rect = el.getBoundingClientRect();
      // rect sudah ikut bergeser oleh efek ini sendiri. Kurangi pergeseran
      // saat ini supaya jarak dihitung dari titik diam tombol; kalau tidak,
      // targetnya terus berubah selagi tombol bergerak dan jadi bergetar.
      const baseX = rect.left + rect.width / 2 - gsap.getProperty(el, "x");
      const baseY = rect.top + rect.height / 2 - gsap.getProperty(el, "y");
      const relX = e.clientX - baseX;
      const relY = e.clientY - baseY;
      xTo(relX * strength);
      yTo(relY * strength);
    }

    function handleLeave() {
      xTo(0);
      yTo(0);
    }

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength]);

  return ref;
}
