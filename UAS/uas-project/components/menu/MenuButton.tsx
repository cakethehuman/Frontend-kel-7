"use client";

import { Button, Stack } from 'react-bootstrap';

const buttonInfo = [
  {
    id: 1,
    icon: "empty for now",
    btn_name: "Main",
  },
  {
    id: 2,
    icon: "empty for now",
    btn_name: "Drinks",
  },
  {
    id: 3,
    icon: "empty for now",
    btn_name: "Others",
  },
];

export default function MenuButton() {
  const scrollToSection = (target: string) => {
    document.getElementById(target)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Stack direction="horizontal" gap={3} className="d-flex justify-content-center py-2 px-3">
      {buttonInfo.map((item) => (
        <Button
          key={item.id}
          variant="danger"
          className="rounded-pill text-white px-3 py-2"
          onClick={() => scrollToSection(item.btn_name === "Drinks" ? "Drink" : item.btn_name)}
        >{item.btn_name}
        </Button>
      ))}
    </Stack>
  );
}

