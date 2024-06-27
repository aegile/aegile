import { Metadata } from "next";
import Link from "next/link";

import { Description } from "@radix-ui/react-dialog";

import { Course } from "@/lib/types";
import { NavCollapsedMenu, NavMenuBar } from "@/components/custom/nav-menu-bar";

export default function ProjectPageLayout({
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
