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
    <AccordionItem value={deliverableId}>
      <AccordionTrigger>
        {deliverableName}
        <DeadlineBadge deadline={deadline} className="ml-auto mr-2" />
      </AccordionTrigger>
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
