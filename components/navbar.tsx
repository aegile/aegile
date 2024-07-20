"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Archive,
  BarChart3,
  CalendarRange,
  FileBarChart2,
  GraduationCap,
  Home,
  KanbanSquare,
  ListTodo,
  MessagesSquare,
  Package2,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LogoOutline from "@/components/aegile/logo-outline";
import { ModeToggle } from "@/components/theme-toggle";

const linksMain = [
  {
    title: "Dashboard",
    label: "111",
    icon: Home,
    path: "/dashboard",
  },
  {
    title: "Courses",
    label: "9",
    icon: GraduationCap,
    path: "/courses",
  },
  {
    title: "Projects",
    label: "",
    icon: KanbanSquare,
    path: "/projects",
  },
  {
    title: "Tasks",
    label: "23",
    icon: ListTodo,
    path: "/tasks",
  },
  {
    title: "Schedule",
    label: "",
    icon: CalendarRange,
    path: "/schedule",
  },
  {
    title: "Archive",
    label: "",
    icon: Archive,
    path: "/archive",
  },
];

const linksAnalytics = [
  {
    title: "Performance",
    label: "111",
    icon: BarChart3,
    path: "/performance",
  },
  {
    title: "Reports",
    label: "",
    icon: FileBarChart2,
    path: "/reports",
  },
  {
    title: "Forums",
    label: "128",
    icon: MessagesSquare,
    path: "/forums",
  },
];

export default function NavBar() {
  const pathname = usePathname();
  const path = "/" + pathname.split("/")[1];
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider delayDuration={0}>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <LogoOutline className="h-4 w-4 stroke-white transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>

          {linksMain.map((link) => (
            <Tooltip key={"navbar-" + link.title.toLowerCase()}>
              <TooltipTrigger asChild>
                <Link
                  href={link.path}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    link.path === path && "bg-accent text-accent-foreground",
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {/* <span className="ml-1">{link.title}</span> */}
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.title}</TooltipContent>
            </Tooltip>
          ))}
          <Separator />
          {linksAnalytics.map((link) => (
            <Tooltip key={"navbar-" + link.title.toLowerCase()}>
              <TooltipTrigger asChild>
                <Link
                  href={link.path}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    link.path === path && "bg-accent text-accent-foreground",
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {/* <span className="ml-1">{link.title}</span> */}
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.title}</TooltipContent>
            </Tooltip>
          ))}
          <ModeToggle />
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}
