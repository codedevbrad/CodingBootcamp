 "use client"

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { sections, type SectionConfig, type SectionLink } from "@/app/(website)/platform/lib/navigation/navItems";
import { Card } from "@/components/ui/card";



type SectionCardProps = {
  title: string;
  description: string;
  href: string;
  color: string;
  icon?: LucideIcon;
  ctaLabel?: string;
  emphasis?: "primary" | "secondary";
};

function SectionCard({
  title,
  description,
  href,
  color,
  icon: Icon,
  ctaLabel = "Explore",
  emphasis = "primary",
}: SectionCardProps) {
  return (
    <NavigationMenuLink asChild>
      <a
        href={href}
        className={cn(
          "flex h-full w-full flex-col justify-center rounded-md border bg-gradient-to-br p-5 transition-all hover:scale-[1.01] hover:shadow-md select-none",
          "border-border",
          color,
          emphasis === "secondary" && "border-dashed opacity-95"
        )}
      >
        <div className="mb-3 flex justify-start items-center gap-2 text-lg font-semibold">
          {Icon && <Icon className="h-5 w-5 text-primary" />}
          {title}
        </div>
        <p className="text-muted-foreground text-sm leading-snug">
          {description}
        </p>
        <div className="mt-3 flex items-center text-primary text-sm font-medium gap-1">
          {ctaLabel} <ArrowRight className="h-4 w-4" />
        </div>
      </a>
    </NavigationMenuLink>
  );
}



type SectionContentProps = {
  section: SectionConfig;
};

function SectionContent({ section }: SectionContentProps) {
  return (
    <ul className="grid gap-3 md:w-[850px] lg:w-[850px] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <li className="sm:col-span-1 md:col-span-2 lg:col-span-1">
        <SectionCard
          title={section.title}
          description={section.description}
          href={section.href}
          color={section.color}
          icon={section.icon}
          ctaLabel="Explore"
          emphasis="primary"
        />
      </li>
      
      {section.extraCard && (
        <li>
          <SectionCard
            title={section.extraCard.title}
            description={section.extraCard.description}
            href={section.href}
            color={section.color}
            ctaLabel="Learn more"
            emphasis="secondary"
          />
        </li>
      )} 
      
      <Card className={`flex flex-col gap-3 p-4 rounded-md bg-white`}>
        <h2 className="text-lg font-semibold pl-3 pt-4">Explore</h2>
        {section.links.map((link) => (
          <SectionLinkItem key={link.href} link={link} />
        ))} 
     </Card>

    </ul>
  );
}

type SectionLinkItemProps = {
  link: SectionLink;
};

function SectionLinkItem({ link }: SectionLinkItemProps) {
  return (
    <ListItem href={link.href} title={link.title}>
      Go to {link.title.toLowerCase()}
    </ListItem>
  );
}

export function HeaderNavbar() {
  return (
    <header className="sticky top-0 z-[100] bg-background backdrop-blur-md border-b border-border">
      <NavigationMenu className="relative z-[200]">

        <NavigationMenuList className="flex-wrap">

          {Object.entries(sections).map(([key, section]) => (
            <NavigationMenuItem key={key}>

              <NavigationMenuTrigger className="cursor-pointer mr-3 font-sans">
                {section.title}
              </NavigationMenuTrigger>

              {/* important: z-index here too */}
              <NavigationMenuContent className="z-[300]">
                <SectionContent section={section} />
              </NavigationMenuContent>

            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}

/* --- Reusable ListItem component --- */
function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <div className="text-base font-semibold">{title}</div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
