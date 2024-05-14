import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AvatarGroupProps {
  max?: number;
  spacing?: number;
  children: React.ReactElement<typeof Avatar>[];
}

export function AvatarGroup({ max = 4, spacing, children }: AvatarGroupProps) {
  const visibleAvatars = React.Children.toArray(children).slice(0, max);
  const remainderCount = React.Children.count(children) - max;
  const firstChild = visibleAvatars[0];
  const className = React.isValidElement(firstChild)
    ? firstChild.props.className
    : "";

  return (
    <div className="flex py-2">
      {visibleAvatars}
      {remainderCount > 0 && (
        <Avatar className={className}>
          <AvatarFallback>+{remainderCount}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
