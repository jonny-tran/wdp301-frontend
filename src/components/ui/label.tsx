"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-[13px] font-black  text-slate-900 leading-none",
        "select-none transition-all truncate max-w-200px",
        "group-data-[disabled=true]:opacity-30",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
