import { useScrollReveal } from "../../hooks/useScrollReveal";
import SectionHeading from "./SectionHeading";

/** Kepala halaman untuk halaman-halaman di menu "Lainnya". */
export default function PageIntro({ label, title, description, children }) {
  const ref = useScrollReveal({ y: 20, stagger: 0.08 });
  return (
    <div ref={ref} className="px-6 pt-36 sm:px-10 sm:pt-44">
      <div className="mx-auto max-w-[1400px]">
        <div data-reveal>
          <SectionHeading label={label} title={title} description={description} />
        </div>
        {children && (
          <div data-reveal className="mt-10 flex flex-col gap-5">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
