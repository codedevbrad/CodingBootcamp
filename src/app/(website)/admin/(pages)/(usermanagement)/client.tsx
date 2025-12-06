"use client";

import { useState, useTransition } from "react";
import { UserRole } from "@prisma/client";
import { updateUserRole, deleteUser } from "../../db/db.users/db.users";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type UserWithProfiles = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: UserRole;
  adminProfile: { id: string; permissions: string[]; createdAt: Date } | null;
  tutorProfile: { id: string; bio: string | null; hourlyRate: any; createdAt: Date } | null;
  studentProfile: {
    id: string;
    level: string;
    bio: string | null;
    createdAt: Date;
    subscriptions: { tier: string; status: string } | null;
  } | null;
};

export default function UserManagementClient({
  initialUsers,
}: {
  initialUsers: UserWithProfiles[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [isPending, startTransition] = useTransition();

  async function handleRoleChange(userId: string, newRole: UserRole) {
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole);
        // Update local state - we'll need to refetch to get updated profiles
        // For now, just update the role
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        // TODO: Consider refetching users after role change to get updated profiles
      } catch (error) {
        console.error("Failed to update role:", error);
        alert("Failed to update user role");
      }
    });
  }

  async function handleDeleteUser(userId: string) {
    startTransition(async () => {
      try {
        await deleteUser(userId);
        // Remove from local state
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user");
      }
    });
  }

  function getRoleBadgeColor(role: UserRole) {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "TUTOR":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "STUDENT":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  }

  function getSubscriptionStatusColor(status: string) {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "EXPIRED":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  }

  // Helper function to get createdAt from the appropriate profile
  function getProfileCreatedAt(user: UserWithProfiles): Date | null {
    if (user.role === "ADMIN" && user.adminProfile) {
      return user.adminProfile.createdAt;
    }
    if (user.role === "TUTOR" && user.tutorProfile) {
      return user.tutorProfile.createdAt;
    }
    if (user.role === "STUDENT" && user.studentProfile) {
      return user.studentProfile.createdAt;
    }
    return null;
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const createdAt = getProfileCreatedAt(user);
                const subscription = user.studentProfile?.subscriptions;
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name || "No name"}
                    </TableCell>
                    <TableCell>{user.email || "No email"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {user.adminProfile && (
                          <span className="text-xs text-gray-500">Admin Profile</span>
                        )}
                        {user.tutorProfile && (
                          <span className="text-xs text-gray-500">Tutor Profile</span>
                        )}
                        {user.studentProfile && (
                          <>
                            <span className="text-xs text-gray-500">
                              Student Profile ({user.studentProfile.level})
                            </span>
                            {subscription && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  Subscription:
                                </span>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                  {subscription.tier}
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-xs font-medium ${getSubscriptionStatusColor(
                                    subscription.status
                                  )}`}
                                >
                                  {subscription.status}
                                </span>
                              </div>
                            )}
                            {!subscription && (
                              <span className="text-xs text-gray-400 italic">
                                No subscription
                              </span>
                            )}
                          </>
                        )}
                        {!user.adminProfile &&
                          !user.tutorProfile &&
                          !user.studentProfile && (
                            <span className="text-xs text-gray-400">No profile</span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {createdAt
                        ? new Date(createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={user.role}
                          onValueChange={(value) =>
                            handleRoleChange(user.id, value as UserRole)
                          }
                          disabled={isPending}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                            <SelectItem value="TUTOR">TUTOR</SelectItem>
                            <SelectItem value="STUDENT">STUDENT</SelectItem>
                          </SelectContent>
                        </Select>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={isPending}
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete user{" "}
                                <strong>{user.name || user.email}</strong> and all
                                associated data. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}