"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import LogoOutline from "@/components/aegile/logo-outline";

type pageLinks = {
  title: string;
  href: string;
  description: string;
};

export function NavMenuBar({
  route,
  page_id,
  links,
}: {
  route: string;
  page_id: string;
  links: pageLinks[];
}) {
  const pathname = usePathname();
  const path = pathname.split("/").pop();

  return (
    <nav className="hidden flex-col gap-6 border-b px-4 pb-3 text-lg font-medium sm:flex sm:flex-row sm:items-center sm:gap-5 sm:px-6 sm:text-sm lg:gap-6">
      <Link
        href={`/${route}/${page_id}`}
        key={page_id}
        className={`transition-colors hover:text-foreground ${
          path === page_id ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        Home
      </Link>
      {links.map(({ title, href }) => (
        <Link
          href={`/${route}/${page_id}/${href}`}
          key={href}
          className={`transition-colors hover:text-foreground ${
            path === href ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {title}
        </Link>
      ))}
    </nav>
  );
}

export function NavCollapsedMenu({
  route,
  page_id,
  links,
}: {
  route: string;
  page_id: string;
  links: pageLinks[];
}) {
  return (
    <NavigationMenu className="py-2 sm:hidden">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="ml-4 sm:ml-6 ">
            Navigation
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[350px] gap-3 p-4 lg:grid-cols-[1fr_1fr]">
              <li className="row-span-full">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="#"
                  >
                    <LogoOutline className="h-6 w-6 transition-all group-hover:scale-110 dark:stroke-white" />
                    <div className="mb-2 mt-4 text-lg font-medium">aegile</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      An all-in-one productivity hub, fostering collaborative
                      writing, streamlining workflow management, and enhancing
                      performance evaluation.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href={`/${route}/${page_id}`} title="Home">
                Start here to get an overview of your {route}!
              </ListItem>
              {links.map(({ title, href, description }) => (
                <ListItem
                  key={href}
                  href={`/${route}/${page_id}/${href}`}
                  title={title}
                >
                  {description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
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
ListItem.displayName = "ListItem";
