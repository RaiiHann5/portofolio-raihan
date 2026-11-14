import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import PageIntro from "../components/ui/PageIntro";
import SearchInput from "../components/ui/SearchInput";
import FilterChips from "../components/ui/FilterChips";
import SpotlightCard from "../components/ui/SpotlightCard";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import { formatDate, readingMinutes } from "../lib/postFormat";

/** Blog pengembang / catatan ngoding. */
export default function Blog() {
  const { posts } = useContent();
  const { t, lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");

  const tagOptions = useMemo(() => {
    const names = [...new Set(posts.flatMap((p) => p.tags))].sort((a, b) => a.localeCompare(b));
    return [{ value: "all", label: t("testi.all") }, ...names.map((n) => ({ value: n, label: n }))];
  }, [posts, t]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (tag !== "all" && !p.tags.includes(tag)) return false;
      if (!q) return true;
      return [p.title, p.excerpt, ...p.tags].join(" ").toLowerCase().includes(q);
    });
  }, [posts, query, tag]);

  return (
    <>
      <PageIntro label={t("blog.label")} title={t("blog.title")} description={t("blog.description")}>
        {posts.length > 0 && (
          <>
            <SearchInput value={query} onChange={setQuery} placeholder={t("blog.search")} />
            {tagOptions.length > 2 && (
              <FilterChips options={tagOptions} value={tag} onChange={setTag} />
            )}
          </>
        )}
      </PageIntro>

      <section className="px-6 pb-28 pt-10 sm:px-10 sm:pb-36">
        <div className="mx-auto max-w-[1400px]">
          {posts.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">{t("blog.empty")}</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">{t("blog.noMatch")}</p>
          ) : (
            <ul className="grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <SpotlightCard
                  as="li"
                  key={post.id}
                  className="group/card overflow-hidden rounded-2xl border border-[var(--border)] transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)]"
                  style={{ background: "var(--card-bg)" }}
                >
                  <Link to={`/blog/${post.slug}`} className="focus-ring flex h-full flex-col">
                    {post.cover && (
                      <img
                        src={post.cover}
                        alt=""
                        loading="lazy"
                        className="aspect-[16/9] w-full object-cover"
                      />
                    )}
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <p className="font-mono text-xs text-[var(--text-faint)]">
                        {formatDate(post.createdAt, lang)} · {readingMinutes(post.content)}{" "}
                        {t("blog.minRead")}
                      </p>
                      <h3 className="font-display text-xl font-medium leading-snug tracking-tight">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="line-clamp-3 text-sm leading-relaxed text-[var(--text-muted)]">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map((x) => (
                            <span
                              key={x}
                              className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] text-[var(--text-muted)]"
                            >
                              {x}
                            </span>
                          ))}
                        </div>
                        <ArrowUpRight
                          size={16}
                          className="text-[var(--text-faint)] transition-colors group-hover/card:text-[var(--accent-1)]"
                        />
                      </div>
                    </div>
                  </Link>
                </SpotlightCard>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
