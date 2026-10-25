import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function ButtonLink({
  href,
  children,
  className = "",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`d-inline-block text-decoration-none ${className}`.trim()}
    >
      {children}
    </Link>
  );
}

// This is the equivalent code

// export default function ButtonLink(props: ButtonLinkProps)
// {
//   const href = props.href
//   const children = props.children
//   const className = props.className ?? "";
//
//   return (
//   <Link
//     href={href}
//     className={`d-inline-block text-decoration-none ${className}`.trim()}
//   >
//     {children}
//   </Link>
//   )
// }
