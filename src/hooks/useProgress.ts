import { useCallback, useEffect, useState } from "react";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useLocalState<T>(key: string, fallback: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => read(key, fallback));
  const set = useCallback(
    (v: T | ((p: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* noop */
        }
        return next;
      });
    },
    [key]
  );
  return [value, set];
}

/** Розділи, які користувач уже відкрив — точки прогресу в навігації */
export function useVisited() {
  const [visited, setVisited] = useLocalState<string[]>("etsy:visited", []);
  const mark = useCallback(
    (id: string) => {
      setVisited((prev) => (prev.includes(id) ? prev : [...prev, id]));
    },
    [setVisited]
  );
  return { visited, mark };
}

/** Поточний розділ за хешем */
export function useHashRoute(): [string, (id: string) => void] {
  const parse = () => window.location.hash.replace(/^#\/?/, "") || "home";
  const [route, setRoute] = useState<string>(parse);
  useEffect(() => {
    const onHash = () => setRoute(parse());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const nav = useCallback((id: string) => {
    window.location.hash = `/${id}`;
    window.scrollTo({ top: 0 });
  }, []);
  return [route, nav];
}
