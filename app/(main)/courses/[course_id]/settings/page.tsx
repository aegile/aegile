import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  BookA,
  PlusCircle,
  Upload,
  Users2,
  User2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DemoCookieSettings } from './_components/cookie-settings';
import { DemoNotifications } from './_components/notification-settings';

export default function CourseSettingsGeneralPage() {
  // const courseData =  fetch course data
  const course = {
    id: '21T1-COMP6441',
    code: 'COMP6441',
    name: 'Security Engineering',
    offering: '21T1',
    status: 'active',
    instructors: 'Richard Buckland',
    members: 100,
    createdAt: '2023-07-12 10:42 AM',
  };
  return (
    // <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {/* {course.name} */}
          General
        </h1>
        {/* <Badge variant="outline" className="ml-auto sm:ml-0">
          In stock
        </Badge> */}
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm" asChild>
            <Link href="/courses">Discard</Link>
          </Button>
          <Button size="sm">Save Course</Button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-1 xl:grid-cols-[1fr_350px] lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>
                {/* {course.description} */}
                Lipsum dolor sit amet, consectetur adipiscing elit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    className="w-full"
                    defaultValue={course.name}
                  />
                </div>
                <div className="flex flex-wrap lg:flex-nowrap gap-3">
                  <div className="w-1/3">
                    <Label htmlFor="name">Code</Label>
                    <Input id="name" type="text" defaultValue={course.code} />
                  </div>
                  <div className="w-1/4">
                    <Label htmlFor="name">Offering</Label>
                    <Input
                      id="name"
                      type="text"
                      defaultValue={course.offering}
                    />
                  </div>
                  <div className="w-full">
                    <Label htmlFor="name">Instructors</Label>
                    <Input
                      id="name"
                      type="text"
                      defaultValue={course.instructors}
                    />
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                    className="min-h-32"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-07-chunk-2">
            <CardHeader>
              <CardTitle>Course Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="grid gap-3">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category" aria-label="Select category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="subcategory">Subcategory (optional)</Label>
                  <Select>
                    <SelectTrigger
                      id="subcategory"
                      aria-label="Select subcategory"
                    >
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="t-shirts">T-Shirts</SelectItem>
                      <SelectItem value="hoodies">Hoodies</SelectItem>
                      <SelectItem value="sweatshirts">Sweatshirts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="lg:columns-2 gap-4 space-y-4 lg:gap-8 lg:space-y-8 [&>*]:break-inside-avoid">
            <DemoCookieSettings />

            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>Course Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger id="status" aria-label="Select status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            <DemoNotifications />
          </div>
        </div>
        <div className="grid auto-rows-max sm:grid-cols-2 xl:grid-cols-1 items-start gap-4 lg:gap-8">
          <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
            <CardHeader>
              <CardTitle>Course Images</CardTitle>
              <CardDescription>
                Lipsum dolor sit amet, consectetur adipiscing elit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Image
                  alt="Course image"
                  className="aspect-square w-full rounded-md object-cover"
                  height="300"
                  src="/placeholder.svg"
                  width="300"
                />
                <div className="grid grid-cols-3 gap-2">
                  <button>
                    <Image
                      alt="Course image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="84"
                      src="/placeholder.svg"
                      width="84"
                    />
                  </button>
                  <button>
                    <Image
                      alt="Course image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="84"
                      src="/placeholder.svg"
                      width="84"
                    />
                  </button>
                  <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Upload</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 lg:gap-8">
            <Card x-chunk="dashboard-07-chunk-5">
              <CardHeader>
                <CardTitle>Archive Course</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" variant="secondary">
                  Archive Course
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm" asChild>
          <Link href="/courses">Discard</Link>
        </Button>
        <Button size="sm">Save Course</Button>
      </div>
    </div>
    // </main>
  );
}
