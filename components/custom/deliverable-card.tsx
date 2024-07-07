import Link from "next/link";

import { ArrowRightIcon } from "@radix-ui/react-icons";
import { FileIcon } from "lucide-react";

import { formatDatetimeFormal } from "@/lib/datetime";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ClientDateTime } from "./client-datetime";

type DeliverableCardProps = {
  id: string;
  name: string;
  weighting: number;
  deadline: Date;
  description?: string;
  status: string;
  files?: Array<string>;
};

export default function DeliverableCard({
  id,
  name,
  weighting,
  deadline,
  description = "Submit a working prototype of <project requirement>.",
  status = "Not Submitted",
  files = [],
}: DeliverableCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="flex items-center justify-between">
          <p className="line-clamp-1">{name}</p>
          <Badge variant="success">{status}</Badge>
        </CardTitle>
        <CardDescription className="space-y-2 font-semibold">
          {weighting}% · Due:{" "}
          <ClientDateTime variant="formal" datetime={deadline} />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col space-y-2 p-4 pt-4">
        <div className="line-clamp-1 text-sm text-muted-foreground">
          {description}
        </div>
        <div className="flex flex-col justify-between">
          <p className="mt-1 text-sm text-muted-foreground underline">
            Files ({files.length})
          </p>
        </div>
        {files?.map((file) => (
          <div className="flex items-center gap-2">
            <FileIcon className="h-4 w-4" />
            <span className="text-sm font-semibold">demo-prototype.zip</span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button
          size="sm"
          asChild
          variant="expandIcon"
          Icon={ArrowRightIcon}
          iconPlacement="left"
        >
          <Link href={`/deliverables/${id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
