import { Col, Form, Row, ToggleButton } from "react-bootstrap";
import type { FieldRefs, FormErrors, FormState, OrderType, Payment } from "@/lib/cartTypes";

const orderTypes: { value: OrderType; label: string; icon: string }[] = [
  { value: "dinein", label: "Makan di Tempat", icon: "bi-shop" },
  { value: "takeaway", label: "Bungkus", icon: "bi-bag" },
];

const payments: { value: Payment; icon: string }[] = [
  { value: "Cash", icon: "bi-cash-coin" },
  { value: "QRIS", icon: "bi-qr-code" },
  { value: "Transfer", icon: "bi-bank2" },
];

interface OrderFormProps {
  form: FormState;
  errors: FormErrors;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  refs: FieldRefs;
}

export default function OrderForm({ form, errors, onChange, refs}: OrderFormProps) {
  return (
    <Form noValidate onSubmit={(e) => e.preventDefault()}>
      <Row className="g-3">
        <Col md={6}>
          <Form.Label htmlFor="cust-name" className="fw-bold">
            Atas Nama
          </Form.Label>
          <Form.Control id="cust-name" ref={refs.name} placeholder="cth: Budi Santoso" autoComplete="name" value={form.name} isInvalid={errors.name} onChange={(e) => onChange("name", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            Nama minimal 3 karakter.
          </Form.Control.Feedback>
        </Col>
        <Col md={6}>
          <Form.Label htmlFor="cust-phone" className="fw-bold">
            No. WhatsApp
          </Form.Label>
          <Form.Control id="cust-phone" ref={refs.phone} type="tel" placeholder="cth: 081234567890" autoComplete="tel" value={form.phone} isInvalid={errors.phone} onChange={(e) => onChange("phone", e.target.value)}/>
          <Form.Control.Feedback type="invalid">
            Masukkan nomor WhatsApp yang valid.
          </Form.Control.Feedback>
        </Col>
      </Row>

      <div className="mt-3">
        <span className="form-label fw-bold d-block">Tipe Pesanan</span>
        <Row className="g-2">
          {orderTypes.map((type) => (
            <Col xs={12} sm={6} key={type.value}>
              <ToggleButton id={`type-${type.value}`} type="radio" name="order-type" variant="" value={type.value} className="option w-100" checked={form.type === type.value} onChange={() => onChange("type", type.value)}>
                <i className={`bi ${type.icon} me-2`} />
                {type.label}
              </ToggleButton>
            </Col>
          ))}
        </Row>
      </div>

      {form.type === "dinein" && (
        <div className="mt-3">
          <Form.Label htmlFor="cust-table" className="fw-bold">
            Nomor Meja
          </Form.Label>
          <Form.Control id="cust-table" ref={refs.table} type="number" min={1} max={99} placeholder="cth: 7" value={form.table} isInvalid={errors.table} onChange={(e) => onChange("table", e.target.value)}/>
          <Form.Control.Feedback type="invalid">
            Isi nomor meja antara 1 sampai 99.
          </Form.Control.Feedback>
        </div>
      )}

      <div className="mt-3">
        <span className="form-label fw-bold d-block">Metode Pembayaran</span>
        <Row className="g-2">
          {payments.map((payment) => (
            <Col xs={12} sm={4} key={payment.value}>
              <ToggleButton id={`pay-${payment.value}`} type="radio" name="payment-method" variant="" value={payment.value} className="option w-100" checked={form.payment === payment.value} onChange={() => onChange("payment", payment.value)}>
                <i className={`bi ${payment.icon} me-2`} />
                {payment.value}
              </ToggleButton>
            </Col>
          ))}
        </Row>
      </div>

      <div className="mt-3">
        <Form.Label htmlFor="order-note" className="fw-bold">
          Catatan Tambahan{" "}
          <span className="text-muted fw-normal">(opsional)</span>
        </Form.Label>
        <Form.Control as="textarea" id="order-note" rows={2} placeholder="cth: tidak terlalu pedas" value={form.note} onChange={(e) => onChange("note", e.target.value)}/>
      </div>
    </Form>
  );
}
