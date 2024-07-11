import { cookies } from "next/headers";

import { getCookie } from "cookies-next";

import { serverFetch } from "@/lib/server-utils";
import { Separator } from "@/components/ui/separator";

import { AssignmentInbox } from "./assignment-inbox";

async function getTutorialData(tutorialId: string) {
  try {
    const data = await serverFetch(`/api/tutorials/${tutorialId}`, "GET");
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

async function getAssignments(courseId: string) {
  try {
    const data = await serverFetch(
      `/api/assignments?course_id=${courseId}`,
      "GET",
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function getProjectGroups(tut_id: string) {
  //   try {
  //     const data = await serverFetch(
  //       `/api/assignments?course_id=${courseId}`,
  //       "GET",
  //     );
  //     return data;
  //   } catch (error) {
  //     console.error(error);
  //   }
}

export default async function TutorialProjectsPage({
  params,
}: {
  params: { tut_id: string };
}) {
  const tutorialData = await getTutorialData(params.tut_id);
  const assignmentsData = await getAssignments(tutorialData.course_id);

  return (
    // <main className="grid min-h-[calc(100vh-6.5rem)] flex-1 gap-4 bg-muted/40 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 grid-flow-row">
    <div className="bg-muted/20 px-4 py-6 md:px-10">
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">Project Groups</h2>
        <p className="text-sm text-muted-foreground">
          View and access project groups for course assignments.
        </p>
      </div>
      <Separator className="my-6" />
      <AssignmentInbox items={assignmentsData} />
    </div>
    // <main className="grid flex-1 flex-grow gap-4 p-4 pb-0 sm:px-6 md:gap-8">
    // </main>
  );
}
