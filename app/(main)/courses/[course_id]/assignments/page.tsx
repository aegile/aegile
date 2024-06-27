import { cookies } from "next/headers";

import { getCookie } from "cookies-next";

import { Separator } from "@/components/ui/separator";

import { AssignmentInbox } from "./_components/assignment-inbox";

async function getAssignments(courseId: string) {
  const url = `${process.env.VERCEL_ENV === "development" ? "http" : "https"}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/assignments?course_id=${courseId}`;
  const jwtCookie = getCookie("_vercel_jwt", { cookies });
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  };
  options.headers = {
    ...options.headers,
    ...(jwtCookie ? { Cookie: `_vercel_jwt=${jwtCookie}` } : {}),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("🚀 ~ getAssignments ~ data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export default async function CourseAssignmentPage({
  params,
}: {
  params: { course_id: string };
}) {
  const assignmentsData = await getAssignments(params.course_id);

  return (
    // <main className="grid min-h-[calc(100vh-6.5rem)] flex-1 gap-4 bg-muted/40 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 grid-flow-row">
    <div className="bg-muted/20 px-4 py-6 md:px-10">
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">
          Course Assignments
        </h2>
        <p className="text-sm text-muted-foreground">
          View and manage past and current course assignments.
        </p>
      </div>
      <Separator className="my-6" />
      <AssignmentInbox items={assignmentsData} />
    </div>
    // <main className="grid flex-1 flex-grow gap-4 p-4 pb-0 sm:px-6 md:gap-8">
    // </main>
  );
}
