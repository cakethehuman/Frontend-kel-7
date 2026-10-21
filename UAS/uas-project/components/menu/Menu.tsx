"use client";
import "@/app/css/constants.css"; 
import { Stack, Container, Row, Col } from 'react-bootstrap';

const menuType = ['Main', 'Drink', 'Others'];

const menus = {
  'Main': [
    {
      id: 1,
      image: "later on the video",
      name: "Mie Belitung",
      description: "description",
      price: "price",
    },
    {
      id: 2,
      image: "later on the video",
      name: "Mie Belitung Special",
      description: "description",
      price: "price",
    },
  ],

  'Drink': [
    {
      id: 3,
      image: "later on the video",
      name: "Es Teh",
      description: "description",
      price: "price",
    },
  ],

  'Others': [
    {
      id: 4,
      image: "later on the video",
      name: "Kerupuk",
      description: "description",
      price: "price",
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

          <Container className="py-3 px-5 bg-danger w-75">
            <Row xs={1} md={2} lg={3} className="g-2">
              {menus[menuFoodType].map((item) => (
                <Col key={item.id} className="px-2 py-2">
                  <div className="bg-success rounded p-3">
                    <h3>{item.name}</h3>
                    <p>{item.price}</p>
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
