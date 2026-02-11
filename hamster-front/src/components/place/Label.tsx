import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/core/utils";

type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root>

function Label({ className, ...props }: LabelProps) {
    return (
        <LabelPrimitive.Root
            data-slot="label"
            className={cn(
                "text-sm font-bold leading-none text-slate-700 select-none cursor-default ml-1 mb-1.5 inline-block",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                className
            )}
            {...props}
        />
    );
}

export { Label };
export type { LabelProps };