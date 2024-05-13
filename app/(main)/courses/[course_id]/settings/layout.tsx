"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const courseSettingsNavItems = [
  {
    title: "General",
    href: "/settings",
    suffix: "settings",
  },
  {
    title: "Administration",
    href: "/settings/admin",
    suffix: "admin",
  },
  {
    title: "Roles & Permissions",
    href: "/settings/roles",
    suffix: "roles",
  },
  {
    title: "Assignments",
    href: "/settings/assignments",
    suffix: "assignments",
  },
  {
    title: "Advanced",
    href: "/settings/advanced",
    suffix: "advanced",
  },
];

interface CourseSettingsLayoutProps {
  children: React.ReactNode;
}

export default function CourseSettingsLayout({
  children,
}: CourseSettingsLayoutProps) {
  const pathname = usePathname();
  const selectedSettingsPage = pathname.split("/").pop();
  const coursePath = pathname.split("/").slice(0, 3).join("/");
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col bg-muted/40 p-4 sm:px-6 ">
      {/* <div className="mx-auto grid w-full max-w-6xl gap-2"> */}
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage course settings and preferences.
        </p>
      </div>
      <Separator className="my-6" />
      {/* <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"> */}
      <div className="grid w-full items-start gap-6 md:grid-cols-[125px_1fr] lg:grid-cols-[200px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          {/* <Link href="#" className="font-semibold text-primary">
            General
          </Link> */}

          {courseSettingsNavItems.map((item) => (
            <Link
              key={item.title}
              href={coursePath + item.href}
              className={cn(
                selectedSettingsPage === item.suffix &&
                  "font-semibold text-primary",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </main>
  );
}
