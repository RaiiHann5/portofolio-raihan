import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveals children of the ref'd container with a stagger as they enter
 * the viewport. Pass a selector for the items to animate; defaults to
 * direct children marked with [data-reveal].
 */
export function useScrollReveal({ selector = "[data-reveal]", y = 28, stagger = 0.1, start = "top 82%" } = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const targets = container.querySelectorAll(selector);
    if (!targets.length) return undefined;

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: container,
          start,
          toggleActions: "play none none reverse",
        },
      });
    }, container);

    return () => ctx.revert();
  }, [selector, y, stagger, start]);

  return containerRef;
}
