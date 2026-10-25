import type { ReactNode } from "react";

export default function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      className="eyebrow d-inline-block mb-2"
    >
      {children}
    </div>
  )
}
