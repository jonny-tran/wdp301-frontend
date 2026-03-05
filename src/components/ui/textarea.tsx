import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-[1.5rem] border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-900 ring-offset-white placeholder:text-slate-300 placeholder:italic focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/10 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
