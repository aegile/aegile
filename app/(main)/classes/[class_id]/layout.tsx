"use client";

import { Metadata } from "next";

import { Course } from "@/lib/types";
import { NavCollapsedMenu, NavMenuBar } from "@/components/custom/nav-menu-bar";

export default function ClassLayout({
  params,
  children,
}: {
  params: { class_id: string };
  children: React.ReactNode;
}) {
  // const course: Course = await getCourse(params.course_id);
  const links = [
    {
      title: "Projects",
      href: "projects",
      description: "View and manage your class projects for each assignment.",
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
      <NavMenuBar route="classes" page_id={params.class_id} links={links} />
      <NavCollapsedMenu
        route="classes"
        page_id={params.class_id}
        links={links}
      />
      {children}
    </>
  );
}
