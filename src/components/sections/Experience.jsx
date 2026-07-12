import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../ui/SectionHeading";
import { timeline } from "../../data/experience";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        }
      );

      gsap.utils.toArray(".timeline-item").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" ref={sectionRef} className="relative px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          index="04"
          label="Journey"
          title="How I got here."
          description="A short, honest timeline — no shortcuts, just consistent work."
        />

        <div className="relative mt-20 pl-8 sm:pl-12">
          <div className="absolute left-0 top-0 h-full w-px bg-[var(--border)] sm:left-[7px]" />
          <div
            ref={lineRef}
            className="absolute left-0 top-0 h-full w-px sm:left-[7px]"
            style={{ background: "linear-gradient(to bottom, var(--accent-1), var(--accent-2))" }}
          />

          <div className="flex flex-col gap-16">
            {timeline.map((item) => (
              <div key={item.year} className="timeline-item relative">
                <div
                  className="absolute -left-8 top-1 h-3.5 w-3.5 rounded-full border-2 sm:-left-12"
                  style={{ borderColor: "var(--accent-1)", background: "var(--bg)" }}
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-8">
                  <span className="eyebrow w-16 shrink-0">{item.year}</span>
                  <div className="max-w-2xl">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-xl font-medium sm:text-2xl">{item.title}</h3>
                      <span className="rounded-full border border-[var(--border)] px-3 py-0.5 text-xs text-[var(--text-faint)]">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-base leading-relaxed text-[var(--text-muted)]">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
