import { Separator } from "@/components/ui/separator";

export default async function CourseHomePage() {
  return (
    <div className="px-4 py-6 md:px-10">
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">Course Home</h2>
        <p className="text-sm text-muted-foreground">
          The overview for this course.
        </p>
      </div>
      <Separator className="my-6" />
    </div>
  );
}
