'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function BreadcrumbPath() {
  const pathname = usePathname();
  const paths: string[] = pathname.split('/').filter(Boolean);
  const breadcrumbPaths = paths.slice(0, -1);

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {breadcrumbPaths.map((path, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/${paths.slice(0, index + 1).join('/')}`}>
                  {path}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </React.Fragment>
        ))}
        <BreadcrumbPage>{paths[paths.length - 1]}</BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
