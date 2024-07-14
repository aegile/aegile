import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Tutorial - Project Groups",
  description:
    "A sample Next.js app showing dynamic routing with modals as a route.",
};

export default function TutorialProjectsLayout({
  children,
  group,
}: {
  children: React.ReactNode;
  group: React.ReactNode;
}) {
  return (
    <div className="bg-muted/20 px-4 py-6 md:px-10">
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">Project Groups</h2>
        <p className="text-sm text-muted-foreground">
          View and access project groups for course assignments.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex">
        {children}
        <div className="mx-2 hidden w-[1px] shrink-0 bg-zinc-200 dark:bg-zinc-800 md:mx-3 lg:block" />
        <div className="-mr-52 max-w-full flex-1 lg:-mr-0">{group}</div>
      </div>
    </div>
  );
}
