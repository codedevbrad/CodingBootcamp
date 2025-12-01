"use client";

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
import { BookOpen, Rocket, Layers, Map, ArrowRight, PlusCircle } from "lucide-react";

/* --- Content for each section --- */
const sections = {
  create: {
    title: "Learn and create",
    description:
      "Practice creating System design and ERM diagrams",
    href: "/platform/create",
    color: "from-fuchsia-500/10 to-rose-500/10",
    icon: PlusCircle,
    links: [
      { title: "Create a Diagram", href: "/platform/create/diagram" },
      { title: "Coding Editor",       href: "/platform/create/code" },
      { title: "Build a project",  href: "/platform/create/project" }
    ],
  },
  concepts: {
    title: "Concepts",
    description:
      "Master theory with bite-sized interactive explanations and examples.",
    href: "/platform/concepts",
    color: "from-blue-500/10 to-purple-500/10",
    icon: BookOpen,
    links: [
      { title: "All Concepts", href: "/concepts" },
      { title: "JavaScript", href: "/concepts/javascript" },
      { title: "React", href: "/concepts/react" },
    ],
  }, 
  challenges: {
    title: "Challenges",
    description:
      "Sharpen your skills with coding puzzles and real-time grading.",
    href: "/platform/challenges",
    color: "from-orange-500/10 to-pink-500/10",
    icon: Rocket,
    links: [
      { title: "Daily Challenges", href: "/challenges/daily" },
      { title: "React Challenges", href: "/challenges/react" },
      { title: "Algorithm Drills", href: "/challenges/algorithms" },
    ],
  },
  projects: {
    title: "Projects",
    description:
      "Build real-world projects and showcase your progress through code.",
    href: "/platform/projects",
    color: "from-emerald-500/10 to-teal-500/10",
    icon: Layers,
    links: [
      { title: "All Projects", href: "/projects" },
      { title: "Beginner", href: "/projects/beginner" },
      { title: "Intermediate", href: "/projects/intermediate" },
    ],
  },
 
  journeys: {
    title: "Journeys",
    description:
      "Follow guided learning paths from beginner to pro, step by step.",
    href: "/platform/journeys",
    color: "from-cyan-500/10 to-blue-500/10",
    icon: Map,
    links: [
      { title: "Frontend Journey", href: "/journeys/frontend" },
      { title: "Backend Journey", href: "/journeys/backend" },
      { title: "Fullstack Path", href: "/journeys/fullstack" },
    ],
  },
  inspiration: {
    title: "inspiration",
    description: "Get inspired by cool designs and tricks",
    href: "/platform/inspiration",
    color: "from-orange-500/10 to-pink-500/10",
    icon: Rocket,
    links: [
        { title: "UI design" , href: "/platform/inspiration/design" }
    ]
  }
};


export function HeaderNavbar() {
  return (
    <header className="sticky top-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border">
      <NavigationMenu className="relative z-[200]">
        <NavigationMenuList className="flex-wrap">
          {Object.entries(sections).map(([key, section]) => (
            <NavigationMenuItem key={key}>
              <NavigationMenuTrigger className="cursor-pointer mr-3 font-sans">
                {section.title}
              </NavigationMenuTrigger>

              {/* important: z-index here too */}
              <NavigationMenuContent className="z-[300]">
                <ul className="grid gap-3 md:w-[450px] lg:w-[550px] lg:grid-cols-[.8fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        href={section.href}
                        className={cn(
                          "flex h-full w-full flex-col justify-end rounded-md border border-border bg-gradient-to-br p-5 transition-all hover:scale-[1.01] hover:shadow-md select-none",
                          section.color
                        )}
                      >
                        <div className="mb-3 flex items-center gap-2 text-lg font-semibold">
                          <section.icon className="h-5 w-5 text-primary" />
                          {section.title}
                        </div>
                        <p className="text-muted-foreground text-sm leading-snug">
                          {section.description}
                        </p>
                        <div className="mt-3 flex items-center text-primary text-sm font-medium gap-1">
                          Explore <ArrowRight className="h-4 w-4" />
                        </div>
                      </a>
                    </NavigationMenuLink>
                  </li>

                  {section.links.map((link) => (
                    <ListItem key={link.href} href={link.href} title={link.title}>
                      Go to {link.title.toLowerCase()}
                    </ListItem>
                  ))}
                </ul>
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
