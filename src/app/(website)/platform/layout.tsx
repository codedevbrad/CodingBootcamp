import type { Metadata } from "next"
import Header from "./(layout)/header" 
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./me/notes/notesSidebar"
import HeaderBanner from "./(layout)/branding"

export const metadata: Metadata = {
  title: "The Code Bootcamp",
  description: "Student platform",
}


export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
    return (
      <SidebarProvider>  
        <AppSidebar />
        <div className="min-h-screen font-sans w-full bg-white">
          <HeaderBanner />
          <Header />
          <div className="p-5">
            {children}
          </div>
        </div>
      </SidebarProvider>
    )
}