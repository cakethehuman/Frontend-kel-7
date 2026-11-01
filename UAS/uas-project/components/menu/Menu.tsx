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
    <Stack gap={3} className="px-3 py-2">
      {menuCategories.map((category) => {
        const categoryItems = menuList.filter(
          (item) => item.category.toLowerCase() === category.toLowerCase()
        );

        return (
          <section key={category} id={category}>
            <div className="d-flex justify-content-center">
              <h2 className="text-danger">{category} Menu</h2>
            </div>

            <Container className="py-3 px-3">
              <Row xs={1} md={2} lg={3} className="g-1">
                {categoryItems.map((item) => (
                  <Col key={item.id} className="px-2 py-1">
                    <div className="bg-darker-beige w-75 rounded p-3 h-100">
                      <Image
                        src={item.img}
                        alt={item.name}
                        width={400}
                        height={200}
                        className="img-fluid rounded mb-3 w-100"
                        style={{ height: "200px", objectFit: "cover" }}
                      />

                      <h3>{item.name}</h3>
                      <p>{item.description}</p>

                      <div className="d-flex justify-content-between align-items-end gap-3">
                        <div>
                          <p className="text-muted small mb-0">Harga</p>
                          <p className="h5 fw-bold text-danger mb-0">
                            {rupiah(item.price)}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="btn btn-sm bg-primary-color text-light add-to-cart"
                          aria-label={`Tambahkan ${item.name} ke keranjang`}
                          onClick={() => order(item)}
                        >
                          <i className="bi bi-cart" aria-hidden="true"></i>
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
