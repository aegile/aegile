'use client';
import React from 'react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import { cn } from '@/lib/utils';
import LogoOutline from '@/components/aegile/logo-outline';

export default function CourseNavCollapsedMenu({
  course_id,
}: {
  course_id: string;
}) {
  return (
    <NavigationMenu className="py-2 sm:hidden">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="ml-4 sm:ml-6 ">
            Course Navigation
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[350px] lg:grid-cols-[1fr_1fr]">
              <li className="row-span-full">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <LogoOutline className="h-6 w-6 transition-all group-hover:scale-110 dark:stroke-white" />
                    <div className="mb-2 mt-4 text-lg font-medium">aegile</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      An integrated productivity platform centred around
                      collaborative writing, workflow management and performance
                      evaluation.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href={`/courses/${course_id}`} title="Home">
                Start here to get an overview of your course!
              </ListItem>
              <ListItem href={`/courses/${course_id}/classes`} title="Classes">
                Get ready to explore all the amazing classes we have lined up
                for you!
              </ListItem>
              <ListItem
                href={`/courses/${course_id}/participants`}
                title="Participants"
              >
                Meet your fellow course participants and start networking!
              </ListItem>
              <ListItem
                href={`/courses/${course_id}/assignments`}
                title="Assignments"
              >
                Challenge yourself with our engaging and thought-provoking
                assignments!
              </ListItem>
              <ListItem href={`/courses/${course_id}/grades`} title="Grades">
                Check out your progress and celebrate your achievements!
              </ListItem>
              <ListItem
                href={`/courses/${course_id}/settings`}
                title="Settings"
              >
                Customize your course experience to suit your learning style!
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
