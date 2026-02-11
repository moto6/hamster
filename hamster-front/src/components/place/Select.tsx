import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {Check, ChevronDown, ChevronUp} from "lucide-react";
import {cn} from "@/core/utils";

type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root>;
const Select = SelectPrimitive.Root;

type SelectGroupProps = React.ComponentProps<typeof SelectPrimitive.Group>;
const SelectGroup = SelectPrimitive.Group;

type SelectValueProps = React.ComponentProps<typeof SelectPrimitive.Value>;
const SelectValue = SelectPrimitive.Value;

interface SelectTriggerProps extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
    size?: "sm" | "default";
}

function SelectTrigger({className, size = "default", children, ...props}: SelectTriggerProps) {
    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            className={cn(
                "flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
                size === "sm" ? "h-8" : "h-10",
                className
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDown className="size-4 opacity-50"/>
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
}

function SelectContent({
                           className,
                           children,
                           position = "popper",
                           ...props
                       }: React.ComponentProps<typeof SelectPrimitive.Content>) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                data-slot="select-content"
                className={cn(
                    "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                    position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                    className
                )}
                position={position}
                {...props}
            >
                <SelectScrollUpButton/>
                <SelectPrimitive.Viewport
                    className={cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]")}>
                    {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton/>
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
}

function SelectItem({className, children, ...props}: React.ComponentProps<typeof SelectPrimitive.Item>) {
    return (
        <SelectPrimitive.Item
            className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-2 pr-8 text-sm outline-none focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors",
                className
            )}
            {...props}
        >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4"/>
        </SelectPrimitive.ItemIndicator>
      </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    );
}

function SelectSeparator({className, ...props}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
    return <SelectPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-slate-100", className)} {...props} />;
}

function SelectScrollUpButton({className, ...props}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
    return (
        <SelectPrimitive.ScrollUpButton
            className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
            <ChevronUp className="size-4"/>
        </SelectPrimitive.ScrollUpButton>
    );
}

function SelectScrollDownButton({className, ...props}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
    return (
        <SelectPrimitive.ScrollDownButton
            className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
            <ChevronDown className="size-4"/>
        </SelectPrimitive.ScrollDownButton>
    );
}

export {Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectSeparator};
export type {SelectProps, SelectGroupProps, SelectValueProps}