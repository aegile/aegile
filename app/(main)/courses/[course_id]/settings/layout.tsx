'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const courseSettingsNavItems = [
  {
    title: 'General',
    href: '/settings',
    suffix: 'settings',
  },
  {
    title: 'Administration',
    href: '/settings/admin',
    suffix: 'admin',
  },
  {
    title: 'Roles & Permissions',
    href: '/settings/roles',
    suffix: 'roles',
  },
  {
    title: 'Assignments',
    href: '/settings/assignments',
    suffix: 'assignments',
  },
  {
    title: 'Advanced',
    href: '/settings/advanced',
    suffix: 'advanced',
  },
];

interface CourseSettingsLayoutProps {
  children: React.ReactNode;
}

export default function CourseSettingsLayout({
  children,
}: CourseSettingsLayoutProps) {
  const pathname = usePathname();
  const selectedSettingsPage = pathname.split('/').pop();
  const coursePath = pathname.split('/').slice(0, 3).join('/');
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:px-10">
      {/* <div className="mx-auto grid w-full max-w-6xl gap-2"> */}
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
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
                  'font-semibold text-primary'
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
