"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Form,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import { API_URL } from "@/lib/api";
import {
  contentEntries,
  contentPages,
  type Entry,
  type ListEntry,
  type TextEntry,
} from "@/lib/content";

type Baris = Record<string, string>;
type Nilai = string | Baris[];
type Peta = Record<string, Nilai>;

const sama = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

function rapikan(entry: Entry, mentah: unknown): Nilai {
  if (entry.kind === "text") {
    return typeof mentah === "string" && mentah.trim() !== ""
      ? mentah
      : entry.default;
  }

  const panjangCocok = entry.fixed
    ? Array.isArray(mentah) && mentah.length === entry.default.length
    : Array.isArray(mentah) && mentah.length > 0;

  if (Array.isArray(mentah) && panjangCocok) {
    return mentah.map((item: unknown) => {
      const sumber = (item ?? {}) as Record<string, unknown>;
      const baris: Baris = {};
      for (const f of entry.fields) {
        const v = sumber[f.name];
        baris[f.name] = typeof v === "string" ? v : "";
      }
      return baris;
    });
  }

  return entry.default;
}

function cekEntry(entry: Entry, nilai: Nilai): string | null {
  if (entry.kind === "text") {
    return String(nilai).trim() === ""
      ? `"${entry.label}" tidak boleh kosong.`
      : null;
  }

  const daftar = nilai as Baris[];
  if (daftar.length === 0) {
    return `"${entry.label}" minimal punya satu item.`;
  }

  for (let i = 0; i < daftar.length; i++) {
    for (const f of entry.fields) {
      if ((daftar[i][f.name] ?? "").trim() === "") {
        return `${entry.label}: ${entry.itemLabel} ${i + 1}, "${f.label}" tidak boleh kosong.`;
      }
    }
  }
  return null;
}

function bersihkan(entry: Entry, nilai: Nilai): Nilai {
  if (entry.kind === "text") return String(nilai).trim();

  return (nilai as Baris[]).map((baris) => {
    const hasil: Baris = {};
    for (const f of entry.fields) {
      hasil[f.name] = (baris[f.name] ?? "").trim();
    }
    return hasil;
  });
}

