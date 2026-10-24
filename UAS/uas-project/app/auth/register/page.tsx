"use client";

import { Container, Form, Button } from "react-bootstrap";
import Link from "next/link";
import "@/app/css/constants.css";

export default function RegisterPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Connect your registration logic here
  };

  return (
    <section className="login">
      <Container className="d-flex justify-content-center align-items-center p-5 min-vh-100">
        <div className="d-flex bg-light w-50 rounded justify-content-center align-items-center">
          <div className="p-4 w-100">
            <div className="d-flex justify-content-center">
              <h1 className="fs-2">REGISTER</h1>
            </div>

            <Form
              id="registerForm"
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
                <Form.Label htmlFor="Name">Name</Form.Label>
                <Form.Control
                  type="text"
                  id="Name"
                  name="Name"
                  placeholder="Cakethehuman"
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

              <Form.Group>
                <Form.Label htmlFor="confirmPassword">
                  Confirm Password
                </Form.Label>
                <Form.Control
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                />
              </Form.Group>

              <div className="result"></div>

              <Button
                type="submit"
                className="bg-primary-color text-light w-100"
              >
                Register
              </Button>
            </Form>

            <div className="d-flex justify-content-center p-2">
              <Link href="/auth/login">Have an account?</Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
