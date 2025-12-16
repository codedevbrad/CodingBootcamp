// src/app/tutorHub/layout.tsx
import type { Metadata } from "next"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {AppSidebar} from "./(layout)/sidebar"
import CustomBreadcrumb from "@/components/custom/breadcrumb"

export const metadata: Metadata = {
  title: "Creator - The Code Bootcamp",
  description: "Tutor Dashboard - Learning Application",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="w-full font-sans">
          <div className="flex items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
          <CustomBreadcrumb />
          <div className="p-4">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}