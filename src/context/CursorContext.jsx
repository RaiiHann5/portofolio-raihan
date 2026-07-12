import { createContext, useContext, useState, useCallback, useMemo } from "react";

const CursorContext = createContext(null);

export function CursorProvider({ children }) {
  const [cursor, setCursorState] = useState({ label: "", variant: "default" });

  const setCursor = useCallback((label = "", variant = "default") => {
    setCursorState({ label, variant });
  }, []);

  const clearCursor = useCallback(() => setCursorState({ label: "", variant: "default" }), []);

  const value = useMemo(() => ({ cursor, setCursor, clearCursor }), [cursor, setCursor, clearCursor]);

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor must be used within CursorProvider");
  return ctx;
}
