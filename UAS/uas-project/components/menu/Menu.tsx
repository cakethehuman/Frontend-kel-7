"use client";

import "@/app/css/constants.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Stack, Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { menuCategories, type MenuItem, type MenuCategory } from "@/data/menu";
import { CartStore } from "@/lib/cartStore";
import { rupiah } from "@/lib/format";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Menu() {
  const router = useRouter();
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/menu`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const mapped: MenuItem[] = data.map((item: any) => ({
        id: item.id || item.slug || String(item.menu_id),
        name: item.name,
        description: item.description || "",
        price: Number(item.price) || 0,
        img: item.img || item.image || "/IMG/mie_belitung.webp",
        category: (item.category || item.item_type || "Others") as MenuCategory,
      }));
      setMenuList(mapped);
    } catch (err) {
      console.error("Gagal mengambil menu dari server:", err);
      setError("Gagal memuat menu dari server database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const order = (item: MenuItem) => {
    CartStore.add(item);
    router.push("/cart-info");
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" role="status" className="mb-2" />
        <p className="text-muted">Memuat data menu dari database...</p>
      </Container>
    );
  }

  if (error && menuList.length === 0) {
    return (
      <Container className="py-4">
        <Alert variant="danger" className="text-center">
          <p className="mb-2">{error}</p>
          <Button variant="outline-danger" size="sm" onClick={fetchMenu}>
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Stack gap={4} className="px-3 py-3">
      {menuCategories.map((category) => {
        const categoryItems = menuList.filter(
          (item) => item.category.toLowerCase() === category.toLowerCase()
        );

        if (categoryItems.length === 0) return null;

        return (
          <section key={category} id={category} className="my-2">
            <div className="d-flex justify-content-center mb-3">
              <h2 className="text-danger fw-bold border-bottom border-danger pb-1">
                {category} Menu
              </h2>
            </div>

            <Container className="py-2 px-3">
              <Row xs={1} md={2} lg={3} className="g-4">
                {categoryItems.map((item) => (
                  <Col key={item.id}>
                    <div className="bg-darker-beige w-100 rounded-4 p-3 h-100 shadow-sm d-flex flex-column justify-content-between transition-hover">
                      <div>
                        <div className="position-relative overflow-hidden rounded-3 mb-3" style={{ height: "200px" }}>
                          <Image
                            src={item.img}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-fit-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/IMG/mie_belitung.webp";
                            }}
                          />
                        </div>

                        <h3 className="h5 fw-bold text-dark text-truncate mb-2" title={item.name}>
                          {item.name}
                        </h3>

                        {/* Uniform height description to prevent overflow and underflow */}
                        <p
                          className="text-muted small mb-3"
                          style={{
                            minHeight: "44px",
                            maxHeight: "44px",
                            lineHeight: "22px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={item.description}
                        >
                          {item.description || "Hidangan khas Belitung lezat dan nikmat pilihan."}
                        </p>
                      </div>

                      <div className="d-flex justify-content-between align-items-end pt-2 border-top border-dark border-opacity-10">
                        <div>
                          <p className="text-muted small mb-0">Harga</p>
                          <p className="h5 fw-bold text-danger mb-0">
                            {rupiah(item.price)}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="btn btn-sm bg-primary-color text-light add-to-cart px-3 py-2 rounded-3 shadow-sm d-flex align-items-center gap-1"
                          aria-label={`Tambahkan ${item.name} ke keranjang`}
                          onClick={() => order(item)}
                        >
                          <i className="bi bi-cart-plus" aria-hidden="true"></i>
                          <span>Pesan</span>
                        </button>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>
        );
      })}
    </Stack>
  );
}
