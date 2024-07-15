import { serverFetch } from "@/lib/server-utils";
import { Deliverable } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import DeliverableCard from "@/components/custom/deliverable-card";

import { DeliverableCreator } from "./deliverable-creator";

async function getDeliverables(assignmentId: string) {
  try {
    const data = await serverFetch(
      `/api/deliverables?assignment_id=${assignmentId}`,
      "GET",
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default async function AssignmentDeliverablesPage({
  params,
}: {
  params: { ass_id: string };
}) {
  const deliverables: Deliverable[] = await getDeliverables(params.ass_id);

  return (
    <div className="px-4 py-6 md:px-10">
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">
          Assignment Deliverables
        </h2>
        <p className="text-sm text-muted-foreground">
          View all the deliverables for this assignment.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 gap-4  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {deliverables.map((deliverable: Deliverable) => (
          <DeliverableCard key={deliverable.id} {...deliverable} />
        ))}
        <DeliverableCreator />
      </div>
    </div>
  );
}
