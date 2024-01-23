import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function CoursesRecents({ courses }: { courses: Course[] }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Recent Courses</CardTitle>
        <CardDescription>View your recently accessed courses.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos earum
          quisquam ab amet sequi nostrum, suscipit nulla expedita, et dolor
          impedit consequuntur quae doloremque commodi cupiditate sint at
          officiis eius.
        </p>
      </CardContent>
    </Card>
  );
}
