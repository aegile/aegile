import { Metadata } from "next";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/sidebar-nav";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

interface SettingsLayoutProps {
  params: { course_id: string };
  children: React.ReactNode;
}

export default function SettingsLayout({
  params,
  children,
}: SettingsLayoutProps) {
  const sidebarNavItems = [
    {
      title: "General",
      href: `/courses/${params.course_id}/settings`,
    },
    {
      title: "Permissions",
      href: `/courses/${params.course_id}/settings/permissions`,
    },
    {
      title: "Advanced",
      href: `/courses/${params.course_id}/settings/advanced`,
    },
  ];
  return (
    <>
      {/* <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div> */}
      <div className="flex-grow space-y-6 bg-muted/30 px-10 pb-16 pt-6">
        <div className="space-y-0.5">
          <h2 className="text-xl font-medium tracking-tight">
            Course Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage settings and preferences related to this course.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="sticky top-16 -mx-4 self-start lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
