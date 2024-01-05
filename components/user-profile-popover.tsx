'use client';

import * as React from 'react';
import { CaretSortIcon } from '@radix-ui/react-icons';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Link from 'next/link';

import { CircleUserRound, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function UserProfilePopover({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'flex h-fit w-full justify-around p-0.5',
            isCollapsed && 'rounded-full'
          )}
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <h4 className="text-sm font-semibold">@UserHandle</h4>
          )}
          {!isCollapsed && <CaretSortIcon className="h-4 w-4" />}
          <span className="sr-only">Toggle User Profile Popover</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 m-2">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">@UserHandle</h4>
            <p className="text-sm text-muted-foreground">
              Manage your profile or log out.
            </p>
          </div>
          <div className="grid gap-2">
            <Button variant="secondary">
              <CircleUserRound className="h-4 w-4 mr-3" />
              Profile
              <span className="sr-only">Profile</span>
            </Button>
            <Button variant="ghost">
              <LogOut className="h-4 w-4 mr-3" />
              Log out
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
