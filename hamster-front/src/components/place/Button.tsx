import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {cn} from "@/core/utils.ts";

// CVA 스타일 정의: export 하지 않음으로써 Fast Refresh 에러 방지
const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:border-slate-900 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer active:scale-[0.98]",
    {
        variants: {
            variant: {
                default: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
                destructive: "bg-rose-500 text-white hover:bg-rose-600 shadow-sm",
                outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
                secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
                ghost: "hover:bg-slate-100 text-slate-700",
                link: "text-slate-900 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 rounded-lg px-3 text-xs",
                lg: "h-12 rounded-2xl px-8 text-base",
                icon: "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

// 정석적인 타입 정의 (Type-only Import 활용)
interface ButtonProps
    extends React.ComponentProps<"button">,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
    const Comp = asChild ? Slot : "button";
    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button };
export type { ButtonProps };