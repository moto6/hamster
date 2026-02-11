
import * as React from "react";
import { cn } from "@/core/utils";

type InputProps = React.ComponentProps<"input">

function Input({ className, type, ...props }: InputProps) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all shadow-sm",
                "placeholder:text-slate-400",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:border-slate-900",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
}

export { Input };
export type { InputProps };