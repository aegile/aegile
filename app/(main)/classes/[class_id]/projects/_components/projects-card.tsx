"use client";

import { format, formatRelative, subDays } from "date-fns";
import { enAU } from "date-fns/locale";
import { AvatarGroup } from "@/components/custom/avatar-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDownIcon,
  CircleIcon,
  PlusIcon,
  StarIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatDatetimeRelative, formatDatetimeFormal } from "@/lib/datetime";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const users = [
  { name: "Shad", avatar: "" },
  { name: "CN", avatar: "" },
  { name: "Shad", avatar: "" },
  { name: "CN", avatar: "" },
  { name: "Shad", avatar: "" },
  { name: "CN", avatar: "" },
  { name: "Shad", avatar: "" },
  { name: "CN", avatar: "" },
  { name: "Shad", avatar: "" },
  { name: "CN", avatar: "" },
  { name: "Shad", avatar: "" },
  { name: "CN", avatar: "" },
  { name: "Shad", avatar: "" },
  { name: "CN", avatar: "" },
  { name: "Shad", avatar: "" },
  { name: "CN", avatar: "" },
];

type BadgeType = {
  variant:
    | "default"
    | "success"
    | "destructive"
    | "secondary"
    | "outline"
    | null
    | undefined;
  text: string;
};

const badges: BadgeType[] = [
  { variant: "success", text: "Submitted" },
  { variant: "destructive", text: "Overdue" },
  { variant: "secondary", text: "Pending" },
];

export default function ProjectsCard() {
  const lastUpdate = subDays(new Date(), 276);
  const randomBadge = badges[Math.floor(Math.random() * badges.length)];
  return (
    <Link
      id={"asgasg"}
      className="rounded-lg border bg-background/80 shadow-sm transition-all duration-300 hover:bg-accent"
      href={`/projects/${Math.floor(Math.random() * 90 + 10)}`}
    >
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle>Group Name</CardTitle>
          <CardDescription>INFS2605: H14A - T3 2023</CardDescription>
        </div>
        <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
          <Button variant="secondary" className="px-3 shadow-none">
            <StarIcon className="mr-2 h-4 w-4" />
            Star
          </Button>
          <Separator orientation="vertical" className="h-[20px]" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="px-2 shadow-none">
                <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              alignOffset={-5}
              className="w-[200px]"
              forceMount
            >
              <DropdownMenuLabel>Suggested Lists</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Future Ideas
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>My Stack</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Inspiration</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <PlusIcon className="mr-2 h-4 w-4" /> Create List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center justify-between ">
          <Badge variant={randomBadge.variant} className="mb-2">
            {randomBadge.text}
          </Badge>
          Due: {formatDatetimeFormal(lastUpdate)}
        </div>
        <div className="flex items-center justify-between">
          <AvatarGroup>
            {users.map((user, index) => (
              <Avatar className={cn("h-8 w-8", index > 0 && "-ml-2")}>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
          <div className="flex items-center gap-x-2">
            Tutor:
            <Avatar className="h-8 w-8">
              <AvatarFallback>TU</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="mt-2 flex justify-between space-x-4 text-sm text-muted-foreground">
          {/* <div className="flex items-center">
              <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
              TypeScript
            </div> */}
          <div className="flex items-center">
            <StarIcon className="mr-1 h-3 w-3" />2 Disputes
          </div>
          <div className="flex items-center">
            <UpdateIcon className="mr-1 h-3 w-3" />
            {formatDatetimeRelative(lastUpdate)}
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="block py-4 text-muted-foreground">
        <div className="mb-2 flex items-center justify-between">
          <p>Progress</p>
          <p>33%</p>
        </div>
        <Progress value={33} />
      </CardFooter>
    </Link>
  );
}
