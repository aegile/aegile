import { notFound } from "next/navigation";

import { serverFetch } from "@/lib/server-utils";
import { Separator } from "@/components/ui/separator";

async function getDeliverableData(deliverableId: string) {
  try {
    const data = await serverFetch(`/api/deliverables/${deliverableId}`, "GET");
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

export default async function AssignmentHomePage({
  params,
}: {
  params: { del_id: string };
}) {
  const deliverableData = await getDeliverableData(params.del_id);
  if (!deliverableData) {
    return notFound();
  }

  return (
    <div className="px-4 py-6 md:px-10">
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">
          {deliverableData.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {deliverableData.description}
        </p>
      </div>
      <Separator className="my-6" />
    </div>
  );
}
