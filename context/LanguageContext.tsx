
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Dict, Lang } from "../lib/translations";
import { translations } from "../lib/translations";
import type { Bilingual } from "../lib/types";

const STORAGE_KEY = "scn-lang";

interface LanguageValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
  pick: (value: Bilingual) => string;
}

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>("en");

  // Restore saved language
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved === "en" || saved === "rw") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLangState(saved);
      }
    } catch {
      // Keep default language
    }
  }, []);

  // Update browser language
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Change language and save preference
  const setLang = useCallback((next: Lang) => {
    setLangState(next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Select the correct language from bilingual content
  const pick = useCallback(
    (value: Bilingual): string => {
      return value[lang] || value.en || value.rw;
    },
    [lang]
  );

  const contextValue: LanguageValue = {
    lang,
    setLang,
    t: translations[lang],
    pick,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLang must be used inside <LanguageProvider>"
    );
  }

  return context;
}
