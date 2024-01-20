import * as React from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
Button;
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import AlertDeleteDialog from './alert-delete-dialog';

export function DropdownSettings<T>({
  editItem,
  EditDialog,
  deleteRoute,
}: {
  editItem: T;
  EditDialog: React.ComponentType<{
    item: T;
    open: boolean;
    setIsOpen: (isOpen: boolean) => void;
  }>;
  deleteRoute:string;
}) {
  const [open, setIsOpen] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => e.stopPropagation()}
            onSelect={() => setIsOpen(true)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => e.stopPropagation()}
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-400"
          >
            Delete class
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div onClick={(e) => e.stopPropagation()}>
        <EditDialog item={editItem} open={open} setIsOpen={setIsOpen} />
        {/* <Dialog open={open} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit class details</DialogTitle>
              <DialogDescription>
                Edit the details to this class/tutorial.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <AlertDeleteDialog deleteRoute={deleteRoute} showDeleteDialog={showDeleteDialog} setShowDeleteDialog={setShowDeleteDialog} />
        {/* <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you certain you want to delete this?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This item will no longer be
                accessible by you or others you&apos;ve shared it with.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDeleteDialog(false);
                  // fetch request route here
                  toast.info('Item deleted.');
                }}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> */}
      </div>
    </>
  );
}
