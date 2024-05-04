import { UploadCloudIcon } from "lucide-react";

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

import FileUpload from "@/components/custom/file-upload";

export default function FileUploadDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <UploadCloudIcon className="mr-2 h-4 w-4" />
          File upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-base">Upload your files</DialogTitle>
          <DialogDescription>{"hello"}</DialogDescription>
        </DialogHeader>
        <FileUpload />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
