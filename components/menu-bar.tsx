'use client';
import * as React from 'react';
import {
  Home,
  GraduationCap,
  KanbanSquare,
  ListTodo,
  CalendarRange,
  Archive,
  BarChart3,
  FileBarChart2,
  AlertCircle,
  ArchiveX,
  MessagesSquare,
  PenBox,
  Search,
  ShoppingCart,
  Trash2,
  Users2,
} from 'lucide-react';

import { Nav } from './nav';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserProfilePopover } from './user-profile-popover';
import { ModeToggle } from '@/components/theme-toggle';

interface NavbarProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  children: React.ReactNode;
}

export function MenuBar({
  accounts,
  defaultLayout = [15, 85],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
}: NavbarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const pathname = usePathname();

  const linksMain = [
    {
      title: 'Dashboard',
      label: '111',
      icon: Home,
      path: '/dashboard',
    },
    {
      title: 'Courses',
      label: '9',
      icon: GraduationCap,
      path: '/courses',
    },
    {
      title: 'Projects',
      label: '',
      icon: KanbanSquare,
      path: '/projects',
    },
    {
      title: 'Tasks',
      label: '23',
      icon: ListTodo,
      path: '/tasks',
    },
    {
      title: 'Schedule',
      label: '',
      icon: CalendarRange,
      path: '/schedule',
    },
    {
      title: 'Archive',
      label: '',
      icon: Archive,
      path: '/archive',
    },
  ];

  const linksAnalytics = [
    {
      title: 'Performance',
      label: '111',
      icon: BarChart3,
      path: '/performance',
    },
    {
      title: 'Reports',
      label: '',
      icon: FileBarChart2,
      path: '/reports',
    },
    {
      title: 'Forums',
      label: '128',
      icon: MessagesSquare,
      path: '/forums',
    },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        // className="h-full max-h-[800px] items-stretch"
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={12}
          maxSize={15}
          onCollapse={(): void => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onExpand={(): void => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            'flex flex-col box-border',
            isCollapsed &&
              'min-w-[50px] transition-all duration-300 ease-in-out'
          )}
        >
          <div
            className={cn(
              'flex h-fit py-4 items-center justify-center',
              isCollapsed ? 'h-[52px]' : 'px-2'
            )}
          >
            <Image
              src={
                isCollapsed
                  ? '/aegile-logo-only.svg'
                  : '/aegile-horizontal-text.svg'
              }
              width={isCollapsed ? 25 : 150}
              height={isCollapsed ? 10 : 60}
              alt="aegile logo with text on the right of the logo"
              className="filter brightness-110"
            />
            {/* <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} /> */}
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={linksMain.map((link) => ({
              ...link,
              variant: (pathname.startsWith(link.path)
                ? 'default'
                : 'ghost') as 'default' | 'ghost',
            }))}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={linksAnalytics.map((link) => ({
              ...link,
              variant: (pathname.startsWith(link.path)
                ? 'default'
                : 'ghost') as 'default' | 'ghost',
            }))}
          />
          <div className="w-full flex justify-center">
            <ModeToggle />
          </div>
          <div className="flex mt-auto w-full px-2 box-border mb-5 justify-center">
            <UserProfilePopover isCollapsed={isCollapsed} />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          {/* <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MailList items={mails} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList items={mails.filter((item) => !item.read)} />
            </TabsContent>
          </Tabs> */}
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
