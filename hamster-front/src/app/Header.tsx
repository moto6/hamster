// @/app/Header.tsx
import React from "react";
import ProfileCard from "@/app/ProfileCard.tsx";

interface HeaderProps {
    className?: string;
    children?: React.ReactNode; // 탭 바를 받기 위한 children 추가
}

export default function Header({ className = "", children }: HeaderProps) {
    return (
        <header
            className={`
                h-12 
                flex items-center
                border-b border-slate-200
                bg-white
                px-4
                dark:bg-slate-900 dark:border-slate-700
                ${className}
            `}
        >

            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 shrink-0 mr-4">
                Admin Demo
            </h1>

            {/* 중간 영역: 여기에 TabBar가 들어감 */}
            <div className="flex-1 h-full overflow-hidden">
                {children}
            </div>

            {/* 우측 유저 영역 (간소화) */}
            <div className="ml-auto flex items-center gap-2 shrink-0">
                <div className="ml-auto">
                    <ProfileCard/>
                </div>
                {/*<span className="text-xs text-slate-500 hidden sm:inline">User</span>*/}
                {/*<div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">*/}
                {/*    U*/}
                {/*</div>*/}
            </div>
        </header>
    );
}