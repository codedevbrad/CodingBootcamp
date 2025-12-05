"use server"
import StudentFullProfile from "./_components/profile.card/student.profile"

export default async function ProfilePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white"    >
            <main className="max-w-6xl mx-auto px-6 py-20 space-y-14">
                <h1 className="text-4xl font-bold text-center">Profile</h1>
                <p className="text-lg text-center">This is your profile page. Here you can manage your account information and preferences.</p>
                <StudentFullProfile />
            </main>
        </div>
    )
}
