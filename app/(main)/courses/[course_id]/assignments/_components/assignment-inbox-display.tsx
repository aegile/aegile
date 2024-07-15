import Link from "next/link";

import { format } from "date-fns";
import { CheckIcon, ClipboardListIcon, File, InfoIcon } from "lucide-react";

import { formatDatetimeFormal } from "@/lib/datetime";
import { Accordion } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import DeliverableCard from "@/components/custom/deliverable-card";
import FileDownload from "@/components/custom/file-download";
import ResourceLink from "@/components/custom/resource-link";

import { Assignment } from "../data";
import { AssignmentActionBar } from "./assignment-action-bar";
import { AssignmentOutline } from "./assignment-outline";
import { DeliverableOutline } from "./deliverable-outline";

interface AssignmentInboxDisplayProps {
  item: Assignment | null;
}

export function AssignmentInboxDisplay({ item }: AssignmentInboxDisplayProps) {
  if (!item) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No assignment selected
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 overflow-y-auto p-2 md:p-4">
      <div>
        <h2 className="text-2xl font-semibold">Minesweeper Game</h2>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div>Start Date: June 1, 2023</div>
          <div>Due Date: June 30, 2023</div>
        </div>
      </div>
      <div className="space-y-6 text-sm">
        <p className="text-gray-700 dark:text-gray-400">
          This assignment will require you to create a classic Minesweeper game
          with a grid of cells, mines, and a timer. The game should have the
          following features:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>A grid of cells that can be revealed or flagged</li>
          <li>Mines placed randomly throughout the grid</li>
          <li>A timer that starts when the game begins</li>
          <li>
            A win condition where the player must reveal all non-mine cells
          </li>
          <li>A game over condition where the player hits a mine</li>
          <li>A scoring system based on the time taken to complete the game</li>
        </ul>
        <div className="space-y-2">
          <h3 className="text-xl font-medium">Specifications</h3>
          <div className="space-y-1">
            <div>
              The game should have a clean and modern design that is visually
              appealing and responsive.
            </div>
            <div>
              The game should use JavaScript to handle the game logic, including
              the grid, mines, and timer.
            </div>
            <div>
              The game should include a scoring system that takes into account
              the time taken to complete the game.
            </div>
            <div>
              The game should have a win condition where the player must reveal
              all non-mine cells, and a game over condition where the player
              hits a mine.
            </div>
            <div>
              The game should include a restart button that allows the player to
              start a new game.
            </div>
            <div>
              The game should be designed with accessibility in mind, ensuring
              that users with disabilities can easily navigate and play the
              game.
            </div>
            <div>
              The game should be tested thoroughly to ensure it works correctly
              across different browsers and devices.
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-md bg-gray-100 p-4 dark:bg-gray-800">
            <InfoIcon className="h-6 w-6 shrink-0 text-gray-500" />
            <div className="text-gray-700 dark:text-gray-400">
              These specifications outline the key requirements for the
              Minesweeper game. Please review them carefully and let me know if
              you have any questions or need further clarification.
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-medium">Resources</h3>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <FileDownload
              fileName="Minesweeper Starter Files"
              fileType="ZIP"
              fileSize="1.2 MB"
            />
            <FileDownload
              fileName="Minesweeper Game Design Document"
              fileType="PDF"
              fileSize="3.5 MB"
            />
            <ResourceLink linkName="JavaScript Game Development" />
            <ResourceLink linkName="Minesweeper Game Logic" />
            <ResourceLink linkName="Responsive Design Principles" />
            <ResourceLink linkName="User Experience Best Practices" />
            <ResourceLink linkName="Accessibility Guidelines for Games" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-medium">Deliverables</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3">
            <DeliverableCard
              id="del_ag80a9dhg0adg"
              name="Prototype Demonstration"
              weighting={20}
              deadline={new Date()}
              status="Submitted"
            />
            <DeliverableCard
              id="del_ads7gtya97ga9dsg"
              name="Final Implementation"
              weighting={80}
              deadline={new Date()}
              status="Late"
              description="Submit the final version of the Minesweeper game assignment."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
