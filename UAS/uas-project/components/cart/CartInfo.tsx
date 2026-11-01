"use client"

import { useState, useRef } from "react";

import Image from "next/image";
import Link from "next/link";
import { Alert, Button, Col, Container, Modal, Row } from "react-bootstrap";
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
const API_URL = "http://localhost:3001";

function getLoggedInUserId(): number | null {
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("currentUser");
    const id = raw ? Number(JSON.parse(raw)?.user_id) : NaN;
    return Number.isInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

const emptyForm: FormState = {
  name: "",
  phone: "",
  type: "dinein",
  table: "",
  payment: "Cash",
  note: "",
};

export default function CartInfo() {
  const hydrated = useHydrated();
  const items = useCart();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [preview, setPreview] = useState<Order | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [placed, setPlaced] = useState<Order | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);
    setShowConfirm(true);
  };

  const finalConfirm = async () => {
    if (!preview || placed || submitting) return;

    const userId = getLoggedInUserId();
    if (userId === null) {
      setSubmitError("Login dulu untuk mengirim pesanan.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(API_URL + "/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          name: preview.name,
          phone: preview.phone,
          type: preview.type,
          table: preview.table,
          payment: preview.payment,
          note: preview.note,
          items: preview.items.map((item) => ({ id: item.id, qty: item.qty })),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setPlaced({ ...preview, number: data.order_number, total: data.total });
        CartStore.clear();
        setShowConfirm(false);
      } else {
        setSubmitError(data.message ?? "Pesanan gagal dikirim. Coba lagi.");
      }
    } catch (e) {
      console.log(e);
      setSubmitError("Tidak bisa terhubung ke server. Pastikan backend sudah berjalan.");
    }

    setSubmitting(false);
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

          <Col lg={5} className="d-flex flex-column gap-4">
            <div className="d-none d-lg-block position-relative rounded-4 overflow-hidden shadow-sm">
              <div className="ratio ratio-4x3">
                <Image
                  src="/IMG/Mie Belitung Close-Up.webp"
                  alt="Semangkuk Mie Belitung"
                  fill
                  sizes="(max-width: 991px) 100vw, 40vw"
                  className="object-fit-cover"
                />
              </div>
              <div className="side-photo-caption position-absolute bottom-0 start-0 end-0 px-4 pb-4 pt-5 text-white">
                <div className="small text-uppercase">Mie Belitung</div>
                <p className="h5 mb-0">Cita rasa Mie Belitung khas Tanjung Pandan</p>
              </div>
            </div>

            <div className="summary d-flex flex-column gap-4">
              <Panel as="aside" title="Ringkasan">
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

              <div className="position-relative bg-white rounded-4 shadow-sm p-3 d-flex align-items-center gap-3">
                <i className="bi bi-whatsapp fs-2 text-danger" />
                <div>
                  <div className="fw-bold">Butuh bantuan soal pesanan?</div>
                  <a
                    href="https://wa.me/6287892544939?text=Halo%20Mie%20Belitung!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="stretched-link text-decoration-none text-danger fw-bold small">
                    Chat WhatsApp 0878-9254-4939
                  </a>
                  <div className="text-muted small">Buka setiap hari, 10.00 – 21.30 WIB</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      )}

      <Modal
        show={showConfirm}
        onHide={() => !submitting && setShowConfirm(false)}
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
              {submitError && (
                <Alert variant="danger" className="mt-3 mb-0" role="alert">
                  {submitError}
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button className="btn-outline-brown" disabled={submitting} onClick={() => setShowConfirm(false)}>
            Edit Dulu
          </Button>
          <Button className="btn-red" disabled={submitting} onClick={finalConfirm}>
            {submitting ? "Mengirim..." : "Ya, Pesan"}
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