import type { ReactNode } from "react";
import Eyebrow from "@/components/ui/Eyebrow";

type SectionHeadingProps = {
  title: ReactNode;
  subtitle?: string;
  eyebrow?: string;
  variant?: "brand" | "section";
};

export default function SectionHeading({
  title,
  subtitle,
  eyebrow,
  variant = "brand",
}: SectionHeadingProps) {
  if (variant === "section") {
    return (
      <>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="section-title">{title}</h2>
      </>
    );
  }
  return (
    <>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={`brand-heading fw-bold text-center ${subtitle ? "mb-2" : "mb-5"
          }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-center text-secondary col-lg-6 mx-auto mb-5">
          {subtitle}
        </p>
      )}
    </>
  );
}
