import { Suspense } from "react";
import { cookies } from "next/headers";

import { getCookie } from "cookies-next";

import { User } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shell";

import MembersTable from "./members-table";

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
  const members: User[] = await getParticipants(params.course_id);
  const enrollableUsers: User[] = await getEnrollableUsers(params.course_id);
  return (
    <div className="bg-muted/20 px-4 py-6 md:px-10">
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">
          Course Participants
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage users and roles of course participants.
        </p>
      </div>
      <Separator className="my-6" />
      <Shell className="gap-2">
        <Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          <MembersTable members={members} candidates={enrollableUsers} />
        </Suspense>
      </Shell>
    </div>
  );
}
