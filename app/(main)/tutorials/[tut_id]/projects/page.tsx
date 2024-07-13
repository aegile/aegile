import Link from "next/link";

import { serverFetch } from "@/lib/server-utils";
import { ProjectOverview } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

import { AssignmentInbox } from "./assignment-inbox";
import ProjectsCard from "./projects-card";

async function getTutorial(tutorialId: string) {
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

async function getTutorialGroupsPerAssignment(
  tutorialId: string,
  assignmentId: string,
) {
  try {
    const data = await serverFetch(
      `/api/projects?tutorial_id=${tutorialId}&assignment_id=${assignmentId}`,
      "GET",
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default async function TutorialProjectsPage({
  params,
  searchParams,
}: {
  params: { tut_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const selectedAssignment: string = Array.isArray(searchParams?.ass_id)
    ? searchParams?.ass_id[0]
    : searchParams?.ass_id || "";
  const tutorialData = await getTutorial(params.tut_id);
  const assignmentsData = await getAssignments(tutorialData.course_id);
  const projectGroups = await getTutorialGroupsPerAssignment(
    params.tut_id,
    selectedAssignment,
  );

  console.log("🚀 ~ projectGroups:", projectGroups);
  return (
    <>
      <AssignmentInbox items={assignmentsData} />
      <div className="mx-2 hidden w-[1px] shrink-0 bg-zinc-200 dark:bg-zinc-800 md:mx-3 lg:block" />
      <div className="-mr-52 max-w-full flex-1 lg:-mr-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
          {projectGroups.map((group: ProjectOverview) => (
            <ProjectsCard />
          ))}
        </div>
      </div>
    </>
  );
}
