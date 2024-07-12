import { Suspense } from "react";

import { serverFetch } from "@/lib/server-utils";
import { User } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shell";

import MembersTable from "./members-table";

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
  const members: User[] = await getTutorialMembers(params.tut_id);
  const enrollableUsers: User[] = await getEnrollableMembers(params.tut_id);

  return (
    <div className="px-4 py-6 md:px-10">
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">Tutorial members</h2>
        <p className="text-sm text-muted-foreground">
          Manage members and project groups within this tutorial.
        </p>
      </div>
      <Separator className="my-6" />
      <Shell>
        <Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          <MembersTable members={members} candidates={enrollableUsers} />
        </Suspense>
      </Shell>
    </div>
  );
}
