
import type { FieldDef, Entry, PageDef, OpsiGambar, ListEntry, TextEntry, Section } from "./types";
import { homePage } from "./home";
import { profilePage } from "./profile";
import { aboutPage } from "./about";
import { contactPage } from "./contact";

export type {
  FieldDef,
  OpsiGambar,
  TextEntry,
  ListEntry,
  Entry,
  Section,
  PageDef,
}

export const contentPages: PageDef[] = [
  homePage,
  profilePage,
  aboutPage,
  contactPage
]

export const contentEntries: Entry[] = contentPages.flatMap((page) =>
  page.sections.flatMap((section) => section.entries),
);

export const contentDefaults: Record<string, unknown> = Object.fromEntries(
  contentEntries.map((entry) => [entry.key, entry.default]),
);

export function gambarAman(key: string, nilai: string): string {
  const entry = contentEntries.find((e) => e.key === key);
  if (entry?.kind !== "text" || !entry.options) return nilai;

  return entry.options.some((opsi) => opsi.value === nilai)
    ? nilai
    : entry.default;
}

