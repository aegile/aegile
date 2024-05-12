import { Metadata } from "next";
import { fetchServerAPIRequest } from "@/lib/server-utils";
import { Course } from "@/lib/types";
import Link from "next/link";
import { NavMenuBar, NavCollapsedMenu } from "@/components/custom/nav-menu-bar";
import { Description } from "@radix-ui/react-dialog";

// async function getCourse(course_id: string) {
//   const res = await fetchServerAPIRequest(
//     `/api/v1/courses/${course_id}`,
//     'GET'
//   );
//   if (res.status === 401)
//     throw new Error("You don't have permission to view this page.");
//   if (res.status === 403)
//     throw new Error('You are not authorized to view this page.');

//   const data = await res.json();
//   return data;
// }

export default async function ProjectPageLayout({
  params,
  children,
}: {
  params: { project_id: string };
  children: React.ReactNode;
}) {
  // const course: Course = await getCourse(params.course_id);

  const links = [
    {
      title: "Tasks",
      href: "tasks",
      description: "View and manage your project's tasks.",
    },
    {
      title: "Settings",
      href: "settings",
      description: "Configure your project settings.",
    },
  ];
  return (
    <>
      <NavMenuBar route="projects" page_id={params.project_id} links={links} />
      <NavCollapsedMenu
        route="projects"
        page_id={params.project_id}
        links={links}
      />
      {children}
    </>
  );
}
