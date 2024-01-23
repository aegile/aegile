import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { LucideIcon } from 'lucide-react';

interface IconTextTooltipProps {
  isFlex?: boolean;
  tooltips: {
    icon: LucideIcon;
    marginRight: number;
    text: string;
    tooltip: string;
  }[];
}

function IconTextTooltip({ isFlex = false, tooltips }: IconTextTooltipProps) {
  return (
    <div className={isFlex ? 'flex space-x-3 my-2' : 'space-y-2'}>
      {tooltips.map((tooltip, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <div className="flex items-center text-muted-foreground">
              <tooltip.icon className={`w-5 h-5 mr-${tooltip.marginRight}`} />{' '}
              {tooltip.text}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

export default IconTextTooltip;
