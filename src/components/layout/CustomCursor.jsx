import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useCursor } from "../../context/CursorContext";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const { cursor } = useCursor();

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    function handleMove(e) {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    }

    function handleDown() {
      gsap.to(ring, { scale: 0.85, duration: 0.25, ease: "power2.out" });
    }
    function handleUp() {
      gsap.to(ring, { scale: 1, duration: 0.25, ease: "power2.out" });
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const isLabel = cursor.variant === "label";
    const isView = cursor.variant === "view";
    gsap.to(ring, {
      width: isLabel || isView ? 84 : 38,
      height: isLabel || isView ? 84 : 38,
      marginLeft: isLabel || isView ? -42 : -19,
      marginTop: isLabel || isView ? -42 : -19,
      duration: 0.4,
      ease: "power3.out",
    });
  }, [cursor]);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        {cursor.label}
      </div>
    </>
  );
}
