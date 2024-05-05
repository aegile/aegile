import React, { useState, useEffect } from "react";
import axios from "axios";

import { Edit, SaveIcon } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import DeadlineBadge from "@/components/custom/deadline-badge";

import Editor from "@/components/editor";
import { assignmentOutlines } from "../data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Block } from "@blocknote/core";
import { toast } from "sonner";

interface AssignmentOutlineProps {
  assignmentId: string;
}

const placeholder = [
  {
    type: "paragraph",
    content: [
      {
        type: "text",
        text: "[Course Code & Offering]: [Course Title] - [Assignment Title]",
        styles: {
          bold: true,
          italic: true,
        },
      },
    ],
  },
  {
    type: "paragraph",
    content: [
      {
        type: "text",
        text: "Assessment outline goes here...",
        styles: {
          italic: true,
        },
      },
    ],
  },
];

export function AssignmentOutline({ assignmentId }: AssignmentOutlineProps) {
  const [description, setDescription] = useState<Object[]>(placeholder);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        setTimeout(() => {
          setDescription(
            assignmentOutlines.find((item) => item.id === assignmentId)
              ?.blocks || placeholder,
          );
          setIsLoading(false);
        }, 1000);
        // axios.get(`/api/Assignments/${AssignmentId}`).then((response) => {
        //   setDescription(response.data.description);
        //   setIsLoading(false);
        // });
      } catch (error) {
        console.error("Error fetching description:", error);
      }
    };

    fetchDescription();
  }, [assignmentId]);
  return (
    <AccordionItem value={assignmentId}>
      <AccordionTrigger>Assignment Outline</AccordionTrigger>
      <AccordionContent>
        {isLoading ? (
          <Skeleton className="h-8 w-full rounded-lg" />
        ) : (
          <div>
            <AssignmentOutlineEditDialog defaultBlocks={description} />
            <Editor defaultBlocks={description} />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

function AssignmentOutlineEditDialog({
  defaultBlocks,
}: {
  defaultBlocks: Object[];
}) {
  const [blocks, setBlocks] = useState<Object[]>([]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="mr-2 h-4 w-4" /> Edit
          <span className="sr-only">Edit Assignment Outline</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[70%] min-w-fit">
        <DialogHeader>
          <DialogTitle>Edit Assignment Outline</DialogTitle>
          <DialogDescription>
            Edit the details of the assignment outline.
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
