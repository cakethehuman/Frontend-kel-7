import type { ReactNode } from "react";

interface ProfileCardProps {
  className?: string;
  children: ReactNode;
}

export default function ProfileCard(props: ProfileCardProps) {
  return (
    <article className={"pf-card " + (props.className || "")}>
      {props.children}
    </article>
  );
}