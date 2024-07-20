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
  // console.log("FETCHING COURSE ASSIGNMENTS x1");
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

export default async function TutorialProjectsPage({
  params,
}: {
  params: { tut_id: string };
}) {
  const tutorialData = await getTutorial(params.tut_id);
  const assignmentsData = await getAssignments(tutorialData.course_id);

  return <AssignmentInbox items={assignmentsData} />;
}
