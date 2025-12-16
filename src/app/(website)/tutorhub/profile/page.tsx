import { getTutorProfile } from "@/app/features/subscription/tutored/connection/tutor/db/db.tutor-profile";
import ProfileClient from "./client";

type SerializedTutorProfile = {
    id: string;
    userId: string;
    bio: string | null;
    hourlyRate: number | null;
    availability: Record<string, { start: string; end: string } | null> | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
};

export default async function ProfilePage() {
    const profile = await getTutorProfile();

    // Serialize the profile for client component (Int serializes as number)
    // Note: After schema change to Int, run `npx prisma generate` to update types
    const serializedProfile: SerializedTutorProfile | null = profile ? {
        ...profile,
        hourlyRate: profile.hourlyRate !== null ? Number(profile.hourlyRate) : null,
    } as SerializedTutorProfile : null;

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Tutor Profile</h1>
                <p className="text-muted-foreground">
                    Update your profile information, bio, hourly rate, and availability
                </p>
            </div>

            <ProfileClient initialProfile={serializedProfile} />
        </div>
    );
}