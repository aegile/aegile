import { serverFetch } from "@/lib/server-utils";
import { User } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table/data-table";

import { columns } from "./columns";
import { DataTableToolbar } from "./tutorial-participants-table-toolbar";

async function getTutorialMembers(tutorialId: string) {
  try {
    const data = await serverFetch(
      `/api/tutorials/${tutorialId}/members`,
      "GET",
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

async function getEnrollableMembers(tutorialId: string) {
  try {
    const data = await serverFetch(
      `/api/tutorials/${tutorialId}/enrollable`,
      "GET",
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

export default async function TutorialMembersPage({
  params,
}: {
  params: { tut_id: string };
}) {
  const members = await getTutorialMembers(params.tut_id);
  const enrollableUsers: User[] = await getEnrollableMembers(params.tut_id);

  return (
    <div className="bg-muted/20 px-4 py-6 md:px-10">
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">Tutorial members</h2>
        <p className="text-sm text-muted-foreground">
          Manage members and project groups within this tutorial.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-2">
        <DataTable columns={columns} data={members}>
          <DataTableToolbar candidate={enrollableUsers} />
        </DataTable>
      </div>
    </div>
  );
}
