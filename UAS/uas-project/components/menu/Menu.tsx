
"use client";

import "@/app/css/constants.css";
import { Stack, Container, Row, Col } from "react-bootstrap";

const menuType = ["Main", "Drink", "Others"];

const menus = {
  Main: [
    {
      id: 1,
      image: "/images/mie-belitung.jpg",
      name: "Mie Belitung",
      description: "Mie Belitung dengan kuah khas.",
      price: "Rp 20.000",
    },
    {
      id: 2,
      image: "/images/mie-belitung-special.jpg",
      name: "Mie Belitung Special",
      description: "Mie Belitung dengan topping spesial.",
      price: "Rp 25.000",
    },
  ],

  Drink: [
    {
      id: 3,
      image: "/images/es-teh.jpg",
      name: "Es Teh",
      description: "Teh manis dingin yang menyegarkan.",
      price: "Rp 5.000",
    },
  ],

  Others: [
    {
      id: 4,
      image: "/images/kerupuk.jpg",
      name: "Kerupuk",
      description: "Kerupuk renyah sebagai pelengkap.",
      price: "Rp 3.000",
    },
  ],
};

export default function Menu() {
  return (
    <Stack gap={3} className="px-3 py-2">
      {menuType.map((menuFoodType) => (
        <section key={menuFoodType} id={menuFoodType}>
          <div className="d-flex justify-content-center">
            <h2 className="text-danger">{menuFoodType} Menu</h2>
          </div>

          <Container className="py-3 px-5 w-75">
            <Row xs={1} md={2} lg={3} className="g-2">
              {menus[menuFoodType].map((item) => (
                <Col key={item.id} className="px-2 py-2">
                  <div className="bg-darker-beige rounded p-3 h-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-fluid rounded mb-3 w-100"
                      style={{
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />

                    <h3>{item.name}</h3>
                    <p>{item.description}</p>

                    <div className="d-flex justify-content-between align-items-end gap-3">
                      <div>
                        <p className="text-muted small mb-0">Harga</p>
                        <p className="h5 fw-bold text-danger mb-0">
                          {item.price}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm bg-primary-color text-light add-to-cart"
                        data-item-id={item.id}
                        aria-label={`Tambahkan ${item.name} ke keranjang`}
                      >
                        <i
                          className="bi bi-cart"
                          aria-hidden="true"
                        ></i>
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

