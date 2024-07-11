// "use client";

// import Link from "next/link";

// import {
//   CheckCircledIcon,
//   ChevronDownIcon,
//   CircleIcon,
//   PlusIcon,
//   StarIcon,
//   UpdateIcon,
// } from "@radix-ui/react-icons";
// import { format, formatRelative, subDays, subHours, toDate } from "date-fns";
// import { enAU } from "date-fns/locale";

// import {
//   formatDatetimeDistance,
//   formatDatetimeFormal,
//   formatDatetimeRelative,
// } from "@/lib/datetime";
// import { cn } from "@/lib/utils";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Progress } from "@/components/ui/progress";
// import { Separator } from "@/components/ui/separator";
// import { AvatarGroup } from "@/components/custom/avatar-group";
// import { ClientDateTime } from "@/components/custom/client-datetime";

// const users = [
//   { name: "Shad", avatar: "" },
//   { name: "CN", avatar: "" },
//   { name: "Shad", avatar: "" },
//   { name: "CN", avatar: "" },
//   { name: "Shad", avatar: "" },
//   { name: "CN", avatar: "" },
//   { name: "Shad", avatar: "" },
//   { name: "CN", avatar: "" },
//   { name: "Shad", avatar: "" },
//   { name: "CN", avatar: "" },
//   { name: "Shad", avatar: "" },
//   { name: "CN", avatar: "" },
//   { name: "Shad", avatar: "" },
//   { name: "CN", avatar: "" },
//   { name: "Shad", avatar: "" },
//   { name: "CN", avatar: "" },
// ];

// type BadgeType = {
//   variant:
//     | "default"
//     | "success"
//     | "destructive"
//     | "secondary"
//     | "outline"
//     | null
//     | undefined;
//   text: string;
// };

// const badges: BadgeType[] = [
//   { variant: "success", text: "Submitted" },
//   { variant: "destructive", text: "Overdue" },
//   { variant: "secondary", text: "Pending" },
// ];

// export default function ProjectsCard() {
//   const lastUpdate = subHours(toDate(new Date()), 5);
//   const randomBadge = badges[Math.floor(Math.random() * badges.length)];
//   const tasksCompleted = 360;
//   const totalTasks = 360;
//   const totalTasksDigits = Math.floor(Math.log10(totalTasks) + 1) - 1;
//   const progressFrac = `${tasksCompleted}/${totalTasks}`;
//   const progressPerc = ((tasksCompleted / totalTasks) * 100).toFixed(
//     totalTasksDigits,
//   );
//   return (
//     <Link
//       id={"asgasg"}
//       className="rounded-lg border bg-background/80 shadow-sm transition-all duration-300 hover:bg-accent"
//       href={`/projects/1`}
//     >
//       <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0 pb-3">
//         <div className="space-y-1">
//           <CardTitle>Group Name</CardTitle>
//           <CardDescription>INFS2605: H14A - T3 2023</CardDescription>
//         </div>
//         <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
//           <Button variant="secondary" className="px-3 shadow-none">
//             <StarIcon className="mr-2 h-4 w-4" />
//             Star
//           </Button>
//           <Separator orientation="vertical" className="h-[20px]" />
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="secondary" className="px-2 shadow-none">
//                 <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//               align="end"
//               alignOffset={-5}
//               className="w-[200px]"
//               forceMount
//             >
//               <DropdownMenuLabel>Suggested Lists</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuCheckboxItem checked>
//                 Future Ideas
//               </DropdownMenuCheckboxItem>
//               <DropdownMenuCheckboxItem>My Stack</DropdownMenuCheckboxItem>
//               <DropdownMenuCheckboxItem>Inspiration</DropdownMenuCheckboxItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>
//                 <PlusIcon className="mr-2 h-4 w-4" /> Create List
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </CardHeader>
//       <CardContent className="pb-3 text-xs">
//         <div className="flex items-center justify-between space-x-3">
//           {/* <Badge variant={randomBadge.variant} className="mb-2">
//             {randomBadge.text}
//           </Badge> */}
//           <Badge variant="destructive" className="mb-2">
//             Pending
//           </Badge>
//           <div className="truncate">
//             Due: <ClientDateTime datetime={lastUpdate} />
//             {/* {formatDatetimeFormal(lastUpdate)} */}
//           </div>
//         </div>
//         <div className="flex items-center justify-between">
//           <AvatarGroup>
//             {users.map((user, index) => (
//               <Avatar
//                 className={cn("h-8 w-8", index > 0 && "-ml-2")}
//                 key={`avatar-${index}`}
//               >
//                 <AvatarImage src="https://github.com/shadcn.png" />
//                 <AvatarFallback>{user.name}</AvatarFallback>
//               </Avatar>
//             ))}
//           </AvatarGroup>
//           <div className="flex items-center gap-x-2">
//             Tutor:
//             <Avatar className="h-8 w-8">
//               <AvatarFallback>TU</AvatarFallback>
//             </Avatar>
//           </div>
//         </div>
//         <div className="mt-2 flex justify-between space-x-4 text-sm text-muted-foreground text-xs">
//           {/* <div className="flex items-center">
//               <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
//               TypeScript
//             </div> */}
//           {/* <div className="flex items-center">
//             <CheckCircledIcon className="mr-1 h-3 w-3" />
//             13/76
//           </div> */}
//           <div className="flex items-center">
//             <StarIcon className="mr-1 h-3 w-3" />2 Disputes
//           </div>
//           <div className="flex items-center">
//             <UpdateIcon className="mr-1 h-3 w-3" />
//             <ClientDateTime datetime={lastUpdate} variant="relative" />
//           </div>
//         </div>
//       </CardContent>
//       <Separator />
//       <CardFooter className="group gap-x-3 px-5 py-3 text-muted-foreground text-xs">
//         <div className="flex items-center">
//           <CheckCircledIcon className="mr-1 h-3 w-3" />
//           <div className="relative w-fit flex items-center justify-center group">
//             <p className="transition-opacity duration-200 ease-in-out group-hover:opacity-0">
//               {progressFrac}
//             </p>
//             <p className="absolute transition-opacity duration-200 ease-in-out opacity-0 group-hover:opacity-100">
//               {progressPerc}%
//             </p>
//           </div>
//         </div>
//         <Progress value={33} />
//       </CardFooter>
//     </Link>
//   );
// }
