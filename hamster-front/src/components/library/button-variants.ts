import {cva} from "class-variance-authority";

export const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    {
        variants: {
            variant: {
                // 1. 검정 대신 신뢰감을 주는 Slate 800 (또는 브랜드 컬러)
                default: "bg-slate-800 text-white hover:bg-slate-700 shadow-sm",
                // 2. 파괴적 액션도 너무 쨍하지 않게
                destructive: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
                // 3. 가장 많이 쓰일 Outline: 선을 연하게
                outline: "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                // 4. 보조 버튼: 은은한 회색
                secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
                // 5. Ghost: 배경 없이 텍스트만
                ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                link: "text-slate-900 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-10 px-6 text-base",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);