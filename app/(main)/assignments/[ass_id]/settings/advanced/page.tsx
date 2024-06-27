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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import AssignmentAdvancedForm from "./assignment-advanced-form";

export default function AssignmentAdvancedSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Advanced & Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          These settings are critical and should be handled with care.
        </p>
      </div>
      <Separator />
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Delete Assignment</h4>
        <p className="text-sm text-muted-foreground">
          Permanently delete this assignment and all associated data.
        </p>
        <AssignmentAdvancedForm />
      </div>
    </div>
  );
}
