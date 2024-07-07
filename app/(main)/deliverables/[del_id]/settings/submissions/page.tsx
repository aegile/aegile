import { notFound } from "next/navigation";

import { serverFetch } from "@/lib/server-utils";
import { Separator } from "@/components/ui/separator";

import { DeliverableSubmissionsForm } from "./deliverable-submissions-form";

async function getDeliverableData(deliverableId: string) {
  try {
    const data = await serverFetch(`/api/deliverables/${deliverableId}`, "GET");
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

export default async function DeliverableSubmissionSettingsPage({
  params,
}: {
  params: { del_id: string };
}) {
  const deliverableData = await getDeliverableData(params.del_id);
  if (!deliverableData) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Submissions</h3>
        <p className="text-sm text-muted-foreground">
          Edit configurations for submissions related to this deliverable.
        </p>
      </div>
      <Separator />
      <DeliverableSubmissionsForm />
    </div>
  );
}
