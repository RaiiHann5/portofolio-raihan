import { useRef, useState } from "react";
import { Send, Check, AlertCircle, Loader2 } from "lucide-react";
import { site } from "../../data/site";
import { useLanguage } from "../../context/LanguageContext";
import { useCursor } from "../../context/CursorContext";

const EMPTY = { name: "", email: "", message: "" };

// Cukup buat nangkep salah ketik yang jelas (kelupaan @, domain gak ada).
// Validasi email yang beneran cuma bisa dilakukan dengan mengirim email.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ContactForm() {
  const { t } = useLanguage();
  const { setCursor, clearCursor } = useCursor();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const honeypotRef = useRef(null);

  const endpoint = site.formEndpoint;
  const usesMailto = !endpoint;

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
    // Error dibersihkan begitu user mulai memperbaiki, bukan nunggu submit
    // berikutnya — biar gak terasa dimarahi terus.
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
  }

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = t("form.errName");
    if (!values.email.trim()) next.email = t("form.errEmailEmpty");
    else if (!EMAIL_PATTERN.test(values.email.trim())) next.email = t("form.errEmailInvalid");
    if (values.message.trim().length < 10) next.message = t("form.errMessage");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;

    // Honeypot: field tersembunyi yang cuma keisi kalau yang ngisi bot.
    if (honeypotRef.current?.value) return;

    if (!validate()) return;

    // Tanpa endpoint Formspree, isian tetap kepakai — cuma dikirim lewat
    // aplikasi email user. Lebih baik daripada tombol yang gak ngapa-ngapain.
    if (usesMailto) {
      const subject = `Project inquiry — ${values.name.trim()}`;
      const body = `${values.message.trim()}\n\n—\n${values.name.trim()}\n${values.email.trim()}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          _subject: `Project inquiry — ${values.name.trim()}`,
        }),
      });

      if (!res.ok) throw new Error(`Request failed with ${res.status}`);

      setStatus("sent");
      setValues(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  const fieldClass = (field) =>
    `focus-ring w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-[var(--text)] transition-colors duration-300 placeholder:text-[var(--text-faint)] ${
      errors[field]
        ? "border-[#f87171]"
        : "border-[var(--border)] hover:border-[var(--border-strong)] focus:border-[var(--accent-1)]"
    }`;

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-xl border border-[var(--border)] p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--accent-1)] text-[var(--accent-1)]">
          <Check size={20} strokeWidth={2.4} />
        </span>
        <h3 className="font-display text-xl font-medium tracking-tight">
          {usesMailto ? t("form.mailtoTitle") : t("form.sentTitle")}
        </h3>
        <p className="max-w-[46ch] text-sm leading-relaxed text-[var(--text-muted)]">
          {usesMailto ? t("form.mailtoBody") : t("form.sentBody")}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="focus-ring text-sm text-[var(--text-faint)] underline-offset-4 transition-colors hover:text-[var(--accent-1)] hover:underline"
        >
          {t("form.sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Honeypot — disembunyikan dari mata & dari screen reader. */}
      <input
        ref={honeypotRef}
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="cf-name" className="text-xs text-[var(--text-muted)]">
            {t("form.name")}
          </label>
          <input
            id="cf-name"
            type="text"
            value={values.name}
            autoComplete="name"
            onChange={(e) => update("name", e.target.value)}
            placeholder={t("form.namePlaceholder")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "cf-name-err" : undefined}
            className={fieldClass("name")}
          />
          {errors.name && (
            <p id="cf-name-err" className="text-xs text-[#f87171]">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-email" className="text-xs text-[var(--text-muted)]">
            {t("form.email")}
          </label>
          <input
            id="cf-email"
            type="email"
            value={values.email}
            autoComplete="email"
            onChange={(e) => update("email", e.target.value)}
            placeholder={t("form.emailPlaceholder")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "cf-email-err" : undefined}
            className={fieldClass("email")}
          />
          {errors.email && (
            <p id="cf-email-err" className="text-xs text-[#f87171]">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cf-message" className="text-xs text-[var(--text-muted)]">
          {t("form.message")}
        </label>
        <textarea
          id="cf-message"
          rows={6}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder={t("form.messagePlaceholder")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "cf-message-err" : undefined}
          className={`${fieldClass("message")} resize-y leading-relaxed`}
        />
        {errors.message && (
          <p id="cf-message-err" className="text-xs text-[#f87171]">
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-[#f87171]/40 px-4 py-3 text-sm text-[#f87171]"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {t("form.errSend")}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          onMouseEnter={() => setCursor("Send", "label")}
          onMouseLeave={clearCursor}
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-7 py-3.5 text-sm font-medium text-[var(--bg)] transition-opacity duration-300 hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {status === "sending" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t("form.sending")}
            </>
          ) : (
            <>
              {t("form.submit")}
              <Send size={15} strokeWidth={2.2} />
            </>
          )}
        </button>

        <p className="text-xs text-[var(--text-faint)]">{t("form.replyNote")}</p>
      </div>
    </form>
  );
}
