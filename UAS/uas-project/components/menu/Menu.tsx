"use client";

import "@/app/css/constants.css";
import { Stack, Container, Row, Col } from "react-bootstrap";

const menuType = ["Main", "Drink", "Others"];

const menus = {
  Main: [
    {
      id: 1,
      image: "/IMG/mie_belitung.webp",
      name: "Mie Belitung",
      description: "Mie Belitung dengan kuah khas dengan toping yang pas.",
      price: "Rp 20.000",
    },
    {
      id: 2,
      image: "/IMG/mie_belitung.webp",
      name: "Mie Belitung Special",
      description: "Mie Belitung dengan topping spesial.",
      price: "Rp 28.000",
    },
    {
      id: 3,
      image: "/IMG/mie_belitung.webp",
      name: "Mie Belitung Complit",
      description: "Mie Belitung dengan topping complit.",
      price: "Rp 29.000",
    },

  ],

  Drink: [
    {
      id: 1,
      image: "/IMG/EsJerukKunci.webp",
      name: "Es Jeruk Kunci",
      description: "Teh jeruk kunci yang dingin yang menyegarkan.",
      price: "Rp 5.000",
    },
    {
      id: 2,
      image: "/IMG/kopiBelitung.webp",
      name: "Kopi belitung",
      description: "Teh jeruk kunci yang dingin yang menyegarkan.",
      price: "Rp 5.000",
    },

  ],

  Others: [
    {
      id: 1,
      image: "/IMG/kerupukBelitung.webp",
      name: "Kerupuk belitung",
      description: "Kerupuk belitung",
      price: "Rp 3.000",
    },
    {
      id: 2,
      image: "/IMG/nasiTim.avif",
      name: "nasi tim",
      description: "Nasi tim paling enak",
      price: "Rp 25.000",
    },
    {
      id: 3,
      image: "/IMG/esBelitung.webp",
      name: "es belitung",
      description: "es belitung enak",
      price: "Rp 13.000",
    },


  ],
};

export default function Menu() {
  return (
    <Stack gap={3} className="px-3 py-2">
      {menuType.map((menuFoodType) => (
        <section key={menuFoodType} id={menuFoodType}>
          <div className="d-flex justify-content-center">
            <h2 className="text-danger">
              {menuFoodType} Menu
            </h2>
          </div>

          <Container className="py-3 px-3">
            <Row xs={1} md={2} lg={3} className="g-1">
              {menus[menuFoodType as keyof typeof menus].map((item) => (
                <Col key={item.id} className="px-2 py-1">
                  <div className="bg-darker-beige w-75 rounded p-3 h-100">
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
                        <p className="text-muted small mb-0">
                          Harga
                        </p>
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
