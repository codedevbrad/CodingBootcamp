import Navigation from "./(layout)/navigation"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full">
            <Navigation />
            <div className="w-full mt-4">
                {children}
            </div>
        </div>
    )
}