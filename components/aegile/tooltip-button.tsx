import { Button, ButtonProps } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TooltipButtonProps = Omit<ButtonProps, 'asChild'> & {
  tooltip?: string;
  children?: React.ReactNode;
};

export function TooltipButton({
  variant = 'ghost',
  tooltip = 'N/A',
  size = 'sm',
  children = 'N/A',
  ...props
}: TooltipButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={variant} size={size} {...props}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
