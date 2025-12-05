"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";


export function GoBackInHistory ( ) {
    return (
          <div
            onClick={() => window.history.back()}
            className="cursor-pointer absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </div>
    )
}


interface BackLinkProps {
  href: string;
  text: string;
  icon?: boolean; // optional arrow
  className?: string; // allow extra styling if needed
}

export function BackLink({
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
