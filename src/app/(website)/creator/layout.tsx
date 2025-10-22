// src/app/tutorHub/layout.tsx
import type { Metadata } from "next"
import CreatorHeader from "./(layout)/header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./(layout)/sidebar"

export const metadata: Metadata = {
  title: "Creator - The Code Bootcamp",
  description: "Tutor Dashboard - Learning Application",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full"> 
        <CreatorHeader />
        <div className="p-4">
            {children}
        </div>
      </main>
    </SidebarProvider>
  )
}