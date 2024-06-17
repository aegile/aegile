import { format } from "date-fns";
import { ClipboardListIcon } from "lucide-react";

import { Accordion } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ClientDateTime } from "@/components/custom/client-datetime";

import { Assignment } from "../data";
import { ProjectsActionBar } from "./projects-action-bar";
import ProjectsCard from "./projects-card";

interface ProjectsInboxDisplayProps {
  item: Assignment | null;
}

export function ProjectsInboxDisplay({ item }: ProjectsInboxDisplayProps) {
  return (
    <div className="flex h-full flex-col">
      <ProjectsActionBar assignmentId={item?.id || ""} disabled={!item} />
      <Separator />
      {item ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar className="items-center justify-center border bg-muted">
                <ClipboardListIcon className="h-5 w-5" />
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{item.name}</div>
                <div className="line-clamp-1 text-xs">{item.variant}</div>
              </div>
            </div>
            <div className="ml-auto text-xs text-muted-foreground">
              <p>
                {item.deadline && (
                  <ClientDateTime datetime={item.deadline} variant="formal" />
                )}
              </p>
            </div>
          </div>
          <Separator />
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="grid flex-1 grid-flow-row gap-4 p-4 text-sm lg:grid-cols-2 xl:grid-cols-3">
              <ProjectsCard />
              <ProjectsCard />
              <ProjectsCard />
              <ProjectsCard />
              <ProjectsCard />
              <ProjectsCard />
              <ProjectsCard />
              <ProjectsCard />
              <ProjectsCard />
              <ProjectsCard />
            </div>
          </ScrollArea>

          {/* <Separator className="mt-auto" />
          <div className="p-4">
            <form>
              <div className="grid gap-4">
                <Textarea
                  className="p-4"
                  placeholder={`Reply ${item.name}...`}
                />
                <div className="flex items-center">
                  <Label
                    htmlFor="mute"
                    className="flex items-center gap-2 text-xs font-normal"
                  >
                    <Switch id="mute" aria-label="Mute thread" /> Mute this
                    thread
                  </Label>
                  <Button
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                    className="ml-auto"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </form>
          </div> */}
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  );
}
