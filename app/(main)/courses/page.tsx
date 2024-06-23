import { Suspense } from "react";

import { File, ListFilter, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CourseCreationDialog } from "./_components/course-creation-dialog";
import CourseListTable from "./_components/course-list-table";

export default function CoursesPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-7 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <CourseCreationDialog />
          </div>
        </div>
        <TabsContent value="all">
          <Suspense
            fallback={
              <div className="w-full border border-red-500">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
                <div className="mt-10 flex w-full items-center justify-between space-x-4">
                  <Skeleton className="ml-4 h-4 w-[550px]" />
                  <Skeleton className="h-4 w-[230px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[130px]" />
                  <Skeleton className="h-4 w-[210px]" />
                  <Skeleton className="h-4 w-[230px]" />
                </div>
                <div className="mt-5 flex w-full items-center justify-between space-x-4">
                  <Skeleton className="h-24 w-24 rounded-lg" />
                  <Skeleton className="h-4 w-[550px]" />
                  <Skeleton className="h-4 w-[230px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[130px]" />
                  <Skeleton className="h-4 w-[210px]" />
                  <Skeleton className="h-4 w-[230px]" />
                </div>
                <div className="mt-5 flex w-full items-center justify-between space-x-4">
                  <Skeleton className="h-24 w-24 rounded-lg" />
                  <Skeleton className="h-4 w-[550px]" />
                  <Skeleton className="h-4 w-[230px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[130px]" />
                  <Skeleton className="h-4 w-[210px]" />
                  <Skeleton className="h-4 w-[230px]" />
                </div>
                <div className="mt-5 flex w-full items-center justify-between space-x-4">
                  <Skeleton className="h-24 w-24 rounded-lg" />
                  <Skeleton className="h-4 w-[550px]" />
                  <Skeleton className="h-4 w-[230px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[130px]" />
                  <Skeleton className="h-4 w-[210px]" />
                  <Skeleton className="h-4 w-[230px]" />
                </div>
                <div className="mt-5 flex w-full items-center justify-between space-x-4">
                  <Skeleton className="h-24 w-24 rounded-lg" />
                  <Skeleton className="h-4 w-[550px]" />
                  <Skeleton className="h-4 w-[230px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[130px]" />
                  <Skeleton className="h-4 w-[210px]" />
                  <Skeleton className="h-4 w-[230px]" />
                </div>
              </div>
            }
          >
            <CourseListTable />
          </Suspense>
        </TabsContent>
      </Tabs>
    </main>
  );
}
