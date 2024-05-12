import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { MoreHorizontal, PlusSquare } from "lucide-react"

import { cn } from "@/lib/utils"

const statusLabelVariants = cva(
  "flex rounded-lg border w-[225px] px-4 py-3 text-md font-semibold bg-white dark:bg-zinc-950 dark:border-l-zinc-800 dark:border-r-zinc-800 dark:border-b-zinc-800 border-transparent border-t-4 justify-between gap-2",
  {
    variants: {
      variant: {
        todo:
          "border-t-blue-600",
        inprogress:
          "border-t-purple-600",
        completed:
          "border-t-green-600",
        backlog: 
          "border-t-red-600",
      },
    },
    defaultVariants: {
        variant: "todo",
    },
  }
)

type statusText = {
  statusText: string
}

export interface StatusLabelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusLabelVariants>, statusText {}

function StatusLabel({ className, variant, ...props }: StatusLabelProps) {
  return (
    <div className={cn(statusLabelVariants({ variant }), className)} {...props} >
      
      <h1 className="font-bold text-lg">
        {props.statusText}
      </h1> 
      <div className="flex gap-1">
        <MoreHorizontal/>
        <PlusSquare/>
      </div>
    </div>
  )
}

export { StatusLabel, statusLabelVariants }
