"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Button, Form, Modal, Table, Spinner, Alert, Card, Badge } from "react-bootstrap";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
}

const emptyForm = {
  name: "",
  category: "Main",
  price: 0,
  image: "/IMG/mie_belitung.webp",
  description: "",
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/menu`);
      if (!res.ok) throw new Error("Gagal mengambil data menu dari server.");
      const data = await res.json();
      const mapped: Item[] = data.map((item: any) => ({
        id: item.menu_id || item.id,
        name: item.name,
        category: item.category || item.item_type || "Main",
        price: Number(item.price) || 0,
        image: item.image || item.img || "/IMG/mie_belitung.webp",
        description: item.description || "",
      }));
      setItems(mapped);
    } catch (err: any) {
      console.error("Fetch menu error:", err);
      setError(err.message || "Gagal memuat menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShow(true);
  };

  const openEdit = (item: Item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image,
      description: item.description || "",
    });
    setShow(true);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Nama menu wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      if (editingId === null) {
        const res = await fetch(`${API_URL}/menu`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            item_type: form.category,
            price: Number(form.price) || 0,
            image: form.image.trim() || "/IMG/mie_belitung.webp",
            description: form.description.trim(),
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Gagal menambah menu");
        }
      } else {
        const res = await fetch(`${API_URL}/menu/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            item_type: form.category,
            price: Number(form.price) || 0,
            image: form.image.trim() || "/IMG/mie_belitung.webp",
            description: form.description.trim(),
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Gagal mengupdate menu");
        }
      }
      setShow(false);
      await fetchItems();
    } catch (err: any) {
      console.error("Save menu error:", err);
      alert(err.message || "Gagal menyimpan menu");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: Item) => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${item.name}"?`)) {
      try {
        const res = await fetch(`${API_URL}/menu/${item.id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Gagal menghapus menu");
        }
        await fetchItems();
      } catch (err: any) {
        console.error("Delete menu error:", err);
        alert(err.message || "Gagal menghapus menu");
      }
    }
  };

  const rupiah = (num: number) => `Rp ${Number(num || 0).toLocaleString("id-ID")}`;

  return (
    <div className="container-fluid px-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manajemen Menu</h2>
          <p className="text-muted mb-0">
            Tambah, edit, atau hapus menu makanan & minuman resto Mie Belitung.
          </p>
        </div>
        <Button variant="danger" onClick={openAdd} className="d-flex align-items-center gap-1">
          <i className="bi bi-plus-lg"></i>
          <span>Tambah Menu</span>
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && items.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
          <p className="mt-2 text-muted">Memuat data menu...</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
          <Table striped hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "80px" }}>Gambar</th>
                <th>Nama Menu</th>
                <th>Kategori</th>
                <th>Deskripsi Makanan</th>
                <th>Harga</th>
                <th className="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>
                    <Image
                      src={i.image}
                      alt={i.name}
                      width={56}
                      height={56}
                      className="img-thumbnail object-fit-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/IMG/mie_belitung.webp";
                      }}
                    />
                  </td>
                  <td>
                    <div className="fw-bold">{i.name}</div>
                    <small className="text-muted">ID: #{i.id}</small>
                  </td>
                  <td>
                    <Badge
                      bg={
                        i.category === "Main"
                          ? "danger"
                          : i.category === "Drink"
                          ? "primary"
                          : "secondary"
                      }
                    >
                      {i.category}
                    </Badge>
                  </td>
                  <td style={{ maxWidth: "280px" }}>
                    <div
                      className="small text-muted text-truncate"
                      title={i.description}
                    >
                      {i.description || "-"}
                    </div>
                  </td>
                  <td className="fw-semibold text-danger">{rupiah(i.price)}</td>
                  <td className="text-end text-nowrap">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => openEdit(i)}
                    >
                      <i className="bi bi-pencil-square me-1"></i>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => remove(i)}
                    >
                      <i className="bi bi-trash3 me-1"></i>
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Add / Edit Menu Modal */}
      <Modal show={show} onHide={() => !saving && setShow(false)} centered>
        <Form onSubmit={save}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold text-danger">
              {editingId === null ? "Tambah Menu Baru" : "Edit Menu"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Nama Menu</Form.Label>
              <Form.Control
                required
                placeholder="Contoh: Mie Belitung Jumbo"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Kategori</Form.Label>
              <Form.Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Main">Main (Makanan Utama)</option>
                <option value="Drink">Drink (Minuman)</option>
                <option value="Others">Others (Lainnya)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Harga (Rp)</Form.Label>
              <Form.Control
                required
                type="number"
                min={0}
                step={500}
                placeholder="Contoh: 20000"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Deskripsi Makanan{" "}
                <small className="text-muted fw-normal">
                  ({form.description.length} karakter)
                </small>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Deskripsi singkat lezat (sekitar 50 karakter agar seragam)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <Form.Text className="text-muted">
                Tip: Deskripsi sekitar 40-55 karakter membuat tampilan kartu menu seragam dan rapi tanpa overflow/underflow.
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label className="fw-semibold">URL Gambar</Form.Label>
              <Form.Control
                placeholder="/IMG/mie_belitung.webp"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" disabled={saving} onClick={() => setShow(false)}>
              Batal
            </Button>
            <Button variant="danger" type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Menu"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
