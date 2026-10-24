"use client";

import "@/app/css/constants.css";
import Image from "next/image";
import { Stack, Container, Row, Col } from "react-bootstrap";
import { menuCategories, menuItems, type MenuItem } from "@/data/menu";
import { CartStore } from "@/lib/cartStore";
import { rupiah } from "@/lib/format";
import { useRouter } from "next/navigation";

export default function Menu() {

  const router = useRouter();

  const order = (item: MenuItem) => {
    CartStore.add(item);
    router.push("/cart-info");
  };

  return (
    <Stack gap={3} className="px-3 py-2">
      {menuCategories.map((category) => (
        <section key={category} id={category}>
          <div className="d-flex justify-content-center">
            <h2 className="text-danger">{category} Menu</h2>
          </div>

          <Container className="py-3 px-3">
            <Row xs={1} md={2} lg={3} className="g-1">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <Col key={item.id} className="px-2 py-1">
                    <div className="bg-darker-beige w-75 rounded p-3 h-100">
                      <Image src={item.img} alt={item.name} width={400} height={200} className="img-fluid rounded mb-3 w-100" style={{ height: "200px", objectFit: "cover" }}/>

                      <h3>{item.name}</h3>
                      <p>{item.description}</p>

                      <div className="d-flex justify-content-between align-items-end gap-3">
                        <div>
                          <p className="text-muted small mb-0">Harga</p>
                          <p className="h5 fw-bold text-danger mb-0">
                            {rupiah(item.price)}
                          </p>
                        </div>

                        <button type="button" className="btn btn-sm bg-primary-color text-light add-to-cart" aria-label={`Tambahkan ${item.name} ke keranjang`} onClick={() => order(item)}>
                          <i className="bi bi-cart" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  </Col>
                ))}
            </Row>
          </Container>
        </section>
      ))}
    </Stack>
  );
}