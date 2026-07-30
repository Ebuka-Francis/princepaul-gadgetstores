// components/layout/Container.tsx

import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: Props) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1640px] px-5 sm:px-10",
        className
      )}
    >
      {children}
    </div>
  );
}