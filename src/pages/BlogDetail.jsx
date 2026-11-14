import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import { formatDate, parsePost, readingMinutes } from "../lib/postFormat";

export default function BlogDetail() {
  const { slug } = useParams();
  const { getPost, loading } = useContent();
  const { t, lang } = useLanguage();
  const post = getPost(slug);
  const blocks = useMemo(() => parsePost(post?.content), [post]);

  if (!post) {
    return (
      <section className="px-6 pb-32 pt-44 sm:px-10">
        <div className="mx-auto max-w-[760px]">
          <h1 className="font-display text-3xl font-medium">
            {loading ? t("more.loading") : t("blog.notFound")}
          </h1>
          <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--accent-1)]">
            <ArrowLeft size={14} /> {t("blog.back")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="px-6 pb-32 pt-36 sm:px-10 sm:pt-44">
      <div className="mx-auto max-w-[760px]">
        <Link
          to="/blog"
          className="focus-ring inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent-1)]"
        >
          <ArrowLeft size={14} /> {t("blog.back")}
        </Link>

        <p className="mt-10 font-mono text-xs text-[var(--text-faint)]">
          {formatDate(post.createdAt, lang)} · {readingMinutes(post.content)} {t("blog.minRead")}
        </p>
        <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        {post.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((x) => (
              <span
                key={x}
                className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-muted)]"
              >
                {x}
              </span>
            ))}
          </div>
        )}

        {post.cover && (
          <img
            src={post.cover}
            alt=""
            className="mt-10 aspect-[16/9] w-full rounded-2xl border border-[var(--border)] object-cover"
          />
        )}

        <div className="mt-12 flex flex-col gap-6">
          {blocks.map((b, i) => {
            if (b.type === "h2")
              return (
                <h2 key={i} className="mt-6 font-display text-2xl font-medium tracking-tight">
                  {b.text}
                </h2>
              );
            if (b.type === "h3")
              return (
                <h3 key={i} className="mt-2 font-display text-xl font-medium tracking-tight">
                  {b.text}
                </h3>
              );
            if (b.type === "code")
              return (
                <pre
                  key={i}
                  className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5 font-mono text-[13px] leading-relaxed"
                >
                  <code>{b.text}</code>
                </pre>
              );
            return (
              <p key={i} className="whitespace-pre-line text-base leading-[1.8] text-[var(--text-muted)]">
                {b.text}
              </p>
            );
          })}
        </div>
      </div>
    </article>
  );
}
