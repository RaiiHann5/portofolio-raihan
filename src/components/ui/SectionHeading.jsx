export default function SectionHeading({ 
  index, 
  label, 
  title, 
  description, 
  align = "left",
  className = "" 
}) {
  return (
    <div className={`flex flex-col gap-6 ${align === "center" ? "items-center text-center" : "items-start"} ${className}`}>
      <div className="flex items-center gap-3">
        {index && (
          <span className="eyebrow text-[var(--text-muted)]">
            {index}
          </span>
        )}
        <span className="eyebrow text-[var(--text-faint)]">
          {label}
        </span>
      </div>
      
      <h2 className="max-w-2xl text-4xl font-medium leading-[1.08] text-[var(--text)] sm:text-5xl md:text-6xl">
        {title}
      </h2>
      
      {description && (
        <p className="max-w-xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}