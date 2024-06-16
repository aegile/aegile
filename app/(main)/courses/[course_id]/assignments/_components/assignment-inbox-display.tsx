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
        <div className="flex flex-1 flex-col p-4 ">
          {/* <div className="flex items-start p-4">
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
          </div> */}
          <ScrollArea className="h-[calc(100vh-13rem)]">
            {/* <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
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
            </div> */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Minesweeper Game</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div>Start Date: June 1, 2023</div>
                    <div>Due Date: June 30, 2023</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-400">
                    This assignment will require you to create a classic
                    Minesweeper game with a grid of cells, mines, and a timer.
                    The game should have the following features:
                  </p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>A grid of cells that can be revealed or flagged</li>
                    <li>Mines placed randomly throughout the grid</li>
                    <li>A timer that starts when the game begins</li>
                    <li>
                      A win condition where the player must reveal all non-mine
                      cells
                    </li>
                    <li>A game over condition where the player hits a mine</li>
                    <li>
                      A scoring system based on the time taken to complete the
                      game
                    </li>
                  </ul>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Specifications</h3>
                    <div className="space-y-1">
                      <div>
                        The game should have a clean and modern design that is
                        visually appealing and responsive.
                      </div>
                      <div>
                        The game should use JavaScript to handle the game logic,
                        including the grid, mines, and timer.
                      </div>
                      <div>
                        The game should include a scoring system that takes into
                        account the time taken to complete the game.
                      </div>
                      <div>
                        The game should have a win condition where the player
                        must reveal all non-mine cells, and a game over
                        condition where the player hits a mine.
                      </div>
                      <div>
                        The game should include a restart button that allows the
                        player to start a new game.
                      </div>
                      <div>
                        The game should be designed with accessibility in mind,
                        ensuring that users with disabilities can easily
                        navigate and play the game.
                      </div>
                      <div>
                        The game should be tested thoroughly to ensure it works
                        correctly across different browsers and devices.
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-md bg-gray-100 p-4 dark:bg-gray-800">
                      <InfoIcon className="h-6 w-6 text-gray-500" />
                      <div className="text-gray-700 dark:text-gray-400">
                        These specifications outline the key requirements for
                        the Minesweeper game. Please review them carefully and
                        let me know if you have any questions or need further
                        clarification.
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Resources</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <a href="#" className="text-blue-600 hover:underline">
                        <div className="rounded-md bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                          JavaScript Game Development
                        </div>
                      </a>
                      <a href="#" className="text-blue-600 hover:underline">
                        <div className="rounded-md bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                          Minesweeper Game Logic
                        </div>
                      </a>
                      <a href="#" className="text-blue-600 hover:underline">
                        <div className="rounded-md bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                          Responsive Design Principles
                        </div>
                      </a>
                      <a href="#" className="text-blue-600 hover:underline">
                        <div className="rounded-md bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                          User Experience Best Practices
                        </div>
                      </a>
                      <a href="#" className="text-blue-600 hover:underline">
                        <div className="rounded-md bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                          Accessibility Guidelines for Games
                        </div>
                      </a>
                      <a href="#" className="text-blue-600 hover:underline">
                        <div className="rounded-md bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                          Cross-Browser Testing Strategies
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Deliverables</h3>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                      <Card>
                        <CardHeader className="p-4 pb-0">
                          <CardTitle className="flex items-center justify-between">
                            <p className="line-clamp-1">
                              Prototype Demonstration
                            </p>
                            <Badge variant="success">Submitted</Badge>
                          </CardTitle>
                          <CardDescription className="space-y-2">
                            <p className="font-semibold">
                              20% · Due: {formatDatetimeFormal(new Date())}
                            </p>
                            <p>
                              Submit a working prototype of the Minesweeper
                              game.
                            </p>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 p-4 pt-4">
                          <div className="flex justify-between">
                            <p className="text-sm text-muted-foreground">
                              Files (1)
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4" />
                            <span className="text-sm font-semibold">
                              demo-prototype.zip
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2 p-4 pt-0">
                          <Button size="sm">Edit Submissions</Button>
                        </CardFooter>
                      </Card>
                      <Card>
                        <CardHeader className="p-4 pb-0">
                          <CardTitle className="flex items-center justify-between">
                            <p className="line-clamp-1">Final Implementation</p>
                            <Badge variant="destructive">Late</Badge>
                          </CardTitle>
                          <CardDescription className="space-y-2">
                            <p className="font-semibold">
                              80% · Due: {formatDatetimeFormal(new Date())}
                            </p>
                            <p>
                              Submit the final version of the Minesweeper game
                              assignment.
                            </p>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 p-4 pt-4">
                          <div className="flex justify-between">
                            <p className="text-sm text-muted-foreground">
                              Files (1)
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4" />
                            <span className="text-sm font-semibold">
                              final-submission.zip
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between gap-2 p-4 pt-0">
                          <Button size="sm">Add Submissions</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
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
