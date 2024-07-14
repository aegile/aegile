import { serverFetch } from "@/lib/server-utils";
import { ProjectOverview } from "@/lib/types";
import NotFoundWrapper from "@/components/not-found-wrapper";

import ProjectsCard from "../../../projects-card";

async function getTutorialGroupsPerAssignment(
  tutorialId: string,
  assignmentId: string,
) {
  // console.log("RENDERING GROUP PROJECT CARDS x1");
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

export default async function PhotoModal({
  params: { id: ass_id, tut_id },
}: {
  params: { id: string; tut_id: string };
}) {
  const projectGroups = await getTutorialGroupsPerAssignment(tut_id, ass_id);

  return (
    <NotFoundWrapper>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
        {projectGroups.map((group: ProjectOverview) => (
          <ProjectsCard key={group.id} {...group} />
        ))}
      </div>
    </NotFoundWrapper>
  );
}
