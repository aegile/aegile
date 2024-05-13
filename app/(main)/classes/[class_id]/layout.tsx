"use client";

import { Metadata } from "next";
import { fetchServerAPIRequest } from "@/lib/server-utils";
import { Course } from "@/lib/types";
import { NavCollapsedMenu, NavMenuBar } from "@/components/custom/nav-menu-bar";

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
