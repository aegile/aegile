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

export default function CourseAdvancedSettingsPage({
  params,
}: {
  params: { course_id: string };
}) {
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
        <h4 className="text-sm font-medium">Delete Course</h4>
        <p className="text-sm text-muted-foreground">
          Permanently delete this course and all associated data.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Course</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
