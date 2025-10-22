import type { Metadata } from "next"
import Header from "./(layout)/header"
import MyLearningHub from "./(layout)/profileHubCard"

export const metadata: Metadata = {
  title: "The Code Bootcamp",
  description: "Student platform",
}



export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <div className="p-5">
        {children}
        <MyLearningHub />
      </div>
    </div>
  )
}
