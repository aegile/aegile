import { addDays, addHours, format, nextSaturday } from 'date-fns';
import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
  GraduationCap,
  GraduationCapIcon,
} from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tutorial } from '../types';

interface ClassInboxDisplayProps {
  item: Tutorial | null;
}

export function ClassInboxDisplay({ item }: ClassInboxDisplayProps) {
  const today = new Date();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!item}>
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!item}>
                <ArchiveX className="h-4 w-4" />
                <span className="sr-only">Move to junk</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to junk</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!item}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Move to trash</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={!item}>
                    <Clock className="h-4 w-4" />
                    <span className="sr-only">Snooze</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="flex w-[535px] p-0">
                <div className="flex flex-col gap-2 border-r px-2 py-4">
                  <div className="px-4 text-sm font-medium">Snooze until</div>
                  <div className="grid min-w-[250px] gap-1">
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Later today{' '}
                      <span className="ml-auto text-muted-foreground">
                        {format(addHours(today, 4), 'E, h:m b')}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Tomorrow
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 1), 'E, h:m b')}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      This weekend
                      <span className="ml-auto text-muted-foreground">
                        {format(nextSaturday(today), 'E, h:m b')}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Next week
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 7), 'E, h:m b')}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <Calendar />
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Snooze</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!item}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!item}>
                <ReplyAll className="h-4 w-4" />
                <span className="sr-only">Reply all</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply all</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!item}>
                <Forward className="h-4 w-4" />
                <span className="sr-only">Forward</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Forward</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!item}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {item ? (
        <Tabs defaultValue="issues" className="flex-1">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar className="justify-center items-center bg-muted border">
                <GraduationCapIcon className="h-6 w-6" />
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">Tutorial - {item.name}</div>
                <div className="line-clamp-1 text-xs">{item.location}</div>
              </div>
            </div>
            {/* {item.datetime && (
                <div className="ml-auto text-xs text-muted-foreground">
                  {format(new Date(item.datetime), 'PPpp')}
                </div>
              )} */}
            <TabsList className="ml-auto">
              <TabsTrigger
                value="issues"
                className="text-zinc-600 dark:text-zinc-200"
              >
                Issues
              </TabsTrigger>
              <TabsTrigger
                value="forum"
                className="text-zinc-600 dark:text-zinc-200"
              >
                Forum
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />
          <TabsContent value="issues" className="h-full">
            {/* <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-3">
                <div className="w-full h-[200px] bg-red-100" />
                <div className="w-full h-[200px] bg-red-100" />
                <div className="w-full h-[200px] bg-red-100" />
                <div className="w-full h-[200px] bg-red-100" />
                <div className="w-full h-[200px] bg-red-100" />
              </div>
            </ScrollArea> */}
            <div className="h-full w-full flex justify-center">
              <Image
                src="/illustrations/not-found/not-found-empty-box.svg"
                alt="Data not found."
                width={300}
                height={300}
                className="object-scale-down"
              />
            </div>
          </TabsContent>
          <TabsContent value="forum">
            <ScrollArea className="h-[calc(100vh-26rem)]">
              <div className="space-y-3"></div>
            </ScrollArea>
            <Separator className="mt-auto" />
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
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  );
}
