import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getCookie } from "cookies-next";

import { Separator } from "@/components/ui/separator";

import { CourseInfoForm } from "./course-info-form";

async function getCourseData(courseId: string) {
  const url = `${process.env.VERCEL_ENV === "development" ? "http" : "https"}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/courses/${courseId}`;
  console.warn(`URL: ${url}`);
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
    // ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(jwtCookie ? { Cookie: `_vercel_jwt=${jwtCookie}` } : {}),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    return null;
  }
  return await response.json();
}

export default async function SettingsCourseGeneralPage({
  params,
}: {
  params: { course_id: string };
}) {
  const courseData = await getCourseData(params.course_id);

  if (!courseData) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General</h3>
        <p className="text-sm text-muted-foreground">
          Edit general information about your course.
        </p>
      </div>
      <Separator />
      <CourseInfoForm initialData={courseData} courseId={params.course_id} />
    </div>
  );
}
