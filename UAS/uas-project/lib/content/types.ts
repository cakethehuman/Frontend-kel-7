export type FieldDef = {
  name: string;
  label: string;
  maxLength: number;
  multiline?: boolean;
  hint?: string;
};

export type OpsiGambar = { value: string; label: string };

export type TextEntry = {
  kind: "text";
  key: string;
  label: string;
  maxLength: number;
  multiline?: boolean;
  hint?: string;
  options?: OpsiGambar[];
  default: string;
};

export type ListEntry = {
  kind: "list";
  key: string;
  label: string;
  itemLabel: string;
  fields: FieldDef[];
  default: Record<string, string>[];
  fixed: boolean;
  max: number;
  hint?: string;
};

export type Entry = TextEntry | ListEntry;
export type Section = { id: string; label: string; entries: Entry[] };
export type PageDef = { id: string; label: string; sections: Section[] };


