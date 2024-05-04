import { format, differenceInDays } from "date-fns";

import { Badge } from "@/components/ui/badge";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  deadline: string;
}

export default function DeadlineBadge({
  className,
  deadline,
  //   ...props
}: BadgeProps) {
  const dateObj = Date.parse(deadline);
  const today = new Date();
  const daysDifference = differenceInDays(dateObj, today);

  return (
    <Badge
      variant={
        daysDifference <= 0
          ? "secondary"
          : daysDifference <= 5
            ? "destructive"
            : "default"
      }
      className={className}
    >
      {format(Date.parse(deadline), "dd MMM, yyyy,  HH:mm")}
    </Badge>
  );
}
