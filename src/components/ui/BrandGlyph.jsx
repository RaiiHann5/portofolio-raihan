import { brands } from "../../data/brands";

/**
 * Render logo sebuah brand dari registry.
 *
 * Warnanya sengaja `currentColor`, bukan warna brand yang dipaksa masuk.
 * Dengan begitu kartu/pill yang memakainya bisa mengatur sendiri kapan
 * logonya monokrom dan kapan berwarna, cukup lewat CSS `color`.
 */
export default function BrandGlyph({ name, size = 20, className = "" }) {
  const brand = brands[name];

  if (!brand) {
    return (
      <span
        aria-hidden
        className={`inline-flex items-center justify-center font-mono ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        {name?.slice(0, 1).toUpperCase() || "?"}
      </span>
    );
  }

  if (brand.monogram) {
    return (
      <span
        aria-hidden
        className={`inline-flex shrink-0 items-center justify-center rounded-[5px] border border-current font-mono font-medium leading-none ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.42 }}
      >
        {brand.monogram}
      </span>
    );
  }

  return (
    <svg
      role="img"
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`shrink-0 ${className}`}
    >
      <path d={brand.path} />
    </svg>
  );
}
