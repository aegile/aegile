import { DownloadIcon, FileIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type FileDownloadProps = {
  fileName: string;
  fileType: string;
  fileSize: string;
};

export default function FileDownload({
  fileName,
  fileType,
  fileSize,
}: FileDownloadProps) {
  return (
    <div className="flex items-center justify-between space-x-4 rounded-md border">
      <div className="flex items-center space-x-4">
        <div className="flex aspect-square w-10 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 md:w-12">
          <FileIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="line-clamp-1 text-sm font-medium leading-none">
            {fileName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {fileType}, {fileSize}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0 md:h-12 md:w-12"
      >
        <DownloadIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}
