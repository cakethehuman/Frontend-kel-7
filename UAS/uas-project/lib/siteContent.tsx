"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";



import { contentEntries, type Entry } from "@/lib/content";
import { apiFetch } from "./api";

type Baris = Record<string, string>;
type Mentah = Record<string, unknown>;

export type Konten = {
  teks: (key: string) => string;
  daftar: (key: string) => Baris[];
};

const entriPerKunci = new Map<string, Entry>(
  contentEntries.map((entry) => [entry.key, entry]),
);

const simpanan: Record<string, Mentah> = {};

function ambilTeks(mentah: Mentah, key: string): string {
  const nilai = mentah[key];
  if (typeof nilai === "string" && nilai.trim() !== "") return nilai;

  const entry = entriPerKunci.get(key);
  return entry?.kind === "text" ? entry.default : "";
}

function ambilDaftar(mentah: Mentah, key: string): Baris[] {
  const entry = entriPerKunci.get(key);
  if (entry?.kind !== "list") return [];

  const nilai = mentah[key];
  const panjangCocok = entry.fixed
    ? Array.isArray(nilai) && nilai.length === entry.default.length
    : Array.isArray(nilai) && nilai.length > 0;

  if (!Array.isArray(nilai) || !panjangCocok) return entry.default;

  return nilai.map((item: unknown, i: number) => {
    const sumber = (item ?? {}) as Record<string, unknown>;
    const baris: Baris = {};
    for (const f of entry.fields) {
      const v = sumber[f.name];
      baris[f.name] =
        typeof v === "string" && v.trim() !== ""
          ? v
          : (entry.default[i]?.[f.name] ?? "");
    }
    return baris;
  });
}

export function useSiteContent(prefix: string): Konten {
  const [mentah, setMentah] = useState<Mentah>(simpanan[prefix] ?? {});

  useEffect(() => {
    let dibatalkan = false;

    apiFetch(`/api/content?prefix=${prefix}.`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: unknown) => {
        if (dibatalkan || !data || typeof data !== "object") return;
        simpanan[prefix] = data as Mentah;
        setMentah(data as Mentah);
      })
      .catch(() => { });

    return () => {
      dibatalkan = true;
    };
  }, [prefix]);

  return {
    teks: (key) => ambilTeks(mentah, key),
    daftar: (key) => ambilDaftar(mentah, key),
  };
}

const KontenContext = createContext<Konten | null>(null);

export function ContentProvider({
  prefix,
  children,
}: {
  prefix: string;
  children: ReactNode;
}) {
  const konten = useSiteContent(prefix);
  return (
    <KontenContext.Provider value={konten}>{children}</KontenContext.Provider>
  );
}

export function useContent(): Konten {
  const konten = useContext(KontenContext);
  if (!konten) {
    throw new Error("useContent harus dipakai di dalam ContentProvider");
  }
  return konten;
}
