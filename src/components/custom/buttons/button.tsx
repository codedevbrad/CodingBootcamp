"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomButtonProps extends React.ComponentProps<"button"> {
  text: string;
  href?: string;              // if present → turns into Link
  className?: string;
  icon?: React.ReactNode;     // allow custom icons too
}

export function CustomButton({
  text,
  href,
  icon = <Crown className="w-5 h-5 mr-2" />,
  className,
  ...props
}: CustomButtonProps) {
  const baseClasses =
    "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl";

  const mergedClasses = cn(baseClasses, className);

  // 🎯 If href exists → turn into Link button
  if (href) {
    return (
      <Button asChild size="lg" className={mergedClasses}>
        <Link href={href}>
          {icon}
          {text}
        </Link>
      </Button>
    );
  }

  // 🎯 Default: regular button
  return (
    <Button size="lg" className={mergedClasses} {...props}>
      {icon}
      {text}
    </Button>
  );
}