function IsiTeks({
  entry,
  nilai,
  onChange,
}: {
  entry: TextEntry;
  nilai: string;
  onChange: (v: string) => void;
}) {
  return (
    <>
      {entry.multiline ? (
        <Form.Control
          as="textarea"
          rows={3}
          maxLength={entry.maxLength}
          value={nilai}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Form.Control
          maxLength={entry.maxLength}
          value={nilai}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      <Form.Text className="text-muted">
        {nilai.length}/{entry.maxLength} karakter
      </Form.Text>
    </>
  );
}

function IsiDaftar({
  entry,
  nilai,
  onChange,
}: {
  entry: ListEntry;
  nilai: Baris[];
  onChange: (v: Baris[]) => void;
}) {
  const ubah = (i: number, nama: string, v: string) =>
    onChange(
      nilai.map((baris, idx) => (idx === i ? { ...baris, [nama]: v } : baris)),
    );

  const hapus = (i: number) => onChange(nilai.filter((_, idx) => idx !== i));

  const tambah = () =>
    onChange([
      ...nilai,
      Object.fromEntries(entry.fields.map((f) => [f.name, ""])),
    ]);

  return (
    <div className="d-flex flex-column gap-3">
      {nilai.map((baris, i) => (
        <div key={i} className="border rounded p-3 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-semibold">
              {entry.itemLabel} {i + 1}
            </span>
            {!entry.fixed && nilai.length > 1 && (
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => hapus(i)}
              >
                <i className="bi bi-trash3 me-1"></i>
                Hapus
              </Button>
            )}
          </div>

          {entry.fields.map((f) => (
            <div key={f.name} className="mb-2">
              <Form.Label className="small fw-semibold mb-1">
                {f.label}
              </Form.Label>
              {f.multiline ? (
                <Form.Control
                  as="textarea"
                  rows={2}
                  maxLength={f.maxLength}
                  value={baris[f.name] ?? ""}
                  onChange={(e) => ubah(i, f.name, e.target.value)}
                />
              ) : (
                <Form.Control
                  maxLength={f.maxLength}
                  value={baris[f.name] ?? ""}
                  onChange={(e) => ubah(i, f.name, e.target.value)}
                />
              )}
              {f.hint && (
                <Form.Text className="text-muted">{f.hint}</Form.Text>
              )}
            </div>
          ))}
        </div>
      ))}

      {!entry.fixed && nilai.length < entry.max && (
        <div>
          <Button size="sm" variant="outline-primary" onClick={tambah}>
            <i className="bi bi-plus-lg me-1"></i>
            Tambah {entry.itemLabel.toLowerCase()}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AdminContentPage() {
  const [tersimpan, setTersimpan] = useState<Peta>({});
  const [draf, setDraf] = useState<Peta>({});
  const [diDb, setDiDb] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);
  const [muatUlang, setMuatUlang] = useState(0);

  useEffect(() => {
    let aktif = true;

    const muat = async () => {
      try {
        const res = await fetch(`${API_URL}/api/content`);
        if (!res.ok) throw new Error("Gagal mengambil konten dari server.");

        const data: unknown = await res.json();
        const mentah = (
          data && typeof data === "object" ? data : {}
        ) as Record<string, unknown>;

        const efektif: Peta = {};
        for (const entry of contentEntries) {
          efektif[entry.key] = rapikan(entry, mentah[entry.key]);
        }

        if (aktif) {
          setTersimpan(efektif);
          setDraf(efektif);
          setDiDb(Object.keys(mentah));
          setError(null);
        }
      } catch (err) {
        if (aktif) {
          setError(err instanceof Error ? err.message : "Gagal memuat konten.");
        }
      } finally {
        if (aktif) setLoading(false);
      }
    };

    muat();
    return () => {
      aktif = false;
    };
  }, [muatUlang]);

  const berubah = contentEntries.filter(
    (entry) => !sama(draf[entry.key], tersimpan[entry.key]),
  );

  const simpanSemua = async () => {
    setPesan(null);
    setError(null);

    for (const entry of berubah) {
      const salah = cekEntry(entry, draf[entry.key]);
      if (salah) {
        setError(salah);
        return;
      }
    }

    setSaving(true);
    try {
      for (const entry of berubah) {
        const nilai = bersihkan(entry, draf[entry.key]);
        const kembaliBawaan = sama(nilai, entry.default);

        const res = await fetch(`${API_URL}/api/content/${entry.key}`, {
          method: kembaliBawaan ? "DELETE" : "PUT",
          headers: { "Content-Type": "application/json" },
          ...(kembaliBawaan ? {} : { body: JSON.stringify({ value: nilai }) }),
          credentials: "include"
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            `${entry.label}: ${data.message ?? "gagal disimpan"}`,
          );
        }
      }

      setPesan(`${berubah.length} perubahan berhasil disimpan.`);
      setMuatUlang((n) => n + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan konten.");
    } finally {
      setSaving(false);
    }
  };

  const tombolSimpan = (
    <Button
      variant="danger"
      disabled={saving || berubah.length === 0}
      onClick={simpanSemua}
    >
      {saving
        ? "Menyimpan..."
        : berubah.length > 0
          ? `Simpan perubahan (${berubah.length})`
          : "Simpan perubahan"}
    </Button>
  );

  return (
    <div className="container-fluid px-0">
      <div className="d-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
        <div>
          <h2 className="fw-bold mb-1">Konten Website</h2>
          <p className="text-muted mb-0">
            Ubah teks di halaman Home dan Profile tanpa menyentuh kode.
          </p>
        </div>
        {tombolSimpan}
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {pesan && (
        <Alert variant="success" dismissible onClose={() => setPesan(null)}>
          {pesan}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
          <p className="mt-2 text-muted">Memuat konten...</p>
        </div>
      ) : (
        <Tabs defaultActiveKey={contentPages[0].id} className="mb-3">
          {contentPages.map((page) => (
            <Tab key={page.id} eventKey={page.id} title={page.label}>
              {page.sections.map((section) => (
                <Card
                  key={section.id}
                  className="border-0 shadow-sm rounded-3 mb-4"
                >
                  <Card.Header className="bg-white fw-bold">
                    {section.label}
                  </Card.Header>
                  <Card.Body>
                    {section.entries.map((entry) => {
                      const nilai = draf[entry.key];
                      if (nilai === undefined) return null;

                      return (
                        <div key={entry.key} className="mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-1 gap-2">
                            <Form.Label className="fw-semibold mb-0">
                              {entry.label}{" "}
                              {!sama(nilai, tersimpan[entry.key]) && (
                                <Badge bg="warning" text="dark">
                                  Diubah
                                </Badge>
                              )}{" "}
                              {diDb.includes(entry.key) && (
                                <Badge bg="success">Dari CMS</Badge>
                              )}
                            </Form.Label>
                            <Button
                              size="sm"
                              variant="link"
                              className="text-decoration-none p-0"
                              disabled={sama(nilai, entry.default)}
                              onClick={() =>
                                setDraf((prev) => ({
                                  ...prev,
                                  [entry.key]: entry.default,
                                }))
                              }
                            >
                              Kembalikan ke bawaan
                            </Button>
                          </div>

                          {entry.kind === "text" ? (
                            <IsiTeks
                              entry={entry}
                              nilai={nilai as string}
                              onChange={(v) =>
                                setDraf((prev) => ({
                                  ...prev,
                                  [entry.key]: v,
                                }))
                              }
                            />
                          ) : (
                            <IsiDaftar
                              entry={entry}
                              nilai={nilai as Baris[]}
                              onChange={(v) =>
                                setDraf((prev) => ({
                                  ...prev,
                                  [entry.key]: v,
                                }))
                              }
                            />
                          )}

                          {entry.hint && (
                            <div>
                              <Form.Text className="text-muted">
                                {entry.hint}
                              </Form.Text>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </Card.Body>
                </Card>
              ))}
            </Tab>
          ))}
        </Tabs>
      )}

      {!loading && <div className="d-flex justify-content-end">{tombolSimpan}</div>}
    </div>
  );
}
