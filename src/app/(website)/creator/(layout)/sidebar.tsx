"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { BookOpen, CheckCircle2, Boxes, Route } from "lucide-react"
import HeaderLogo from "@/components/app/app"

const nav = [
  { label: "Concepts",    href: "/creator/concepts",   icon: BookOpen },
  { label: "Challenges",  href: "/creator/challenges", icon: CheckCircle2 },
  { label: "Projects",    href: "/creator/projects",   icon: Boxes },
  { label: "Journeys",    href: "/creator/journeys",   icon: Route, badge: "NEW" },
  { label: "Inspiration", href: "/creator/inspiration" , icon: CheckCircle2 },
  { label: "Blocks",      href: "/creator/blocks",     icon: BookOpen },
];


export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2"> 
          <HeaderLogo url={""} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + "/");

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.href} className="font-sans">
                        <Icon className="mr-2 size-4" />
                        <span className="truncate">{item.label}</span>
                        {item.badge ? (
                          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

/** Optional wrapper: use this to keep a familiar “content area” API */
export function WithSidebarInset({ children }: { children: React.ReactNode }) {
  return <SidebarInset className="min-h-screen">{children}</SidebarInset>;
}