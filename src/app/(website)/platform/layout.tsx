import type { Metadata } from "next"
import Header from "./(layout)/header/index" 
import { SidebarProvider } from "@/components/ui/sidebar"
import RenderNotesSidebar from "./(content)/student/research/sidebar/render.notes"
import PlatformBreadcrumb from "./(layout)/breadcrumb"

export const metadata: Metadata = {
  title: "The Code Bootcamp",
  description: "Student platform",
}

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
    return (
      <SidebarProvider>  
          <RenderNotesSidebar />
          {/* Root content wrapper sits below the header's z-40 */}
          <div className="relative z-0 min-h-screen font-sans w-full bg-white">
            <Header />
            <div className="relative z-10 p-5">
              <PlatformBreadcrumb />
              {children}
            </div>
          </div>
       </SidebarProvider>
    )
}