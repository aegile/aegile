import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

export default function ProjectsCard() {
  return (
    <Link
      id={"asgasg"}
      className={cn(
        "flex flex-col items-start gap-2 rounded-lg border bg-background/80 p-3 text-left text-sm transition-all duration-300 hover:bg-accent",
      )}
      href={`/projects/${Math.floor(Math.random() * 90 + 10)}`}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="font-semibold">Group Name</div>
            {/* {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )} */}
          </div>
          <div
            className={cn(
              "ml-auto text-xs",
              //   selected === item.id
              //     ? "text-foreground"
              //     : "text-muted-foreground",
            )}
          >
            {/* {formatDistanceToNow(new Date(item.deadline), {
                                addSuffix: true,
                              })} */}
          </div>
        </div>
        {/* <div className="text-xs font-medium">{item.variant}</div> */}
      </div>
      <div className="line-clamp-1 text-xs text-muted-foreground">
        {/* {item.description.substring(0, 300)} */}
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam, similique
        pariatur incidunt beatae iure minus? Saepe quo est aperiam officiis
        blanditiis ipsam quia quae? Expedita praesentium molestiae mollitia eos
        deleniti!
      </div>
      <div className="flex">
        {users.slice(0, 4).map((user, index) => (
          <Avatar className={cn("h-7 w-7", index > 0 && "-ml-1")}>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </Link>
  );
}
