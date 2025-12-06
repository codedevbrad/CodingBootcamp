"use server"

import ProfileEditClient from "./profile.edit"

export default async function ProfileEditPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white"    >
            <ProfileEditClient  />
        </div>
    )
}