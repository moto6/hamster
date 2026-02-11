import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/core/utils";

type RadioGroupProps = React.ComponentProps<typeof RadioGroupPrimitive.Root>;

function RadioGroup({ className, ...props }: RadioGroupProps) {
    return <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} />;
}

type RadioGroupItemProps = React.ComponentProps<typeof RadioGroupPrimitive.Item>;

function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
    return (
        <RadioGroupPrimitive.Item
            className={cn(
                "aspect-square size-4 rounded-full border border-slate-300 text-slate-900 shadow-sm focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50 transition-all cursor-pointer",
                className
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                <Circle className="size-2 fill-current text-current" />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
}

export { RadioGroup, RadioGroupItem };