"use server"

import { GuestNotesSidebar } from "./subscriptionType/guest.notes"
import { AppSidebar } from "./subscriptionType/student.notes"
import RenderBasedOnUserType from "@/app/(website)/platform/session/renderSwitch/server.renderswitch"

export default async function RenderNotesSidebar ( ) {
    return <RenderBasedOnUserType student={<AppSidebar />} guest={<GuestNotesSidebar />} />
}