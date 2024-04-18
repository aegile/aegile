'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const coursePageLinks = [
  {
    title: 'Classes',
    href: 'classes',
  },
  {
    title: 'Participants',
    href: 'participants',
  },
  {
    title: 'Assignments',
    href: 'assignments',
  },
  {
    title: 'Grades',
    href: 'grades',
  },
  {
    title: 'Settings',
    href: 'settings',
  },
];

export default function CourseNavMenu({ course_id }: { course_id: string }) {
  const pathname = usePathname();
  const path = pathname.split('/').pop();

  return (
    <nav className="hidden flex-col gap-6 text-lg font-medium sm:flex sm:flex-row sm:items-center sm:gap-5 sm:text-sm lg:gap-6 px-4 sm:px-6">
      <Link
        href={`/courses/${course_id}`}
        key={course_id}
        className={`transition-colors hover:text-foreground ${
          path === course_id ? 'text-foreground' : 'text-muted-foreground'
        }`}
      >
        Home
      </Link>
      {coursePageLinks.map(({ title, href }) => (
        <Link
          href={`/courses/${course_id}/${href}`}
          key={href}
          className={`transition-colors hover:text-foreground ${
            path === href ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          {title}
        </Link>
      ))}
    </nav>
  );
}
