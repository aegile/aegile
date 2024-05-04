import { format } from "date-fns";
import { ClipboardListIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { Assignment } from "../data";
import { AssignmentActionBar } from "./assignment-action-bar";
import { AssignmentOutline } from "./assignment-outline";
import { DeliverableOutline } from "./deliverable-outline";

interface AssignmentInboxDisplayProps {
  item: Assignment | null;
}

export function AssignmentInboxDisplay({ item }: AssignmentInboxDisplayProps) {
  return (
    <div className="flex h-full flex-col">
      <AssignmentActionBar assignmentId={item?.id || ""} disabled={!item} />
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
              <p>{item.deadline && format(new Date(item.deadline), "PPpp")}</p>
            </div>
          </div>
          <Separator />
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
              <Accordion
                type="single"
                collapsible
                className="w-full"
                key={item?.id}
              >
                <AssignmentOutline assignmentId={item.id} />
                <DeliverableOutline
                  deliverableId="item-1"
                  deliverableName="Deliverable #1"
                  deadline="2024-05-01T23:59:00"
                />
                <DeliverableOutline
                  deliverableId="item-2"
                  deliverableName="Deliverable #2"
                  deadline="2024-05-08T23:59:00"
                />
                <DeliverableOutline
                  deliverableId="item-3"
                  deliverableName="Deliverable #3"
                  deadline="2024-05-22T23:59:00"
                />
              </Accordion>
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
