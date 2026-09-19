import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { translate } from "../i18n/translations";
import { subscribeOverrides, getOverrides } from "../i18n/overrides";

const LanguageContext = createContext(null);
const STORAGE_KEY = "site-lang";
const DEFAULT_LANG = "en";
const TARGET_LANG = "id";

/**
 * Terjemahan manual (bukan auto-translate). `t("nav.about")` ambil teks
 * dari src/i18n/translations.js sesuai bahasa aktif. Nambah teks baru =
 * nambah key di dictionary itu, bukan di sini.
 */
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_LANG;
    return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLanguage = useCallback((next) => {
    setLangState(next === TARGET_LANG ? TARGET_LANG : DEFAULT_LANG);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLangState((prev) => (prev === TARGET_LANG ? DEFAULT_LANG : TARGET_LANG));
  }, []);

  // Teks yang ditimpa admin disimpan di luar React. useSyncExternalStore
  // bikin setiap komponen yang memakai t() ikut render ulang begitu
  // isinya berubah, tanpa perlu meneruskan props ke mana-mana.
  const overrides = useSyncExternalStore(subscribeOverrides, getOverrides, getOverrides);

  // `overrides` sengaja ikut sebagai dependensi walau tidak dipanggil di
  // dalam fungsi: translate() membacanya dari luar React, jadi ini yang
  // bikin t() jadi fungsi baru saat teksnya berubah.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const t = useCallback((path) => translate(path, lang), [lang, overrides]);

  const value = useMemo(
    () => ({ lang, setLanguage, toggleLanguage, t, targetLang: TARGET_LANG, sourceLang: DEFAULT_LANG }),
    [lang, setLanguage, toggleLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
