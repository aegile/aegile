export const Kbd = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="size-[18px] flex items-center justify-center rounded-sm border border-muted-foreground bg-muted/10 px-1 text-xs">
      <kbd>{children}</kbd>
    </span>
  );
};
