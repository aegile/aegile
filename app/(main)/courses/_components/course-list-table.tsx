import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { getCookie } from "cookies-next";

// import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import CourseDropdown from "./course-dropdown";

type Course = {
  id: string;
  code: string;
  name: string;
  term: string;
  status: "active" | "ended";
  instructors: string;
  member_count: number;
  createdAt: string;
};

async function getCourses() {
  const url = `${process.env.VERCEL_ENV === "development" ? "http" : "https"}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/courses`;
  console.warn(`URL: ${url}`);
  const jwtCookie = getCookie("_vercel_jwt", { cookies });
  // const authToken = session?.accessToken;
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
  try {
    let res = await fetch(url, options);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error: ${res.status} - ${text}`);
    }

    const data = await res.json();
    // toast.success("Success!!");
    return data as Course[];
  } catch (err) {
    const error = err as Error;
    console.error(error.toString());
  }
}

export default async function CourseListTable() {
  let courses = await getCourses();

  return (
    <Card x-chunk="dashboard-06-chunk-1">
      <CardHeader>
        <CardTitle>Courses</CardTitle>
        <CardDescription>
          Access your courses and view your coursework.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Term</TableHead>
              <TableHead className="hidden lg:table-cell">Members</TableHead>
              <TableHead className="hidden xl:table-cell">
                Instructors
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses?.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt="Course image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src="/aegile-logo-only.svg"
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/courses/${course.id}`}
                    className="hover:underline"
                  >
                    {course.name}
                  </Link>
                </TableCell>
                <TableCell>{course.code}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline">{course.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {course.term}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {course.member_count}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {course.instructors}
                </TableCell>
                <TableCell>
                  <CourseDropdown course_id={course.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}
