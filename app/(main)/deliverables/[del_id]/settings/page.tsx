import { notFound } from "next/navigation";

import { serverFetch } from "@/lib/server-utils";
import { Separator } from "@/components/ui/separator";

import { DeliverableEditForm } from "./deliverable-edit-form";

async function getDeliverableData(deliverableId: string) {
  try {
    const data = await serverFetch(`/api/deliverables/${deliverableId}`, "GET");
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

export default async function DeliverableSettingsPage({
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
        <h3 className="text-lg font-medium">General</h3>
        <p className="text-sm text-muted-foreground">
          Edit general information about this deliverable.
        </p>
      </div>
      <Separator />
      <DeliverableEditForm initialData={deliverableData} />
    </div>
  );
}
