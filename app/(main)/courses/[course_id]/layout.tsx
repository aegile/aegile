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

export default async function CourseLayout({
  params,
  children,
}: {
  params: { course_id: string };
  children: React.ReactNode;
}) {
  // const course: Course = await getCourse(params.course_id);

  const links = [
    {
      title: "Home",
      href: "",
      description: "Start here to get an overview of this course.",
    },
    {
      title: "Classes",
      href: "classes",
      description:
        "Get ready to explore all the amazing classes we have lined up for you!",
    },
    {
      title: "Participants",
      href: "participants",
      description: "Meet your fellow course participants and start networking!",
    },
    {
      title: "Assignments",
      href: "assignments",
      description:
        "Challenge yourself with our engaging and thought-provoking assignments!",
    },
    {
      title: "Grades",
      href: "grades",
      description: "Check out your progress and celebrate your achievements!",
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
      <NavMenuBar route="courses" page_id={params.course_id} links={links} />
      <NavCollapsedMenu
        route="courses"
        page_id={params.course_id}
        links={links}
      />
      {children}
    </>
  );
}
