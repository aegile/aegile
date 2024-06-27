import { Separator } from "@/components/ui/separator";

export default async function AssignmentDeliverablesPage({
  params,
}: {
  params: { ass_id: string };
}) {
  //   const assignmentData = await getAssignmentData(params.ass_id);

  return (
    <div className="bg-muted/20 px-4 py-6 md:px-10">
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">
          Assignment Deliverables
        </h2>
        <p className="text-sm text-muted-foreground">
          View all the deliverables for this assignment.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-4" />
    </div>
  );
}
