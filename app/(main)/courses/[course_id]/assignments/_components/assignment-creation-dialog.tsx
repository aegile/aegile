import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AssignmentCreationForm } from "./assignment-creation-form";

export default function AssignmentCreationDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <PlusIcon className="mr-1 h-4 w-4" />
          <span className="">New</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-h-md">
        <DialogHeader>
          <DialogTitle>Add Deliverable</DialogTitle>
          <DialogDescription>
            Create a new deliverable for this assignment.
          </DialogDescription>
        </DialogHeader>

        <AssignmentCreationForm />
        {/* <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
            <Button type="button" variant="secondary">
            Close
            </Button>
        </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
