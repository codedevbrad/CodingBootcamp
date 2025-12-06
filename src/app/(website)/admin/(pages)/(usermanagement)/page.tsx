"use server";

import { getAllUsers } from "../../db/db.users/db.users"; 
import UserManagementClient from "./client";

export default async function AdminPage() {
  const users = await getAllUsers();

  return (
    <div className="flex flex-col h-screen p-4">
      <h1 className="text-2xl font-bold">User Management</h1>
      <p className="text-sm text-gray-500">Manage the users of the platform.</p>
      <div className="flex flex-col gap-4 mt-4">
        <UserManagementClient initialUsers={users} />
      </div>
    </div>
  );
}