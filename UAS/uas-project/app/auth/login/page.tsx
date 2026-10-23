"use client";

import { Container, Form, Button } from "react-bootstrap";
import "@/app/css/constants.css";

export default function Login() {
  const handleSubmit = (event) => {
    event.preventDefault();

    // Connect your authentication logic here
  };

  return (
    <section className="login">
      <Container className="d-flex justify-content-center align-items-center p-5 min-vh-100">
        <div className="d-flex bg-light w-50 rounded justify-content-center align-items-center">
          <div className="p-4 w-100">
            <div className="d-flex justify-content-center">
              <h1 className="fs-2">LOGIN</h1>
            </div>

            <Form
              id="loginForm"
              className="d-flex flex-column gap-3 w-100"
              onSubmit={handleSubmit}
            >
              <Form.Group>
                <Form.Label htmlFor="Email">Email</Form.Label>
                <Form.Control
                  type="email"
                  id="Email"
                  name="Email"
                  placeholder="Cake@gmail.com"
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor="Password">Password</Form.Label>
                <Form.Control
                  type="password"
                  id="Password"
                  name="Password"
                  placeholder="Password"
                  required
                />
              </Form.Group>

              <div className="result"></div>

              <Button
                type="submit"
                className="bg-primary-color text-light w-100"
              >
                Login
              </Button>
            </Form>

            <div className="d-flex justify-content-center p-2">
              <div className="d-flex flex-column gap-2 text-center">
                <a href="/auth/register">Don't have an account?</a>
                <a href="/auth/forget-password">Forgot your password?</a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

