"use client";

import { useState } from "react";
import { Badge, Button, Table } from "react-bootstrap";

type User = { id: number; name: string; email: string; role: "user" | "admin" };

const initial: User[] = [
  { id: 1, name: "Admin", email: "admin@mail.com", role: "admin" },
  { id: 2, name: "Budi", email: "budi@mail.com", role: "user" },
  { id: 3, name: "Sari", email: "sari@mail.com", role: "user" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initial);

  const remove = (user: User) => {
    if (confirm(`Delete ${user.name}?`)) setUsers(users.filter((u) => u.id !== user.id));
  };

  return (
    <>
      <h3 className="mb-3">Users</h3>

      <Table striped hover responsive className="align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <Badge bg={u.role === "admin" ? "primary" : "secondary"}>{u.role}</Badge>
              </td>
              <td>
                {u.role === "user" && (
                  <Button size="sm" variant="outline-danger" onClick={() => remove(u)}>
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
