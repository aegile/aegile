import React from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function AlertDeleteDialog({
  deleteRoute,
  showDeleteDialog,
  setShowDeleteDialog,
}: {
  deleteRoute: string;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (showDeleteDialog: boolean) => void;
}) {
  const router = useRouter();

  async function handleDelete(route: string) {
    console.log("🚀 ~ handleDelete ~ route:", route);
    const response = await fetch(deleteRoute, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      toast.info("Deletion successful.");
    } else {
      toast.error("Failed to delete user.");
    }
    router.refresh();
  }

  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you certain you want to delete this?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This item will no longer be accessible
            by you or others you&apos;ve shared it with.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={async () => {
              setShowDeleteDialog(false);
              await handleDelete(deleteRoute);
              router.refresh();
            }}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
