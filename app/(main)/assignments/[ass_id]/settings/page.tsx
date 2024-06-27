import { serverFetch } from "@/lib/server-utils";
import { Separator } from "@/components/ui/separator";

import { AssignmentInfoForm } from "./assignment-info-form";

async function getAssignmentData(assignmentId: string) {
  try {
    const data = await serverFetch(`api/assignments/${assignmentId}`, "GET");
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

export default async function AssignmentSettingsPage({
  params,
}: {
  params: { ass_id: string };
}) {
  const assignmentData = await getAssignmentData(params.ass_id);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General</h3>
        <p className="text-sm text-muted-foreground">
          Edit general information about this assignment.
        </p>
      </div>
      <Separator />
      <AssignmentInfoForm
        initialData={assignmentData}
        assignmentId={params.ass_id}
      />
    </div>
  );
}
