"use client";

import { FormEvent, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";

type Item = { id: number; name: string; category: string; price: number; image: string };

const initial: Item[] = [
  { id: 1, name: "Mie Belitung", category: "Main", price: 25000, image: "/images/mie.png" },
  { id: 2, name: "Es Teh", category: "Drinks", price: 5000, image: "/images/teh.png" },
  { id: 3, name: "Kerupuk", category: "Other", price: 3000, image: "/images/kerupuk.png" },
];

const emptyForm = { name: "", category: "Main", price: 0, image: "" };

export default function AdminMenuPage() {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [show, setShow] = useState(false);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShow(true);
  };

  const openEdit = (item: Item) => {
    setEditingId(item.id);
    setForm({ name: item.name, category: item.category, price: item.price, image: item.image });
    setShow(true);
  };

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (editingId === null) setItems([...items, { id: Date.now(), ...form }]);
    else setItems(items.map((i) => (i.id === editingId ? { ...i, ...form } : i)));
    setShow(false);
  };

  const remove = (item: Item) => {
    if (confirm(`Delete ${item.name}?`)) setItems(items.filter((i) => i.id !== item.id));
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Menu</h3>
        <Button onClick={openAdd}>+ Add menu</Button>
      </div>

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
                <img src={i.image} alt={i.name} width={56} height={56} className="img-thumbnail object-fit-cover" />
              </td>
              <td>{i.name}</td>
              <td>{i.category}</td>
              <td>Rp {i.price.toLocaleString("id-ID")}</td>
              <td className="text-nowrap">
                <Button size="sm" variant="outline-primary" className="me-2" onClick={() => openEdit(i)}>
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
              <Form.Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Main</option>
                <option>Drinks</option>
                <option>Other</option>
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
            <Form.Group>
              <Form.Label>Image URL</Form.Label>
              <Form.Control value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
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
