import React, { useState, useEffect } from "react";
import axios from "axios";

import DeadlineBadge from "@/components/custom/deadline-badge";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import Editor from "@/components/editor";
import { assignmentOutlines } from "../data";

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
          <Editor defaultBlocks={description} showEditToggle />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
