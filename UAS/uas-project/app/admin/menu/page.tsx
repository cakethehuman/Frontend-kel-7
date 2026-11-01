"use client";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Button, Form, Modal, Table, Spinner, Alert } from "react-bootstrap";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Item = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
};

const emptyForm = { name: "", category: "Main", price: 0, image: "", description: "" };

export default function AdminMenuPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [show, setShow] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/menu`);
      if (!res.ok) throw new Error("Gagal mengambil data menu");
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
      console.error(err);
      setError(err.message || "Gagal memuat menu");
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
    try {
      if (editingId === null) {
        const res = await fetch(`${API_URL}/menu`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            item_type: form.category,
            price: form.price,
            image: form.image || "/IMG/mie_belitung.webp",
            description: form.description,
          }),
        });
        if (!res.ok) throw new Error("Gagal menambah menu");
      } else {
        const res = await fetch(`${API_URL}/menu/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            item_type: form.category,
            price: form.price,
            image: form.image || "/IMG/mie_belitung.webp",
            description: form.description,
          }),
        });
        if (!res.ok) throw new Error("Gagal mengupdate menu");
      }
      setShow(false);
      await fetchItems();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan menu");
    }
  };

  const remove = async (item: Item) => {
    if (confirm(`Delete ${item.name}?`)) {
      try {
        const res = await fetch(`${API_URL}/menu/${item.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Gagal menghapus menu");
        await fetchItems();
      } catch (err: any) {
        alert(err.message || "Gagal menghapus menu");
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Menu</h3>
        <Button onClick={openAdd}>+ Add menu</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="danger" />
          <p className="mt-2 text-muted">Memuat menu...</p>
        </div>
      ) : (
        <Table striped hover responsive className="align-middle">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th></th>
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
                    className="img-thumbnail object-fit-cover"
                  />
                </td>
                <td>{i.name}</td>
                <td>{i.category}</td>
                <td>Rp {i.price.toLocaleString("id-ID")}</td>
                <td className="text-nowrap">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => openEdit(i)}
                  >
                    Edit
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => remove(i)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Form onSubmit={save}>
          <Modal.Header closeButton>
            <Modal.Title>{editingId === null ? "Add menu" : "Edit menu"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Main">Main</option>
                <option value="Drink">Drink</option>
                <option value="Others">Others</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                required
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
