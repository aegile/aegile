import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Edit, Edit3Icon, SaveIcon } from "lucide-react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DeadlineBadge from "@/components/custom/deadline-badge";
import Editor from "@/components/editor";

interface DeliverableOutlineProps {
  deliverableId: string;
  deliverableName: string;
  deadline: string;
}

export function DeliverableOutline({
  deliverableId,
  deliverableName,
  deadline,
}: DeliverableOutlineProps) {
  const [description, setDescription] = useState<Object[]>([
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "[Deliverable Name] - [Weighting %]",
          styles: {
            bold: true,
          },
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Deliverable outline goes here...",
          styles: {
            italic: true,
          },
        },
      ],
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        // axios.get(`/api/deliverables/${deliverableId}`).then((response) => {
        //   setDescription(response.data.description);
        //   setIsLoading(false);
        // });
      } catch (error) {
        console.error("Error fetching description:", error);
      }
    };

    fetchDescription();
  }, [deliverableId]);
  return (
    <AccordionItem value={deliverableId} key={JSON.stringify(description)}>
      <div className="group flex items-center justify-between gap-2 overflow-hidden rounded-lg">
        <AccordionTrigger>
          {deliverableName}
          <DeadlineBadge deadline={deadline} className="ml-auto mr-2" />
        </AccordionTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="flex w-0 cursor-pointer items-center justify-center transition-all duration-300 group-hover:w-8"
            >
              <Edit3Icon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit deliverable</TooltipContent>
        </Tooltip>
      </div>
      <AccordionContent>
        {isLoading ? (
          <Skeleton className="h-8 w-full rounded-lg" />
        ) : (
          <div>
            <DeliverableOutlineEditDialog
              defaultBlocks={description}
              setDescription={setDescription}
            />
            <Editor defaultBlocks={description} />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

function DeliverableOutlineEditDialog({
  defaultBlocks,
  setDescription,
}: {
  defaultBlocks: Object[];
  setDescription: (description: Object[]) => void;
}) {
  const [blocks, setBlocks] = useState<Object[]>([]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="mr-2 h-4 w-4" /> Edit
          <span className="sr-only">Edit Deliverable Outline</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[70%] min-w-fit">
        <DialogHeader>
          <DialogTitle>Edit Deliverable Outline</DialogTitle>
          <DialogDescription>
            Edit the details of a deliverable outline.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] overflow-visible">
          <Editor
            defaultBlocks={defaultBlocks}
            editable
            setContentCallback={setBlocks}
          />
        </ScrollArea>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                toast(
                  <div className="w-full">
                    <p>You submitted the following values:</p>
                    <pre className="mt-2 max-h-[300px] w-full overflow-x-auto rounded-md bg-slate-900 p-4">
                      <code className="text-white">
                        {JSON.stringify(blocks, null, 2)}
                      </code>
                    </pre>
                  </div>,
                );
                if (blocks.length > 0) setDescription(blocks);
              }}
            >
              <SaveIcon className="mr-2 h-4 w-4" /> Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
