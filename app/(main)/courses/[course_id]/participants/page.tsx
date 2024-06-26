import { cookies } from "next/headers";

import { getCookie } from "cookies-next";

import { Participant } from "@/lib/schemas";
import { User } from "@/lib/types";

import { columns } from "./columns";
import { EnrolParticipantsDialog } from "./components/enrol-participants-dialog";
import { DataTableToolbar } from "./course-participants-table-toolbar";
import { DataTable } from "./data-table";

async function getParticipants(courseId: string) {
  const url = `${process.env.VERCEL_ENV === "development" ? "http" : "https"}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/courses/${courseId}/enrolments`;
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
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

async function getEnrollableUsers(courseId: string | string[]) {
  const url = `${process.env.VERCEL_ENV === "development" ? "http" : "https"}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/courses/${courseId}/enrollable`;
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
  const res = await fetch(url, options);
  if (res.status === 401)
    throw new Error("You don't have permission to view this page.");
  if (res.status === 403)
    throw new Error("You are not authorized to view this page.");

  const data = await res.json();
  return data;
}

export default async function CourseParticipantsPage({
  params,
}: {
  params: { course_id: string };
}) {
  const members: Participant[] = await getParticipants(params.course_id);
  const enrollables: User[] = await getEnrollableUsers(params.course_id);
  return (
    <main className="min-h-[calc(100vh-6.5rem)] flex-1 gap-4 bg-muted/40 p-4 sm:px-6 md:gap-8 ">
      <div className="mb-2">
        <EnrolParticipantsDialog enrollableUsers={enrollables} />
      </div>
      <DataTable columns={columns} data={members} />
    </main>
  );
}
