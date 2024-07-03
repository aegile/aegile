import { notFound } from "next/navigation";

import { serverFetch } from "@/lib/server-utils";
import { NavCollapsedMenu, NavMenuBar } from "@/components/custom/nav-menu-bar";

async function getAssignmentData(assignmentId: string) {
  try {
    const data = await serverFetch(`/api/assignments/${assignmentId}`, "GET");
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

export default async function AssignmentLayout({
  params,
  children,
}: {
  params: { ass_id: string };
  children: React.ReactNode;
}) {
  // const course: Course = await getCourse(params.course_id);
  const assignmentData = getAssignmentData(params.ass_id);
  if (!assignmentData) {
    return notFound();
  }
  const links = [
    {
      title: "Home",
      href: "",
      description: "Start here to get an overview of this assignment!",
    },
    {
      title: "Deliverables",
      href: "deliverables",
      description:
        "View all the deliverables you need to submit for this assignment.",
    },
    {
      title: "Settings",
      href: "settings",
      description:
        "Customize your course experience to suit your learning style!",
    },
  ];
  return (
    <>
      <NavMenuBar route="assignments" page_id={params.ass_id} links={links} />
      <NavCollapsedMenu
        route="assignments"
        page_id={params.ass_id}
        links={links}
      />
      {children}
    </>
  );
}
