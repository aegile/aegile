import { notFound } from "next/navigation";

import { serverFetch } from "@/lib/server-utils";
import { Separator } from "@/components/ui/separator";

// Example usage
async function getAssignmentData(assignmentId: string) {
  try {
    const data = await serverFetch(`api/assignments/${assignmentId}`, "GET");
    console.log("Data fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

export default async function AssignmentHomePage({
  params,
}: {
  params: { ass_id: string };
}) {
  const assignmentData = await getAssignmentData(params.ass_id);

  if (!assignmentData) {
    return notFound();
  }

  return (
    <div className="bg-muted/20 px-4 py-6 md:px-10">
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">
          {assignmentData.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {assignmentData.description}
        </p>
      </div>
      <Separator className="my-6" />
    </div>
  );
}
