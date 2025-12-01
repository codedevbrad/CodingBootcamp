"use client";

import Link from "next/link";

interface BackLinkProps {
  href: string;
  text: string;
  icon?: boolean; // optional arrow
  className?: string; // allow extra styling if needed
}

export default function BackLink({
  href,
  text,
  icon = true,
  className = "",
}: BackLinkProps) {
  return (
    <Link
      href={href}
      className={
        "inline-flex items-center mt-6 text-sm underline decoration-dotted underline-offset-4 opacity-80 hover:opacity-100 transition " +
        className
      }
    >
      {icon && <span className="mr-1">←</span>}
      {text}
    </Link>
  );
}
