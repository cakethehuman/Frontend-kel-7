"use client"

import { useState, useRef } from "react";

import Link from "next/link";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import CartRow from "@/components/cart/CartRow";
import MoreList from "@/components/cart/MoreList";
import OrderForm from "@/components/cart/OrderForm";
import Panel from "@/components/ui/Panel";
import Recap from "@/components/cart/Recap";
import type { FieldKey, FieldRefs, FormErrors, FormState, Order } from "@/lib/cartTypes";
import type { MenuItem } from "@/data/menu";
import type { CartItem } from "@/lib/cartStore";
import { CartStore } from "@/lib/cartStore";
import { useCart, useHydrated } from "@/lib/useCart";

import { rupiah } from "@/lib/format";


const TAX_RATE = 0.1;

const emptyForm: FormState = {
  name: "",
  phone: "",
  type: "dinein",
  table: "",
  payment: "Cash",
  note: "",
};

function nextOrderNumber(): string {
  let seq = 1;
  try {
    seq = Number(localStorage.getItem("mb_order_seq") || 0) + 1;
    localStorage.setItem("mb_order_seq", String(seq));
  } catch { }
  return "MB-" + String(seq).padStart(4, "0");
}

export default function CartInfo() {
  const hydrated = useHydrated();
  const items = useCart();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [preview, setPreview] = useState<Order | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [placed, setPlaced] = useState<Order | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLInputElement>(null);

  const refs: FieldRefs = { name: nameRef, phone: phoneRef, table: tableRef };

  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;
  const empty = items.length === 0;

  const changeField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({
      ...prev, [key]: value, ...(key === "type" && value === "takeaway" ? { table: "" } : {}),
    }));
    setErrors((prev) => ({
      ...prev, [key]: false, ...(key === "type" ? { table: false } : {}),
    }));
  };

  const stepQty = (item: CartItem, step: number) => CartStore.setQty(item.id, item.qty + step);
  const removeItem = (id: string) => CartStore.remove(id);
  const addMore = (menu: MenuItem) => CartStore.add(menu);

  const validate = (): boolean => {
    const phone = form.phone.replace(/\D/g, "");
    const table = parseInt(form.table, 10);
    const result: Record<FieldKey, boolean> = {
      name: form.name.trim().length < 3,
      phone: phone.length < 9 || phone.length > 15,
      table: form.type === "dinein" && !(table >= 1 && table <= 99),
    };
    setErrors(result);

    const firstBad = (["name", "phone", "table"] as FieldKey[]).find(
      (key) => result[key],
    );
    if (firstBad) {
      setTimeout(
        () =>
          refs[firstBad].current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          }),
        0,
      );
    }
    return !firstBad;
  };

  const buildOrder = (): Order => ({
    name: form.name.trim(),
    phone: form.phone.trim(),
    type: form.type,
    table: form.type === "dinein" ? form.table : null,
    payment: form.payment,
    note: form.note.trim(),
    items,
    count,
    total,
  });

  const checkout = () => {
    if (empty || !validate()) return;
    setPreview(buildOrder());
    setShowConfirm(true);
  };

  const finalConfirm = () => {
    if (!preview || placed) return;
    setPlaced({ ...preview, number: nextOrderNumber() });
    CartStore.clear();
    setShowConfirm(false);
  };

  const afterConfirmHidden = () => {
    if (placed) setShowSuccess(true);
  };

  const afterSuccessHidden = () => {
    setPlaced(null);
    setPreview(null);
    setForm(emptyForm);
    setErrors({});
  };

  return (
    <Container className="py-2">
      <h1 className="text-danger text-center mb-4">PESANAN</h1>

      {!hydrated ? null : empty ? (
        <section>
          <div className="empty-box bg-light rounded-4 p-4 p-md-5 text-center mx-auto">
            <i className="bi bi-bag fs-1 text-danger" />
            <h2 className="h4 text-danger mt-2">Pesanan masih kosong</h2>
            <p className="text-muted">
              Pilih menu dulu, lalu kembali ke sini untuk memeriksa dan
              mengonfirmasi pesananmu.
            </p>
            <Link href="/menu" className="btn btn-red">
              Lihat Menu
            </Link>
          </div>
        </section>
      ) : (
        <Row className="g-4">
          <Col lg={7} className="d-flex flex-column gap-4">
            <Panel title="Daftar Pesanan" action={
              <Button variant="link" size="sm" className="link-secondary text-decoration-none" onClick={() => CartStore.clear()} >
                <i className="bi bi-trash3" /> Kosongkan
              </Button>
            }>
              {items.map((item) => (
                <CartRow key={item.id} item={item} onStep={stepQty} onRemove={removeItem} />
              ))}
            </Panel>

            <Panel title="Tambah Menu Lain">
              <MoreList items={items} onAdd={addMore} />
            </Panel>

            <Panel title="Data Pemesan">
              <OrderForm form={form} errors={errors} onChange={changeField} refs={refs} />
            </Panel>
          </Col>

          <Col lg={5}>
            <Panel as="aside" title="Ringkasan" className="summary">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Total item</span>
                <span className="fw-bold">{count} porsi</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="fw-bold">{rupiah(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Pajak (10%)</span>
                <span className="fw-bold">{rupiah(tax)}</span>
              </div>
              <hr className="my-3" />
              <div className="d-flex justify-content-between align-items-baseline mb-4">
                <span className="fw-bold">Total bayar</span>
                <span className="fs-3 fw-bold text-danger">{rupiah(total)}</span>
              </div>
              <Button className="btn-red w-100" onClick={checkout}>
                Konfirmasi Pesanan
              </Button>
            </Panel>
          </Col>
        </Row>
      )}

      <Modal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onExited={afterConfirmHidden}
        centered
        scrollable
        className="cart-modal"
        contentClassName="bg-light rounded-4"
        aria-labelledby="confirmTitle">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title as="h2" id="confirmTitle" className="h4 text-danger">
            Konfirmasi Pesanan
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {preview && (
            <>
              <p className="mb-3">
                Kamu akan memesan <b>{preview.count} porsi</b> dengan total{" "}
                <b className="text-danger">{rupiah(preview.total)}</b>.
              </p>
              <Recap order={preview} />
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button className="btn-outline-brown" onClick={() => setShowConfirm(false)}>
            Edit Dulu
          </Button>
          <Button className="btn-red" onClick={finalConfirm}>
            Ya, Pesan
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSuccess}
        onHide={() => setShowSuccess(false)}
        onExited={afterSuccessHidden}
        backdrop="static"
        keyboard={false}
        centered
        scrollable
        className="cart-modal"
        contentClassName="bg-light rounded-4"
        aria-labelledby="successTitle">
        <Modal.Body className="text-center p-4">
          <i className="bi bi-check-circle fs-1 text-danger" />
          <h2 className="h4 text-danger mt-2" id="successTitle">
            Pesanan Diterima
          </h2>
          <p className="text-muted">Tunjukkan nomor pesanan ini ke kasir.</p>
          <div className="order-number rounded-3 d-inline-block px-4 py-2 mb-3">
            {placed?.number}
          </div>
          {placed && <Recap order={placed} />}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 justify-content-center">
          <Button className="btn-outline-brown" onClick={() => setShowSuccess(false)}>
            Tutup
          </Button>
          <Link href="/menu" className="btn btn-red">
            Pesan Lagi
          </Link>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
