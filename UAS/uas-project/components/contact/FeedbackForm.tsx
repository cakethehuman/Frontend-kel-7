"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button, Col, Row, Form, Container } from "react-bootstrap";
import Eyebrow from "@/components/contact/Eyebrow";

const starLabels = [
  "Belum dinilai",
  "Kurang, nih",
  "Cukup enak",
  "Enak!",
  "Bikin nagih",
  "Luar biasa!",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  nama: string;
  email: string;
  rating: number;
  kategori: string;
  pesan: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
  nama: "",
  email: "",
  rating: 0,
  kategori: "Makanan",
  pesan: "",
};

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, required, error, children }: FieldProps) {
  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      <label className="f-label d-block" htmlFor={id}>
        {label} {required && <em className="req">*</em>}
      </label>
      {children}
      {error && <div className="error-msg mt-1">{error}</div>}
    </div>
  );
}

export default function FeedbackForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showAlert, setShowAlert] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): FormErrors => {
    const result: FormErrors = {};
    if (form.nama.trim().length < 3) result.nama = "Nama minimal 3 huruf, ya.";
    if (form.email.trim() && !emailPattern.test(form.email.trim()))
      result.email = "Format email belum benar.";
    if (form.rating === 0) result.rating = "Kasih bintang dulu, yuk.";
    if (form.pesan.trim().length < 10)
      result.pesan = "Ceritakan sedikit lebih panjang (min. 10 karakter).";
    return result;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validate();
    setErrors(result);
    if (Object.keys(result).length) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    setSending(true);
    setTimeout(() => setSent(true), 900);
  };

  return (
    <section id="ulasan" className="section">
      <Container className="wrap">
        <Row className="align-items-center gy-4 gx-lg-5">
          <Col lg={6}>
            <Eyebrow>Saran &amp; Masukan</Eyebrow>
            <h2 className="section-title">
              Katakan Apa Saja, Dapur Kami Mendengar
            </h2>
            <p className="section-copy">
              Setiap pesan yang masuk akan dibaca langsung oleh kepala dapur.
            </p>
          </Col>

          <Col lg={6}>
            <div className="form-panel bg-white">
              {showAlert && !sent && (
                <div className="form-alert show align-items-center fw-bold" role="alert">
                  <i className="bi bi-wifi-off" /> Ups, ada isian yang belum lengkap.
                </div>
              )}

              {sent ? (
                <div className="form-success show align-items-center fw-bold flex-column text-center gap-2" role="status">
                  <i className="bi bi-check-circle" />
                  <p className="m-0">Terima kasih, masukanmu sudah terkirim!</p>
                </div>
              ) : (
                <Form noValidate onSubmit={handleSubmit}>
                  <Field id="nama" label="Nama Kamu" required error={errors.nama}>
                    <Form.Control id="nama" className="f-control w-100" placeholder="Misal: Sahang Belitung" value={form.nama} onChange={(e) => setField("nama", e.target.value)}/>
                  </Field>

                  <Field id="email" label="Email (opsional)" error={errors.email}>
                    <Form.Control id="email" type="email" className="f-control w-100" placeholder="biar kami bisa membalas" value={form.email} onChange={(e) => setField("email", e.target.value)}/>
                  </Field>

                  <div className={`field ${errors.rating ? "has-error" : ""}`}>
                    <div className="f-label d-block">
                      Berapa Bintang untuk Kami? <em className="req">*</em>
                    </div>
                    <div className="stars-row d-flex align-items-center flex-wrap">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} type="button" className={`star ${n <= form.rating ? "active" : ""}`} onClick={() => setField("rating", n)}>
                          <i className="bi bi-star-fill" />
                        </button>
                      ))}
                      <div className="star-label ms-2 fw-bold">
                        {starLabels[form.rating]}
                      </div>
                    </div>
                    {errors.rating && (
                      <div className="error-msg mt-1">{errors.rating}</div>
                    )}
                  </div>

                  <Field id="kategori" label="Mau Bicara Soal Apa?">
                    <Form.Select id="kategori" className="f-control w-100" value={form.kategori} onChange={(e) => setField("kategori", e.target.value)}>
                      <option value="Makanan">Makanan</option>
                      <option value="Pelayanan">Pelayanan</option>
                      <option value="Tempat">Tempat &amp; Suasana</option>
                      <option value="Lainnya">Lainnya</option>
                    </Form.Select>
                  </Field>

                  <Field id="pesan" label="Pesan Kamu" required error={errors.pesan}>
                    <Form.Control as="textarea" id="pesan" rows={4} maxLength={500} className="f-control w-100" placeholder="Ceritakan pengalamanmu..." value={form.pesan} onChange={(e) => setField("pesan", e.target.value)}/>
                    <div className="char-count d-block text-end mt-1">
                      {form.pesan.length}/500
                    </div>
                  </Field>

                  <Button type="submit" disabled={sending} className="btn-app btn-solid d-inline-flex align-items-center gap-2 rounded-pill border-0">
                    <i className="bi bi-send" />{" "}
                    <span>{sending ? "Mengirim..." : "Kirim Masukan"}</span>
                  </Button>
                </Form>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
