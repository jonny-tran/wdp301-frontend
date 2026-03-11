import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-base text-slate-900 shadow-xs outline-none transition-[color,box-shadow] placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 selection:bg-primary selection:text-primary-foreground file:text-slate-900 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:ring-red-200 aria-invalid:border-red-400",
        className
      )}
      {...props}
    />
  )
}

export { Input }

