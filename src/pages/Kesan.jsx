import { useRef, useState } from "react";
import { Check, Loader2, Send, Star, AlertCircle } from "lucide-react";
import PageIntro from "../components/ui/PageIntro";
import SpotlightCard from "../components/ui/SpotlightCard";
import { supabase } from "../lib/supabase";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";
import { formatDate } from "../lib/postFormat";

const EMPTY = { name: "", relation: "", email: "", rating: 0, message: "" };

function Stars({ value }) {
  if (!value) return null;
  return (
    <span className="inline-flex gap-0.5 text-[var(--accent-1)]" aria-label={`${value}/5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={13} fill={n <= value ? "currentColor" : "none"} />
      ))}
    </span>
  );
}

/** Formulir kesan & pesan + daftar kesan yang sudah disetujui admin. */
export default function Kesan() {
  const { kesan, reload } = useContent();
  const { t, lang } = useLanguage();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error | offline
  const honeypot = useRef(null);

  const field =
    "focus-ring w-full rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--text)] transition-colors placeholder:text-[var(--text-faint)] hover:border-[var(--border-strong)] focus:border-[var(--accent-1)]";

  function set(patch) {
    setValues((v) => ({ ...v, ...patch }));
  }

  async function submit(e) {
    e.preventDefault();
    if (status === "sending" || honeypot.current?.value) return;

    const next = {};
    if (!values.name.trim()) next.name = t("kesan.errName");
    if (values.message.trim().length < 10) next.message = t("kesan.errMessage");
    setErrors(next);
    if (Object.keys(next).length) return;

    if (!supabase) {
      setStatus("offline");
      return;
    }

    setStatus("sending");
    const { error } = await supabase.from("messages").insert({
      kind: "kesan",
      name: values.name.trim(),
      relation: values.relation.trim(),
      email: values.email.trim(),
      rating: values.rating || null,
      message: values.message.trim(),
    });
    if (error) {
      setStatus("error");
      return;
    }
    setValues(EMPTY);
    setStatus("sent");
    reload?.(); // muat ulang supaya kesan baru langsung terlihat di daftar
  }

  return (
    <>
      <PageIntro
        label={t("kesan.label")}
        title={t("kesan.title")}
        description={t("kesan.description")}
      />

      <section className="px-6 pb-16 pt-12 sm:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {status === "sent" ? (
              <div className="flex flex-col items-start gap-4 rounded-xl border border-[var(--border)] p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--accent-1)] text-[var(--accent-1)]">
                  <Check size={20} strokeWidth={2.4} />
                </span>
                <h3 className="font-display text-xl font-medium">{t("kesan.sentTitle")}</h3>
                <p className="max-w-[46ch] text-sm leading-relaxed text-[var(--text-muted)]">
                  {t("kesan.sentBody")}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="focus-ring text-sm text-[var(--text-faint)] underline-offset-4 hover:text-[var(--accent-1)] hover:underline"
                >
                  {t("kesan.another")}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="flex flex-col gap-5">
                <input
                  ref={honeypot}
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="pointer-events-none absolute h-0 w-0 opacity-0"
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="ks-name" className="text-xs text-[var(--text-muted)]">
                      {t("kesan.name")}
                    </label>
                    <input
                      id="ks-name"
                      value={values.name}
                      maxLength={100}
                      onChange={(e) => set({ name: e.target.value })}
                      className={field}
                      aria-invalid={Boolean(errors.name)}
                    />
                    {errors.name && <p className="text-xs text-[#f87171]">{errors.name}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="ks-rel" className="text-xs text-[var(--text-muted)]">
                      {t("kesan.relation")}
                    </label>
                    <input
                      id="ks-rel"
                      value={values.relation}
                      maxLength={100}
                      placeholder={t("kesan.relationPh")}
                      onChange={(e) => set({ relation: e.target.value })}
                      className={field}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="ks-email" className="text-xs text-[var(--text-muted)]">
                    {t("kesan.email")}
                  </label>
                  <input
                    id="ks-email"
                    type="email"
                    value={values.email}
                    maxLength={200}
                    onChange={(e) => set({ email: e.target.value })}
                    className={field}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs text-[var(--text-muted)]">{t("kesan.rating")}</span>
                  <div className="flex gap-1" role="radiogroup" aria-label={t("kesan.rating")}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        role="radio"
                        aria-checked={values.rating === n}
                        aria-label={`${n}/5`}
                        onClick={() => set({ rating: values.rating === n ? 0 : n })}
                        className="focus-ring rounded p-1 text-[var(--accent-1)] transition-transform hover:scale-110"
                      >
                        <Star size={22} fill={n <= values.rating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="ks-msg" className="text-xs text-[var(--text-muted)]">
                    {t("kesan.message")}
                  </label>
                  <textarea
                    id="ks-msg"
                    rows={6}
                    maxLength={2000}
                    value={values.message}
                    onChange={(e) => set({ message: e.target.value })}
                    className={`${field} resize-y leading-relaxed`}
                    aria-invalid={Boolean(errors.message)}
                  />
                  {errors.message && <p className="text-xs text-[#f87171]">{errors.message}</p>}
                </div>

                {(status === "error" || status === "offline") && (
                  <p
                    role="alert"
                    className="flex items-start gap-2 rounded-lg border border-[#f87171]/40 px-4 py-3 text-sm text-[#f87171]"
                  >
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {status === "offline" ? t("kesan.errOffline") : t("kesan.errSend")}
                  </p>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-7 py-3.5 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> {t("kesan.sending")}
                      </>
                    ) : (
                      <>
                        {t("kesan.submit")} <Send size={15} strokeWidth={2.2} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-6">
            <h2 className="font-display text-2xl font-medium tracking-tight">
              {t("kesan.listTitle")}
            </h2>
            {kesan.length === 0 ? (
              <p className="mt-6 text-sm text-[var(--text-muted)]">{t("kesan.listEmpty")}</p>
            ) : (
              <ul className="mt-6 flex list-none flex-col gap-4 p-0">
                {kesan.map((k) => (
                  <SpotlightCard
                    as="li"
                    key={k.id}
                    className="rounded-2xl border border-[var(--border)] p-6"
                    style={{ background: "var(--card-bg)" }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Stars value={k.rating} />
                      <span className="font-mono text-[11px] text-[var(--text-faint)]">
                        {formatDate(k.createdAt, lang)}
                      </span>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--text)]">
                      {k.message}
                    </p>
                    <p className="mt-4 text-sm font-medium">
                      {k.name}
                      {k.relation && (
                        <span className="font-normal text-[var(--text-faint)]"> · {k.relation}</span>
                      )}
                    </p>
                  </SpotlightCard>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
