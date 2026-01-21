"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Avatar from "@/src/components/custom/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/shadcn/card";
import { Button } from "@/src/components/shadcn/button";
import { Skeleton } from "@/src/components/shadcn/skeleton";
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
} from "@/src/components/shadcn/alert-dialog";
import { useEffect, useState } from "react";
import AlertDialogContentModal from "@/src/components/modals/alert-dialog-content";
import { useMutation } from "@tanstack/react-query";
import { deleteUserAccount } from "@/src/lib/api/user/services";

/* ---------------- Skeleton ---------------- */

const ProfileSkeleton = () => {
  return (
    <div className="max-w-xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent>
          <Skeleton className="h-10 w-40" />
        </CardContent>
      </Card>
    </div>
  );
};

/* ---------------- Profile ---------------- */

const Profile = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [deleting, setDeleting] = useState<boolean>(false);

  const { mutate: deleteAccountMutation } = useMutation({
    mutationFn: deleteUserAccount,
    onMutate: () => {
      setDeleting(true);
    },
    onSuccess: async () => {
      localStorage.removeItem("workspaceSlug");
      await signOut();
    },
    onError: (error) => {
      console.error("Failed to delete account", error);
    },
    onSettled: () => {
      setDeleting(false);
    },
  });

  const handleDeleteAccount = () => {
    deleteAccountMutation();
  };

  useEffect(() => {
    console.log("user data", user);
  }, [user]);

  if (!isLoaded) {
    return <ProfileSkeleton />;
  }

  if (!user) return null;

  return (
    <div className="max-w-xl space-y-6 mt-5">
      {/* User Info */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar src={user.imageUrl} width={48} height={48} />
          <div>
            <CardTitle className="text-lg">
              {user.fullName ?? "No username"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>

        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContentModal
              loader={deleting}
              onContinue={handleDeleteAccount}
              buttonText="Yes, delete account"
            />
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
