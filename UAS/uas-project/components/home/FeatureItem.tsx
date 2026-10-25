import type { ReactNode } from "react";

type FeatureItemProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
};

export default function FeatureItem({ icon, title, subtitle }: FeatureItemProps) {
  return (
    <div className="icon-and-text-wrapper">
      <div className="icon-wrapper p-2 rounded-circle bg-white border">
        {icon}
      </div>
      <div className="footer-pertama-description-wrapper">
        <p className="paragraph-footer-description">
          <b>{title}</b>
        </p>
        <p className="paragraph-footer-description lower-paragraph-description">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
