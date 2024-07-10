import { Suspense } from "react";

import { serverFetch } from "@/lib/server-utils";
import { Tutorial } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

import { TutorialCard } from "./tutorial-card";
import TutorialCreator from "./tutorial-creator";
import TutorialFilterByDay from "./tutorial-filter-by-day";

async function getTutorials(courseId: string) {
  try {
    const data = await serverFetch(
      `/api/tutorials?course_id=${courseId}`,
      "GET",
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default async function CourseClassesPage({
  params,
  searchParams,
}: {
  params: { course_id: string; days?: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const tutorials: Tutorial[] = await getTutorials(params.course_id);

  const selectedDays = Array.isArray(searchParams?.days)
    ? searchParams?.days
    : searchParams?.days?.split(",") || [];

  return (
    <div className="min-h-dvh flex flex-col bg-muted/20 px-4 py-6 md:px-10">
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">Tutorial Classes</h2>
        <p className="text-sm text-muted-foreground">
          View the classes you're overseeing for this course.
        </p>
      </div>
      <Separator className="my-6" />
      <section className="w-full py-6 md:py-8 lg:py-10">
        <div className="container space-y-10 px-4 md:px-6 xl:space-y-16">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h3 className="text-3xl font-semibold tracking-tighter md:text-3xl lg:text-4xl/none">
                Manage Your Classes
              </h3>
              <p className="mx-auto max-w-[700px] text-muted-foreground ">
                Oversee and organize your tutorials with ease. Add new
                tutorials, edit existing ones, and keep track of your students'
                progress.
              </p>
            </div>
            <TutorialCreator />
          </div>
        </div>
      </section>
      <div className="container grid grid-cols-1 gap-8 py-12 md:grid-cols-[200px_1fr] md:py-4">
        <TutorialFilterByDay />
        <Suspense fallback={<div>Loading...</div>}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {tutorials
              .filter(
                (tutorial) =>
                  selectedDays.includes(tutorial.day) ||
                  selectedDays.includes("All"),
              )
              .map((tutorial) => (
                <TutorialCard key={tutorial.id} {...tutorial} />
              ))}
          </div>
        </Suspense>
      </div>
    </div>
  );
}
