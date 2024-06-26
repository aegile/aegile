import Link from "next/link";

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
  title: string;
  weighting: number;
  deadline: Date;
  description?: string;
  status: string;
  files?: Array<string>;
  link?: string;
};

export default function DeliverableCard({
  title,
  weighting,
  deadline,
  description = "Submit a working prototype of <project requirement>.",
  status = "Not Submitted",
  files = [],
  link = "#",
}: DeliverableCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="flex items-center justify-between">
          <p className="line-clamp-1">{title}</p>
          <Badge variant="success">{status}</Badge>
        </CardTitle>
        <CardDescription className="space-y-2 font-semibold">
          {weighting}% · Due:{" "}
          <ClientDateTime variant="formal" datetime={deadline} />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col space-y-2 p-4 pt-4">
        <div className="line-clamp-2 h-10 text-muted-foreground">
          {description}
        </div>
        <div className="flex flex-col justify-between">
          <p className="mt-1 text-sm text-muted-foreground">
            Files ({files.length})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FileIcon className="h-4 w-4" />
          <span className="text-sm font-semibold">demo-prototype.zip</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button size="sm" asChild>
          <Link href={link}>View Deliverable</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
