"use client";

import { Container, Form, Button } from "react-bootstrap";
import Link from "next/link";
import "@/app/css/constants.css";

export default function ForgetPasswordPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Connect your password recovery logic here
  };

  return (
    <section className="login">
      <Container className="d-flex justify-content-center align-items-center p-5 min-vh-100">
        <div className="d-flex bg-light w-50 rounded justify-content-center align-items-center">
          <div className="p-4 w-100">
            <div className="d-flex justify-content-center">
              <h1 className="fs-2">Forget Password</h1>
            </div>

            <Form
              id="forgetPasswordForm"
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

              <Button
                type="submit"
                className="bg-primary-color text-light w-100"
              >
                Send Recovery Email
              </Button>
            </Form>

            <div className="d-flex justify-content-center p-2">
              <div className="d-flex flex-column gap-2 text-center">
                <Link href="/auth/login">Go back</Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

