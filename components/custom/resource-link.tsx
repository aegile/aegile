import Link from "next/link";

import { ExternalLinkIcon, LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type ResourceLinkProps = {
  linkName: string;
  linkUrl?: string;
};

export default function ResourceLink({
  linkName,
  linkUrl = "#",
}: ResourceLinkProps) {
  return (
    <div className="flex items-center justify-between space-x-4 rounded-md border">
      <div className="flex items-center space-x-4">
        <div className="flex aspect-square w-10 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 md:w-12">
          <LinkIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium leading-none">
            <Link href={linkUrl} className="line-clamp-1 hover:underline ">
              {linkName}
            </Link>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">WEB</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="h-10 w-10 shrink-0 md:h-12 md:w-12"
      >
        <Link href={linkUrl}>
          <ExternalLinkIcon className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
