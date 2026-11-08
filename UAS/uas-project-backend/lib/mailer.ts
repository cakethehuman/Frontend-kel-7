import "dotenv/config";
import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;
const port = Number(SMTP_PORT ?? 587);

const transporter = SMTP_HOST
  ? nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  })
  : null;

export async function kirimEmail(tujuan: string, subjek: string, isi: string): Promise<void> {
  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP belum dikonfigurasi (SMTP_HOST kosong).");
    }
    // Mode development: tampilkan di terminal supaya bisa dites tanpa email sungguhan
    console.log(`\n[DEV] SMTP belum diatur, email tidak dikirim.\nKe: ${tujuan}\nSubjek: ${subjek}\n\n${isi}\n`);
    return;
  }

  await transporter.sendMail({
    from: MAIL_FROM || SMTP_USER,
    to: tujuan,
    subject: subjek,
    text: isi,
  });
}
