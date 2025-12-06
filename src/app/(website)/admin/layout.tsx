export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen p-4">
            <h1 className="text-2xl font-bold">Admin</h1>
            <div className="flex flex-col gap-4">
                {children}
            </div>
        </div>
    )
}