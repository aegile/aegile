'use client';
import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Archive,
  BarChart3,
  CalendarRange,
  FileBarChart2,
  GraduationCap,
  Home,
  KanbanSquare,
  LineChart,
  ListTodo,
  MessagesSquare,
  PanelLeft,
  Settings,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import LogoOutline from '@/components/aegile/logo-outline';

import { cn } from '@/lib/utils';

const linksMain = [
  {
    title: 'Dashboard',
    label: '111',
    icon: Home,
    path: '/dashboard',
  },
  {
    title: 'Courses',
    label: '9',
    icon: GraduationCap,
    path: '/courses',
  },
  {
    title: 'Projects',
    label: '',
    icon: KanbanSquare,
    path: '/projects',
  },
  {
    title: 'Tasks',
    label: '23',
    icon: ListTodo,
    path: '/tasks',
  },
  {
    title: 'Schedule',
    label: '',
    icon: CalendarRange,
    path: '/schedule',
  },
  {
    title: 'Archive',
    label: '',
    icon: Archive,
    path: '/archive',
  },
];

const linksAnalytics = [
  {
    title: 'Performance',
    label: '111',
    icon: BarChart3,
    path: '/performance',
  },
  {
    title: 'Reports',
    label: '',
    icon: FileBarChart2,
    path: '/reports',
  },
  {
    title: 'Forums',
    label: '128',
    icon: MessagesSquare,
    path: '/forums',
  },
];

export default function NavBarMobile() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <LogoOutline className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">aegile</span>
          </Link>
          {linksMain.map((link) => (
            <Link
              key={'navbar-mobile-' + link.title.toLowerCase()}
              href={link.path}
              className={cn(
                'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground',
                link.path === pathname && 'text-foreground'
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.title}
            </Link>
          ))}
          <Separator />
          {linksAnalytics.map((link) => (
            <Link
              key={'navbar-mobile-' + link.title.toLowerCase()}
              href={link.path}
              className={cn(
                'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground',
                link.path === pathname && 'text-foreground'
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.title}
            </Link>
          ))}
          <Separator />
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
