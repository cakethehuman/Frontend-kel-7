import type { Metadata } from "next";
import { Libre_Baskerville, Nunito } from "next/font/google";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "./css/constants.css";
import "./css/style.css";
import "./css/navbar.css";
import "./css/hero-bg.css";

import Navbar from "@/components/Navbar";

const libre = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: {
    default: "Mie Belitung",
    template: "%s | Mie Belitung",
  },
  description: "Mie Belitung - Makanan Khas Belitung",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${libre.variable} ${nunito.variable}`}>
      <body className="d-flex flex-column min-vh-100 bg-beige text-dark">
        <Navbar />
        {children}
        {/* TODO: pasang <Footer /> di sini setelah komponen footer dibuat */}
      </body>
    </html>
  );
}
