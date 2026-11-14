/** Waktu baca perkiraan, 200 kata per menit. */
export function readingMinutes(text) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(iso, lang) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Pecah isi artikel (teks biasa) jadi blok yang aman dirender tanpa
 * dangerouslySetInnerHTML:
 *   ```...```   -> { type: "code" }
 *   ## Judul    -> { type: "h2" }, ### -> h3
 *   baris kosong memisahkan paragraf.
 */
export function parsePost(content) {
  const blocks = [];
  const parts = String(content || "").replace(/\r\n/g, "\n").split(/```/);
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      // Baris pertama setelah ``` boleh berisi nama bahasa (js, php, …).
      const nl = part.indexOf("\n");
      const lang = nl === -1 ? "" : part.slice(0, nl).trim();
      const code = (nl === -1 ? part : part.slice(nl + 1)).replace(/\n$/, "");
      blocks.push({ type: "code", lang, text: code });
      return;
    }
    part
      .split(/\n{2,}/)
      .map((b) => b.trim())
      .filter(Boolean)
      .forEach((b) => {
        if (b.startsWith("### ")) blocks.push({ type: "h3", text: b.slice(4) });
        else if (b.startsWith("## ")) blocks.push({ type: "h2", text: b.slice(3) });
        else blocks.push({ type: "p", text: b });
      });
  });
  return blocks;
}
