'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    path: '',
    label: 'Home',
  },
  {
    path: '/classes',
    label: 'Classes',
  },
  {
    path: '/participants',
    label: 'Participants',
  },
  {
    path: '/grades',
    label: 'Grades',
  },
  {
    path: '/assignments',
    label: 'Assignments',
  },
];

export function CourseNav({
  course_id,
  className,
}: {
  course_id: string;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'flex items-center space-x-4 lg:space-x-24 px-4 py-3 border-y',
        className
      )}
    >
      {navItems.map(({ path, label }) => (
        <Link
          href={`/courses/${course_id}${path}`}
          key={path}
          className={cn(
            'font-medium transition-colors',
            pathname !== `/courses/${course_id}${path}` &&
              'text-muted-foreground hover:text-primary'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
