import { Metadata } from "next";

import { Course } from "@/lib/types";
import { NavCollapsedMenu, NavMenuBar } from "@/components/custom/nav-menu-bar";

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
      href: "classes?days=All",
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
