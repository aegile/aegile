import Image from "next/image";
import Link from "next/link";

import { MoreHorizontal } from "lucide-react";

// import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/courses`;
  console.warn(`URL: ${url}`);
  try {
    let res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.log(`RESPONSE ERROR: ${res.status} - ${text}`);
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={"courses/" + course.id + "/settings"}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
