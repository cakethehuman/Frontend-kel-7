import type { ReactNode } from "react";

interface FeatureBoxProps {
  icon: string;
  judul: string;
  children: ReactNode;
}

export default function FeatureBox(props: FeatureBoxProps) {
  return (
    <div className="feature-box">
      <i className={props.icon}></i>
      <h4>{props.judul}</h4>
      <p>{props.children}</p>
    </div>
  );
}