import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

/**
 * Animasi ganti halaman: konten baru masuk dengan fade + geser tipis setiap
 * kali alamat berubah. Pindah antar halaman admin tidak dianimasikan supaya
 * panel terasa cepat.
 */
export default function PageTransition({ children }) {
  const ref = useRef(null);
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (pathname.startsWith("/admin")) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        // Transform dilepas supaya elemen `position: fixed` / sticky di
        // dalam halaman tidak terjebak di dalam konteks transform.
        clearProps: "transform,opacity",
      }
    );
    return () => tween.kill();
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
